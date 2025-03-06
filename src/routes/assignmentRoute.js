// const router = require("express").Router();
// const assignmentController = require('../controllers/assignmentController');
// const { authMiddleware, isAdmin } = require('../middlewares/Authmiddlewares');

// // Create a new assignment (Admin only)
// router.post('/', authMiddleware, isAdmin, assignmentController.createAssignment);

// // Get all assignments (Authenticated users)
// router.get('/', authMiddleware, assignmentController.getAssignments);

// // Get a specific assignment by ID (Authenticated users)
// router.get('/:id', authMiddleware, assignmentController.getAssignmentById);

// // Update an assignment by ID (Admin only)
// router.put('/:id', authMiddleware, isAdmin, assignmentController.updateAssignment);

// // Delete an assignment by ID (Admin only)
// router.delete('/:id', authMiddleware, isAdmin, assignmentController.deleteAssignment);

// module.exports = router;