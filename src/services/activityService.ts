import Activity from '../models/Activity';

export class ActivityService {
  static async logActivity(data: {
    type: string;
    description: string;
    userId: string;
    targetId?: string;
    targetName?: string;
    metadata?: any;
  }) {
    try {
      const activity = new Activity(data);
      await activity.save();
      return activity;
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }

  static async getRecentActivities(limit = 10) {
    return Activity.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async getUserActivities(userId: string, limit = 10) {
    return Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async getActivityStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayActivities = await Activity.countDocuments({
      createdAt: { $gte: today }
    });

    const totalActivities = await Activity.countDocuments();

    const activityTypes = await Activity.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return {
      todayActivities,
      totalActivities,
      activityTypes
    };
  }
}