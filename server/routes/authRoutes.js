const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const user = new User({ username, password });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      'MY_SECRET_KEY',
    );
    await user.save();
    return res.status(201).json({ token, userId: user._id });
  } catch (error) {
    return res.status(422).json({ error: 'Gabim gjatë regjistrimit. Ju lutemi provoni përsëri ose na kontaktoni.' });
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      return res.status(401).json({ error: 'Gabim i username-it ose fjalëkalimit. Ju lutemi provoni përsëri.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Gabim i username-it ose fjalëkalimit. Ju lutemi provoni përsëri.' });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      'MY_SECRET_KEY',
    );
    console.log('User signed in:', user.username, token);
    return res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.log('ERROR', error);
    return res.status(500).json({ error: 'Error i serverit. Te lutem provoni perseri.' });
  }
});

router.put('/edit-user', async (req, res) => {
  const { userId, username, password, oldPassword } = req.body;
  if (!userId || (!username && !password)) {
    console.log('EROR');
    return res.status(400).json({ error: 'User ID and at least one field to update are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Gabim i username-it ose fjalëkalimit. Ju lutemi provoni përsëri.' });
    }

    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = password;
    }

    await user.save();
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.log('ERROR', error);
    return res.status(500).json({ error: 'Error i serverit. Te lutem provoni perseri.' });
  }
});

module.exports = router;
