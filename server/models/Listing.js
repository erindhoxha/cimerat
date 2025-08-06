const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
