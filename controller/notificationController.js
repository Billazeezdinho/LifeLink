const donorModel = require('../model/donorModel');
const hospitalModel = require('../model/hospitalModel');
const bloodRequest = require('../model/bloodRequestModel')

const getUserModel = (role) => {
  if (role === 'donor') return donorModel;
  if (role === 'hospital') return hospitalModel;
  throw new Error('Invalid user role');
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userModel = getUserModel(req.user.role);
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    notification.read = true;
    await user.save();

    res.status(200).json({ message: 'Notification marked as read successfully.' });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const userModel = getUserModel(req.user.role);
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const unreadNotifications = user.notifications.filter(notification => !notification.read);

    res.status(200).json({ count: unreadNotifications.length, notifications: unreadNotifications });
  } catch (error) {
    console.error('Error fetching unread notifications:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const userModel = getUserModel(req.user.role);
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ count: user.notifications.length, notifications: user.notifications });
  } catch (error) {
    console.error('Error fetching all notifications:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userModel = getUserModel(req.user.role);
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    notification.deleteOne();
    await user.save();

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const userModel = getUserModel(req.user.role);
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.notifications = [];
    await user.save();

    res.status(200).json({ message: 'All notifications cleared successfully.' });
  } catch (error) {
    console.error('Error clearing all notifications:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;  // assuming you have role from auth middleware

    let user, fullName;

    if (userRole === 'donor') {
      user = await donorModel.findById(userId).select('fullName notifications');
      fullName = user?.fullName;
    } else if (userRole === 'hospital') {
      user = await hospitalModel.findById(userId).select('fullName notifications');
      fullName = user?.fullName;
    } else {
      return res.status(403).json({ message: 'Invalid user role' });
    }

    if (!user) {
      return res.status(404).json({ message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} not found` });
    }

    res.status(200).json({
      message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} notifications fetched successfully`,
      user: {
        fullName: fullName,
        notifications: user.notifications?.map(notification => ({
          _id: notification._id,
          requestId: notification.requestId,
          message: notification.message,
          from: notification.from,
          date: notification.date,
          read: notification.read
        })) || []
      }
    });

  } catch (error) {
    console.error('Error fetching user notifications:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
