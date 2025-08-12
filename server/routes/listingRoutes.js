const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();
const multer = require('multer');
const requireAuth = require('../middlewares/requireAuthentication');
const sharp = require('sharp');
const { encode } = require('blurhash');

async function getBlurhash(imagePath) {
  const image = await sharp(imagePath)
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const { data, info } = image;
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}

const upload = multer({ dest: 'uploads/' });

router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('user', 'username');
    return res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/listings', requireAuth, upload.array('images'), async (req, res) => {
  const { city, neighborhood, description, price } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  if (!city || !neighborhood || !description || !price || imagePaths.length === 0) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const firstBlurhash = req.files.length > 0 ? await getBlurhash(req.files[0].path) : null;

  try {
    const listing = new Listing({
      city,
      neighborhood,
      description,
      price,
      images: imagePaths,
      blurhash: firstBlurhash,
      user: req.user._id,
    });

    await listing.save();
    return res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    console.error('Error creating listing:', error);
    return res.status(422).json({ error: 'Error creating listing. Please try again.' });
  }
});

router.get('/listings', async (_, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 }).populate('user', 'username');
    return res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/listing/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'username');
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    return res.status(200).json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
