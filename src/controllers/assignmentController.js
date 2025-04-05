const assignmentService = require('../services/AssignmentService');
const  {sendEmailByStudentIds, sendEmailByTutorId} = require('../services/sentEmailService');
const { createNotification, createNotificationsForUsers } = require('./notificationController');


exports.createAssignment = async (req, res) => {
    try {
        const { title, student_id, tutor_id, assigned_by } = req.body;

        if (!title || !student_id || !tutor_id || !assigned_by) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const assignment = await assignmentService.createAssignment(req.body);
        if (!assignment) {
            return res.status(400).json({ message: 'Failed to create assignment' });
        }

        console.log("student_id: ", student_id);

        await sendEmailByStudentIds(student_id, 'new_assignment', { assignmentTitle: title });
        await sendEmailByTutorId(tutor_id, 'new_assignment', { assignmentTitle: title });

        await createNotificationsForUsers({
            body: {
                user_ids: student_id, 
                from: assigned_by,
                message: `New assignment: ${title}`,
                entityType: 'Assignment',
                entityId: assignment._id
            }
        }, { status: () => ({ json: () => {} }) }); 

        await createNotification({
            body: {
                user_id: tutor_id,
                from: assigned_by,
                message: `New assignment: ${title}`,
                entityType: 'Assignment',
                entityId: assignment._id
            }
        }, { status: () => ({ json: () => {} }) });

        res.status(201).json({ message: 'Assignment created successfully', assignment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await assignmentService.getAllAssignments();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await assignmentService.getAssignmentById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAssignmentById = async (req, res) => {
    try {
        const updatedAssignment = await assignmentService.updateAssignmentById(req.params.id, req.body);
        if (!updatedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment updated successfully', assignment: updatedAssignment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAssignmentById = async (req, res) => {
    try {
        const deletedAssignment = await assignmentService.deleteAssignmentById(req.params.id);
        if (!deletedAssignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};