import mongoose, { ConnectOptions } from "mongoose";

// MongoDB connection URI
const uri = process.env.DB_URI;

// Connect to MongoDB
async function connectDB() {
  if (!uri) throw Error("DB Uri not passed");
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

connectDB();
