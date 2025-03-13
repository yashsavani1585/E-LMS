// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema({

//     userId: String,
//     userName: String,
//     userEmail: String,
//     orderStatus: String,
//     paymentMethod: String,
//     paymentStatus: String,
//     orderDate: Date,
//     paymentId: String,
//     payerId: String,
//     instructorId: String,
//     instructorName: String,
//     courseImage: String,
//     courseTitle: String,
//     courseId: String,
//     coursePricing: String,
// })

// const Order = mongoose.model('Order', OrderSchema);

// export default Order;

// import mongoose from "mongoose";

// const OrderSchema = new mongoose.Schema({
//     userId: String,
//     userName: String,
//     userEmail: String,
//     orderStatus: String,
//     paymentMethod: String,
//     paymentStatus: String,
//     orderDate: Date,
//     paymentId: String,
//     payerId: String,
//     instructorId: String,
//     instructorName: String,
//     courseImage: String,
//     courseTitle: String,
//     courseId: String,
//     coursePricing: String,
//   });
  

// const Order = mongoose.model("Order", OrderSchema);
// export default Order;


// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   userName: String,
//   userEmail: String,
//   courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   courseTitle: String,
//   coursePricing: Number,

//   orderId: String, // Razorpay Order ID
//   paymentId: String, // Razorpay Payment ID
//   signature: String, // Razorpay Signature

//   amount: Number,
//   currency: String,
//   orderStatus: { type: String, enum: ["pending", "confirmed"], default: "pending" },
//   paymentStatus: { type: String, enum: ["initiated", "paid", "failed"], default: "initiated" },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Order", orderSchema);

// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   userName: { type: String, required: true },
//   userEmail: { type: String, required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//   courseTitle: { type: String, required: true },
//   coursePricing: { type: Number, required: true },
//   orderId: { type: String, required: true, unique: true },
//   paymentId: { type: String, default: null },
//   signature: { type: String, default: null },
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true, default: "INR" },
//   orderStatus: { type: String, enum: ["pending", "confirmed", "failed"], default: "pending" },
//   paymentStatus: { type: String, enum: ["initiated", "paid", "failed"], default: "initiated" },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  // Order Details
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

  // Payment Details
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: false, // Make this optional
  },
  razorpay_signature: {
    type: String,
    required: false, // Make this optional
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for faster queries
OrderSchema.index({ userId: 1, courseId: 1, orderId: 1 });

// Export the combined model
const Order = mongoose.model("Order", OrderSchema);

export default Order;