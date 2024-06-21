const express = require("express");
const router = express.Router();
const {
  createEvent,
  listEvents,
  registerForEvent,
  getEventById,
} = require("../controllers/events");
const auth = require("../middleware/auth");

router.post("/", auth, createEvent);
router.get("/", listEvents);
router.get("/:id/", getEventById);
router.post("/:id/register", registerForEvent);

module.exports = router;
