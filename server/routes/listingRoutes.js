const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { encode } = require('blurhash');

const Listing = require('../models/Listing');
const requireAuth = require('../middlewares/requireAuthentication');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper to generate blurhash
async function getBlurhash(imagePath) {
  const { data, info } = await sharp(imagePath)
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}

// Get current user's listings
router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('user', 'username');
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new listing
router.post('/listings', requireAuth, upload.array('images'), async (req, res) => {
  const { city, neighborhood, description, price, phone, rooms, flatmateGender, currentFlatmates } = req.body;
  if (!city || !neighborhood || !description || !price || !phone || !req.files?.length) {
    return res.status(400).json({ error: 'All fields are required and at least one image must be uploaded' });
  }

  try {
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    const blurhashes = await Promise.all(req.files.map((file) => getBlurhash(file.path)));

    const listing = new Listing({
      city,
      neighborhood,
      description,
      price,
      images: imagePaths,
      phone,
      blurhash: blurhashes[0] || null,
      blurhashes,
      rooms,
      flatmateGender,
      currentFlatmates,
      user: req.user._id,
    });

    await listing.save();
    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: 'Error creating listing. Please try again.' });
  }
});

// Delete a listing
router.delete('/listings/:id', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a listing
router.put('/listings/:id', requireAuth, upload.array('images'), async (req, res) => {
  const { city, neighborhood, description, price, phone, rooms, flatmateGender, currentFlatmates } = req.body;

  if (!city || !neighborhood || !description || !price || !phone || !req.files?.length) {
    return res.status(400).json({ error: 'All fields are required and at least one image must be uploaded' });
  }

  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not allowed to edit this listing' });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    const blurhashes = await Promise.all(req.files.map((file) => getBlurhash(file.path)));

    Object.assign(listing, {
      city,
      neighborhood,
      description,
      price,
      images: imagePaths,
      phone,
      blurhash: blurhashes[0] || null,
      blurhashes,
      rooms,
      flatmateGender,
      currentFlatmates,
    });

    await listing.save();
    res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: 'Error updating listing. Please try again.' });
  }
});

// Get all listings with filters
router.get('/listings', async (req, res) => {
  try {
    const {
      city,
      neighborhood,
      priceFrom,
      priceTo,
      numberOfRooms,
      numberOfFlatmates,
      limit = 20,
      skip = 0,
    } = req.query;
    const filter = {};

    if (city) filter.city = Array.isArray(city) ? { $in: city } : city;
    if (neighborhood) filter.neighborhood = Array.isArray(neighborhood) ? { $in: neighborhood } : neighborhood;
    if (priceFrom || priceTo) {
      filter.price = {};
      if (priceFrom) filter.price.$gte = Number(priceFrom);
      if (priceTo) filter.price.$lte = Number(priceTo);
    }
    if (numberOfRooms) filter.rooms = numberOfRooms;
    if (numberOfFlatmates) filter.currentFlatmates = numberOfFlatmates;

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('user', 'username');

    const total = await Listing.countDocuments(filter);
    res.status(200).json({ listings, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single listing
router.get('/listing/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'username');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
