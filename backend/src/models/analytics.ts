import mongoose, { Schema } from "mongoose";

interface IAnalyticsSnapshot {
    type: "daily" | "weekly" | "monthly";
    date: Date;
    data: {
        totalSales: number;
        totalOrders: number;
        topProducts: Array<{
        product_id: string;
        title: string;
        quantity: number;
        }>;
    };
}

const analyticsSchema = new Schema<IAnalyticsSnapshot>({
    type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
    date: { type: Date, required: true, index: true },
    data: {
        totalSales: Number,
        totalOrders: Number,
        topProducts: [{
        product_id: Schema.Types.ObjectId,
        title: String,
        quantity: Number
        }]
    }
});

export const AnalyticsSnapshot = mongoose.model<IAnalyticsSnapshot>("AnalyticsSnapshot", analyticsSchema);