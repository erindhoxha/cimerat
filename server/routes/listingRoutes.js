const express = require('express');

const Listing = require('../models/Listing');
const requireAuth = require('../middlewares/requireAuthentication');
const { upload, saveImage, PUBLIC_USER_FIELDS } = require('../utils/images');
const { buildSearchFilter } = require('../utils/search');

const router = express.Router();

// Get current user's listings
router.get('/my-listings', requireAuth, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', PUBLIC_USER_FIELDS);
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
    const saved = await Promise.all(req.files.map((file) => saveImage(file)));
    const imagePaths = saved.map((img) => img.path);
    const blurhashes = saved.map((img) => img.blurhash);

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
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    // Previously any logged in user could delete any listing
    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not allowed to delete this listing' });
    }
    await listing.deleteOne();
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

    const saved = await Promise.all(req.files.map((file) => saveImage(file)));
    const imagePaths = saved.map((img) => img.path);
    const blurhashes = saved.map((img) => img.blurhash);

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
      q,
      limit = 20,
      skip = 0,
    } = req.query;
    const filter = {};

    if (city) filter.city = Array.isArray(city) ? { $in: city } : city;
    if (neighborhood) {
      // Ids are "City|Name" (names repeat across cities); plain names are still accepted
      const pairs = (Array.isArray(neighborhood) ? neighborhood : [neighborhood]).map((value) => {
        const [first, ...rest] = String(value).split('|');
        const name = rest.length ? rest.join('|') : first;
        // "Bregu i Diellit / Kodra e Diellit" also matches listings saved under either single name
        const names = [name, ...name.split(' / ').map((part) => part.trim())];
        const match = { neighborhood: { $in: [...new Set(names)] } };
        return rest.length ? { city: first, ...match } : match;
      });
      filter.$or = pairs;
    }
    if (priceFrom || priceTo) {
      filter.price = {};
      if (priceFrom) filter.price.$gte = Number(priceFrom);
      if (priceTo) filter.price.$lte = Number(priceTo);
    }
    // "5+" means five or more; older listings stored exact counts up to 10
    const countFilter = (value) =>
      value === '5+' ? { $in: ['5+', '5', '6', '7', '8', '9', '10'] } : value;
    if (numberOfRooms) filter.rooms = countFilter(numberOfRooms);
    if (numberOfFlatmates) filter.currentFlatmates = countFilter(numberOfFlatmates);

    if (q) {
      Object.assign(
        filter,
        await buildSearchFilter(q, {
          textFields: ['city', 'neighborhood', 'description', 'flatmateGender'],
          numberFields: ['rooms', 'currentFlatmates'],
          approxNumberFields: ['price'],
        }),
      );
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('user', PUBLIC_USER_FIELDS);

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
    const listing = await Listing.findById(req.params.id).populate('user', PUBLIC_USER_FIELDS);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
