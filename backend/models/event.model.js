import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["tech", "music", "sports", "workshop", "film", "dance", "others"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming",
  },
  paymentType: {
    type: String,
    enum: ["free", "paid"],
    default: "free",
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  availableSeats: {
    type: Number,
    default: 0,
    min: 0
  },
  registeredUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
