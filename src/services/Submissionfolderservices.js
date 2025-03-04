const SubmissionFolder = require('../models/SubmissionFolder');

exports.getAllSubmissionFolders = async () => {
    return await SubmissionFolder.find();
};

exports.createSubmissionFolder = async (data) => {
    const folder = new SubmissionFolder(data);
    return await folder.save();
};

exports.getSubmissionFolderById = async (id) => {
    return await SubmissionFolder.findById(id);
};

exports.updateSubmissionFolderById = async (id, data) => {
    return await SubmissionFolder.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteSubmissionFolderById = async (id) => {
    return await SubmissionFolder.findByIdAndDelete(id);
};