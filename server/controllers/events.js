const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { name, date, capacity } = req.body;
  try {
    const event = new Event({ name, date, capacity });
    await event.save();
    res.status(201).send("Event created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.listEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.registerForEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    if (event.date < new Date()) {
      return res.status(400).send("Cannot register for past events");
    }
    if (event.registrations.length >= event.capacity) {
      return res.status(400).send("Event is full");
    }
    if (event.registrations.includes(userId)) {
      return res.status(400).send("User already registered");
    }
    event.registrations.push(userId);
    await event.save();
    res.send("Registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
