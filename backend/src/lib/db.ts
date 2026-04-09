import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const connect = await mongoose.connect( process.env.MONGODB_URI as string)
        console.log(`MongoDB Connected! ${connect.connection.host}`);
    } catch (error) {
        console.log("Failed to connect to MongoDB", error);
        process.exit(1);
    }
}
