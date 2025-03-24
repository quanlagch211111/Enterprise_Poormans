const Student = require('../models/Student');

const StudentService = {
  // Tạo mới một student
  async createStudent(studentData) {
    try {
      const student = new Student(studentData);
      await student.save();
      return student;
    } catch (error) {
      throw new Error(`Failed to create student: ${error.message}`);
    }
  },

  // Tìm student theo user_id
  async findByUserId(userId) {
    try {
      return await Student.findOne({ user_id: userId });
    } catch (error) {
      throw new Error(`Failed to find student: ${error.message}`);
    }
  },

  // Cập nhật student theo user_id
  async updateStudent(userId, updateData) {
    try {
      return await Student.findOneAndUpdate({ user_id: userId }, updateData, { new: true });
    } catch (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
  },

  // Xóa student theo user_id
  async deleteStudent(userId) {
    try {
      return await Student.findOneAndDelete({ user_id: userId });
    } catch (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  },

  async isStudent (userId) {
    return Boolean(await Student.exists({user_id: userId }));
  }

};

module.exports = StudentService;
