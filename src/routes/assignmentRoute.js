const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authMiddleware, isStaff } = require('../middlewares/Authmiddlewares');

// Create a new assignment (Staff only)
router.post('/', authMiddleware("access"), isStaff, assignmentController.createAssignment);

// Get all assignments (Authenticated users)
router.get('/', authMiddleware("access"), assignmentController.getAllAssignments);

// Get a specific assignment by ID (Authenticated users)
router.get('/:id', authMiddleware("access"), assignmentController.getAssignmentById);

// Update an assignment by ID (Staff only)
router.put('/:id', authMiddleware("access"), isStaff, assignmentController.updateAssignmentById);

// Delete an assignment by ID (Staff only)
router.delete('/:id', authMiddleware("access"), isStaff, assignmentController.deleteAssignmentById);

module.exports = router;