import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedSuperadmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio');
    
    const email = 'superadmin@vibe.com';
    const existing = await User.findOne({ email });
    
    if (existing) {
      console.log('Superadmin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin123', salt);

    const superadmin = new User({
      name: 'Platform Creator',
      email: email,
      password: hashedPassword,
      role: 'superadmin',
      status: 'approved'
    });

    await superadmin.save();
    console.log('Superadmin created successfully!');
    console.log('Email: superadmin@vibe.com');
    console.log('Password: superadmin123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding superadmin:', err);
    process.exit(1);
  }
};

seedSuperadmin();
