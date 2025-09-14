import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Product from './models/Product';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB for seeding');

    // Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user seeded');
    }

    // Seed Regular User
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      await User.create({
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
      });
      console.log('Regular user seeded');
    }

    // Seed Test Products
    const productExists = await Product.findOne({ name: 'ChatGPT Pro' });
    if (!productExists) {
      await Product.create({
        name: 'ChatGPT Pro',
        description: 'Advanced AI chatbot with enhanced capabilities',
        categories: ['AI Assistant', 'Productivity'],
        tags: ['AI', 'chatbot', 'productivity'],
        usps: ['Advanced reasoning', 'Code generation', 'Multiple languages'],
        features: [
          { name: 'Advanced AI', description: 'GPT-4 powered conversations' },
          { name: 'Code Assistant', description: 'Help with programming tasks' }
        ],
        reviews: [
          { user: 'John Doe', rating: 5, comment: 'Excellent AI tool!', date: new Date().toISOString() }
        ],
        gallery: [
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
          'https://www.youtube.com/watch?v=example'
        ],
        price: 20,
        purchaseLink: 'https://openai.com/chatgpt',
        popularity: 95,
        seoMetadata: { title: 'ChatGPT Pro - Advanced AI Assistant', description: 'The most advanced AI chatbot' },
      });
      console.log('Sample product seeded');
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
