import { Request, Response, NextFunction } from 'express';
import { UserRole } from 'src/models/auth';


export const authorize = (allowedRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
        // Ensure user is authenticated first
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if user has one of the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
        } catch (error) {
        next(error);
        }
    };
};