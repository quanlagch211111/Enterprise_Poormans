const commentService = require('../services/Commentservice');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await commentService.getAllComments();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const comment = await commentService.createComment(req.body);
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await commentService.getCommentById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCommentById = async (req, res) => {
    try {
        const comment = await commentService.updateCommentById(req.params.id, req.body);
        if (!comment) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCommentById = async (req, res) => {
    try {
        const comment = await commentService.deleteCommentById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Cannot find comment' });
        }
        res.json({ message: 'Deleted Comment' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};