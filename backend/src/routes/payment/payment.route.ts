import PaymentController from '../../controllers/payment.controller';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import MailService from '../../utils/emailer';
import express from 'express';

const routes: express.Router = express.Router()
const paymentController = new PaymentController(Payment, Order, new MailService())

routes.post("/payments/process", paymentController.processPayment.bind(paymentController));
routes.post("/payments/webhook", paymentController.handleWebhook.bind(paymentController));

export default routes