import express from 'express';
import AdminController from '../../controllers/admin.controller';
import AnalyticControllers from '../../controllers/analytics.controller';
import { authMiddleware } from 'src/middleware/http.middleware';
import { Order } from 'src/models/order';
import { Payment } from 'src/models/payment';
import User, { UserRole } from 'src/models/auth';
import { authorize } from 'src/middleware/role.middleware';


const routes: express.Router = express.Router();
const analyticsController = new AnalyticControllers(Order)
const adminController = new AdminController(Order, Payment, User)

// Analytics
routes.get('/analytics/sales', authMiddleware, authorize([UserRole.ADMIN]), analyticsController.getSalesData.bind(analyticsController));
routes.get('/analytics/products', authorize([UserRole.ADMIN]), analyticsController.getProductPerformance.bind(analyticsController));
routes.get('/analytics/history', authorize([UserRole.ADMIN]), analyticsController.getHistoricalData.bind(analyticsController));

// Admin Dashboard
routes.get('/admin/dashboard',authorize([UserRole.ADMIN]), adminController.getDashboardData.bind(adminController));
routes.get('/admin/orders/:id',authorize([UserRole.ADMIN]), adminController.getFullOrderDetails.bind(adminController));


export default routes;