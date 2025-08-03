"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
dotenv_1.default.config();
const errorHandler = (err, req, res) => {
    if (!(err instanceof Error)) {
        return res.status(500).json({ error: 'Unknown error occurred' });
    }
    const errorTypes = {
        CastError: {
            status: 400,
            message: 'Malformed ID',
            logMessage: 'Database Cast Error'
        },
        ValidationError: {
            status: 400,
            message: err.message,
            logMessage: 'Validation Error'
        },
        MongoServerError: {
            status: 400,
            message: 'Duplicate key error',
            condition: err.message.includes('E11000'),
            logMessage: 'MongoDB Duplicate Key Error'
        },
        JsonWebTokenError: {
            status: 401,
            message: 'Invalid token',
            logMessage: 'JWT Validation Error'
        },
        TokenExpiredError: {
            status: 401,
            message: 'Token expired',
            logMessage: 'JWT Expired Error'
        },
        UnauthorizedError: {
            status: 401,
            message: 'Unauthorized access',
            logMessage: 'Authorization Error'
        },
        ForbiddenError: {
            status: 403,
            message: 'Forbidden resource',
            logMessage: 'Access Forbidden Error'
        },
        NotFoundError: {
            status: 404,
            message: 'Resource not found',
            logMessage: 'Not Found Error'
        },
        ServiceUnavailableError: {
            status: 503,
            message: 'Service temporarily unavailable',
            expose: true
        },
        default: {
            status: 500,
            message: 'Something went wrong',
            logMessage: 'Internal Server Error'
        }
    };
    // Find matching error type or use default
    const matchedEntry = Object.entries(errorTypes).find(([key, def]) => {
        if (key === 'MongoServerError')
            return err.name === key && def.condition;
        return err.name === key;
    });
    const errorDef = matchedEntry?.[1] || errorTypes.default;
    // log error with additional context 
    logger_1.default.error(`Error: ${err.message} | Name: ${err.name} | Path: ${req.path} | Method: ${req.method} | Body: ${JSON.stringify(req.body)} | Params: ${JSON.stringify(req.params)}${errorDef.logMessage ? ` | LogMessage: ${errorDef.logMessage}` : ''}${process.env.NODE_ENV === 'development' ? ` | Stack: ${err.stack}` : ''}`);
    // Send error response
    res.status(errorDef.status).json({
        error: errorDef.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.message
        })
    });
};
exports.default = errorHandler;
