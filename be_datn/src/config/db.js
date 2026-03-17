import mongoose from "mongoose";

let isConnected = false;
let listenersAttached = false;

export default async function connectDB(dbUrl) {
    if (!dbUrl) {
        throw new Error('Missing MongoDB URI. Set MONGO_URI in your .env to a real MongoDB connection string. Do not use in-memory DB for production.');
    }

    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(dbUrl, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;

        if (!listenersAttached) {
            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('MongoDB disconnected');
            });

            listenersAttached = true;
        }

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}
