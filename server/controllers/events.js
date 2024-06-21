const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { name, date, capacity, username } = req.body;

  try {
    const event = new Event({
      name,
      date,
      capacity,
      registrations: [username],
    });
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

exports.getEventById = async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findById(id);
    res.send(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(400).send(error.message);
  }
};

exports.registerForEvent = async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;
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
    if (event.registrations.includes(username)) {
      return res.status(400).send("User already registered");
    }
    event.registrations.push(username);
    await event.save();
    res.send("Registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
