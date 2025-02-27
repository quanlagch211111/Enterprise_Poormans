const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
