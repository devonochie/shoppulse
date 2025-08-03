"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userValidators = zod_1.z.object({
    username: zod_1.z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name cannot exceed 50 characters"),
    email: zod_1.z.string()
        .min(6, "Email must be at least 6 characters long")
        .email("Invalid email address"),
    password: zod_1.z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    role: zod_1.z.enum(['admin', 'user', 'moderator']).optional().default('user'),
    refreshTokens: zod_1.z.array(zod_1.z.object({
        token: zod_1.z.string(),
        expiresAt: zod_1.z.date()
    })).optional(),
    resetPasswordToken: zod_1.z.string().optional(),
    resetPasswordExpires: zod_1.z.date().optional()
});
exports.default = userValidators;
