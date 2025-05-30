

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  coursePricing: {
    type: Number,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: "INR",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "failed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["initiated", "confirmed", "failed"],
    default: "initiated",
  },

  
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: false, 
  },
  razorpay_signature: {
    type: String,
    required: false, 
  },

  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


OrderSchema.index({ userId: 1, courseId: 1, orderId: 1 });

// Export the combined model
const Order = mongoose.model("Order", OrderSchema);

export default Order;
