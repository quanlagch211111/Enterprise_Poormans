const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receive_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }, // Nội dung tin nhắn
    created_at: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

