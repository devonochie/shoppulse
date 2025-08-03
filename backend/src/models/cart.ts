import mongoose, { Schema, Document, Model } from 'mongoose';
import { Cart as CartType, CartItem } from '../validators/cart.validators';

export enum ShippingMethod {
    STANDARD = "standard",
    EXPRESS = "express",
    PAYONDELIVERY = "payondelivery"
}

interface ICart extends Omit<CartType, 'shipping_method'> {
    shipping_method: ShippingMethod;
}

export interface CartDocument extends ICart, Document {}

const cartItemSchema = new Schema({
    product_id: { 
        type: Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    snapshot_price: {
        type: Number,
        required: true,
        min: 0.01
    },
    variant_id: { 
        type: Schema.Types.ObjectId, 
        ref: "Product" 
    },
    notes: String
});

const cartSchema: Schema<CartDocument> = new Schema<CartDocument>({
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: [cartItemSchema],
    coupon_code: String,
    shipping_method: { 
        type: String, 
        enum: Object.values(ShippingMethod), 
        default: ShippingMethod.STANDARD 
    },
    metadata: Schema.Types.Mixed,
    subtotal: { 
        type: Number, 
        min: 0 
    },
    requires_price_check: Boolean
}, { 
    timestamps: true 
});

cartSchema.pre("save", async function(next) {
    // Calculate subtotal
    this.subtotal = this.items.reduce(
        (sum: number, item: CartItem) => sum + (item.snapshot_price * item.quantity),
        0
    );

    // Optional: Add price check logic here if needed
    next();
});

export const Cart: Model<CartDocument> = mongoose.model<CartDocument>("Cart", cartSchema);