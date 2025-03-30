const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // Chủ phòng (thường là tutor)
    participant_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], // Danh sách người tham gia
    room_id: { type: String, require: true}, // Room ID cố định
    date: { type: Date, required: true }, // Ngày họp
    start_time: { type: String, required: true }, // Thời gian bắt đầu (HH:mm)
    end_time: { type: String, required: true }, // Thời gian kết thúc (HH:mm)
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }, // Trạng thái
    type: { type: String, enum: ['Online', 'Offline'], required: true }, // Loại họp
    note: { type: String }
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', MeetingSchema);
module.exports = Meeting;