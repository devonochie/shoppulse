import { z } from "zod";


export const couponValidator = z.object({
    code: z.string()
        .min(4, "Code must be at least 4 characters")
        .max(20, "Code cannot exceed 20 characters")
    ,

    discount_type: z.enum(['percentage', 'fixed']),

    discount_value: z.number()
        .positive("Discount must be positive")
        .refine(val => val <= (val < 1 ? 100 : Number.MAX_SAFE_INTEGER), {
        message: "Percentage discounts must be ≤ 100"
        }),

    valid_from: z.date().min(new Date()),

    valid_to: z.date().max(new Date()),

    min_cart_value: z.number()
        .min(0, "Minimum cart value cannot be negative")
        .optional(),

    max_discount: z.number()
        .min(0, "Maximum discount cannot be negative")
        .optional()
        ,

    is_active: z.boolean().default(true)
}).strict();

// Partial update validator
export const partialCouponValidator = couponValidator.partial().refine(data => {
    if (data.valid_from && data.valid_to && data.valid_to <= data.valid_from) {
        return false;
    }
    return true;
    }, {
    message: "End date must be after start date",
    path: ["valid_to"]
});

export const applyCouponValidator = z.object({
    coupon_code: z.string().min(1, "Coupon code is required"),
    cart_total: z.number().min(0, "Cart total must be positive")
});

export type Coupon = z.infer<typeof couponValidator>;
export type ApplyCouponInput = z.infer<typeof applyCouponValidator>;