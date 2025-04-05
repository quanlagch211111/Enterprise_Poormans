require('dotenv').config();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../models/Users');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor'); 
const Staff = require('../models/Staff');

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const getEmailsFromstudentid = async (userIds) => {
    try {
        console.log("Received userIds:", userIds);

        if (!Array.isArray(userIds) || userIds.length === 0) {
            console.error("userIds is not a valid array");
            return [];
        }


        const students = await Student.find({ _id: { $in: userIds } }, 'user_id'); 
        const userIdsFromStudents = students.map(student => student.user_id);

        if (userIdsFromStudents.length === 0) {
            console.log("No matching user IDs found in Student table.");
            return [];
        }

        const users = await User.find({ _id: { $in: userIdsFromStudents } }, 'email');
        const emails = users.map(user => user.email);

        return emails;
    } 
    catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
};



const getEmailsFromadminid = async (userIds) => {
    try {
        console.log("Received userIds:", userIds);

        if (!Array.isArray(userIds) || userIds.length === 0) {
            console.error("userIds is not a valid array");
            return [];
        }


        const staffs = await Staff.find({ _id: { $in: userIds } }, 'user_id'); 
        const userIdsFromStaffs = staffs.map(staff => staff.user_id);

        if (userIdsFromStudents.length === 0) {
            console.log("No matching user IDs found in Student table.");
            return [];
        }

        const users = await User.find({ _id: { $in: userIdsFromStaffs } }, 'email');
        const emails = users.map(user => user.email);

        return emails;
    } 
    catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
};



const getEmailsFromTutorId = async (tutorId) => {
    try {
        if (!tutorId) {
            console.error("Invalid tutor ID");
            return [];
        }

        // Tìm kiếm tutor với tutorId và lấy user_id
        const tutor = await Tutor.findById(tutorId, 'user_id');
        if (!tutor) {
            console.error(`Tutor with ID ${tutorId} not found`);
            return [];
        }

        // Lấy email từ bảng User
        const user = await User.findById(tutor.user_id, 'email');
        if (!user) {
            console.error(`User with ID ${tutor.user_id} not found`);
            return [];
        }
        return [user.email];
    } 
    catch (error) {
        console.error('Error fetching email:', error);
        return [];
    }
};


const getEmailContent = (subjectType, userName, additionalData) => {
    switch (subjectType) {
        case 'assignment_due':
            return {
                subject: '📌 Assignment Due Reminder',
                text: `Hello ${userName},\n\nYour assignment is due soon.`,
                html: `<p>Hello <b>${userName}</b>,</p><p>Your assignment is due soon.</p>`
            };
        case 'new_assignment':
            return {
                subject: '📝 New Assignment Assigned',
                text: `Hello ${userName},\n\nYou have a new assignment: ${additionalData.assignmentTitle}.`,
                html: `<p>Hello <b>${userName}</b>,</p><p>You have a new assignment: <b>${additionalData.assignmentTitle}</b>.</p>`
            };
        case 'new_class_assigned':
            return {
                subject: '🎉 You Have Been Assigned to a New Class!',
                text: `Hello ${userName},\n\nYou have been assigned to the class: ${additionalData.className}.`,
                html: `<p>Hello <b>${userName}</b>,</p><p>You have been assigned to the class: <b>${additionalData.className}</b>.</p>`
            };
        case 'new_comment':
            return {
                subject: '💬 New Comment on Your Post',
                text: `Hello ${userName},\n\nYour post received a new comment: "${additionalData.commentText}".`,
                html: `<p>Hello <b>${userName}</b>,</p><p>Your post received a new comment: "<b>${additionalData.commentText}</b>".</p>`
            };
            case 'new_blog':
            return {
                subject: '📰 New Blog Post Available',
                text: `Hello ${userName},\n\nA new blog post has been published: "${additionalData.blogTitle}".`,
                html: `<p>Hello <b>${userName}</b>,</p><p>A new blog post has been published: "<b>${additionalData.blogTitle}</b>".</p>`
            };
            case 'update_blog':
            return {
                subject: '📰 Blog Post Updated',
                text: `Hello ${userName},\n\nYour blog post has been updated: "${additionalData.blogTitle}".`,
                html: `<p>Hello <b>${userName}</b>,</p><p>Your blog post has been updated: "<b>${additionalData.blogTitle}</b>".</p>`
            };
        default:
            return {
                subject: '📢 Notification',
                text: `Hello ${userName},\n\nYou have a new notification.`,
                html: `<p>Hello <b>${userName}</b>,</p><p>You have a new notification.</p>`
            };
    }
};


const sendEmailByStudentIds = async (studentIds, subjectType, additionalData = {}) => {
    try {
        const emails = await getEmailsFromstudentid(studentIds);
        if (emails.length === 0) {
            console.log('No emails found for given IDs.');
            return { success: false, message: 'No emails found' };
        }
        const userName = additionalData.userName || 'User';
        const emailContent = getEmailContent(subjectType, userName, additionalData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails, 
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };
        console.log(`Sending email to: ${emails.join(', ')}`);

        const info = await transporter.sendMail(mailOptions);
        
        console.log(`Email sent: ${info.response}`);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        return { success: false, message: 'Failed to send email', error };
    }
};


const sendEmailToAllAdmins = async (additionalData = {}, subjectType="new_blog") => {
    try {
        const staffs = await Staff.find({}, 'user_id');
        const userIdsFromStaffs = staffs.map(staff => staff.user_id?.toString()).filter(Boolean);

        if (userIdsFromStaffs.length === 0) {
            console.log("No matching user IDs found in Staff collection.");
            return { success: false, message: 'No emails found' };
        }

        const users = await User.find({ _id: { $in: userIdsFromStaffs } }, 'email');
        const emails = users.map(user => user.email).filter(Boolean);

        if (emails.length === 0) {
            console.log('No emails found for given user IDs.');
            return { success: false, message: 'No emails found' };
        }

        const userName = additionalData.userName || 'User';
        const emailContent = getEmailContent(subjectType, userName, additionalData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);

        return { success: true, message: 'Email sent successfully' };

    } catch (error) {
        console.error('Error sending email to admins:', error);
        return { success: false, message: 'Failed to send email', error };
    }
};

const sendEmailByTutorId = async (tutorId, subjectType, additionalData = {}) => {
    try {
        const emails = await getEmailsFromTutorId(tutorId);
        if (emails.length === 0) {
            console.log('No emails found for given IDs.');
            return { success: false, message: 'No emails found' };
        }
        const userName = additionalData.userName || 'User';
        const emailContent = getEmailContent(subjectType, userName, additionalData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails, 
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };
        console.log(`Sending email to: ${emails.join(', ')}`);

        const info = await transporter.sendMail(mailOptions);
        
        // In thông tin phản hồi của email gửi thành công
        console.log(`Email sent: ${info.response}`);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        return { success: false, message: 'Failed to send email', error };
    }
}



const sendEmailByUserId = async (userId, subjectType="update_blog", additionalData = {}) => {
    try {

        const user = await User.findById(userId, 'email');
        if (!user || !user.email) {
            console.log('No email found for given user ID.');
            return { success: false, message: 'No email found' };
        }

        const userName = additionalData.userName || 'User';
        const emailContent = getEmailContent(subjectType, userName, additionalData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        };

        console.log(`Sending email to: ${user.email}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);

        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email by userId:', error);
        return { success: false, message: 'Failed to send email', error };
    }
};


module.exports = {sendEmailByStudentIds, sendEmailByTutorId, sendEmailToAllAdmins, sendEmailByUserId};
