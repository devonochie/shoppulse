import dotenv from 'dotenv'
import express from 'express';
import logger from '../utils/logger';
dotenv.config()

interface ErrorDefinition {
    status: number,
    message: string,
    logMessage?: string,
    condition?: boolean,
    expose?: boolean
}

const errorHandler = (err: unknown, req: express.Request, res: express.Response) => {

    if (!(err instanceof Error)) {
        return res.status(500).json({ error: 'Unknown error occurred' });
    }
    const errorTypes: Record<string, ErrorDefinition> = {
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
        MulterError: {
            status: 400,
            message: "File upload error",
            logMessage: 'image upload error',
        },
        default: {
        status: 500,
        message: 'Something went wrong',
        logMessage: 'Internal Server Error'
        }
    };

    // Find matching error type or use default
    const matchedEntry = Object.entries(errorTypes).find(([key, def]) => {
        if (key === 'MongoServerError') return err.name === key && def.condition
        return err.name === key
    })

    const errorDef = matchedEntry?.[1] || errorTypes.default

    // log error with additional context 
    logger.error(
        `Error: ${err.message} | Name: ${err.name} | Path: ${req.path} | Method: ${req.method} | Body: ${JSON.stringify(req.body)} | Params: ${JSON.stringify(req.params)}${errorDef.logMessage ? ` | LogMessage: ${errorDef.logMessage}` : ''}${process.env.NODE_ENV === 'development' ? ` | Stack: ${err.stack}` : ''}`
    )

    // Send error response
    res.status(errorDef.status).json({
        error:errorDef.message,
        ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.message
        })
    });

}

export default errorHandler