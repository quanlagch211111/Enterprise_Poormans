const mongoose = require('mongoose');

const MeetingRecordSchema = new mongoose.Schema({
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    link_Record: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MeetingRecord', MeetingRecordSchema);
