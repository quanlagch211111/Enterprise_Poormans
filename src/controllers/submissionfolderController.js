const submissionFolderService = require('../services/Submissionfolderservices');

exports.getAllSubmissionFolders = async (req, res) => {
    try {
        const folders = await submissionFolderService.getAllSubmissionFolders();
        res.json(folders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createSubmissionFolder = async (req, res) => {
    try {
        const folder = await submissionFolderService.createSubmissionFolder(req.body);
        res.status(201).json(folder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getSubmissionFolderById = async (req, res) => {
    try {
        const folder = await submissionFolderService.getSubmissionFolderById(req.params.id);
        if (!folder) {
            return res.status(404).json({ message: 'Cannot find submission folder' });
        }
        res.json(folder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateSubmissionFolderById = async (req, res) => {
    try {
        const folder = await submissionFolderService.updateSubmissionFolderById(req.params.id, req.body);
        if (!folder) {
            return res.status(404).json({ message: 'Cannot find submission folder' });
        }
        res.json(folder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteSubmissionFolderById = async (req, res) => {
    try {
        const folder = await submissionFolderService.deleteSubmissionFolderById(req.params.id);
        if (!folder) {
            return res.status(404).json({ message: 'Cannot find submission folder' });
        }
        res.json({ message: 'Deleted Submission Folder' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

