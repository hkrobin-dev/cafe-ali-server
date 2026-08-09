import mongoose from 'mongoose';
import { env } from './env.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log('[db] MongoDB connected successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.warn('[db] MongoDB disconnected');
  isConnected = false;
});

export default connectDB;
