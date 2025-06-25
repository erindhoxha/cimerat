const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const user = new User({ email, password });
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "MY_SECRET_KEY",
    );
    await user.save();
    return res.status(201).json({ token });
  } catch (error) {
    return res.status(422).json({ error });
  }
});

module.exports = router;
