const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

router.post('/send-email-otp', otpController.sendOtp);
router.post('/resend-email-otp', otpController.resendOtp);

module.exports = router;