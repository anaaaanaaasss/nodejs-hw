// src/db/connectMongoDB.js
import mongoose from 'mongoose';

export async function connectMongoDB(uri) {
  if (!uri) throw new Error('MONGO_URL is not provided');
  await mongoose.connect(uri);
  console.log('✅ MongoDB connection established successfully');
}
