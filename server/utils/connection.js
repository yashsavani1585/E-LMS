import mongoose from "mongoose";

let retryAttempts = 0;
const maxRetries = 5;

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        if (retryAttempts < maxRetries) {
            retryAttempts++;
            console.log(`Retrying connection (${retryAttempts}/${maxRetries})...`);
            setTimeout(connectDB, 5000); // Retry after 5 seconds
        } else {
            console.error("Max retries reached. Exiting...");
            process.exit(1);
        }
    }
};