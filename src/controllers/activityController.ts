import { Request, Response } from 'express';
import { ActivityService } from '../services/activityService';

export class ActivityController {
  static async getRecentActivities(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await ActivityService.getRecentActivities(limit);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getActivityStats(req: Request, res: Response) {
    try {
      const stats = await ActivityService.getActivityStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}