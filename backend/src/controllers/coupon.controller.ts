import { Coupon } from '../models/coupon';
import { couponValidator } from '../validators/coupon.validators';
import express from 'express';
import logger from '../utils/logger';

class CouponController {

  constructor(
    private couponModel: typeof Coupon
  ) {}

  async createCoupon(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const validation = couponValidator.parse(req.body)

      const coupon = new this.couponModel({
          ...validation,
          valid_from: new Date(validation.valid_from),
          valid_to: new Date(validation.valid_to),
          code: validation.code.toUpperCase()
      });

      return res.success({
        data: coupon
      }, "Coupon number created successfully")
    } catch (error: unknown) {
      next(error)
      return logger.error("Error creating coupon", error instanceof Error ? error.message : "Unknown or Server error")
    }
  }


  async validateCoupon(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { code } = req.params;
      const { cartTotal } = req.query;

      const coupon = await this.couponModel.findOne({
        code: code.toUpperCase(),
        is_active: true,
        valid_from: { $lte: new Date() },
        valid_to: { $gte: new Date() }
      });

      if (!coupon) {
        return res.status(404).json({ valid: false, message: 'Invalid coupon' });
      }

      // Check minimum cart value if specified
      if (coupon.min_cart_value && Number(cartTotal) < coupon.min_cart_value) {
        return res.json({
          valid: false,
          message: `Minimum cart value of ${coupon.min_cart_value} required`
        });
      }

      return res.success({
        valid: true,
        coupon: {
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          max_discount: coupon.max_discount
        }
      }, "Coupon validated successfully");
    } catch (error: unknown) {
      next(error)
      return logger.error("Error creating coupon", error instanceof Error ? error.message : "Unknown or Server error")
    }
  }


  async listCoupons(_req: express.Request, res: express.Response) {
    const coupons = await this.couponModel.find().sort({ valid_to: 1 });
    return res.success(coupons, "Fetch successfull");
  }


  async deactivateCoupon(req: express.Request, res: express.Response) {
    const { id } = req.params;
    await this.couponModel.findByIdAndUpdate(id, { is_active: false });
    return res.success({
      message: 'Coupon deactivated' 
    }, 'Coupon deactivated');

  }
}


export default CouponController;