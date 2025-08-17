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
  const { city, neighborhood, description, price, phone } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  if (!city || !neighborhood || !description || !price || !phone || imagePaths.length === 0) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const firstBlurhash = req.files.length > 0 ? await getBlurhash(req.files[0].path) : null;
  const blurhashes = await Promise.all(req.files.map((file) => getBlurhash(file.path)));

  try {
    const listing = new Listing({
      city,
      neighborhood,
      description,
      price,
      images: imagePaths,
      phone,
      blurhash: firstBlurhash,
      blurhashes: blurhashes,
      user: req.user._id,
    });

    await listing.save();
    return res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    console.error('Error creating listing:', error);
    return res.status(422).json({ error: 'Error creating listing. Please try again.' });
  }
});

router.put('/listings/:id', requireAuth, upload.array('images'), async (req, res) => {
  const { id } = req.params;
  const { city, neighborhood, description, price, phone } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  if (!city || !neighborhood || !description || !price || !phone || imagePaths.length === 0) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (listing.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'You are not allowed to edit this listing.' });
  }

  const firstBlurhash = req.files.length > 0 ? await getBlurhash(req.files[0].path) : null;
  const blurhashes = await Promise.all(req.files.map((file) => getBlurhash(file.path)));

  try {
    const listing = await Listing.findByIdAndUpdate(
      id,
      {
        city,
        neighborhood,
        description,
        price,
        images: imagePaths,
        phone,
        blurhash: firstBlurhash,
        blurhashes: blurhashes,
      },
      { new: true },
    );

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await listing.save();
    return res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    return res.status(422).json({ error: 'Error updating listing. Please try again.' });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const { city, neighborhood, priceFrom, priceTo } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (neighborhood) filter.neighborhood = neighborhood;
    if (priceFrom || priceTo) {
      filter.price = {};
      if (priceFrom) filter.price.$gte = Number(priceFrom);
      if (priceTo) filter.price.$lte = Number(priceTo);
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 }).populate('user', 'username');
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
