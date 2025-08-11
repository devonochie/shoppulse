import mongoose, { Schema, Document, Model } from 'mongoose';
import { Coupon as CouponValidator } from '../validators/coupon.validators';


type ICoupon =  CouponValidator

export interface CouponDocument extends ICoupon, Document {}

const couponSchema: Schema = new Schema<CouponDocument>({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true
    },
    discount_type: { 
        type: String, 
        enum: ['percentage', 'fixed'], 
        required: true 
    },
    discount_value: { 
        type: Number, 
        required: true,
        min: 0
    },
    valid_from: { 
        type: Date, 
        required: true 
    },
    valid_to: { 
        type: Date, 
        required: true 
    },
    min_cart_value: { 
        type: Number, 
        min: 0 
    },
    max_discount: { 
        type: Number,
        min: 0 
    },
    is_active: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });


couponSchema.index({ code: 1 }, { unique: true });

export const Coupon: Model<CouponDocument> = mongoose.model<CouponDocument>('Coupon', couponSchema);