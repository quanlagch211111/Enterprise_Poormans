const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
    try {
      const { attendance_id, status } = req.body;
      const tutor_id = req.user.payload.id; // Assuming the tutor is authenticated
  
      // Validate attendance_id
      if (!mongoose.Types.ObjectId.isValid(attendance_id)) {
        return res.status(400).json({ message: 'Invalid attendance_id' });
      }
  
      const attendance = await Attendance.findById(attendance_id);
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      // Ensure only the tutor who created the meeting can mark attendance
      if (attendance.marked_by.toString() !== tutor_id) {
        return res.status(403).json({ message: 'You are not authorized to mark attendance for this meeting' });
      }
  
      attendance.status = status;
      attendance.marked_at = new Date();
      await attendance.save();
  
      res.status(200).json({ message: 'Attendance marked successfully', attendance });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getAttendanceByMeeting = async (req, res) => {
  try {
    const { meeting_id } = req.params;

    const attendanceRecords = await Attendance.find({ meeting_id })
      .populate('student_id', 'user_id')
      .populate('marked_by', 'user_id');

    res.status(200).json({ attendance: attendanceRecords });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};