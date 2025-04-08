const router = require('express').Router();
const { register, login, resetNewPassword, changePassword, forgotPassword, getAllDonor } = require('../controller/donorController');
const { registerValidate } = require('../middleware/validate');

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
 * /donor/register:
 *   post:
 *     summary: Register a new donor
 *     description: This endpoint allows new donors to register with the platform by providing their full name, email, password, and location. An email verification process will follow.
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Donor'
 *     responses:
 *       201:
 *         description: Donor successfully registered. A verification email is sent.
 *       400:
 *         description: Email is already registered.
 *       500:
 *         description: Internal Server Error, registration failed.
 */
router.post('/donor/register', registerValidate, register);

/**
 * @swagger
 * /donor/login:
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
 *         description: Login successful, returns authentication token.
 *       400:
 *         description: Incorrect email or password provided.
 *       404:
 *         description: Donor not found with the provided email.
 *       500:
 *         description: Internal Server Error, login failed.
 */
router.post('/donor/login', login);

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
 *         description: Password reset link sent successfully to the provided email.
 *       404:
 *         description: Email not found in the system.
 *       500:
 *         description: Internal Server Error, password reset link could not be sent.
 */
router.patch('/forgot', forgotPassword);

/**
 * @swagger
 * /donor/resetPassword/{token}:
 *   patch:
 *     summary: Reset donor password using a token
 *     description: This endpoint allows donors to reset their password by using a token received through the password reset email. The token must be valid for the password reset to be successful.
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: token
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
 *         description: Password successfully reset.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Internal Server Error, password reset failed.
 */
router.patch('/resetPassword/:token', resetNewPassword);

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
 *         description: Password successfully updated.
 *       400:
 *         description: Donor not found or failed to update password.
 *       500:
 *         description: Internal Server Error, password change failed.
 */
router.patch('/change', changePassword);

/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Retrieve all donors
 *     description: This endpoint allows admins to view all registered donors in the system, including their details such as name, email, and blood type.
 *     tags: [Donors]
 *     responses:
 *       200:
 *         description: A list of all donors.
 *       500:
 *         description: Internal Server Error, unable to fetch donor data.
 */
router.get('/donors', getAllDonor);

module.exports = router;