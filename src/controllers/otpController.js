const otpService = require('../services/Otpservices');

// Gửi OTP lần đầu
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = otpService.generateOtp();

        // Gửi OTP qua email
        await otpService.sendOtpEmail(email, otp);

        res.status(200).json({
            message: 'OTP đã được gửi thành công!',
            email: email
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi gửi OTP',
            error: error.message
        });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Tìm OTP gần nhất của email trong DB
        const existingOtp = await UserOTP.findOne({ email }).sort({ createdAt: -1 });

        if (existingOtp) {
            const currentTime = new Date();
            const otpCreatedAt = new Date(existingOtp.createdAt);
            const timeDiff = currentTime - otpCreatedAt;

            if (timeDiff < 5 * 60 * 1000) { // 5 phút (300000 ms)
                return res.status(400).json({
                    message: 'Bạn phải đợi ít nhất 5 phút trước khi gửi lại OTP.'
                });
            }

            await UserOTP.deleteMany({ email });
        }
        const otp = otpService.generateOtp();

        // Lưu OTP mới vào DB
        await UserOTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // OTP hết hạn sau 5 phút
        });
        await otpService.sendOtpEmail(email, otp);

        res.status(200).json({
            message: 'OTP đã được gửi lại thành công!',
            email
        });

    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi gửi lại OTP',
            error: error.message
        });
    }
};


module.exports = { sendOtp, resendOtp };
