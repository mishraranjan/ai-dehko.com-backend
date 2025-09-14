import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll((req as any).user.role);
      res.json(users);
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const user = await UserService.update(req.params.id, req.body, (req as any).user.role);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await UserService.delete(req.params.id, (req as any).user.role, (req as any).user.id);
      res.json({ message: 'User deleted' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
