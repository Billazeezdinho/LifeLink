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
 * /hospital/register:
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
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *       400:
 *         description: Bad Request – Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post('/hospital/register', register);

/**
 * @swagger
 * /hospital/login:
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

router.post('/hospital/login', login);


/**
 * @swagger
 * /hospital/forgotPassword:
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
router.post('/hospital/forgotPassword', forgotPassword);

/**
 * @swagger
 * /hospital/resetPassword:
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
router.post('/hospital/resetPassword', auth, roleAuth(['hospital']), resetPassword);


/**
 * @swagger
 * /hospital/updateProfile:
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

router.patch('/hospital/updateProfile', auth, roleAuth(['hospital']), updateProfile);

/**
 * @swagger
 * /hospital/request-blood:
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
 *             required:
 *               - bloodGroup
 *               - numberOfPints
 *               - preferredDate
 *               - amount
 *             properties:
 *               bloodGroup:
 *                 type: string
 *                 example: O+
 *               numberOfPints:
 *                 type: integer
 *                 example: 5
 *               preferredDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-05-15
 *               urgencyLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               amount:
 *                 type: number
 *                 example: 20000
 *     responses:
 *       201:
 *         description: Blood request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blood request submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/BloodRequest'
 *       403:
 *         description: Forbidden – Only hospitals can make a blood request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Only hospitals can submit blood requests.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/hospital/request-blood', auth, roleAuth(['hospital']), submitBloodRequest);

/**
 * @swagger
 * /hospital/history:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Only hospitals can view their blood request history.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/hospital/history', auth, roleAuth(['hospital']), getBloodRequestHistory);

/**
 * @swagger
 * /hospital/profile:
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

router.get('/hospital/profile', auth, roleAuth(['hospital']), getHospitalProfile);


/**
 * @swagger
 * /hospital/search-donors:
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
router.get('/hospital/search-donors', auth, roleAuth(['hospital']), kycMiddleware, searchForDonors);


const kycUpload = upload.fields([
  { name: 'facilityImage', maxCount: 1 },
  { name: 'accreditedCertificate', maxCount: 1 },
  { name: 'utilityBill', maxCount: 1 },
]);


/**
 * @swagger
 * /hospital/kyc:
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

router.post('/hospital/kyc', auth, roleAuth(['hospital']), kycUpload, submitKYC);

module.exports = router;
