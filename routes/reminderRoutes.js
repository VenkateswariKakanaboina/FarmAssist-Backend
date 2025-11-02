// routes/reminderRoutes.js
const express = require("express");
const Reminder = require("../models/Reminder");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create reminder
router.post("/", auth, async (req, res) => {
  try {
    const { crop, message, date } = req.body;
    if (!message || !date) return res.status(400).json({ message: "Missing fields" });

    const reminder = new Reminder({ userId: req.user.id, crop, message, date });
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List reminders (optionally upcoming)
router.get("/", auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Toggle complete
router.put("/:id/toggle", auth, async (req, res) => {
  try {
    const r = await Reminder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!r) return res.status(404).json({ message: "Reminder not found" });
    r.completed = !r.completed;
    await r.save();
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete reminder
router.delete("/:id", auth, async (req, res) => {
  try {
    const r = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!r) return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Deleted", r });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
