import mongoose from "mongoose";

let isConnected = false;

/**
 * Connect to MongoDB instance using Mongoose
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pathai";
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 3000, // Timeout fast after 3 seconds if DB is offline
    });

    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB Runtime Error: ${err.message}`);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB Disconnected. Application running in memory-resilient mode.");
      isConnected = false;
    });
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Warning: Could not connect to ${process.env.MONGO_URI || "127.0.0.1:27017"}.`);
    console.warn(`🚀 PathAI Express Backend is running in Memory-Resilient Mode on Port ${process.env.PORT || 5000}.`);
  }
};

export const getDBStatus = () => isConnected;

export default connectDB;
