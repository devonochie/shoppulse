"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const product_route_1 = __importDefault(require("./product/product.route"));
const cart_route_1 = __importDefault(require("./cart/cart.route"));
const coupon_route_1 = __importDefault(require("./coupon/coupon.route"));
const order_route_1 = __importDefault(require("./order/order.route"));
const payment_route_1 = __importDefault(require("./payment/payment.route"));
const redis_1 = require("../config/redis");
const router = express_1.default.Router();
// Api routes
router.use('/auth', auth_route_1.default);
router.use('/products', product_route_1.default);
router.use('/cart', cart_route_1.default);
router.use('/coupons', coupon_route_1.default);
router.use('/order', order_route_1.default);
router.use('/payments', payment_route_1.default);
// Health check endpoint
router.get('/health', async (_req, res) => {
    const isHealthy = await (0, redis_1.checkRedisHealth)();
    res.json({ redis: isHealthy ? 'OK' : 'UNHEALTHY' });
    res.status(200).json({ status: 'OK' });
});
// 404 handler for API routes
router.use((_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});
exports.default = router;
