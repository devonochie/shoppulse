import mongoose, { Model, Schema } from "mongoose";
import { OrderStatus, Order as OrderValidator } from "../validators/order.validators";
import { ShippingMethod } from "./cart";


interface IOrder extends OrderValidator {
    status: OrderStatus
    total: number;
    created_at: Date;
    payment_transaction_id?: string
}

export interface OrderDocument extends IOrder, Document {}

const orderSchema: Schema = new Schema<OrderDocument>({
    user_id: { type: String, required: true },
    items: [{
        product_id: { type: String, required: true },
        quantity: { type: Number, required: true },
        price_at_purchase: { type: Number, required: true }
    }],
    shipping_method: {type: String, enum: Object.values(ShippingMethod), default: ShippingMethod.STANDARD},
    billing_address: {
        street: String,
        city: String,
        state: String,
        postal_code: String,
        country: String
    },
    payment_method: { type: String, enum: ["credit_card", "stripe", "bank_transfer"] },
    coupon_code: String,
    notes: String,
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
        default: "pending"
    },
    total: { type: Number, required: true },
    tracking: {
        tracking_number: { type: String },
        carrier: { type: String },
        estimated_delivery: { type: Date },
        actual_delivery: { type: Date}
    },
    payment_transaction_id: { type: String, ref: "Payment"},
    created_at: { type: Date, default: Date.now }
});

export const Order: Model<OrderDocument> = mongoose.model<OrderDocument>("Order", orderSchema);