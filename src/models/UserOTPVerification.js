const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOTPVerificationSchema = new Schema({
    email: { type: String, required: true }, // Thêm email vào Schema
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // Tham chiếu tới Users
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }

});
module.exports = mongoose.model('UserOTP', UserOTPVerificationSchema);