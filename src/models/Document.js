const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    folder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubmissionFolder', required: true },
    file_path: { type: String, required: true },
    types: { type: String, required: true },  // e.g., 'pdf', 'docx', 'image'
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);

