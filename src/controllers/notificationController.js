// / controllers/notificationController.js
const notificationService = require('../services/notificationService');

const socketIo = require('socket.io'); // Lấy đối tượng socket.io từ global

// Nhập đối tượng io từ server.js
const { io } = require('../../index');

exports.createNotification = async (req, res) => {
    const { user_id, from, message, entityType, entityId } = req.body;
    try {
      const notification = await notificationService.createNotification(req.body);
    //   if(!notification)
    //   notificationService.sendNotificationToUser(notification)

      const receiverSocketId = global.onlineUsers.get(user_id);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification-receive', notification );
      } else {
        console.log(`User ${user_id} is not online. Notification stored in DB.`);
      }
  
      res.status(201).json({ status: 'Success', message: 'Notification created', data: notification });
    } catch (error) {
      res.status(500).json({ status: 'Error', message: error.message });
    }
  };


exports.createBulkNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.createBulkNotifications(req.body);
        res.status(201).json({ status: 'success', message: 'Bulk notifications created', data: notifications });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications(req.params.userId);
        res.status(200).json({ status: 'success', message: 'Notifications retrieved', data: notifications });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const updatedNotification = await notificationService.markAsRead(req.params.notificationId);
        res.status(200).json({ status: 'success', message: 'Notification marked as read', data: updatedNotification });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
