// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Tạo thông báo đơn lẻ
router.post('/', notificationController.createNotification);

// Tạo thông báo hàng loạt cho admin
router.post('/bulk', notificationController.createBulkNotifications);

// Lấy danh sách thông báo của người dùng
router.get('/:userId', notificationController.getNotifications);

// Đánh dấu thông báo đã đọc
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
