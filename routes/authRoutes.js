const express = require('express');
const router = express.Router();
const { signup, login, resetPassword } = require('../controller/authController');

router.post('/signup', signup); // For donor/hospital registration
router.post('/login', login); // For login
router.post('/reset-password', resetPassword); // For password reset

module.exports = router;
