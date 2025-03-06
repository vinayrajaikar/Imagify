import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error("Define MONGODB_URL in environment variables.");
}

interface MongooseConnection {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

// Extend global object to avoid TypeScript errors
declare global {
    /* eslint-disable no-var */ 
    var mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongoose ?? { conn: null, promise: null };

export const connectToDatabase = async (): Promise<mongoose.Connection> => {
    if (cached.conn) return cached.conn; // Return existing cached connection

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URL, {
                dbName: "imagify",
                bufferCommands: false,
            })
            .then((mongooseInstance) => mongooseInstance.connection);
    }

    cached.conn = await cached.promise;
    global.mongoose = cached; // Store the connection globally
    return cached.conn;
};
