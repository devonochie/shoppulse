import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import logger from '../utils/logger'
import User, { UserDocument } from '../models/auth'
import express from 'express';

dotenv.config()

interface JwtPayload {
  user_id: string;
}

const tokenExtractor = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    const auth = req.get('authorization')
    if(auth && auth.startsWith('Bearer ')) {
        req.token = auth.substring(7).trim()
    } else {
        req.token = null
    }
    next()
}

const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Get token from cookies instead of headers
        const token = req.cookies.accessToken 

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
        const user: UserDocument | null = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Invalid or expired token:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

const unknownEndPoint = (_req: express.Request, res: express.Response) => {
    res.status(404).json({
        error: 'Unknown endPoint'
    })
    res.error = (error: Error | string, statusCode = 500) => {
        res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : error
        })
    }
}

const requestLogger = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    logger.info('---')
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    logger.info('---')
    next()
}

export {
    requestLogger,
    unknownEndPoint,
    authMiddleware,
    tokenExtractor,
    JwtPayload
}