import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },  // Or email
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  console.log('Comparing passwords:');
  console.log('Input password:', password);
  console.log('Stored hash:', this.password);
  
  try {
    const result = await bcrypt.compare(password, this.password);
    console.log('Bcrypt comparison result:', result);
    return result;
  } catch (error) {
    console.error('Bcrypt comparison error:', error);
    return false;
  }
};

export default models.User || model('User', userSchema);
