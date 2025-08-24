require("dotenv").config(); // Load environment variables from .env
const express = require("express"); // Handle requests
const mongoose = require("mongoose"); //For database
const cors = require("cors"); // To run an app on same port
const citiesRoutes = require("./routes/cities");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON

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

// console.log("Loaded API Key:", process.env.OPENWEATHER_API_KEY);
