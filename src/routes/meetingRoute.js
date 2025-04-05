const express = require("express");
const router = express.Router();
const { createMeeting, getMeetings, getMeetingById, updateMeetingById, deleteMeetingById } = require("../controllers/meetingController");

router.post("/create", createMeeting);
router.get("/", getMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeetingById);
router.delete("/:id", deleteMeetingById);

module.exports = router;
