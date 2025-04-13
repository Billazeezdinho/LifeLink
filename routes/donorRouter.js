const router = require('express').Router();
const { register, login, resetNewPassword, changePassword, forgotPassword, getAllDonor,getDashboard, getDonationsByStatus, deleteDonor, viewHospitals, bookAppointment, logOut, updateProfile } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');
const {auth} = require('../middleware/authMiddleware');
const upload= require('../utils/multer');
// const roleAuth =require('../middleware/authMiddleware')
/**
 * @swagger
 * components:
 *   schemas:
 *     Donor:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - location
 *       properties:
 *         fullName:
 *           type: string
 *           description: Donor's full name (e.g., John Doe)
 *         email:
 *           type: string
 *           description: Donor's email address (e.g., johndoe@example.com)
 *         password:
 *           type: string
 *           description: Secure password for account protection (e.g., Curvedev123)
 *         bloodType:
 *           type: string
 *           description: Blood group (optional, can be left empty)
 *         location:
 *           type: string
 *           description: Donor's geographical location (e.g., Lagos, Nigeria)
 *       example:
 *         fullName: John Doe
 *         email: johndoe@example.com
 *         password: SecurePass123
 *         bloodType: O+
 *         location: Lagos, Nigeria
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
 *     summary: Log in a donor to the platform
 *     description: This endpoint allows registered donors to log in by providing their email and password. A valid token will be returned upon successful login.
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
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
 *         description: Incorrect email or password provided.
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
router.post("/logout", auth, logOut );


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
 * /donor/forgot:
 *   patch:
 *     summary: Request a password reset link
 *     description: This endpoint allows donors to request a password reset by providing their registered email. If the email exists, a reset link will be sent.
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
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
 * /donor/resetPassword/{token}:
 *   patch:
 *     summary: Reset donor password using a token
 *     description: This endpoint allows donors to reset their password by using a token received through the password reset email. The token must be valid for the password reset to be successful.
 *     tags: [Donors]
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
// router.post("/resetPassword/:id", resetNewPassword);
router.post("/resetPassword", resetNewPassword);

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
 *           type: string
 *         description: The password reset token that was sent to the donor's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewSecurePass123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
// router.put("/changePassword", changePassword);
router.put("/changePassword", auth, changePassword);


/**
 * @swagger
 * /donor/change:
 *   patch:
 *     summary: Change the donor's password
 *     description: This endpoint allows an authenticated donor to change their password by providing their ID and the new password. The change is immediate upon success.
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 661b2fdc64c1f1f8a1a2d3e5
 *               newPassword:
 *                 type: string
 *                 example: SecurePass456
 *     responses:
 *       200:
 *         description: Donor deleted successfully
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteDonor/:id", auth,  deleteDonor);

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