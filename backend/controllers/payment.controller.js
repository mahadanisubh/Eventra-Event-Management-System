import Razorpay from "razorpay";
import crypto from "crypto";
import Event from "../models/event.model.js";
import Payment from "../models/payment.model.js";
import { registerInEventLogic } from "./join.event.controller.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.paymentType === "free" || event.price === 0) {
      return res.status(400).json({
        message: "This is a free event. No payment required.",
      });
    }

    const alreadyPaid = await Payment.findOne({
      userId,
      eventId,
      registrationStatus: "confirmed",
      status: "paid",
    });

    if (alreadyPaid) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    const amount = Number(event.price);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid event price" });
    }
    const receipt = `rcpt_${Date.now()}`;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt,
      notes: {
        eventId: eventId.toString(),
        userId: userId.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      userId,
      eventId,
      amount,
      currency: "INR",
      status: "pending",
      razorpayOrderId: order.id,
      receipt,
      notes: {
        eventTitle: event.title,
      },
    });

    return res.status(200).json({
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id,
      eventTitle: event.title,
      eventPrice: amount,
    });
  } catch (err) {
    console.log("createOrder error:", err);
    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (payment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized payment access" });
    }

    if (
      payment.status === "paid" &&
      payment.registrationStatus === "confirmed"
    ) {
      return res.status(200).json({
        message: "Payment already verified",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";

    await registerInEventLogic({
      userId: payment.userId,
      eventId: payment.eventId,
    });

    payment.registrationStatus = "confirmed";
    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and registration confirmed",
    });
  } catch (err) {
    console.log("verifyPayment error:", err);

    return res.status(500).json({
      message: err.message || "Payment verification failed",
    });
  }
};
