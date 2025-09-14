// backend/src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');

    // Clear existing data (optional, comment out if you want to append)
    await User.deleteMany({});
    await Product.deleteMany({});

    // Seed Admin User - Always create fresh
    await User.create({
      email: 'admin@example.com',
      password: 'admin123',  // Let the User model hash it
      role: 'admin',
    });
    console.log('Admin user seeded: admin@example.com / admin123');

    // Seed Test Product (optional, for frontend testing)
    const productExists = await Product.findOne({ name: 'Test AI Tool' });
    if (!productExists) {
      await Product.create({
        name: 'Test AI Tool',
        description: 'A test AI tool for automation',
        categories: ['Marketing', 'Automation'],
        tags: ['AI', 'automation'],
        usps: ['Fast', 'Scalable'],
        features: [{ name: 'Automation', description: 'Automates tasks' }],
        reviews: [{ user: 'TestUser', rating: 5, comment: 'Great tool!', date: new Date().toISOString() }],
        gallery: ['https://example.com/image.jpg'],
        price: 99,
        purchaseLink: 'https://example.com/buy',
        popularity: 10,
        seoMetadata: { title: 'Test AI Tool', description: 'Best AI automation tool' },
      });
      console.log('Test product seeded');
    }

    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
  }
}

seed();
