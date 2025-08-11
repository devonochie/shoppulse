/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnalyticsSnapshot } from '../models/analytics';
import { Order } from '../models/order';
import logger from '../utils/logger';
import express from 'express';


class AnalyticControllers {
    constructor(
        private orderModel : typeof Order
    ) {}

    async getSalesData (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const { period = "30d", currency = "USD" } = req.body

            // convert currency
            const conversionRates: Record<string, number> = {
                USD: 1,
                EUR: 0.85,
                GBP: 0.73
            }

            const matchStage: any = {}
            
            if(period === "7d") {
                matchStage.created_at =  { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
            } else if( period === "30d") {
                matchStage.created_at = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
            }

            const salesData = await this.orderModel.aggregate([
                { $match: matchStage },
                {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    avgOrderValue: { $avg: "$total" },
                    count: { $sum: 1 },
                    byStatus: { $push: "$status" }
                }
                },
                {
                $project: {
                    totalSales: { $multiply: ["$totalSales", conversionRates[currency as string]] },
                    avgOrderValue: { $multiply: ["$avgOrderValue", conversionRates[currency as string]] },
                    count: 1,
                    statusDistribution: {
                    $reduce: {
                        input: "$byStatus",
                        initialValue: { pending: 0, completed: 0, cancelled: 0 },
                        in: {
                        pending: { $add: ["$$value.pending", { $cond: [{ $eq: ["$$this", "pending"] }, 1, 0] }] },
                        completed: { $add: ["$$value.completed", { $cond: [{ $eq: ["$$this", "completed"] }, 1, 0] }] },
                        cancelled: { $add: ["$$value.cancelled", { $cond: [{ $eq: ["$$this", "cancelled"] }, 1, 0] }] }
                        }
                    }
                    }
                }
                }
            ]);

            res.json(salesData[0] || {})

        } catch (error: unknown) {
            next(error)
            logger.error("Analytics error:", error instanceof Error ? error.message : "Unknown error")
        }
    }

    async getProductPerformance(_req: express.Request, res: express.Response, next: express.NextFunction ) {

        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
            const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

            const orders = await this.orderModel.find({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
            });
            const topProduct = await this.orderModel.aggregate([
            {
                $match: {
                    created_at: {
                    $gte: startOfDay,
                    $lt: endOfDay
                    }
                }
            },
            { $unwind: "$items" }, 
            {
                $group: {
                _id: "$items.product_id",
                totalSold: { $sum: "$items.quantity" },
                totalRevenue: {
                    $sum: {
                    $multiply: ["$items.quantity", "$items.price_at_purchase"]
                    }
                }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                _id: 0,
                name: "$product.title",
                totalSold: 1,
                totalRevenue: 1
                }
            }
            ]);

            const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

            const analytics = await new AnalyticsSnapshot({
            type: "daily",
            date: startOfDay,
            data: {
                totalSales,
                totalOrders: orders.length,
                topProduct
            }
            });

            return res.success({
                topProduct,
                analyticsData: analytics
            }, "Saved successfully")
        } catch (error: unknown) {
            next(error);
            logger.error(
            "Analytic error",
            error instanceof Error ? error.message : "Unknown Error"
            );
        }
    }

    async getHistoricalData (req: express.Request, res: express.Response) {
        const { period, type = "daily" } = req.query;

        const filter: any = { type };
        if (period === "30d") {
            filter.date = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        } else if (period === "90d") {
            filter.date = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        }

        const snapshots = await AnalyticsSnapshot.find(filter).sort({ date: 1 });
        res.json(snapshots);
    }
}


export default AnalyticControllers

// controllers/analytics.controller.ts
