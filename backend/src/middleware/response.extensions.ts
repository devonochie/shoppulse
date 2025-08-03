import { RequestHandler } from 'express';

const responseExtensions: RequestHandler = (_, res, next) => {
    res.success = function(data?: unknown, message = 'Success') {
        return this.json({
        success: true,
        data,
        message
        });
    };

    res.error = function(error: string | Error, statusCode = 500) {
        const message = typeof error === 'string' ? error : error.message;
        return this.status(statusCode).json({
        success: false,
        error: message
        });
    };

    next();
};

export default responseExtensions;