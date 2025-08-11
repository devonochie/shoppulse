import CartController from '../../controllers/cart.controller';
import { authMiddleware } from '../../middleware/http.middleware';
import { Cart } from '../../models/cart';
import { Coupon } from '../../models/coupon';
import express from 'express';


const routes: express.Router = express.Router();
const cartController = new CartController(Cart, Coupon)

routes.use(authMiddleware)

routes.get('/',  cartController.getCart.bind(cartController));
routes.post('/items', cartController.addToCart.bind(cartController));
routes.patch('/items/:itemId', cartController.updateCart.bind(cartController));
routes.delete('/items/:itemId', cartController.removeFromCart.bind(cartController));
routes.post('/coupons', cartController.applyCoupon.bind(cartController));
routes.delete('/', cartController.clearCart);

export default routes;