import OrderController from "../../controllers/order.controller";
import { Order } from "../../models/order";
import { Refund } from "../../models/refund";
import MailService from "../../utils/emailer";
import express from "express";


const routes: express.Router = express.Router();
const orderController = new OrderController(Order, Refund ,new MailService())


routes.post("/", orderController.createOrder.bind(orderController));
routes.get("/:id", orderController.getOrder.bind(orderController));
routes.patch("/:id/status", orderController.updateStatus.bind(orderController));
routes.post("/:id/shipping", orderController.addShipping.bind(orderController));
routes.post("/:id/refunds", orderController.processRefund.bind(orderController));
routes.delete("/:id", orderController.deleteOrder.bind(orderController));


export default routes;