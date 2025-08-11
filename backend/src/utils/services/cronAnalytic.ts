import { AnalyticsSnapshot } from "../../models/analytics";
import { Order } from "../../models/order";
import logger from "../logger";


export default async function generateDailyAnalytics() {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
        const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

        const orders = await Order.find({
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
        }
        });

        const topProduct = await Order.aggregate([
        {
            $match: {
            createdAt: {
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
            name: "$product.title",
            totalSold: 1,
            totalRevenue: 1
            }
        }
        ]);

        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

        await new AnalyticsSnapshot({
        type: "daily",
        date: startOfDay,
        data: {
            totalSales,
            totalOrders: orders.length,
            topProduct
        }
        });
    } catch (error) {
        logger.error("Analytics generation failed:", error);
    }
}
