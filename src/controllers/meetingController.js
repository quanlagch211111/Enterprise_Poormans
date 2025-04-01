const Meeting = require("../models/Meeting");
const { nanoid } = require("nanoid");


// Tạo một cuộc họp mới
exports.createMeeting = async (req, res) => {
  try {
    const { organizer_id, participant_ids, date, start_time, end_time, type, note } = req.body;
    const room_id = nanoid(12).match(/.{1,4}/g).join("-");

    const newMeeting = new Meeting({
      organizer_id,
      participant_ids,
      room_id,
      date,
      start_time,
      end_time,
      type,
      note,
    });

    await newMeeting.save();
    res.status(201).json({ success: true, meeting: newMeeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy danh sách cuộc họp
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
    .populate("organizer_id", "username") // Lấy username của organizer
    .populate("participant_ids", "username"); // Lấy username của participants
    res.status(200).json({ success: true, meetings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy chi tiết cuộc họp theo ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate("organizer_id participant_ids");
    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

    res.status(200).json({ success: true, meeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
