const documentService = require('../services/Documentservice');

exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await documentService.getAllDocuments();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createDocument = async (req, res) => {
    try {
        const document = await documentService.createDocument(req.body);
        res.status(201).json(document);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await documentService.getDocumentById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Cannot find document' });
        }
        res.json(document);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateDocumentById = async (req, res) => {
    try {
        const document = await documentService.updateDocumentById(req.params.id, req.body);
        if (!document) {
            return res.status(404).json({ message: 'Cannot find document' });
        }
        res.json(document);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteDocumentById = async (req, res) => {
    try {
        const document = await documentService.deleteDocumentById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Cannot find document' });
        }
        res.json({ message: 'Deleted Document' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};