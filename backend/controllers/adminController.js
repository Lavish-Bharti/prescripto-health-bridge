const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'prescripto/doctors' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ success: false, message: 'Invalid admin credentials' });
    }
    const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, fees, about, available } = req.body;
    if (!name || !email || !password || !speciality || !degree || !experience || !fees) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }
    const exists = await Doctor.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Doctor email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    let imageUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const doctor = await Doctor.create({ name, email, password: hashed, speciality, degree, experience, fees: Number(fees), about, available: available !== 'false', image: imageUrl });
    res.status(201).json({ success: true, doctor: { ...doctor._doc, password: undefined } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove doctor
const removeDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('userId',   'name email image')
      .populate('doctorId', 'name email speciality fees image')
      .sort({ createdAt: -1 });
    const formatted = appointments.map(apt => ({
      _id:    apt._id,
      date:   apt.date,
      time:   apt.time,
      status: apt.status,
      user:   apt.userId,
      doctor: apt.doctorId,
    }));
    res.json({ success: true, appointments: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { loginAdmin, addDoctor, getAllDoctors, removeDoctor, getAllAppointments, getAllUsers };