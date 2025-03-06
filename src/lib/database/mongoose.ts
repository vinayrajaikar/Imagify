import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error("Define MONGODB_URL in environment variables.");
}

interface MongooseConnection {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
}

// Ensure `global.mongoose` is correctly initialized
const cached: MongooseConnection = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn; // Return existing cached connection

    //if not cached connection to db is made
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URL, {
                dbName: "imagify",
                bufferCommands: false,
            })
            .then((mongooseInstance) => {
                return mongooseInstance.connection;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
