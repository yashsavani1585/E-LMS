import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // optional: prevents strict query warnings
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // stop the app if DB connection fails
  }
};

// Optional: helpful events for debugging
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("💥 MongoDB connection error:", err);
});
