const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authMiddleware } = require('../middlewares/Authmiddlewares');

router.post('/', authMiddleware('access'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', authMiddleware('access'), blogController.updateBlogById);
router.delete('/:id', authMiddleware('access'), blogController.deleteBlogById);

module.exports = router;