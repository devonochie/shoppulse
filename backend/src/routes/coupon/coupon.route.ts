import CouponController from '../../controllers/coupon.controller';
import { authorize } from '../../middleware/role.middleware';
import { UserRole } from '../../models/auth';
import { Coupon } from '../../models/coupon';
import express from 'express';



const routes: express.Router = express.Router();

const couponController = new CouponController(Coupon)

// Public routes
routes.get('/validate/:code', couponController.validateCoupon.bind(couponController));

// Admin routes
routes.post('/', authorize([UserRole.ADMIN]), couponController.createCoupon.bind(couponController));
routes.get('/', authorize([UserRole.ADMIN]),  couponController.listCoupons.bind(couponController));
routes.patch('/:id/deactivate',authorize([UserRole.ADMIN]), couponController.deactivateCoupon.bind(couponController));

export default routes;