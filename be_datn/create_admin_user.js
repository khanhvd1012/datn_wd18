import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from './src/models/user_MD.js';
import connectDB from './src/config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not set in .env');
    }

    await connectDB(uri);

    const email = 'admin@datn.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email, existing.role);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    const admin = await User.create({
      username: 'admin',
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created:', {
      email: admin.email,
      username: admin.username,
      role: admin.role,
      password: 'Admin@1234'
    });
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();