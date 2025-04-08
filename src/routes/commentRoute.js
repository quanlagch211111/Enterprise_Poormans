
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middlewares/Authmiddlewares');


// Define routes and map them to controller methods
router.get('/',authMiddleware('access'), commentController.getAllComments);
router.post('/',authMiddleware('access'), commentController.createComment);
router.get('/:id', authMiddleware('access'),commentController.getCommentById);
router.put('/:id', authMiddleware('access'),commentController.updateCommentById);
router.delete('/:id', authMiddleware('access'),commentController.deleteCommentById);
router.get('/document/:documentId', authMiddleware('access'), commentController.getCommentsByDocumentId);


module.exports = router;