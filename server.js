require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const citiesRoutes = require("./routes/cities");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/cities", citiesRoutes);

// Connect DB & start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err.message));

console.log("Loaded API Key:", process.env.OPENWEATHER_API_KEY);
