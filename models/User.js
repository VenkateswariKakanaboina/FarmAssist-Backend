// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number },
  acres: { type: Number },
  landType: { type: String },
  location: { type: String },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
