const router = require('express').Router();
const { register, login, resetNewPassword, changePassword, forgotPassword, scheduleDonation, getAllDonor, getDashboard, getDonationsByStatus, deleteDonor, viewHospitals, bookAppointment, logOut, updateProfile, getOneDonorById, UpdateDonorDetails, getDonorNotifications, cancelAppointment, getDonorAppointments, verifyDonors, resendVerificationEmail } = require('../controller/donorController');
const { registerValidate, loginValidator } = require('../middleware/validate');
const {auth, roleAuth} = require('../middleware/authMiddleware');
const upload= require('../utils/multer');

/**
 * @swagger
 * tags:
 *   - name: Donor
 *     description: Operations for Donors
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new donor
 *     tags: [Donor]
 *     description: Register a new donor with full name, email, password, blood type, location, and age.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Life Link
 *               email:
 *                 type: string
 *                 example: LifeLink@mail.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               bloodType:
 *                 type: string
 *                 example: O+
 *               location:
 *                 type: string
 *                 example: New York
 *               age:
 *                 type: string
 *                 example: "28"
 *     responses:
 *       201:
 *         description: Donor created successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", registerValidate, register);


/**
 * @swagger
 * /verify-donor/{token}:
 *   get:
 *     summary: Verify Donor via email token
 *     tags: [Donor]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "someVerificationToken"
 *     responses:
 *       200:
 *         description: Donor verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get('/verify-donor/:token', verifyDonors);

/**
 * @swagger
 * /re-verify:
 *   post:
 *     summary: Resend verification email
 *     tags: [Donor]
 *     description: Resend a verification email to the donor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: LifeLink@mail.com
 *     responses:
 *       200:
 *         description: New verification link sent successfully.
 *       400:
 *         description: Donor is already verified or email is missing.
 *       404:
 *         description: Donor not found.
 *       500:
 *         description: Internal server error.
 */

router.post('/re-verify', resendVerificationEmail);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing donor
 *     tags: [Donor]
 *     description: Login a donor using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: LifeLink@mail.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid Credentials
 *       404:
 *         description: Invalid Credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login",loginValidator, login);

/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Get all donors
 *     tags: [Donor]
 *     description: Retrieve all donors from the database.
 *     responses:
 *       200:
 *         description: List of all donors
 *       500:
 *         description: Internal server error
 */
router.get("/donors", getAllDonor);
/**
 * @swagger
 * /donors/{id}:
 *   get:
 *     summary: Get a donor by ID
 *     tags: [Donor]
 *     description: Retrieve a donor's details by their unique ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Donor ID
 *     responses:
 *       200:
 *         description: Donor details retrieved
 *       404:
 *         description: Donor not found
 *       401:
 *         description: Unauthorized - Token required or invalid
 *       500:
 *         description: Internal server error
 */
router.get("/donors/:id", auth, roleAuth(["admin", "hospital"]), getOneDonorById);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get donor dashboard
 *     tags: [Donor]
 *     description: Retrieve the donor's dashboard information, including their profile.
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", auth ,getDashboard);

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Schedule a donation
 *     tags: [Donor]
 *     description: Schedule a donation appointment with a date and hospital ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: 2025-04-20
 *               hospitalId:
 *                 type: string
 *                 example: 64321ab7e2f476001d98dccc
 *     responses:
 *       201:
 *         description: Donation scheduled successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/schedule", auth, scheduleDonation);

/**
 * @swagger
 * /donations/{status}:
 *   get:
 *     summary: Get all donor's donations filtered by status with hospital details
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, rescheduled, cancelled]
 *         description: Status of the donation to filter
 *     responses:
 *       200:
 *         description: Donations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pending donations fetched successfully
 *                 donations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 66147c272bb29c76e9a83b56
 *                       donor:
 *                         type: string
 *                         example: 661479fe2bb29c76e9a83b45
 *                       hospital:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 66147b8a2bb29c76e9a83b22
 *                           name:
 *                             type: string
 *                             example: LifeLink General Hospital
 *                           address:
 *                             type: string
 *                             example: 123 Blood Drive Avenue, Lagos
 *                           phoneNumber:
 *                             type: string
 *                             example: +2348012345678
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: 2025-04-21
 *                       time:
 *                         type: string
 *                         example: 14:00
 *                       status:
 *                         type: string
 *                         example: pending
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-17T10:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-04-17T10:30:00.000Z
 *                 token:
 *                   type: string
 *                   description: Fresh JWT token after successful request
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       404:
 *         description: No donations found for the given status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No pending donations found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   example: 'Internal Server Error: something went wrong'
 */
router.get("/donations/:status", auth, getDonationsByStatus);

