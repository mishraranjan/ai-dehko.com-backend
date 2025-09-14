import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/products.routes';
import userRoutes from './routes/users.routes';
import activityRoutes from './routes/activity.routes';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB error:', err));

app.get('/health', (req: Request, res: Response) => res.json({ status: 'OK' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
