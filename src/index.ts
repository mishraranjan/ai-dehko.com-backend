import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import usersRoutes from './routes/users.routes';  // User routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));  // Frontend + Admin
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);  // Mount user routes here

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
