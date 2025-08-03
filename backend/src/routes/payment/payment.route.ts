import { Order } from "src/models/order";
import { Payment } from "src/models/payment";
import MailService from "src/utils/emailer";
import express from 'express';
import PaymentController from "src/controllers/payment.controller";

const routes: express.Router = express.Router()
const paymentController = new PaymentController(Payment, Order, new MailService())

routes.post("/payments/process", paymentController.processPayment.bind(paymentController));
routes.post("/payments/webhook", paymentController.handleWebhook.bind(paymentController));

export default routes