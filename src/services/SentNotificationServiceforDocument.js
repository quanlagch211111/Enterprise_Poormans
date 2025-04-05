const Document = require('../models/Document'); // điều chỉnh đường dẫn tùy project
const SubmissionFolder = require('../models/SubmissionFolder');
const Assignment = require('../models/Assignment');

const User = require('../models/Users');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');


const { sendEmailByStudentIds, sendEmailByTutorId } = require('./sentEmailService');
const { createNotification, createNotificationsForUsers } = require('../controllers/notificationController');



class SentNotificationfprDocumentService {

  async getStudentIdsByDocumentId(documentId) {
    try {
      const document = await Document.findById(documentId);
      if (!document) throw new Error('Document not found');

      const folder = await SubmissionFolder.findById(document.folder_id);
      if (!folder) throw new Error('Folder not found');

      const assignment = await Assignment.findById(folder.assignment_id);
      if (!assignment) throw new Error('Assignment not found');

      // Lấy các student_id từ database
      const students = await Student.find({ _id: { $in: assignment.student_id } }, 'user_id');



      const userIdsFromStudents = [];
      const studentIds = [];// Chuyển đổi sang chuỗi để đảm bảo định dạng đúng

      students.forEach(student => {
        userIdsFromStudents.push(student.user_id.toString()); // Chuyển đổi sang chuỗi để đảm bảo định dạng đúng
      });

      students.forEach(student => {
        studentIds.push(student._id.toString()); // Chuyển đổi sang chuỗi để đảm bảo định dạng đúng
      });

       await createNotificationsForUsers({
                  body: {
                      user_ids: userIdsFromStudents, 
                      from: "Tutor",
                      message: `New document`,
                      entityType: 'Document',
                      entityId: documentId
                  }
              }, { status: () => ({ json: () => {} }) }); 
      await sendEmailByStudentIds( studentIds,  "Document" );

      return userIdsFromStudents;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Tương tự cho hàm getUserIdByDocumentId
  async getUserIdByDocumentId(documentId) {
    try {
      const document = await Document.findById(documentId);
      if (!document) throw new Error('Document not found');

      const folder = await SubmissionFolder.findById(document.folder_id);
      if (!folder) throw new Error('Folder not found');

      const assignment = await Assignment.findById(folder.assignment_id);
      if (!assignment) throw new Error('Assignment not found');

      const tutor = await Tutor.findById(assignment.tutor_id, 'user_id');
      if (!tutor) throw new Error('Tutor not found');
  
      await createNotificationsForUsers({
        body: {
            user_ids: tutor.user_id , 
            from: "Tutor",
            message: `New document`,
            entityType: 'Document',
            entityId: documentId
        }
    }, { status: () => ({ json: () => {} }) }); 

      await sendEmailByTutorId( tutor._id, "Document" );

      return tutor.user_id;
    } catch (err) {
      console.error('Error in getUserIdByDocumentId:', err);
      throw err;
    }
  }
  

  async sendnotficationtoAdmin() {
    try {

      const admins = await Student.find({}, 'user_id');
      const adminIds = [];// Chuyển đổi sang chuỗi để đảm bảo định dạng đúng

      admins.forEach(admin => {
        adminIds.push(admin._id.toString()); // Chuyển đổi sang chuỗi để đảm bảo định dạng đúng
      });

       await createNotificationsForUsers({
                  body: {
                      user_ids: adminIds, 
                      from: "User",
                      message: `New Blog To Accept, please check it`,
                      entityType: 'Blog',
                      entityId: ""
                  }
              }, { status: () => ({ json: () => {} }) }); 
      await sendEmailByStudentIds( adminIds,  "Document" );

      return userIdsFromStudents;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }






}

module.exports = new SentNotificationfprDocumentService();
