const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    assigned_at: { type: Date, default: Date.now }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;