const express = require('express');
const router = express.Router();
const {
  bookAppointment, getUserAppointments,
  cancelAppointment, updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protectUser, protectDoctor } = require('../middleware/authMiddleware');

router.post('/book',               protectUser,   bookAppointment);
router.get('/user',                protectUser,   getUserAppointments);
router.put('/:id/cancel',          protectUser,   cancelAppointment);
router.put('/:id/status',          protectDoctor, updateAppointmentStatus);

module.exports = router;