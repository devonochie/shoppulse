import { Order } from "../models/order";
import MailService from "../utils/emailer";
import express from 'express';
import logger from "../utils/logger";
import { orderStatusSchema, orderValidator, shippingOrderTrackingDetails} from "../validators/order.validators";
import z from "zod";
import { stripe } from "../config/stripe";
import { Refund } from "../models/refund";
import { refundValidator } from "../validators/refund.validator";



class OrderController {
    constructor (
        private orderModel: typeof Order,
        private refundModel: typeof Refund,
        private mailService: MailService
    ) {}

    async createOrder (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const orderData = orderValidator.parse(req.body)

            const total = orderData.items.reduce(
                (sum, item) => sum + (item.snapshot_price * item.quantity),
                0
            )

            // Create Order
            const order = new this.orderModel({
                ...orderData,
                total,
                status: "pending",
            
            })
            
            if (req.user) {
                await this.mailService.sendEmail(req.user, "Order created successfully under");
            }

            return res.success({
                data: order,
                total: total
            }, "Order created successfully")
        } catch (error) {
            next(error)
            logger.error("Error creating order", error instanceof Error ? error.message : "Unknown error") 
        }
    }

    async getOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const order = await this.orderModel.findById(req.params.id);
            if (!order) return res.status(404).json({ error: "Order not found" });
            return res.success({
                order
            }, "Fetch successfull")
        } catch (error: unknown) {
            next(error)
            logger.error("Error creating order", error instanceof Error ? error.message : "Unknown error") 
        }
    }

    async updateStatus( req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const { order_id } = req.params;
            const { status } = z.object({ 
                status: orderStatusSchema
            }).parse(req.body);

            const order = await this.orderModel.findByIdAndUpdate(
                order_id,
                { status },
                { new: true }
            );

            return res.success({
                order
            }, "Updated successfully")

        } catch (error) {
            next(error)
            logger.error("Error creating order", error instanceof Error ? error.message : "Unknown error") 
        }
    }

    async addShipping(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
        const shippingData = shippingOrderTrackingDetails.parse(req.body);
        const order = await this.orderModel.findByIdAndUpdate(
            req.params.order_id,
            { tracking: shippingData },
            { new: true }
        );
        res.json(order);
        } catch (error) {
            next(error)
            logger.error("Error creating order", error instanceof Error ? error.message : "Unknown error") 
        }
    }

    async processRefund(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
        const refundData = refundValidator.parse(req.body);
        
        const order = await this.orderModel.findByIdAndUpdate(
            req.params.order_id,
            { status: "refunded" },
            { new: true }
        );

        await stripe.refunds.create({
            charge: order?.payment_transaction_id,
            amount: refundData.amount * 100
        });

        
        this.refundModel.create({
            ...refundData,
            status: "processed"
        });

        return res.success({
            data: order
        }, " refund Successful")
        } catch (error) {
            next(error)
            logger.error("Error creating order", error instanceof Error ? error.message : "Unknown error") 
        }
    }

    async deleteOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const order = await this.orderModel.findByIdAndDelete(req.params.id);
            if (!order) return res.status(404).json({ error: "Order not found" });
            return res.success({
                data: order
            }, "Order deleted successfully")
        } catch (error) {
            next(error)
            logger.error("Error deleting order", error instanceof Error ? error.message : "Unknown error") 
        }

    }
}

export default OrderController