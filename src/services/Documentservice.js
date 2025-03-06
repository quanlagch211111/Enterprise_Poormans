const Document = require('../models/Document');

exports.getAllDocuments = async () => {
    return await Document.find();
};

exports.createDocument = async (data) => {
    const document = new Document(data);
    return await document.save();
};

exports.getDocumentById = async (id) => {
    return await Document.findById(id);
};

exports.updateDocumentById = async (id, data) => {
    return Document.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteDocumentById = async (id) => {
    return await Document.findByIdAndDelete(id);
};