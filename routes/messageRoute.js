const { markNotificationAsRead, getUnreadNotifications, getAllNotifications, deleteNotification, clearAllNotifications } = require('../controller/notificationController');
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
 * /clear/messages:
 *   delete:
 *     summary: Clear all notifications for the authenticated user (donor or hospital)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications cleared successfully
 *       404:
 *         description: User not found
 */

router.delete('/clear/messages', auth, clearAllNotifications);

module.exports = router;