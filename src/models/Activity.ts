import { Schema, model, models } from 'mongoose';

const activitySchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['product_created', 'product_updated', 'product_deleted', 'user_created', 'user_updated', 'user_deleted']
  },
  description: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: String }, // ID of the affected resource
  targetName: { type: String }, // Name of the affected resource
  metadata: { type: Schema.Types.Mixed }, // Additional data
}, { timestamps: true });

// Index for efficient querying
activitySchema.index({ createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

export default models.Activity || model('Activity', activitySchema);