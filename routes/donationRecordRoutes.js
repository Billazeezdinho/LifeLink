const express = require('express');
const { auth, roleAuth } = require('../middleware/authMiddleware');
const {
  addDonationRecord,
  getDonationStats,
  getDonationRecords
} = require('../controller/donationController');

const router = express.Router();





/**
 * @swagger
 * /donations/add:
 *   post:
 *     summary: Add a blood donation record
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationRecord'
 *     responses:
 *       201:
 *         description: Record added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DonationRecord'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/add', auth, roleAuth(['hospital']), addDonationRecord);



/**
 * @swagger
 * /donations/stats:
 *   get:
 *     summary: Get monthly donation stats for a hospital
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly donation statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDonations:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch stats
 */
router.get('/stats', auth, roleAuth(['hospital']), getDonationStats);

/**
 * @swagger
 * /donations/all:
 *   get:
 *     summary: Get all donation records for a hospital
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all donation records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DonationRecord'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error while fetching records
 */

router.get('/all', auth, roleAuth(['hospital']), getDonationRecords);

module.exports = router;
