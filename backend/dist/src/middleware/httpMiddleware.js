"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExtractor = exports.authMiddleware = exports.unknownEndPoint = exports.requestLogger = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
const auth_1 = __importDefault(require("../models/auth"));
dotenv_1.default.config();
const tokenExtractor = (req, _res, next) => {
    const auth = req.get('authorization');
    if (auth && auth.startsWith('Bearer ')) {
        req.token = auth.substring(7).trim();
    }
    else {
        req.token = null;
    }
    next();
};
exports.tokenExtractor = tokenExtractor;
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies instead of headers
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await auth_1.default.findById(decoded.user_id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.default.error('Invalid or expired token:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const unknownEndPoint = (_req, res) => {
    res.status(404).json({
        error: 'Unknown endPoint'
    });
    res.error = (error, statusCode = 500) => {
        res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : error
        });
    };
};
exports.unknownEndPoint = unknownEndPoint;
const requestLogger = (req, _res, next) => {
    logger_1.default.info('---');
    logger_1.default.info('Method:', req.method);
    logger_1.default.info('Path:', req.path);
    logger_1.default.info('Body:', req.body);
    logger_1.default.info('---');
    next();
};
exports.requestLogger = requestLogger;
