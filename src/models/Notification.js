const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityType: { type: String, required: true }, // Loại thực thể liên quan (ví dụ: "Assignment", "Message")
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của thực thể liên quan
    isRead: { type: Boolean, default: false }, // Xác định đã đọc hay chưa
    message: { type: String, required: true }, // Nội dung thông báo
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

 
