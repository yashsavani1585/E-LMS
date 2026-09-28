// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

// export const connectDB = async () => {
//   try {
//     mongoose.set("strictQuery", false);

//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//       connectTimeoutMS: 10000,
//     });

//     console.log("✅ MongoDB connected successfully.");
//   } catch (error) {
//     console.error("❌ Error connecting to MongoDB:");
//     console.error(error);
//     process.exit(1);
//   }
// };

// mongoose.connection.on("disconnected", () => {
//   console.log("⚠️ MongoDB disconnected.");
// });

// mongoose.connection.on("reconnected", () => {
//   console.log("🔄 MongoDB reconnected.");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("💥 MongoDB connection error:", err.message);
// });

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
    });

    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error(
      "❌ Error connecting to MongoDB:",
      error.message
    );

    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected.");
});

mongoose.connection.on("error", (error) => {
  console.error(
    "💥 MongoDB connection error:",
    error.message
  );
});