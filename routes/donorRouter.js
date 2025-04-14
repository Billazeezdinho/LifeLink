const router = require('express').Router();
const { register, login, resetNewPassword, changePassword, forgotPassword, scheduleDonation, getAllDonor,getDashboard, getDonationsByStatus, deleteDonor, viewHospitals, bookAppointment, logOut, updateProfile, getOneDonorById } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');
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
 *     parameters:
 *       - in: body
 *         name: donor
 *         description: Donor registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             bloodType:
 *               type: string
 *             location:
 *               type: string
 *             age:
 *               type: number
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
 * /login:
 *   post:
 *     summary: Log in an existing donor
 *     tags: [Donor]
 *     description: Login a donor using email and password.
 *     parameters:
 *       - in: body
 *         name: donor
 *         description: Donor login details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Incorrect password
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Donor ID
 *     responses:
 *       200:
 *         description: Donor details retrieved
 *       404:
 *         description: Donor not found
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
 *     parameters:
 *       - in: body
 *         name: appointment
 *         description: Donation appointment details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             date:
 *               type: string
 *             hospitalId:
 *               type: string
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
 *     summary: Get donations by status
 *     tags: [Donor]
 *     description: Retrieve a donor's donations filtered by status (e.g., pending, completed).
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         description: Status of the donation (pending, completed, etc.)
 *     responses:
 *       200:
 *         description: Donations found with the specified status
 *       404:
 *         description: No donations found with the given status
 *       500:
 *         description: Internal server error
 */
router.get("/donations/:status", auth, getDonationsByStatus);

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
 *     summary: Update donor profile
 *     tags: [Donor]
 *     description: Update donor's profile information, including profile picture.
 *     parameters:
 *       - in: body
 *         name: donor
 *         description: Donor profile update details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             location:
 *               type: string
 *             age:
 *               type: number
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *       500:
 *         description: Internal server error
 */
router.put("/profile", auth, upload.single("profilePics"), updateProfile);

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Forgot password
 *     tags: [Donor]
 *     description: Send a password reset link to the donor's email.
 *     parameters:
 *       - in: body
 *         name: email
 *         description: Donor email address
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
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
 * /resetPassword/{id}:
 *   post:
 *     summary: Reset password
 *     tags: [Donor]
 *     description: Reset donor's password using a token and new password.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Donor ID
 *       - in: body
 *         name: newPassword
 *         description: New password for the donor
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.post("/resetPassword/:id", resetNewPassword);

/**
 * @swagger
 * /changePassword:
 *   put:
 *     summary: Change password
 *     tags: [Donor]
 *     description: Change the donor's password.
 *     parameters:
 *       - in: body
 *         name: password
 *         description: Donor's new password
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.put("/changePassword", changePassword);

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
 *     description: Book an appointment with a selected hospital.
 *     parameters:
 *       - in: body
 *         name: appointment
 *         description: Appointment booking details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hospitalId:
 *               type: string
 *             date:
 *               type: string
 *             time:
 *               type: string
 *     responses:
 *       200:
 *         description: Appointment booked successfully
 *       500:
 *         description: Internal server error
 */
router.post("/bookAppointment", bookAppointment);

module.exports = router;