import { z } from "zod";


const idSchema = z.string().min(1, "ID is required");

export const cartItemSchema = z.object({
    _id: z.string().optional(),
    product_id: idSchema,
    title: z.string().min(1, "Title is required").max(100, "Title can't exceed 100 characters"),
    price: z.number()
        .min(0.01, "Price must be positive")
        .max(10000, "Price can't exceed 10000"),
    image: z.string().url("Invalid image URL"),
    size: z.string().max(50).optional(),
    color: z.string().max(50).optional(),
    category: z.string().min(1, "Category is required").max(50,
                "Category can't exceed 50 characters"),
    quantity: z.number()
        .min(1, "Quantity must be at least 1")
        .max(100, "Max quantity is 100"),
    
    snapshot_price: z.number() 
        .min(0.01, "Price must be positive"),
    variant_id: idSchema.optional(),
    notes: z.string().max(200).optional()
}).strict();

export const cartValidator = z.object({
    user_id: idSchema.optional(),
    items: z.array(cartItemSchema).min(1, "Cart can't be empty"),
    coupon_code: z.string().max(20).optional(),
    shipping_method: z.enum(["standard", "express", "payondelivery"]).default("standard"),
    metadata: z.record(z.string(), z.unknown()).optional(),
    subtotal: z.number().min(0),
    requires_price_check: z.boolean().default(false)
});


export type Cart = z.infer<typeof cartValidator>;
export type CartItem = z.infer<typeof cartItemSchema>;

export const validatePartialCart = (data: unknown) => {
    return cartValidator.partial().safeParse(data)
}