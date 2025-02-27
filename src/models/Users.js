const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  avatar: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  isVerified : {type: Boolean}
});

module.exports = mongoose.model('Users', userSchema);
