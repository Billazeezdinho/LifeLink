const express = require('express');
const router = express.Router();
const { searchForDonors, register, login, bookAppointment, forgotPassword, resetPassword, updateProfile } = require('../controller/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');


router.get('/search-donors', authMiddleware, kycMiddleware, searchForDonors);

/**
 * @swagger
 * /api/hospital/register:
 *   post:
 *     summary: Hospital registration
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, location, password]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital registered successfully
 */
router.post('/register', register);

/**
 * @swagger
 * /api/hospital/login:
 *   post:
 *     summary: Hospital login
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */

router.post('/login', login);
router.post('/appointment', bookAppointment);

/**
 * @swagger
 * /api/hospital/forgotPassword:
 *   post:
 *     summary: Hospital forgot password
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.post('/forgotPassword',  forgotPassword);

/**
 * @swagger
 * /api/hospital/resetPassword:
 *   post:
 *     summary: Reset hospital password
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.post('/resetPassword', authMiddleware, resetPassword);

/**
 * @swagger
 * /api/hospital/updateProfile:
 *   patch:
 *     summary: Update hospital profile
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/updateProfile', authMiddleware,  updateProfile);







module.exports = router;
