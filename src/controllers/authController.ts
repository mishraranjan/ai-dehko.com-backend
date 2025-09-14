import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { token, user } = await AuthService.login(req.body);
      res.json({ token, user });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const user = await AuthService.getCurrentUser((req as any).user.id); // ✅ Use 'id' not 'userId'
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
  }
