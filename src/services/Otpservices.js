// const UserOTPVerification = require('../models/UserOTPVerification');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const  User = require('../models/Users');
const OtpUser = require('../models/UserOTPVerification');


dotenv.config();


const sendOtp = async (email, otp = null) => {
    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (!otp) {
            otp = generateOtp();
        }

        await OtpUser.deleteMany({ email }); // ✅ Xóa OTP cũ nếu có

        const newOtp = new OtpUser({
            email,
            otp,
            user_id: user._id, // ✅ Đảm bảo đúng kiểu ObjectId của MongoDB
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await newOtp.save(); // ✅ Lưu vào MongoDB

        await sendOtpEmail(email, otp);

        const result = {
            status: "Success",
            message: "OTP has been sent successfully!",
            email,
            otp,
        };
        console.log(result);
        return result;
    } catch (err) {
        console.error("Error sending OTP: ", err.message);
        throw err;
    }
};

const resendOtp = async (email) => {
    try {
        const existingOtp = await OtpUser.findOne({ email }); 

        if (!existingOtp) {
            throw new Error("No OTP exists for this user.");
        }

        const currentTime = new Date();
        const otpCreatedAt = new Date(existingOtp.createdAt);
        const timeDiff = currentTime - otpCreatedAt;

        if (timeDiff < 5 * 60 * 1000) {
            console.log("Existing OTP: ", existingOtp);
            throw new Error("You must wait at least 5 minutes before requesting a new OTP.");
        }

        return await sendOtp(email);
    } catch (err) {
        console.error("Error resending OTP: ", err.message);
        throw err;
    }
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
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

module.exports = { generateOtp, sendOtpEmail, sendOtp, resendOtp };

