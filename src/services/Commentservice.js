const Comment = require('../models/Comment');

exports.getAllComments = async () => {
    return await Comment.find();
};

exports.createComment = async (data) => {
    const comment = new Comment(data);
    return await comment.save();
};

exports.getCommentById = async (id) => {
    return await Comment.findById(id);
};

exports.updateCommentById = async (id, data) => {
    return Comment.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteCommentById = async (id) => {
    return await Comment.findByIdAndDelete(id);
};

exports.getCommentsByDocumentId = async (documentId) => {
    return await Comment.find({ document_id: documentId }).populate('author_id', 'username email');
};
