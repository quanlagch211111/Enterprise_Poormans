const mongoose = require('mongoose');

// Teacher Schema
const tutorSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    expertise: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true }
});


module.exports = mongoose.model('Tutor', tutorSchema);