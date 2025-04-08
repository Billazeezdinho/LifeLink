const express = require('express');
const router = express.Router();
const { signup, login, resetPassword } = require('../controller/authController');

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new donor or hospital
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *               role:
 *                 type: string
 *                 enum: [donor, hospital]
 *                 example: donor
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists / Missing required fields
 *       500:
 *         description: Internal Server Error
 */
router.post('/signup', signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as a donor or hospital
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       400:
 *         description: Missing email or password / Incorrect credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', login);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password request
 *     tags: [Authentication]
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
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         description: Email not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/reset-password', resetPassword);

module.exports = router;
