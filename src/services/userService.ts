import User from '../models/User';

interface CreateUserPayload { username: string; password: string; role?: 'user' | 'admin'; }
interface UpdateUserPayload { username?: string; role?: 'user' | 'admin'; }

export class UserService {
  static async getAll(currentUserRole: string): Promise<any[]> {
    if (currentUserRole !== 'admin') throw new Error('Admin access required');
    return User.find({}).select('-password').sort({ createdAt: -1 });
  }

  static async getById(id: string, currentUserRole: string): Promise<any> {
    if (currentUserRole !== 'admin') throw new Error('Admin access required');
    const user = await User.findById(id).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }

  static async update(id: string, payload: UpdateUserPayload, currentUserRole: string): Promise<any> {
    if (currentUserRole !== 'admin') throw new Error('Admin access required');
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    // Don't allow self-update for role
    if (id === (payload as any).currentUserId && payload.role) throw new Error('Cannot change own role');
    Object.assign(user, payload);
    await user.save();
    return user;
  }

  static async delete(id: string, currentUserRole: string, currentUserId: string): Promise<void> {
    if (currentUserRole !== 'admin') throw new Error('Admin access required');
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    // Prevent self-deletion
    if (id === currentUserId) throw new Error('Cannot delete self');
    await user.deleteOne();
  }
}
