const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  number: { type: Number, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  admin: { type: Boolean, default: false },
  status: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", userSchema);
