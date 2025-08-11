import { Cart } from "../models/cart"
import express from 'express';
import logger from "../utils/logger";
import { cartValidator } from "../validators/cart.validators";
import mongoose from "mongoose";
import z from "zod";
import { Coupon } from "../models/coupon";



class CartController {
    constructor (
        private cartModel: typeof Cart,
        private couponModel: typeof Coupon
    ) {}

    async getCart (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const cart = await this.cartModel.findOne({ user_id: req.user?._id })
                .populate('items.product_id', "title price images category sizes colors reviewCount featured tags")
                .populate('items.variant_id', "title price")


            if(!cart) { 
                return res.status(404).json({ message: 'Cart not found'})
            }

            return res.success({
                data: cart
            }, "Fetch successful")

        } catch (error: unknown) {
            next(error)
            logger.error("Error fetching cart:", error instanceof Error ? error.message : "Unknown error")
        }
    }

    async addToCart (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const validation = cartValidator.pick({ items: true }).parse(req.body)

            const product = await mongoose.model("Product").findById(
                validation.items[0].product_id).select("price, title images size color category")

            if(!product) {
                return res.status(404).json({ message: "Product not found"})
            }

            // Find or create cart
            let cart = await this.cartModel.findOne({ user_id: req.user?._id })

            if(!cart) {
                cart = new this.cartModel({
                    user_id: req.user?._id,
                    items: []
                })
            }

            cart.items.push({
                ...validation.items[0],
                snapshot_price: product.price
            })

            await cart.save()
            
            return res.success({
                data: cart
            }, "Cart saved successfully")

        } catch (error) {
            next(error)
            logger.error("Error fetching cart:", error instanceof Error ? error.message : "Unknown error")
        }
    }

    async updateCart (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const { itemId } = req.params

            const schema = z.object({
                quantity: z.number().int().min(1).max(100).optional(),
                action: z.enum(['increment', 'decrement', 'set']).optional()
            })

            const validateData = schema.parse(req.body)

            const cart = await this.cartModel.findOne({ user_id: req.user?._id })

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                item => item._id?.toString() === itemId  
            )

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            switch (validateData.action) {
                case "increment":
                    cart.items[itemIndex].quantity += validateData.quantity ?? 1
                    break;
                case "decrement":
                    cart.items[itemIndex].quantity = Math.max(
                        1,
                        cart.items[itemIndex].quantity - (validateData.quantity ?? 1)

                    )
                    break;
                case 'set':
                    if (!validateData.quantity) {
                        return res.status(400).json({ message: "Quantity required for set operation"})
                    }
                    cart.items[itemIndex].quantity = validateData.quantity

            }

            cart.subtotal = cart.items.reduce(
                (sum, item) => sum + (item.snapshot_price * item.quantity),
                0
            )

            await cart.save()
            return res.success({
                data: cart
            }, "Cart updated successfully")

        } catch (error) {
            next(error)
            logger.error("Error fetching cart:", error instanceof Error ? error.message : "Unknown error")
        }
    }

    async removeFromCart (req: express.Request, res: express.Response, next: express.NextFunction ) {
        try {
            const { itemId } = req.params

            const cart = await this.cartModel.findOneAndUpdate(
                { user_id: req.user?._id },
                { $pull: { items: { _id: itemId }}},
                { new : true }
            )

            if(!cart) {
                return res.json(404).json({ message: "Cart not found"})
            }

            return res.success({
                data: cart
            })
        } catch (error) {
            next(error)
            logger.error("Error fetching cart:", error instanceof Error ? error.message : "Unknown error")
        }
    }

    async applyCoupon(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { coupon_code } = req.body;

            const validation = cartValidator.pick({ coupon_code: true }).parse({
                coupon_code
            });

            const cart = await Cart.findOne({ user_id: req.user?._id })
                .populate('items.product_id', 'price');
            
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // 3. Verify coupon validity (from database or service)
            const coupon = await this.couponModel.findOne({ 
                code: validation.coupon_code?.toUpperCase(),
                is_active: true,
                valid_from: { $lte: new Date() },
                valid_to: { $gte: new Date() }
            });

            if (!coupon) {
                return res.status(400).json({ message: 'Invalid or expired coupon' });
            }

            // 4. Apply discount to cart items
            let discountApplied = 0;
            const discountedItems = cart.items.map(item => {
                const originalPrice = item.snapshot_price;
                let discountedPrice = originalPrice;

                // Apply percentage discount
                if (coupon.discount_type === 'percentage') {
                    discountedPrice = originalPrice * (1 - coupon.discount_value / 100);
                } 
                // Apply fixed amount discount
                else if (coupon.discount_type === 'fixed') {
                    discountedPrice = Math.max(0, originalPrice - coupon.discount_value);
                }

                discountApplied += (originalPrice - discountedPrice) * item.quantity;

                return {
                    ...item,
                    discounted_price: discountedPrice
                };
            });

            const updatedCart = await Cart.findOneAndUpdate(
                { _id: cart._id },
                { 
                    coupon_code: validation.coupon_code,
                    items: discountedItems,
                    discount_amount: discountApplied,
                    total: cart.subtotal - discountApplied
                },
                { new: true }
            );

            return res.success({
                data: {
                    ...updatedCart,
                    original_total: cart.subtotal,
                    discount_amount: discountApplied,
                    new_total: cart.subtotal - discountApplied
                }
            }, "Coupon applied successfully");

        } catch (error: unknown) {
            next(error);
            logger.error("Error applying coupon:", error instanceof Error ? error.message : "Unknown error");
        }
    }

    async clearCart(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const cart = await Cart.findOneAndUpdate(
                { user_id: req.user?._id },
                { items: [], coupon_code: null },
                { new: true }
        );

        return res.success({
            data: cart
        }, "Cart cleared successfully")
        } catch (error) {
            next(error)
            logger.error("Error fetching cart:", error instanceof Error ? error.message : "Unknown error")
        }
    }

}


export default CartController