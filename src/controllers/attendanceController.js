const Attendance = require('../models/Attendance');
const Meeting = require('../models/Meeting');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

exports.markAttendance = async (req, res) => {
    try {
        const { tutor_id, meeting_id, student_id, status } = req.body; // Lấy thông tin từ request

        // Kiểm tra xem status có hợp lệ không
        if (!['Present', 'Absent'].includes(status)) {
            return res.status(400).json({ message: 'Status must be either Present or Absent' });
        }

        // Kiểm tra xem meeting_id có hợp lệ không
        const meeting = await Meeting.findById(meeting_id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Kiểm tra xem tutor có phải là người tổ chức cuộc họp không
        const tutor = await Tutor.findOne({ _id: tutor_id });
        if (!tutor || tutor._id.toString() !== meeting.organizer_id.toString()) {
            return res.status(403).json({ message: 'Only the tutor who organized the meeting can mark attendance' });
        }

        // Tìm attendance của học sinh trong meeting
        const attendance = await Attendance.findOne({ meeting_id, student_id });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found for this student in this meeting' });
        }

        // Cập nhật trạng thái điểm danh
        attendance.status = status;
        attendance.marked_at = new Date(); // Cập nhật thời gian điểm danh
        await attendance.save();

        res.status(200).json({ message: 'Attendance marked successfully', attendance });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.markMultipleAttendance = async (req, res) => {
    try {
        const { tutor_id, meeting_id, students } = req.body;

        // Kiểm tra xem các status có hợp lệ không
        const validStatuses = ['Present', 'Absent'];
        const invalidStatus = students.find(student => !validStatuses.includes(student.status));
        if (invalidStatus) {
            return res.status(400).json({ message: 'Status must be either Present or Absent for all students' });
        }

        // Kiểm tra xem meeting_id có hợp lệ không
        const meeting = await Meeting.findById(meeting_id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        // Kiểm tra xem tutor có phải là người tổ chức cuộc họp không
        const tutor = await Tutor.findOne({ _id: tutor_id });
        if (!tutor || tutor._id.toString() !== meeting.organizer_id.toString()) {
            return res.status(403).json({ message: 'Only the tutor who organized the meeting can mark attendance' });
        }

        // Duyệt qua danh sách học sinh và cập nhật điểm danh
        const attendancePromises = students.map(async (student) => {
            const { student_id, status } = student;

            // Kiểm tra nếu bản ghi attendance đã tồn tại cho học sinh này trong cuộc họp
            let attendance = await Attendance.findOne({ meeting_id, student_id });

            if (attendance) {
                // Nếu bản ghi tồn tại, chỉ cần cập nhật trạng thái
                attendance.status = status;
                attendance.marked_at = new Date(); // Cập nhật thời gian điểm danh
                await attendance.save();
            } else {
                // Nếu bản ghi không tồn tại, tạo mới
                attendance = new Attendance({
                    meeting_id,
                    student_id,
                    status,
                    marked_by: tutor._id, // Người điểm danh là tutor
                    marked_at: new Date()
                });
                await attendance.save();
            }
        });

        // Chờ tất cả các promise hoàn thành
        await Promise.all(attendancePromises);

        res.status(200).json({ message: 'Attendance marked successfully for all students' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAttendanceByMeeting = async (req, res) => {
    try {
        const { meeting_id } = req.params;

        const attendanceRecords = await Attendance.find({ meeting_id })
            .populate({
                path: 'student_id',
                populate: {
                    path: 'user_id',
                    model: 'Users',
                    select: 'username  email address phone',
                },
            })
            .populate({
                path: 'marked_by',
                populate: {
                    path: 'user_id',
                    model: 'Users',
                    select: 'username',
                },
            })
            .populate({
                path: 'meeting_id', 
                model: 'Meeting',
                select: 'room_id date',
            });


        res.status(200).json({ attendance: attendanceRecords });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};