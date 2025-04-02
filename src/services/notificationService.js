// / services/notificationService.js
const Notification = require('../models/Notification');

const { io } = require('../../index');

exports.createNotification = async (data) => {
    return await Notification.create(data);
};

exports.createBulkNotifications = async (data) => {
    return await Notification.insertMany(data);
};

exports.getNotifications = async (userId) => {
    return await Notification.find({ user_id: userId }).sort({ created_at: -1 });
};

exports.markAsRead = async (notificationId) => {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

exports.sendNotificationToUser = (notification) => {
    const receiverSocketId = global.onlineUsers.get(notification.user_id);
    
    if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification-receive', notification);
    } else {
        console.log(`User ${notification.user_id} is not online. Notification stored in DB.`);
    }
};
