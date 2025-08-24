const express = require("express");
const router = express.Router();
const axios = require("axios");
const City = require("../models/City");

// Save a favorite city
router.post("/", async (req, res) => {
  try {
    // Receive the data from request
    const { name, country } = req.body;
    const city = new City({ name, country }); //Create the document using model
    await city.save(); // Save the document in DB
    res.json(city);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all favorite cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// City autocomplete (geocoding)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query; // get from query parameter
    if (!q) return res.status(400).json({ error: "Missing query param: q" });

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    console.error("City search API error:", err.response?.data || err.message);
    res.status(500).json({ error: "City search failed" });
  }
});

// Remove the city
router.delete("/:id", async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current weather
router.get("/weather", async (req, res) => {
  try {
    const { q, lat, lon, unit } = req.query;
    let url;

    if (lat && lon) {
      //get weather using lat and lon; e.g if you are using current location
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else if (q) {
      //else query parameter
      url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=${unit}&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: "Missing query params" });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Weather API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Weather API failed" });
  }
});

// Forecast
router.get("/forecast", async (req, res) => {
  try {
    const { q, lat, lon, unit } = req.query;
    let url;

    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else if (q) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&units=${unit}&appid=${process.env.OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: "Missing query params" });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("Forecast API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Forecast API failed" });
  }
});

module.exports = router;
