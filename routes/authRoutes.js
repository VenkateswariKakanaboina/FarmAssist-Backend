// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, acres, landType, location, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, age, acres, landType, location, phone });
    await user.save();

    // Do not send password hash back
    const userSafe = { id: user._id, name: user.name, email: user.email, age: user.age, acres: user.acres, landType: user.landType, location: user.location, phone: user.phone };
    res.json({ message: "Signup successful", user: userSafe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "8h" });

    const userSafe = { id: user._id, name: user.name, email: user.email, age: user.age, acres: user.acres, landType: user.landType, location: user.location, phone: user.phone };
    res.json({ message: "Login successful", token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
