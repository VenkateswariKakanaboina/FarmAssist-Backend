// models/Activity.js
const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: String, required: true },
  week: { type: Number, required: true },
  activity: { type: String, required: true },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
  notes: { type: String }
}, { timestamps: true });

activitySchema.index({ userId: 1, crop: 1, week: 1 }, { unique: true }); // one record per week per crop per user

module.exports = mongoose.model("Activity", activitySchema);
