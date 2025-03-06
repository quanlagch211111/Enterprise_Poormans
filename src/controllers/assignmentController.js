// const Assignment = require('../models/Assignment');

// // Create a new assignment
// exports.createAssignment = async (req, res) => {
//     try {
//         const { title, student_id, tutor_id, assigned_by } = req.body;
//         const newAssignment = new Assignment({ title, student_id, tutor_id, assigned_by });
//         await newAssignment.save();
//         res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get all assignments
// exports.getAssignments = async (req, res) => {
//     try {
//         const assignments = await Assignment.find().populate('student_id tutor_id assigned_by');
//         res.status(200).json(assignments);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get an assignment by ID
// exports.getAssignmentById = async (req, res) => {
//     try {
//         const assignment = await Assignment.findById(req.params.id).populate('student_id tutor_id assigned_by');
//         if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
//         res.status(200).json(assignment);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update an assignment by ID
// exports.updateAssignment = async (req, res) => {
//     try {
//         const updatedAssignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedAssignment) return res.status(404).json({ message: 'Assignment not found' });
//         res.status(200).json({ message: 'Assignment updated', assignment: updatedAssignment });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete an assignment by ID
// exports.deleteAssignment = async (req, res) => {
//     try {
//         const deletedAssignment = await Assignment.findByIdAndDelete(req.params.id);
//         if (!deletedAssignment) return res.status(404).json({ message: 'Assignment not found' });
//         res.status(200).json({ message: 'Assignment deleted' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };