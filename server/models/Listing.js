const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blurhash: {
      type: String,
      required: false,
    },
    blurhashes: {
      type: [String],
      required: false,
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
