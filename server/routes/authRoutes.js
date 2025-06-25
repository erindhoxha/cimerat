const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", (req, res) => {
  console.log("Received signup request:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  const user = new User({ email, password });
  user.save();

  res.status(201).json({ message: "User signed up successfully" });
});

module.exports = router;
