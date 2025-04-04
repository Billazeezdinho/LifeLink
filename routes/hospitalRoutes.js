const express = require('express');
const router = express.Router();
const { searchForDonors } = require('../controller/hospitalController');
const authMiddleware = require('../middleware/authMiddleware');
const kycMiddleware = require('../middleware/kycMiddleware');

/**
 * @swagger
 * /search-donors:
 *   get:
 *     summary: Search for available blood donors
 *     tags: [Hospitals]
 *     security:
 *       - BearerAuth: []  # Requires authentication
 *     parameters:
 *       - in: query
 *         name: bloodType
 *         schema:
 *           type: string
 *         required: true
 *         description: The required blood type (e.g., A+, B-, O+)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional location to filter donors (e.g., Lagos, Nigeria)
 *     responses:
 *       200:
 *         description: Successfully retrieved matching donors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *                   bloodType:
 *                     type: string
 *                     example: O+
 *                   location:
 *                     type: string
 *                     example: Lagos, Nigeria
 *       400:
 *         description: Missing or invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blood type is required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - KYC verification required
 *       500:
 *         description: Internal Server Error
 */
router.get('/search-donors', authMiddleware, kycMiddleware, searchForDonors);

module.exports = router;
