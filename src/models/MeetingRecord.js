const MeetingRecordSchema = new mongoose.Schema({
    meeting_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    link_Record: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

const MeetingRecord = mongoose.model('MeetingRecord', MeetingRecordSchema);
module.exports = MeetingRecord;
