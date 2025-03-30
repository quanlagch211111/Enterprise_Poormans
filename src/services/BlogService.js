const Blog = require('../models/Blog');

exports.createBlog = async (data) => {
    const blog = new Blog(data);
    return await blog.save();
};

exports.getAllBlogs = async () => {
    return await Blog.find().populate('author_id', 'username email');
};

exports.getBlogById = async (id) => {
    return await Blog.findById(id).populate('author_id', 'username email');
};

exports.updateBlogById = async (id, data) => {
    return await Blog.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteBlogById = async (id) => {
    return await Blog.findByIdAndDelete(id);
};