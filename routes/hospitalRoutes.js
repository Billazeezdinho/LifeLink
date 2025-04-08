const express = require('express');
const router = express.Router();
const { searchForDonors, register, login, bookAppointment } = require('../controller/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');

router.get('/search-donors', authMiddleware, kycMiddleware, searchForDonors);
router.post('/register', register);
router.post('/login', login);
router.post('/appointment', bookAppointment);




module.exports = router;
