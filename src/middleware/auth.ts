import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = AuthService.verifyToken(req);
    (req as any).user = decoded;
    if (decoded.role !== 'admin') throw new Error('Admin access required');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};