const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  speciality: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    default: '',
  },
  fees: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);