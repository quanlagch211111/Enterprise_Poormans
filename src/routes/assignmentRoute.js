const router = require("express").Router();
const assignmentController = require('../controllers/assignmentController');
const { authMiddleware, isAdmin } = require('../middlewares/Authmiddlewares');

router.post('/', authMiddleware, isAdmin, assignmentController.createAssignment);

router.get('/', authMiddleware, assignmentController.getAssignments);

router.get('/:id', authMiddleware, assignmentController.getAssignmentById);

router.put('/:id', authMiddleware, isAdmin, assignmentController.updateAssignment);

router.delete('/:id', authMiddleware, isAdmin, assignmentController.deleteAssignment);

module.exports = router;