const { initializePayment, verifyPayment } = require('../controller/transactionController');
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Payment transactions via KoraPay
 */

/**
 * @swagger
 * /initialize:
 *   post:
 *     summary: Initialize a new payment
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - amount
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: donor@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               amount:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: payment initialize Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: LifeLink-ch6-ABCDEFGHIJKL
 *                     checkout_url:
 *                       type: string
 *                       format: uri
 *                       example: https://checkout.korapay.com/abc123
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/initialize', initializePayment);

/**
 * @swagger
 *  /verify:
 *   get:
 *     summary: Verify the status of a payment
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: reference
 *         schema:
 *           type: string
 *         required: true
 *         description: Reference ID of the transaction
 *     responses:
 *       200:
 *         description: Payment verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Verification Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: donor@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     amount:
 *                       type: number
 *                       example: 10000
 *                     reference:
 *                       type: string
 *                       example: LifeLink-ch6-ABCDEFGHIJKL
 *                     status:
 *                       type: string
 *                       example: success
 *                     paymentDate:
 *                       type: string
 *                       example: 4/10/2025, 4:32:58 PM
 *       500:
 *         description: Internal server error
 */
router.get('/verify', verifyPayment);

module.exports = router;
