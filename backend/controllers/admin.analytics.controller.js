import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { Parser } from "json2csv";

export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId).populate(
      "registeredUsers.user",
      "name email",
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const registrations = event.registeredUsers.map((r) => ({
      userId: r.user._id,
      name: r.user.name,
      email: r.user.email,
      registeredAt: r.registeredAt,
    }));
    res.status(200).json({
      event: {
        _id: event._id,
        title: event.title,
      },
      totalRegistrations: registrations.length,
      registrations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const exportRegistrationCSV = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate(
      "registeredUsers.user",
      "name email",
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Access denied" });
    }
    const data = event.registeredUsers.map((r) => ({
      Name: r.user.name,
      Email: r.user.email,
      RegisteredAt: r.registeredAt.toISOString(),
    }));

    if (data.length === 0) {
      return res.status(400).json({ message: "No registrations found" });
    }

    const json2csvparser = new Parser();
    const csv = json2csvparser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${event.title.replace(/\s+/g, "_")}_registrations.csv`);

    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOverview = async ( req, res) => {
  try{
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const events = await Event.find({}, "registeredUsers");
    let totalRegistrations = 0;
    events.forEach(event => {
      totalRegistrations += event.registeredUsers.length;
    });
     res.status(200).json({
    totalEvents,
    totalUsers,
    totalRegistrations
  })
  }catch(err){
    res.status(500).json({message: "Server error"})
  }
}
