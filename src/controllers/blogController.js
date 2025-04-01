const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, author_id, tags, status } = req.body;

        if (!title || !content || !author_id) {
            return res.status(400).json({ message: 'Title, content, and author ID are required' });
        }

        const newBlog = new Blog({ title, content, author_id, tags, status });
        await newBlog.save();

        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author_id', 'username email');
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author_id', 'username email');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBlogById = async (req, res) => {
    try {
        const { status, ...updateData } = req.body; // Allow updating the status field
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { ...updateData, status }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBlogById = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};