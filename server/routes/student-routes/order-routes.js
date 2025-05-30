
import express from "express";
import { createOrder, capturePaymentAndFinalizeOrder } from "../../controllers/student-controller/order-controller.js";

const studentOrderRoutes = express.Router();


studentOrderRoutes.post("/create", createOrder);


studentOrderRoutes.post("/capture", capturePaymentAndFinalizeOrder);

export default studentOrderRoutes;

