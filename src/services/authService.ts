import User from '../models/User';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

interface LoginPayload { email: string; password: string; }
interface RegisterPayload { email: string; password: string; }

export class AuthService {
  static async login(payload: LoginPayload): Promise<{ token: string; user: any }> {
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET);
    
    console.log('Login attempt for:', payload.email);
    
    const user = await User.findOne({ email: payload.email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const passwordMatch = await user.comparePassword(payload.password);
    console.log('Password match result:', passwordMatch);
    
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    return { token, user: { id: user._id, email: user.email, role: user.role } };
  }

  static async register(payload: RegisterPayload): Promise<any> {
    const existing = await User.findOne({ email: payload.email });
    if (existing) throw new Error('User exists');
    const user = new User(payload);
    await user.save();
    return { id: user._id, email: user.email };
  }

  static async getCurrentUser(userId: string): Promise<any> {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }

  static verifyToken(req: Request): any {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token');
    return jwt.verify(token, process.env.JWT_SECRET!) as any;
  }
}
