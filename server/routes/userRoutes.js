const express = require('express');

const User = require('../models/User');
const Listing = require('../models/Listing');
const CimerPost = require('../models/CimerPost');
const requireAuth = require('../middlewares/requireAuthentication');
const { isValidPhoneNumber } = require('libphonenumber-js');
const { upload, saveImage, deleteImages, PUBLIC_USER_FIELDS } = require('../utils/images');

const router = express.Router();

// Upload / replace the logged in user's profile photo
router.post('/me/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Fotoja është e detyrueshme' });

  try {
    const { path, blurhash } = await saveImage(req.file, { avatar: true });
    const previousAvatar = req.user.avatar;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: path, avatarBlurhash: blurhash },
      { new: true },
    ).select(PUBLIC_USER_FIELDS);
    await deleteImages([previousAvatar]);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: 'Gabim gjatë ngarkimit të fotos. Ju lutemi provoni përsëri.' });
  }
});

// Update the logged in user's own details. The username is permanent and can't be changed here.
router.put('/me', requireAuth, async (req, res) => {
  const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : undefined;
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : undefined;

  if (fullName && fullName.length > 60) {
    return res.status(400).json({ error: 'Emri i plotë mund të ketë deri në 60 karaktere' });
  }
  if (phone && !isValidPhoneNumber(phone, 'XK')) {
    return res.status(400).json({ error: 'Numri duhet të jetë valid për Kosovë' });
  }

  try {
    const update = {};
    if (fullName !== undefined) update.fullName = fullName || null;
    if (phone !== undefined) update.phone = phone || null;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true }).select(
      `${PUBLIC_USER_FIELDS} phone`,
    );
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: 'Gabim gjatë ruajtjes së profilit. Ju lutemi provoni përsëri.' });
  }
});

// Public profile: the user plus everything they've posted
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(PUBLIC_USER_FIELDS);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [listings, posts] = await Promise.all([
      Listing.find({ user: user._id }).sort({ createdAt: -1 }).populate('user', PUBLIC_USER_FIELDS),
      CimerPost.find({ user: user._id }).sort({ createdAt: -1 }).populate('user', PUBLIC_USER_FIELDS),
    ]);

    res.status(200).json({ user, listings, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
