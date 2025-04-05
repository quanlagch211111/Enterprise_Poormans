const Tutor = require('../models/Tutor');

const TutorService = {
  // Tạo mới một tutor
  async createTutor(tutorData) {
    try {
      const tutor = new Tutor(tutorData);
      await tutor.save();
      return tutor;
    } catch (error) {
      throw new Error(`Failed to create tutor: ${error.message}`);
    }
  },

  // Tìm tutor theo user_id
  async findByUserId(userId) {
    try {
      return await Tutor.findOne({ user_id: userId });
    } catch (error) {
      throw new Error(`Failed to find tutor: ${error.message}`);
    }
  },

  // Cập nhật tutor theo user_id
  async updateTutor(userId, updateData) {
    try {
      return await Tutor.findOneAndUpdate({ user_id: userId }, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update tutor: ${error.message}`);
    }
  },

  // Xóa tutor theo user_id
  async deleteTutor(userId) {
    try {
      return await Tutor.findOneAndDelete({ user_id: userId });
    } catch (error) {
      throw new Error(`Failed to delete tutor: ${error.message}`);
    }
  },

  async isTutor(userId) {
    return Boolean( await Tutor.findOne({ user_id: userId }));
    
  },

  async getTutoridByuserId(userId) {
    const tutor = await Tutor.findOne({ user_id: userId });
    return tutor ? tutor._id : null;
  }

};

module.exports = TutorService;
