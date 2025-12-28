import mongoose from "mongoose";
import "dotenv/config"; // Ensures variables are loaded before connection attempts

const connectDB = async () => {
  try {
    // Match the variable name in your .env (you used process.env.URI)
    const MONGO_URI = process.env.URI;

    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI (process.env.URI) is not defined in .env file"
      );
    }

    // Options for a stable Atlas connection
    const connectionOptions = {
      autoIndex: true, // Useful for development to build indexes
      connectTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(MONGO_URI, connectionOptions);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(`Error: ${error.message}`);

    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
