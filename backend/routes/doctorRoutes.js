const express = require('express');
const router = express.Router();
const {
  getAllDoctors, getDoctorById, loginDoctor,
  getDoctorProfile, updateDoctorProfile, getDoctorAppointments
} = require('../controllers/doctorController');
const { protectDoctor } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

router.get('/',                    getAllDoctors);
router.get('/:id',                 getDoctorById);
router.post('/login',              loginDoctor);
router.get('/profile',             protectDoctor, getDoctorProfile);
router.put('/profile',             protectDoctor, upload.single('image'), updateDoctorProfile);
router.get('/appointments',        protectDoctor, getDoctorAppointments);

module.exports = router;