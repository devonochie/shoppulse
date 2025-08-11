import { z } from 'zod'
import { cartItemSchema } from './cart.validators';
import { ShippingMethod } from '../models/cart';


export const orderStatusSchema = z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded"
]);

export const shippingOrderTrackingDetails = z.object({
    tracking_number: z.string(),
    carrier: z.string(),
    estimated_delivery: z.coerce.date(), 
    actual_delivery: z.coerce.date(),
});


const addressSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required")
})

export const paymentMethodSchema = z.enum([
    'credit_card',
    'bank_transfer'
])

export const orderValidator = z.object({
    user_id: z.string().min(1, 'User ID is required'),
    items: z.array(cartItemSchema).min(1, "At least one item is required"),
    shipping_method: z.enum(ShippingMethod),
    billing_address: addressSchema.optional(),
    payment_method: paymentMethodSchema,
    coupon_code: z.string().optional(),
    tracking: shippingOrderTrackingDetails.optional(),
    notes: z.string().max(500).optional
}).refine( data => {
    if(!data.billing_address) {
        return true
    }
    return Object.keys(data.billing_address).length > 0
}, {
    message: "Billing address cannot be empty if provided",
    path: ['billing_address']
})


export type Order = z.infer<typeof orderValidator>
export type Address = z.infer<typeof addressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type OrderStatus = z.infer<typeof orderStatusSchema>