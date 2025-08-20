require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const requireAuth = require('./middlewares/requireAuthentication');
const User = require('./models/User');
const cors = require('cors');

const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(authRoutes);
app.use(listingRoutes);

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/user', requireAuth, (req, res) => {
  console.log('Getting user!');
  res.status(200).json({ user: req.user });
});

app.get('/liked-listings', requireAuth, async (req, res) => {
  console.log('Getting liked listings for user:', req.user);
  try {
    const user = await User.findById(req.user._id).populate('likedListings');
    return res.status(200).json(user.likedListings);
  } catch (error) {
    console.error('Error fetching liked listings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/uploads', express.static('uploads'));
