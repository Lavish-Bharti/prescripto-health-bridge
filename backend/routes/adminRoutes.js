const express = require('express');
const router = express.Router();
const {
  loginAdmin, addDoctor, getAllDoctors,
  removeDoctor, getAllAppointments, getAllUsers
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

router.post('/login',           loginAdmin);
router.post('/add-doctor',      protectAdmin, upload.single('image'), addDoctor);
router.get('/doctors',          protectAdmin, getAllDoctors);
router.delete('/doctors/:id',   protectAdmin, removeDoctor);
router.get('/appointments',     protectAdmin, getAllAppointments);
router.get('/users',            protectAdmin, getAllUsers);

module.exports = router;