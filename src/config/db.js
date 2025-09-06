import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection sucessfull");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}
