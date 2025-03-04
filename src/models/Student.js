const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    grade: { type: String, required: true },
    major: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);