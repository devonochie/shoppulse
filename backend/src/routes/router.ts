import express from 'express'
import authRoute from './auth/auth.route'
import productRoute from './product/product.route'
import cartRoute from './cart/cart.route'
import couponRoute from './coupon/coupon.route'
import orderRoute from './order/order.route'
import paymentRoute from './payment/payment.route'
import { checkRedisHealth } from '../config/redis'


const router: express.Router = express.Router()

// Api routes
router.use('/auth', authRoute)
router.use('/products', productRoute)
router.use('/cart', cartRoute )
router.use('/coupons', couponRoute )
router.use('/order', orderRoute )
router.use('/payments', paymentRoute )

// Health check endpoint
router.get('/health', async (_req, res: express.Response) => {
    const isHealthy = await checkRedisHealth()
    res.json({ redis: isHealthy ? 'OK' : 'UNHEALTHY' });
    res.status(200).json({ status: 'OK' });
});

// 404 handler for API routes
router.use((_req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

export default router