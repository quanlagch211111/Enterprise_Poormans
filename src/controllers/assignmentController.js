const assignmentService = require('../services/AssignmentService');

exports.createAssignment = async (req, res) => {
    try {
        const assignment = await assignmentService.createAssignment(req.body);
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