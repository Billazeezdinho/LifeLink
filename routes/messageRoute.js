const { markNotificationAsRead, getUnreadNotifications, getAllNotifications, deleteNotification, clearAllNotifications, getUserNotifications } = require('../controller/notificationController');
const { auth } = require('../middleware/authMiddleware');

const router = require('express').Router();




/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: endpoints to manage user notifications
*/

/**
 * @swagger
 * /message/{notificationId}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: ID of the notification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       404:
 *         description: Notification not found
*/

router.patch('/message/:notificationId/read', auth, markNotificationAsRead);

/**
 * @swagger
 * /message/unread:
 *   get:
 *     summary: Get all unread notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unread notifications
*/
router.get('/message/unread', auth, getUnreadNotifications);

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notifications
 * 
 *   delete:
 *     summary: Delete all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications cleared
*/
router.get('/messages', auth, getAllNotifications);

router.delete('/messages', auth, clearAllNotifications);

/**
 * @swagger
 * /message/{notificationId}:
 *   delete:
 *     summary: Delete a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         description: ID of the notification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
*/
router.delete('/message/:notificationId', auth, deleteNotification);



/**
 * @swagger
 * /user/notifications:
 *   get:
 *     summary: Get notifications for the logged-in donor or hospital
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Donor notifications fetched successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: John Doe Hospital
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 661aa347c4d8a2b5e3e2767d
 *                           requestId:
 *                             type: string
 *                             example: 660a4e74e46ab2f9c42a08b1
 *                           message:
 *                             type: string
 *                             example: Blood request from donor John Doe
 *                           from:
 *                             type: string
 *                             example: John Doe
 *                           date:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-04-19T12:00:00Z
 *                           read:
 *                             type: boolean
 *                             example: false
 *       403:
 *         description: Invalid user role
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.get('/user/notifications', auth, getUserNotifications);

module.exports = router;