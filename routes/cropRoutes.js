// routes/cropRoutes.js
const express = require("express");
const Crop = require("../models/Crop");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create or update a crop for a user
router.post("/", auth, async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const crop = new Crop(payload);
    await crop.save();
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all crops for user
router.get("/", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete crop
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: "Crop not found" });
    res.json({ message: "Deleted", result });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
