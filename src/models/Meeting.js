const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participant_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    schedule: { type: Date, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    type: { type: String, enum: ['Online', 'Offline'], required: true },
    note: { type: String }
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;