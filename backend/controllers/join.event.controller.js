import Event from "../models/event.model.js";
import User from "../models/user.model.js";

export const registerInEventLogic = async ({ userId, eventId }) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("No Event Found");
  }

  const alreadyRegistered = event.registeredUsers.some(
    (registration) => registration.user.toString() === userId.toString()
  );

  if (alreadyRegistered) {
    throw new Error("Already registered");
  }

  if (event.availableSeats !== undefined && event.availableSeats <= 0) {
    throw new Error("No seats available");
  }

  event.registeredUsers.push({
    user: userId,
    registeredAt: new Date(),
  });

  if (event.availableSeats !== undefined) {
    event.availableSeats -= 1;
  }

  await event.save();

  await User.findByIdAndUpdate(userId, {
    $addToSet: { registeredEvents: event._id },
  });

  return event;
};

export const registerInEvent = async (req, res) => {
  try {
    const event = await registerInEventLogic({
      userId: req.user._id,
      eventId: req.params.eventId,
    });

    res.status(201).json({ message: "Successfully Registered", event });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};