const mongoose = require('mongoose');

const submissionFolderSchema = new mongoose.Schema({
    assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubmissionFolder', submissionFolderSchema);

