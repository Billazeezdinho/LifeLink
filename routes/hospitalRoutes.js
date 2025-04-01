const express = require('express');
const router = express.Router();
const { searchForDonors } = require('../controller/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');

router.get('/search-donors', authMiddleware, kycMiddleware, searchForDonors);

module.exports = router;
