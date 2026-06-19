import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export const connectDB = async (): Promise<void> => {
    try {
        const connect = await mongoose.connect(env.MONGODB_URI)
        logger.info(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        logger.error({ error }, 'Failed to connect to MongoDB');
        process.exit(1);
    }
}
