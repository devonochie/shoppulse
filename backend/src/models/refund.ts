import mongoose, { Model, Schema } from "mongoose";
import { Refund as RefundValidator } from "src/validators/refund.validator";


export interface IRefund extends RefundValidator, Document {}

const refundSchema: Schema = new Schema<IRefund>({
    
    reason: { type: String},
    amount: { type: Number},
    status: {type: String, enum: ["requested", "processed", "rejected"], default: "requested"}
}, { timestamps: true})

export const Refund: Model<IRefund> = mongoose.model<IRefund>("Refund", refundSchema)
