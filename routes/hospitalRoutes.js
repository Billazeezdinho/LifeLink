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
  getHospitalAppointments,
  respondToAppointment,
  getOneHospital,
  getAppointmentHistory,
  getOneBloodRequestById,
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
 * /hospital/resetPassword/{token}:
 *   patch:
 *     summary: Reset hospital password using token
 *     tags: [Hospital]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: yourNewSecurePassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad Request – Token or new password missing
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Internal server error
 */

router.post('/hospital/resetPassword/:token', resetPassword);

/**
 * @swagger
 * /hospital/{hospitalId}:
 *   get:
 *     summary: Get complete information about a hospital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []    # This indicates that Authorization token is needed
 *     description: Retrieve full details of a specific hospital by ID.
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         description: The ID of the hospital to retrieve.
 *         schema:
 *           type: string
 *           example: 64321ab7e2f476001d98dccc
 *     responses:
 *       200:
 *         description: Hospital fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hospital fetched successfully
 *                 hospital:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64321ab7e2f476001d98dccc
 *                     fullName:
 *                       type: string
 *                       example: St. Mary's Hospital
 *                     email:
 *                       type: string
 *                       example: hospital@example.com
 *                     location:
 *                       type: string
 *                       example: New York
 *                     phone:
 *                       type: string
 *                       example: +123456789
 *                     address:
 *                       type: string
 *                       example: 123 Main Street
 *                     city:
 *                       type: string
 *                       example: New York City
 *                     state:
 *                       type: string
 *                       example: NY
 *                     profilePicture:
 *                       type: string
 *                       example: https://cloudinary.com/sample.jpg
 *                     role:
 *                       type: string
 *                       example: hospital
 *                     kycCompleted:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Server error
 */

router.get('/hospital/:hospitalId', auth, getOneHospital);

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
 * /theAppointment/history:
 *   get:
 *     summary: Get appointment history for a hospital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past appointment request for the hospital
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BloodRequest'
 *       403:
 *         description: Forbidden – Only hospitals can view their Appointment history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Only hospitals can view their Appointment history.
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
router.get('/theAppointment/history', auth, roleAuth(['hospital']), getAppointmentHistory);

/**
 * @swagger
 * /re-hospital/history:
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
router.get('/re-hospital/history', auth, roleAuth(['hospital']), getBloodRequestHistory);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments for the hospital
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     description: Fetches a list of all donors who have booked appointments with the hospital.
 *     responses:
 *       200:
 *         description: List of appointments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointments fetched successfully
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       donorName:
 *                         type: string
 *                         example: John Doe
 *                       donorEmail:
 *                         type: string
 *                         example: johndoe@example.com
 *                       bloodType:
 *                         type: string
 *                         example: O+
 *                       date:
 *                         type: string
 *                         example: 2025-04-22
 *                       time:
 *                         type: string
 *                         example: 10:00 AM
 *                       status:
 *                         type: string
 *                         example: pending
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get("/appointments", auth, getHospitalAppointments); 

/**
 * @swagger
 * /appointments/{appointmentId}/respond:
 *   put:
 *     summary: Respond to a donor appointment
 *     tags: [Hospital]
 *     security:
 *       - bearerAuth: []
 *     description: Hospital can accept or reject a donor's appointment request.
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to respond to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, declined]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Appointment response recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment accepted
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.put("/appointments/:appointmentId/respond", auth, respondToAppointment); 

/**
 * @swagger
 * /hospital/profile/one:
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

router.get('/hospital/profile/one', auth, roleAuth(['hospital']), getHospitalProfile);


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


/**
 * @swagger
 * /blood-request/{hospitalId}:
 *   get:
 *     summary: Get a single blood request by its ID
 *     description: Allows a verified donor to fetch the details of a specific blood request by its ID.
 *     tags:
 *       - Blood Requests
 *     security:
 *       - bearerAuth: []   # JWT Authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the blood request to fetch
 *     responses:
 *       200:
 *         description: Blood request fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blood request fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     hospital:
 *                       type: object
 *                       properties:
 *                         fullName:
 *                           type: string
 *                         address:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *                         city:
 *                           type: string
 *                         profilePics:
 *                           type: string
 *                     bloodGroup:
 *                       type: string
 *                     numberOfPints:
 *                       type: integer
 *                     preferredDate:
 *                       type: string
 *                       format: date
 *                     urgencyLevel:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized. Donor not found.
 *       404:
 *         description: Blood request not found.
 *       500:
 *         description: Internal server error
 */

// Route setup
router.get('/blood-request/:hospitalId', auth,  getOneBloodRequestById);

module.exports = router;
