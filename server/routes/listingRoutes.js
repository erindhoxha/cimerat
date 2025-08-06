const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Listing = require("../models/Listing"); // Make sure you have this!
const router = express.Router();
const multer = require("multer");
const requireAuth = require("../middlewares/requireAuthentication");

const upload = multer({ dest: "uploads/" });

router.post("/listings", requireAuth, upload.array("images"), async (req, res) => {
  const { city, neighborhood, title, description, price } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  if (!city || !neighborhood || !title || !description || !price || imagePaths.length === 0) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const listing = new Listing({
      city,
      neighborhood,
      title,
      description,
      price,
      images: imagePaths,
    });

    await listing.save();
    return res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(422).json({ error: "Error creating listing. Please try again." });
  }
});

router.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find();
    return res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
