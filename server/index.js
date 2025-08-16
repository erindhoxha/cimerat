require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const requireAuth = require('./middlewares/requireAuthentication');

const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/uploads', express.static('uploads'));
