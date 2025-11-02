// routes/activityRoutes.js
const express = require("express");
const Activity = require("../models/Activity");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Add or update activity (upsert by userId+crop+week)
router.post("/", auth, async (req, res) => {
  try {
    const { crop, week, activity, notes, status } = req.body;
    if (!crop || week == null || !activity) return res.status(400).json({ message: "Missing required fields" });

    const doc = await Activity.findOneAndUpdate(
      { userId: req.user.id, crop, week },
      { activity, notes, status },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get activities for a user (optionally filter by crop)
router.get("/", auth, async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.crop) filter.crop = req.query.crop;
    const activities = await Activity.find(filter).sort({ week: 1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete activity
router.delete("/:id", auth, async (req, res) => {
  try {
    const doc = await Activity.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", doc });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
