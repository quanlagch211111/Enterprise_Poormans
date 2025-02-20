// const UserOTPVerification = require('../models/UserOTPVerification');

const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const dotenv = require('dotenv');

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Sinh OTP 6 số
};




const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Xác nhận tài khoản của bạn',
        text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { generateOtp, sendOtpEmail };