/**
 * @swagger
 * /donor/notifications:
 *   get:
 *     summary: Get donor notifications
 *     tags: [Donor]
 *     description: Fetch the notifications for a donor.
 *     security:
 *       - bearerAuth: []  # Indicating that this endpoint requires JWT authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved donor notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "A new appointment has been scheduled."
 *                       from:
 *                         type: string
 *                         example: "Hospital XYZ"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-04-20"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.get('/donor/notifications', auth, getDonorNotifications);

/**
 * @swagger
 * /donor/appointments:
 *   get:
 *     summary: Get all scheduled donations for a donor
 *     tags: [Donor Appointments]
 *     security:
 *       - bearerAuth: []  # Token auth required
 *     responses:
 *       200:
 *         description: List of donor appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Donor appointments fetched successfully
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6630abc123456789
 *                       hospital:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Life Hospital
 *                           address:
 *                             type: string
 *                             example: 123 Health Street
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-01T00:00:00.000Z
 *                       time:
 *                         type: string
 *                         example: 10:00 AM
 *                       status:
 *                         type: string
 *                         example: pending
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/donor/appointments', auth, getDonorAppointments);


/**
 * @swagger
 * /donor/appointments/{appointmentId}/cancel:
 *   put:
 *     summary: Cancel a scheduled donation appointment
 *     tags: [Donor Appointments]
 *     security:
 *       - bearerAuth: []  # Token auth required
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment to cancel
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Appointment cancelled successfully
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6630abc123456789
 *                     status:
 *                       type: string
 *                       example: cancelled
 *       400:
 *         description: Appointment already cancelled
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.put('/donor/appointments/:appointmentId/cancel', auth, cancelAppointment);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out a donor
 *     tags: [Donor]
 *     description: Log out the currently logged-in donor.
 *     responses:
 *       200:
 *         description: Donor logged out successfully
 *       500:
 *         description: Internal server error
 */
router.post("/logout", auth, logOut);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update donor profile picture
 *     tags: [Donor]
 *     description: Update donor's profile picture.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePics:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *       500:
 *         description: Internal server error
 */
router.put("/profile", auth, upload.single("profilePics"), updateProfile);

/**
 * @swagger
 * /update-profile:
 *   put:
 *     summary: Update donor profile information
 *     tags: [Donor]
 *     description: This route allows a donor to update any of their profile details including name, location, phone number, and other fields.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "life Link"
 *               location:
 *                 type: string
 *                 example: "Festac, Lagos"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2349090909090"
 *               email:
 *                 type: string
 *                 example: "donor@example.com"
 *               age:
 *                 type: string
 *                 example: "30"
 *               gender:
 *                 type: string
 *                 example: "female"
 *               bloodType:
 *                 type: string
 *                 example: "O+"
 *     responses:
 *       200:
 *         description: Profile details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile Details Updated successfully"
 *                 data:
 *                   type: object
 *                   example:
 *                     fullName: "Nlife Link"
 *                     email: "donor@example.com"
 *                     location: "Festac, Lagos"
 *                     phoneNumber: "+2349090909090"
 *                     bloodType: "O+"
 *                     age: "30"
 *                     gender: "female"
 *       400:
 *         description: Invalid input or phone number format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid phone Number Format"
 *       500:
 *         description: Server error while updating profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update donor details: Internal Server Error"
 */

// Donor Update Route
router.put('/update-profile', auth, UpdateDonorDetails);


/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Forgot password
 *     tags: [Donor]
 *     description: Send a password reset link to the donor's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: LifeLink@Mail.com
 *     responses:
 *       200:
 *         description: Reset password link sent successfully
 *       404:
 *         description: Email not found
 *       500:
 *         description: Internal server error
 */
router.post("/forgotPassword", forgotPassword);

/**
 * @swagger
 * /resetPassword/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Donor]
 *     description: Reset donor's password using a token and new password.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Donor TOKEN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.post("/resetPassword/:token", resetNewPassword);


/**
 * @swagger
 * /changePassword:
 *   put:
 *     summary: Change password
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []   # <-- add this to require JWT token
 *     description: Change the donor's password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldSecurePass456
 *               newPassword:
 *                 type: string
 *                 example: AnotherSecurePass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password incorrect or invalid input
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.put("/changePassword", auth, changePassword);

/**
 * @swagger
 * /deleteDonor/{id}:
 *   delete:
 *     summary: Delete a donor
 *     tags: [Donor]
 *     description: Delete a donor from the system by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Donor ID
 *     responses:
 *       200:
 *         description: Donor deleted successfully
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteDonor/:id", auth, roleAuth([ "admin" ]), deleteDonor);

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get list of hospitals
 *     tags: [Donor]
 *     description: Retrieve all hospitals.
 *     responses:
 *       200:
 *         description: List of hospitals
 *       500:
 *         description: Internal server error
 */
router.get("/hospitals", viewHospitals);

/**
 * @swagger
 * /bookAppointment:
 *   post:
 *     summary: Book an appointment with a hospital
 *     tags: [Donor]
 *     security:
 *       - bearerAuth: []   # ✅ This matches your auth middleware
 *     description: Allows a donor to book an appointment with a selected hospital.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospitalId
 *               - date
 *               - time
 *             properties:
 *               hospitalId:
 *                 type: string
 *                 example: 64321ab7e2f476001d98dccc
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-04-20
 *               time:
 *                 type: string
 *                 example: 10:00 AM
 *     responses:
 *       200:
 *         description: Appointment booked successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Internal server error
 */
router.post("/bookAppointment", auth, bookAppointment);

module.exports = router;