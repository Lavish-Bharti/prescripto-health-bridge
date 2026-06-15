const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

router.post('/register', registerUser);
router.post('/login',    loginUser);
router.get('/profile',   protectUser, getProfile);
router.put('/profile',   protectUser, upload.single('image'), updateProfile);

module.exports = router;