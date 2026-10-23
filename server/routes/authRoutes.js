const express = require('express');
const { signToken } = require('../utils/auth');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const user = new User({ username, password });

    const token = signToken(user._id);
    await user.save();
    return res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Ky emër përdoruesi ekziston tashmë. Ju lutem provoni një emër tjetër.' });
    }
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
    const token = signToken(user._id);
    // Never log the token itself: anyone with log access could use it to act as this user
    console.log('User signed in:', user.username);
    return res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.log('ERROR', error);
    return res.status(500).json({ error: 'Error i serverit. Te lutem provoni perseri.' });
  }
});

router.post('/listing/:id/like', async (req, res) => {
  const { userId } = req.body;
  const listingId = req.params.id;
  if (!userId || !listingId) {
    console.log({ ERROR: 'User ID and Listing ID are required' });
    return res.status(400).json({ error: 'User ID and Listing ID are required' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log({ ERROR: 'User not found' });
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.likedListings.includes(listingId)) {
      user.likedListings.pull(listingId);
    } else {
      user.likedListings.push(listingId);
    }
    await user.save();
    return res.status(200).json({ message: 'Listing liked status updated successfully' });
  } catch (error) {
    console.log('ERROR', error);
    return res.status(500).json({ error: 'Error i serverit. Te lutem provoni perseri.' });
  }
});

router.put('/edit-user', async (req, res) => {
  // Usernames are permanent; this endpoint only changes the password
  const { userId, password, oldPassword } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and a new password are required' });
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

    user.password = password;

    await user.save();
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.log('ERROR', error);
    return res.status(500).json({ error: 'Error i serverit. Te lutem provoni perseri.' });
  }
});

module.exports = router;
