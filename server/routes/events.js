const express = require("express");
const router = express.Router();
const {
  createEvent,
  listEvents,
  registerForEvent,
} = require("../controllers/events");
const auth = require("../middleware/auth");

router.post("/", createEvent,);
router.get("/", listEvents);
router.post("/:id/register", auth, registerForEvent);

module.exports = router;
