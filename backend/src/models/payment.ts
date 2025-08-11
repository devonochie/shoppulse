import {  Model, Schema } from 'mongoose';
import mongoose from 'mongoose';
import { Payment as PaymentValidator } from '../validators/payment.validators';


interface IPayment extends PaymentValidator {
    transaction_id: string
    created_at: Date
}

export interface PaymentDocument extends IPayment, Document {}

const paymentSchema: Schema = new Schema<PaymentDocument>({
    order_id: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    method: { 
        type: String, 
        enum: ["credit_card", "bank_transfer"],
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    exchange_rate: { type: Number, default: 1},
    transaction_id: { type: String, unique: true },
    details: { type: mongoose.Schema.Types.Mixed },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true})


export const Payment: Model<PaymentDocument> = mongoose.model<PaymentDocument>("Payment", paymentSchema)



