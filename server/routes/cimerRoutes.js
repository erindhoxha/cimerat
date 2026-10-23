const express = require('express');

const CimerPost = require('../models/CimerPost');
const requireAuth = require('../middlewares/requireAuthentication');
const { PUBLIC_USER_FIELDS } = require('../utils/images');
const { buildSearchFilter } = require('../utils/search');

const router = express.Router();

// Get all cimer posts, newest first
router.get('/cimerat', async (req, res) => {
  try {
    const { city, gender, budgetFrom, budgetTo, q, skip = 0, limit = 10 } = req.query;
    const filter = {};
    if (city) filter.city = { $in: Array.isArray(city) ? city : [city] };
    if (gender) filter.gender = gender;
    if (budgetFrom || budgetTo) {
      filter.budget = {};
      if (budgetFrom) filter.budget.$gte = Number(budgetFrom);
      if (budgetTo) filter.budget.$lte = Number(budgetTo);
    }
    if (q) {
      Object.assign(
        filter,
        await buildSearchFilter(q, {
          textFields: ['city', 'neighborhoods', 'description', 'gender'],
          numberFields: ['age'],
          approxNumberFields: ['budget'],
        }),
      );
    }

    const posts = await CimerPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate('user', PUBLIC_USER_FIELDS);

    const total = await CimerPost.countDocuments(filter);
    res.status(200).json({ posts, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single cimer post
router.get('/cimerat/:id', async (req, res) => {
  try {
    const post = await CimerPost.findById(req.params.id).populate('user', PUBLIC_USER_FIELDS);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a cimer post
router.post('/cimerat', requireAuth, async (req, res) => {
  const { city, neighborhoods, budget, description, gender, age, phone } = req.body;
  if (!city || !budget || !description || !phone) {
    return res.status(400).json({ error: 'Qyteti, buxheti, përshkrimi dhe numri i telefonit janë të detyrueshëm' });
  }

  try {
    const post = await CimerPost.create({
      city,
      neighborhoods: neighborhoods || [],
      budget,
      description,
      gender,
      age: age || undefined,
      phone,
      user: req.user._id,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: 'Gabim gjatë krijimit të postimit. Ju lutemi provoni përsëri.' });
  }
});

// Update own cimer post
router.put('/cimerat/:id', requireAuth, async (req, res) => {
  const { city, neighborhoods, budget, description, gender, age, phone } = req.body;
  if (!city || !budget || !description || !phone) {
    return res.status(400).json({ error: 'Qyteti, buxheti, përshkrimi dhe numri i telefonit janë të detyrueshëm' });
  }

  try {
    const post = await CimerPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not allowed to edit this post' });
    }
    Object.assign(post, {
      city,
      neighborhoods: neighborhoods || [],
      budget,
      description,
      gender,
      age: age || undefined,
      phone,
    });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: 'Gabim gjatë ruajtjes së postimit. Ju lutemi provoni përsëri.' });
  }
});

// Delete own cimer post
router.delete('/cimerat/:id', requireAuth, async (req, res) => {
  try {
    const post = await CimerPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You are not allowed to delete this post' });
    }
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
