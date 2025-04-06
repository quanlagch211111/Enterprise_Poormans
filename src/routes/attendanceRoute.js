const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware, isTeacher } = require('../middlewares/Authmiddlewares');

// Mark attendance (Tutor only)
router.put('/mark', authMiddleware('access') , attendanceController.markAttendance);

router.put('/mark-multiple', authMiddleware('access'), attendanceController.markMultipleAttendance);

// Get attendance records for a meeting
router.get('/meeting/:meeting_id', authMiddleware('access'), attendanceController.getAttendanceByMeeting);

module.exports = router;