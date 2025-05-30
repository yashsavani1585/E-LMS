import Razorpay from "razorpay";
import Order from "../../models/Order.js";
import Course from "../../models/Course.js";
import StudentCourses from "../../models/StudentCourses.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createOrder = async (req, res) => {
  try {
    const { userId, userName, userEmail, courseId, courseTitle, coursePricing } = req.body;

 
    if (!userId || !courseId || !coursePricing) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data. Missing required fields.",
      });
    }

    
    const razorpayOrder = await razorpay.orders.create({
      amount: coursePricing * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${courseId.slice(0, 10)}_${Date.now().toString().slice(-6)}`,
      notes: { courseTitle, userId, userEmail },
    });

    
    const newOrder = new Order({
      userId,
      userName,
      userEmail,
      courseId,
      courseTitle,
      coursePricing,
      orderId: razorpayOrder.id,
      razorpay_order_id: razorpayOrder.id, 
      amount: razorpayOrder.amount, 
      currency: razorpayOrder.currency, 
      orderStatus: "pending", 
      paymentStatus: "initiated", 
    });

    await newOrder.save();

    console.log("New Order Created:", newOrder);

    
    res.status(201).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating Razorpay order!",
    });
  }
};


export const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    console.log("Received payment data:", req.body);

    const { orderId, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment data. Missing required fields.",
      });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature!",
      });
    }


    order.paymentStatus = "confirmed";
    order.orderStatus = "confirmed";
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;

    await order.save();


    const course = await Course.findById(order.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found!" });
    }


    const isAlreadyEnrolled = course.students.some(
      (student) => student.studentId.toString() === order.userId.toString()
    );

    if (!isAlreadyEnrolled) {
      course.students.push({
        studentId: order.userId,
        studentName: order.userName,
        studentEmail: order.userEmail,
        paidAmount: order.amount / 100, 
      });

      await course.save();
    }

  
    let studentCourses = await StudentCourses.findOne({ userId: order.userId });

    if (!studentCourses) {
      studentCourses = new StudentCourses({ userId: order.userId, courses: [] });
    }

    const isCourseAdded = studentCourses.courses.some(
      (c) => c.courseId.toString() === order.courseId.toString()
    );

    if (!isCourseAdded) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: course.title,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        dateOfPurchase: new Date(),
        courseImage: course.image,
      });

      await studentCourses.save();
    }

    console.log("Payment Successful & Student Enrolled:", order);

    res.status(200).json({
      success: true,
      message: "Payment captured and student enrolled!",
      data: order,
    });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({
      success: false,
      message: "Error while capturing payment!",
    });
  }
};

