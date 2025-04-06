const Meeting = require("../models/Meeting");
const Attendance = require("../models/Attendance");
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

    const attendanceRecords = participant_ids.map(student_id => ({
      meeting_id: newMeeting._id,
      student_id,
      marked_by: organizer_id // The tutor is the one who can mark attendance
    }));

    await Attendance.insertMany(attendanceRecords);

    // Populate sau khi save
    const populatedMeeting = await Meeting.findById(newMeeting._id)
      .populate({
        path: 'organizer_id',
        model: 'Tutor',
        populate: {
          path: 'user_id',
          model: 'Users',
          select: 'username email'
        }
      })
      .populate({
        path: 'participant_ids',
        model: 'Student',
        populate: {
          path: 'user_id',
          model: 'Users',
          select: 'username email'
        }
      });

    res.status(201).json({ success: true, meeting: populatedMeeting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Lấy danh sách cuộc họp
// exports.getMeetings = async (req, res) => {
//   try {
//     const meetings = await Meeting.find()
//     .populate("organizer_id", "username") // Lấy username của organizer
//     .populate("participant_ids", "username"); // Lấy username của participants
//     res.status(200).json({ success: true, meetings });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate({
        path: 'organizer_id',
        model: 'Tutor',
        populate: {
          path: 'user_id',
          model: 'Users',
          select: 'username'
        }
      })
      .populate({
        path: 'participant_ids',
        model: 'Student',
        populate: {
          path: 'user_id',
          model: 'Users',
          select: 'username'
        }
      });

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

// Chỉnh sửa thông tin cuộc họp và trả về dữ liệu đã populate giống API getMeetings
exports.updateMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updatedMeeting = await Meeting.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMeeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    // Populate thông qua Tutor / Student → Users
    updatedMeeting = await Meeting.findById(updatedMeeting._id)
      .populate({
        path: 'organizer_id',
        model: 'Tutor',
        populate: {
          path: 'user_id',
          model: 'Users',
          select: 'username email'
        }
      })
      .populate({
        path: 'participant_ids',
        model: 'Student',
        populate: {
          path: 'user_id',
          model: 'Users',
          select: 'username email'
        }
      });

    res.status(200).json({ 
      success: true, 
      message: "Meeting updated successfully", 
      meeting: updatedMeeting 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa cuộc họp
exports.deleteMeetingById = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của cuộc họp từ URL

    const deletedMeeting = await Meeting.findByIdAndDelete(id);

    if (!deletedMeeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    res.status(200).json({ success: true, message: "Meeting deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
