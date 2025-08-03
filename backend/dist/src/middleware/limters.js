"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
// Robust rate limiter middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler: (req, res, _next, options) => {
        logger_1.default.warn(`Rate limit hit: ${req.ip} on ${req.originalUrl}`);
        res.status(options.statusCode).json(options.message);
    },
    skipSuccessfulRequests: false,
    skip: (req) => {
        return req.path === '/health';
    },
    keyGenerator: (req) => {
        return `${req.ip}:${req.method}:${req.path}`;
    }
});
exports.default = limiter;
