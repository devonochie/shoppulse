import express from 'express';
import CouponController from 'src/controllers/coupon.controller';
import { authorize } from 'src/middleware/role.middleware';
import { UserRole } from 'src/models/auth';
import { Coupon } from 'src/models/coupon';


const routes: express.Router = express.Router();

const couponController = new CouponController(Coupon)

// Public routes
routes.get('/validate/:code', couponController.validateCoupon.bind(couponController));

// Admin routes
routes.post('/', authorize([UserRole.ADMIN]), couponController.createCoupon.bind(couponController));
routes.get('/', authorize([UserRole.ADMIN]),  couponController.listCoupons.bind(couponController));
routes.patch('/:id/deactivate',authorize([UserRole.ADMIN]), couponController.deactivateCoupon.bind(couponController));

export default routes;