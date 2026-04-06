import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/protect.middleware.js";

const paymentRouter = Router();

paymentRouter.post("/payments/create-order",authMiddleware,createOrder);
paymentRouter.post("/payments/verify",authMiddleware,verifyPayment);

export default paymentRouter;