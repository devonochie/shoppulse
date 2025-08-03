import express from "express";
import OrderController from "src/controllers/order.controller";
import { Order } from "src/models/order";
import { Refund } from "src/models/refund";
import MailService from "src/utils/emailer";


const routes: express.Router = express.Router();
const orderController = new OrderController(Order, Refund ,new MailService())


routes.post("/", orderController.createOrder.bind(orderController));
routes.get("/:id", orderController.getOrder.bind(orderController));
routes.patch("/orders/:id/status", orderController.updateStatus.bind(orderController));
routes.post("/orders/:id/shipping", orderController.addShipping.bind(orderController));
routes.post("/orders/:id/refunds", orderController.processRefund.bind(orderController));


export default routes;