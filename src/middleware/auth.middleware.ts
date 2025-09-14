import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await UserService.getById(decoded.userId, decoded.role);  // Verify user exists
    (req as any).user = { id: user._id, role: user.role }; // ❌ Sets 'id', not 'userId'
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};