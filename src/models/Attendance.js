const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Not yet'], default: 'Not yet' },
    marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    marked_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);