// models/Reminder.js
const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: String },
  message: { type: String, required: true },
  date: { type: String, required: true }, // ISO string or yyyy-mm-dd
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);
