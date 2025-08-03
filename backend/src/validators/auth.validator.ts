import { z } from 'zod'

const userValidators = z.object({
    username: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name cannot exceed 50 characters"),
        
    email: z.string()
        .min(6, "Email must be at least 6 characters long")
        .email("Invalid email address"),
        
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
        
    role: z.enum(['admin', 'user', 'moderator']).optional().default('user'),
    refreshTokens: z.array(z.object({
        token: z.string(),
        expiresAt: z.date()
    })).optional(),
    resetPasswordToken: z.string().optional(),
    resetPasswordExpires: z.date().optional(),
    avatar:  z.string()
        .url("Must be a valid URL")
        .startsWith("https://", "URL must be secure (HTTPS)")
        .refine(url => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        return allowedExtensions.some(ext => url.toLowerCase().endsWith(ext));
        }, "Image must be JPG, JPEG, PNG, or WebP"),
});

export type User = z.infer<typeof userValidators>
export type UserInput = z.input<typeof userValidators>

export const validateUser = ( data : unknown ) => {
    return userValidators.safeParse(data)
}

export const validatePartialUser = ( data: unknown ) => {
    return userValidators.partial().safeParse(data)
}

export default userValidators