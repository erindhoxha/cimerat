const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/listings", upload.array("images"), async (req, res) => {
  // req.files contains uploaded images
  // Save file paths or upload to cloud storage, then save URLs in DB

  res.status(201).json({ message: "Images uploaded!", files: req.body.images });

  const { city, neighborhood, title, description, price, images } = req.body;

  if (!city || !neighborhood || !title || !description || !price || !images) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // try {
  //   const listing = new Listing({
  //     city,
  //     neighborhood,
  //     title,
  //     description,
  //     price,
  //     images,
  //   });

  //   await listing.save();
  //   return res.status(201).json({ message: "Listing created successfully", listing });
  // } catch (error) {
  //   console.error("Error creating listing:", error);
  //   return res.status(422).json({ error: "Error creating listing. Please try again." });
  // }
});

module.exports = router;
