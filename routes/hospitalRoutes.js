const express = require('express');
const router = express.Router();

const {
  searchForDonors,
  register,
  login,
  forgotPassword,
  submitKYC,
  submitBloodRequest,
  getHospitalProfile,
  getBloodRequestHistory,
  resetPassword,
  updateProfile,
} = require('../controller/hospitalController');

// Import named exports from middleware
const { auth, roleAuth } = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');
const upload = require('../config/multerConfig');

/**
 * @swagger
 * /api/hospital/register:
 *   post:
 *     summary: Register a new hospital
 *     tags: [Hospital]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *       400:
 *         description: Bad Request – Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/hospital/login:
 *   post:
 *     summary: Login a hospital
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hospital logged in successfully
 *       400:
 *         description: Bad Request – Missing email or password
 *       401:
 *         description: Unauthorized – Invalid credentials
 *       500:
 *         description: Internal server error
 */

router.post('/login', login);


/**
 * @swagger
 * /api/hospital/forgotPassword:
 *   post:
 *     summary: Send password reset link to hospital email
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
 *         description: Password reset link sent successfully
 *       400:
 *         description: Bad Request – Email is required
 *       404:
 *         description: Not Found – Hospital not found
 *       500:
 *         description: Internal server error
 */
router.post('/forgotPassword', forgotPassword);

/**
 * @swagger
 * /api/hospital/resetPassword:
 *   post:
 *     summary: Reset hospital password using token
 *     tags: [Hospital]
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
 *         description: Password reset successfully
 *       400:
 *         description: Bad Request – Token and new password are required
 *       404:
 *         description: Not Found – Hospital not found
 *       500:
 *         description: Internal server error
 */
router.post('/resetPassword', auth, roleAuth(['hospital']), resetPassword);


/**
 * @swagger
 * /api/hospital/updateProfile:
 *   patch:
 *     summary: Update hospital profile
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request – Error with file upload or missing data
 *       401:
 *         description: Unauthorized – Invalid token
 *       500:
 *         description: Internal server error
 */

router.patch('/updateProfile', auth, roleAuth(['hospital']), updateProfile);


/**
 * @swagger
 * /api/hospital/request-blood:
 *   post:
 *     summary: Submit a blood request
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
 *               bloodGroup:
 *                 type: string
 *               numberOfPints:
 *                 type: integer
 *               preferredDate:
 *                 type: string
 *                 format: date
 *               urgencyLevel:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Blood request submitted successfully
 *       403:
 *         description: Forbidden – Only hospitals can make a blood request
 *       500:
 *         description: Internal server error
 */

router.post('/request-blood', auth, roleAuth(['hospital']), submitBloodRequest);

/**
 * @swagger
 * /api/hospital/history:
 *   get:
 *     summary: Get blood request history for a hospital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past blood requests for the hospital
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BloodRequest'
 *       403:
 *         description: Forbidden – Only hospitals can view their blood request history
 *       500:
 *         description: Internal server error
 */

router.get('/history', auth, roleAuth(['hospital']), getBloodRequestHistory);


/**
 * @swagger
 * /api/hospital/profile:
 *   get:
 *     summary: Get hospital profile
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hospital profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       401:
 *         description: Unauthorized – Invalid token
 *       500:
 *         description: Internal server error
 */

router.get('/profile', auth, roleAuth(['hospital']), getHospitalProfile);


/**
 * @swagger
 * /api/hospital/search-donors:
 *   get:
 *     summary: Search for available blood donors
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available blood donors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donor'
 *       400:
 *         description: Bad Request – KYC not completed
 *       403:
 *         description: Forbidden – Only hospitals can search for donors
 *       500:
 *         description: Internal server error
 */
router.get('/search-donors', auth, roleAuth(['hospital']), kycMiddleware, searchForDonors);


const kycUpload = upload.fields([
  { name: 'facilityImage', maxCount: 1 },
  { name: 'accreditedCertificate', maxCount: 1 },
  { name: 'utilityBill', maxCount: 1 },
]);


/**
 * @swagger
 * /api/hospital/kyc:
 *   post:
 *     summary: Submit KYC
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               licenseNumber:
 *                 type: string
 *               facilityImage:
 *                 type: string
 *                 format: binary
 *               accreditedCertificate:
 *                 type: string
 *                 format: binary
 *               utilityBill:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submitted successfully
 *       400:
 *         description: A KYC is already pending or invalid submission
 *       401:
 *         description: Unauthorized – Invalid token
 *       500:
 *         description: Internal server error
 */

router.post('/kyc', auth, roleAuth(['hospital']), kycUpload, submitKYC);

module.exports = router;
