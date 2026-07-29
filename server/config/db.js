import mongoose from "mongoose";

/**
 * Connect to MongoDB instance using Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production",
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);

    // Connection Listeners
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB Runtime Error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB Disconnected. Attempting reconnection...");
    });

    // Graceful Shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB Connection Closed due to app termination.");
      process.exit(0);
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
