// const router = require('express').Router();
// const { register, login, resetNewPassword, changePassword, forgotPassword, getAllDonor } = require('../controller/donorController');
// const { registerValidate } = require('../middleware/validate');

// router.post('/donor/register', registerValidate, register);
// router.post('/donor/login', login);
// router.patch('/forgot', forgotPassword);
// router.patch('/resetPassword/:token', resetNewPassword);
// router.patch('/change', changePassword);
// router.get('/donors', getAllDonor)

// module.exports = router;
const router = require('express').Router();
const {  register, login, resetNewPassword, changePassword, forgotPassword, getAllDonor, } = require('../controller/donorController');
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
 *           description: Donor's full name
 *         email:
 *           type: string
 *           description: Donor's email
 *         password:
 *           type: string
 *           description: Secure password
 *           description: Donor's email (e.g., LifeLink@theCurve.com)
 *         password:
 *           type: string
 *           description: Secure password (e.g., Curvedev123)
 *         bloodType:
 *           type: string
 *           description: Blood group (optional)
 *         location:
 *           type: string
 *           description: Donor's location
 *       example:
 *         fullName: John Doe
 *         email: johndoe@example.com
 *         password: SecurePass123
 *         email: LifeLink@theCurve.com
 *         password: Curvedev123
 *         bloodType: O+
 *         location: Lagos, Nigeria
 */

/**
 * @swagger
 * /donor/register:
 *   post:
 *     summary: Register a new donor
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Donor'
 *     responses:
 *       201:
 *         description: Donor registered successfully
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/donor/register', registerValidate, register);

/**
 * @swagger
 * /donor/login:
 *   post:
 *     summary: Login a donor
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
 *                 example: LifeLink@theCurve.com
 *               password:
 *                 type: string
 *                 example: Curvedev123
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       400:
 *         description: Incorrect email or password
 *         description: Missing email or password / Incorrect password
>>
 *       404:
 *         description: Donor not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/donor/login', login);

/**
 * @swagger
 * /forgot:
 * /donor/forgot:
 *   patch:
 *     summary: Request password reset link
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
 *                 example: LifeLink@theCurve.com
>>>>>>> origin/jtown
 *     responses:
 *       200:
 *         description: Reset password link sent successfully
 *       404:
 *         description: Email not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/forgot', forgotPassword);

/**
 * @swagger
 * /resetPassword/{token}:
 * /donor/resetPassword/{token}:
>>>>>>> origin/jtown
 *   patch:
 *     summary: Reset password using a token
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset password token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
<<<<<<< HEAD
 *                 example: NewSecurePass123
=======
 *                 example: NewPass@123
>>>>>>> origin/jtown
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal Server Error
 */
router.patch('/resetPassword/:token', resetNewPassword);

/**
 * @swagger
<<<<<<< HEAD
 * /change:
=======
 * /donor/change:
>>>>>>> origin/jtown
 *   patch:
 *     summary: Change donor's password
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
 *         description: Password changed successfully
 *       400:
 *         description: Donor not found / Failed to change password
 *       500:
 *         description: Internal Server Error
 */
router.patch('/change', changePassword);

/**
 * @swagger
 * /donors:
 *   get:
 *     summary: Get all donors
 *     tags: [Donors]
 *     responses:
 *       200:
 *         description: List of all donors
 *       500:
 *         description: Internal Server Error
 */
router.get('/donors', getAllDonor);

module.exports = router;
