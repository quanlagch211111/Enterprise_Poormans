const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    entityType: { type: String, required: true }, 
    entityId: { type: mongoose.Schema.Types.ObjectId, required: false }, 
    isRead: { type: Boolean, default: false }, 
    message: { type: String, required: true }, 
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

 
