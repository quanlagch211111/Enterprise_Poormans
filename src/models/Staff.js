const mongoose = require('mongoose');

// Staff Schema
const staffSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    department: { type: String, required: true },
    position: { type: String, required: true }
});

module.exports = mongoose.model('Staff', staffSchema);