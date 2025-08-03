import MailService from 'src/utils/emailer';
import { Payment } from '../models/payment';
import express from 'express';
import { paymentValidator } from 'src/validators/payment.validators';
import { stripe } from 'src/config/stripe';
import logger from 'src/utils/logger';
import { Order } from 'src/models/order';
import Stripe from 'stripe';


class PaymentController {

    private event: Stripe.Event | undefined

    constructor (
        private paymentModel: typeof Payment,
        private orderModel: typeof Order,
        private mailService: MailService,

    ) {}

    async processPayment (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const paymentData = paymentValidator.parse(req.body)

            let paymentResult: Stripe.Charge | null = null;
            switch(paymentData.method) {
                case "credit_card":
                paymentResult = await stripe.charges.create({
                    amount: paymentData.amount * 100, 
                    currency: paymentData.currency,
                    source: req.body.token 
                });
                break;
            }

            const payment = new this.paymentModel({
                ...paymentData,
                transaction_id: (paymentResult as Stripe.Charge).id,
                status: "completed"
            })

            await this.orderModel.findByIdAndUpdate(paymentData.order_id, { 
                status: "confirmed" 
            });

            await this.mailService.sendEmail(req.user!, "Payment processed successfully")

            return res.success({
                sucess: true,
                payment
            }, "Payment processed successfully")

        } catch (error) {
            next(error);
            logger.error("Error applying coupon:", error instanceof Error ? error.message : "Unknown error");
        }
    }

    async handleWebhook(req: express.Request, res: express.Response, next: express.NextFunction) {
        const sig = req.headers['stripe-signature'] as string
        try{
        
            try {
                this.event = stripe.webhooks.constructEvent(req.body, sig,  process.env.STRIPE_WEBHOOK_SECRET!)
            } catch (error: unknown) {
                next(error);
                logger.debug("Error applying coupon:", error instanceof Error ? error.message : "Unknown error");
            }

            // handle the event type
            switch (this.event?.type) {
                case "payment_intent.succeeded":
                    { const payment_Intent = this.event.data.object as Stripe.PaymentIntent
                    console.log('PaymentIntent was successful:', payment_Intent.id)
                    break; }
                case 'charge.failed':
                    { const charge = this.event.data.object as Stripe.Charge;
                    console.warn('Charge failed:', charge.id);
                    break; }
            
                default:
                    console.log(`Unhandled event type: ${this.event?.type}`);
            }

        }catch (error: unknown) {
            next(error);
            logger.error("Webhook error:", error instanceof Error ? error.message : "Unknown error");
        }
    }
}


export default PaymentController