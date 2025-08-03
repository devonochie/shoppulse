"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseExtensions = (_, res, next) => {
    res.success = function (data, message = 'Success') {
        return this.json({
            success: true,
            data,
            message
        });
    };
    res.error = function (error, statusCode = 500) {
        const message = typeof error === 'string' ? error : error.message;
        return this.status(statusCode).json({
            success: false,
            error: message
        });
    };
    next();
};
exports.default = responseExtensions;
