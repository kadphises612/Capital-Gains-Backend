import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = "mongodb://127.0.0.1:27017/capital_gain_db";
    await mongoose.connect(process.env.MONGO_URI || MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
