const Doctor = require('../models/Doctor');
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

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'prescripto/doctors' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const { search, speciality, available, sort, maxFee, limit } = req.query;
    let query = {};
    if (search)     query.$or = [{ name: { $regex: search, $options: 'i' } }, { speciality: { $regex: search, $options: 'i' } }];
    if (speciality) query.speciality = speciality;
    if (available)  query.available = true;
    if (maxFee)     query.fees = { $lte: Number(maxFee) };

    let sortObj = {};
    if (sort === 'fees_asc')   sortObj = { fees: 1 };
    else if (sort === 'fees_desc')  sortObj = { fees: -1 };
    else if (sort === 'experience') sortObj = { experience: -1 };
    else sortObj = { rating: -1 };

    let doctorsQuery = Doctor.find(query).select('-password').sort(sortObj);
    if (limit) doctorsQuery = doctorsQuery.limit(Number(limit));
    const doctors = await doctorsQuery;
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, doctor.password);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(doctor._id);
    res.json({ success: true, token, doctor: { _id: doctor._id, name: doctor.name, email: doctor.email, image: doctor.image, speciality: doctor.speciality, available: doctor.available } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    res.json({ success: true, doctor: req.doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, experience, available, about } = req.body;
    const updateData = { fees, experience, about, available: available === 'true' || available === true };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    }
    const doctor = await Doctor.findByIdAndUpdate(req.doctor._id, updateData, { new: true }).select('-password');
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get doctor appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.doctor._id })
      .populate('userId', 'name email image phone')
      .sort({ createdAt: -1 });
    const formatted = appointments.map(apt => ({
      _id:    apt._id,
      date:   apt.date,
      time:   apt.time,
      status: apt.status,
      user:   apt.userId,
    }));
    res.json({ success: true, appointments: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllDoctors, getDoctorById, loginDoctor, getDoctorProfile, updateDoctorProfile, getDoctorAppointments };