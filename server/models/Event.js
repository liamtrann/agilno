const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  registrations: [{ type: String, ref: "User" }],
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
