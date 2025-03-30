const express = require("express");
const router = express.Router();
const { createMeeting, getMeetings, getMeetingById } = require("../controllers/meetingController");

router.post("/create", createMeeting);
router.get("/", getMeetings);
router.get("/:id", getMeetingById);

module.exports = router;
