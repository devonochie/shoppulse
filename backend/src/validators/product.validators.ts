import { z } from 'zod';

const productValidators = z.object({
    title: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(100, "Name cannot exceed 100 characters")
        .trim(),
    
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description cannot exceed 2000 characters")
        .trim(),
    
    price: z.number()
        .positive("Price must be positive")
        .max(1_000_000, "Price cannot exceed $1,000,000")
        .refine(val => Number(val.toFixed(2)) === val, {
            message: "Price can only have up to 2 decimal places"
        }),
    
    images:z.array(z.string()
        .url("Must be a valid URL")
        .startsWith("https://", "URL must be secure (HTTPS)")
        .refine(url => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        return allowedExtensions.some(ext => url.toLowerCase().endsWith(ext));
        }, "Image must be JPG, JPEG, PNG, or WebP")), 
    
    category: z.string()
        .min(1, "Category is required")
        .max(50, "Category cannot exceed 50 characters"),
    
    stock: z.number()
        .int("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .default(0),
    
    discountPercentage: z.number()
        .min(0, "Discount cannot be negative")
        .max(90, "Discount cannot exceed 90%")
        .optional(),
    
    rating: z.number()
        .min(0, "Rating cannot be below 0")
        .max(5, "Rating cannot exceed 5")
        .optional()
}).strict(); 


export type Product = z.infer<typeof productValidators>;
export type ProductInput = z.input<typeof productValidators>;

export const validateProduct = ( data: unknown) => {
    return productValidators.safeParse(data)
}

export const validatePartailProduct = ( data: unknown ) => {
    return productValidators.partial().safeParse(data)
}

export default productValidators