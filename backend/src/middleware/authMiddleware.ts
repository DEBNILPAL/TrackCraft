import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';
import { AuthService } from '../services/authService';
import { UserSanitized } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: UserSanitized;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as { id: string; email: string };
    const user = AuthService.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User session invalid or expired' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};
