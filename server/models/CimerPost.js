const mongoose = require('mongoose');

// A person looking for a place: posts about themselves so listing owners can find them
const cimerPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    neighborhoods: {
      type: [String],
      default: [],
    },
    budget: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('CimerPost', cimerPostSchema);
