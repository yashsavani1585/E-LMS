
import express from "express";
import { createOrder, capturePaymentAndFinalizeOrder } from "../../controllers/student-controller/order-controller.js";

const studentOrderRoutes = express.Router();

// Create an order (Razorpay Only)
studentOrderRoutes.post("/create", createOrder);

// Capture and finalize payment (Razorpay Only)
studentOrderRoutes.post("/capture", capturePaymentAndFinalizeOrder);

export default studentOrderRoutes;

