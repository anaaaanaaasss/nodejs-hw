// src/db/connectMongoDB.js
import mongoose from 'mongoose';

export async function connectMongoDB() {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error('MONGO_URL is not provided');

    await mongoose.connect(uri);
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}
