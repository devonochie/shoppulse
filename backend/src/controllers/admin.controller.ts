import logger from 'src/utils/logger';
import express from 'express';
import { Order } from 'src/models/order';
import { Payment } from 'src/models/payment';
import User from 'src/models/auth';



class AdminController {
    constructor(
        private orderModel: typeof Order,
        private paymentModel: typeof Payment,
        private userModel: typeof User
    ) {}

    async getDashboardData(_req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const [
                totalOrders,
                pendingOrders,
                completedPayments,
                recentOrders,
                newUsers
            ] = await Promise.all([
                this.orderModel.countDocuments(),
                this.orderModel.countDocuments({ status: 'pending' }),
                this.paymentModel.countDocuments({ status: 'completed' }),
                this.orderModel.find().sort({ created_at: -1 }).limit(5),
                this.userModel.find().sort({ created_at: -1 }).limit(5)
            ]);

            return res.success({
                summary: {
                totalOrders,
                pendingOrders,
                completedPayments,
                newUsers: newUsers.length
                },
                recentOrders,
                newUsers
            }, "Data analytics retrieved successfully");
        } catch (error: unknown) {
            next(error)
            logger.error("Admin Analytics Error", error instanceof Error ? error.message : "Unknown error")
        }
    }

    async getFullOrderDetails(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
        const order = await this.orderModel.findById(req.params.id)
            .populate('user_id', 'username email')
            .populate('items.product_id', 'title price');

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const payment = await Payment.findOne({ order_id: req.params.id });

        return res.success({
            order,
            payment,
            shipping: order.shipping_method
        }, "Admin fetch analaysis successfully");
        } catch (error) {
            next(error)
            logger.error("Admin Analytics Error", error instanceof Error ? error.message : "Unknown error")
        }
    }

}

export  default AdminController 