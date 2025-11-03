// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cropRoutes = require("./routes/cropRoutes");
const activityRoutes = require("./routes/activityRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(cors({
  origin: "https://farm-assistance.netlify.app/", // 👈 your actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// --- Mount routes ---
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/expenses", expenseRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
