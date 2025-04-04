const express = require('express');
const router = express.Router();
const { viewHospitals, bookAppointment } = require('../controller/donorController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Retrieve a list of hospitals
 *     tags: [Donors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of hospitals retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal Server Error
 */
router.get('/hospitals', authMiddleware, async (req, res) => {
  try {
    await viewHospitals(req, res);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /book-appointment:
 *   post:
 *     summary: Book an appointment with a hospital
 *     tags: [Donors]
 *     security:
 *       - BearerAuth: []
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
 *                 example: "661b2fdc64c1f1f8a1a2d3e5"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-10"
 *               time:
 *                 type: string
 *                 example: "10:30 AM"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Invalid request or missing fields
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    await bookAppointment(req, res);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
