import mongoose from "mongoose";

const ConnectDataBase = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB CONNECTED");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};

export default ConnectDataBase;
