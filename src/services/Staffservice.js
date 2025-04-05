const Staff = require('../models/Staff');

const StaffService = {
  // Tạo mới một staff
  async createStaff(staffData) {
    try {
      const staff = new Staff(staffData);
      await staff.save();
      return staff;
    } catch (error) {
      throw new Error(`Failed to create staff: ${error.message}`);
    }
  },

  // Tìm staff theo user_id
  async findByUserId(userId) {
    try {
      return await Staff.findOne({ user_id: userId });
    } catch (error) {
      throw new Error(`Failed to find staff: ${error.message}`);
    }
  },

  // Cập nhật staff theo user_id
  async updateStaff(userId, updateData) {
    try {
      return await Staff.findOneAndUpdate({ user_id: userId }, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update staff: ${error.message}`);
    }
  },

  // Xóa staff theo user_id
  async deleteStaff(userId) {
    try {
      return await Staff.findOneAndDelete({ user_id: userId });
    } catch (error) {
      throw new Error(`Failed to delete staff: ${error.message}`);
    }
  },
  
  async isStaff(userId) {
    return Boolean( await Staff.findOne({ user_id: userId }));
  },
  async getStaffidByuserId(userId) {
    const staff = await Staff.findOne({ user_id: userId });
    return staff ? staff._id : null;
  }
};

module.exports = StaffService;
