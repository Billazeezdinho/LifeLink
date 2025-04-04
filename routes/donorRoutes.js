const express = require('express');
const router = express.Router();
const { viewHospitals, bookAppointment } = require('../controller/donorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/hospitals', authMiddleware, viewHospitals);
router.post('/book-appointment', authMiddleware, bookAppointment);

module.exports = router;
