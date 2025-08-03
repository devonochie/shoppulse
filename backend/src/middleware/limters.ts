import dotenv from 'dotenv'
import express from 'express';
import logger from '../utils/logger';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit'

dotenv.config()

interface RateLimitMessage {
    status: number;
    error: string
}

// Robust rate limiter middleware
const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, 
    standardHeaders: true, 
    legacyHeaders: false, 

    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    } as RateLimitMessage,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (req: express.Request, res: express.Response , _next: express.NextFunction, options: any) => {
        logger.warn(`Rate limit hit: ${req.ip} on ${req.originalUrl}`);
        res.status(options.statusCode).json(options.message);
    },

    skipSuccessfulRequests: false, 
    skip: (req) => {
        return req.path === '/health'
    },
    keyGenerator: (req) => {
        return `${req.ip}:${req.method}:${req.path}`;
    }
});

export default limiter
