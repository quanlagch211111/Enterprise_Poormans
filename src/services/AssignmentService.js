const Assignment = require('../models/Assignment');

exports.createAssignment = async (data) => {
    const { title, student_id, tutor_id, assigned_by } = data;

    if (!title || !student_id || !tutor_id || !assigned_by) {
        throw new Error('All fields are required');
    }

    const assignment = new Assignment(data);
    await assignment.save();

    return await Assignment.findById(assignment._id)
        .populate({
            path: 'student_id',
            model: 'Student',
            populate: {
                path: 'user_id',
                model: 'Users',
                select: 'username email'
            }
        })
        .populate({
            path: 'tutor_id',
            model: 'Tutor',
            populate: {
                path: 'user_id',
                model: 'Users',
                select: 'username email'
            }
        })
        .populate({
            path: 'assigned_by',
            model: 'Users',
            select: 'username email'
        });
};


exports.getAllAssignments = async () => {
    return await Assignment.find()
        .populate({
            path: 'student_id',
            model: 'Student',
            populate: {
                path: 'user_id', 
                model: 'Users',
                select: 'username email'
            }
        })
        .populate({
            path: 'tutor_id',
            model: 'Tutor',
            populate: {
                path: 'user_id', 
                model: 'Users',
                select: 'username email'
            }
        })
        .populate({
            path: 'assigned_by',
            model: 'Users',
            select: 'username email'
        });
};


exports.getAssignmentById = async (id) => {
    return await Assignment.findById(id)
        .populate('student_id tutor_id assigned_by');
};

exports.updateAssignmentById = async (id, data) => {
    return await Assignment.findByIdAndUpdate(id, data, { new: true })
        .populate({
            path: 'student_id',
            model: 'Student',
            populate: {
                path: 'user_id',
                model: 'Users',
                select: 'username email'
            }
        })
        .populate({
            path: 'tutor_id',
            model: 'Tutor',
            populate: {
                path: 'user_id',
                model: 'Users',
                select: 'username email'
            }
        })
        .populate({
            path: 'assigned_by',
            model: 'Users',
            select: 'username email'
        });
};


exports.deleteAssignmentById = async (id) => {
    return await Assignment.findByIdAndDelete(id);
};