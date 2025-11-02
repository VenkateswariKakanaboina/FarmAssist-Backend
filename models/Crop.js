// models/Crop.js
const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  crop: { type: String, required: true },
  state: { type: String },
  season: { type: String },
  sowingDate: { type: String },
  acres: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Crop", cropSchema);
