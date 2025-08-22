const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("City", CitySchema);
