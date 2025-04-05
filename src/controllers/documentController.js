const documentService = require('../services/Documentservice');

const SentNotificationfprDocumentService = require('../services/SentNotificationServiceforDocument');




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
        // notifi all member of class
        await SentNotificationfprDocumentService.getStudentIdsByDocumentId(document._id);
        await SentNotificationfprDocumentService.getUserIdByDocumentId(document._id);


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

exports.getDocumentsByFolderId = async (req, res) => {
    try {
        const { folder_id } = req.params;

        // Kiểm tra nếu `folder_id` không được cung cấp
        if (!folder_id) {
            return res.status(400).json({ message: 'Folder ID is required' });
        }

        // Gọi service để lấy danh sách tài liệu theo `folder_id`
        const documents = await documentService.getDocumentsByFolderId(folder_id);

        // Kiểm tra nếu không có tài liệu nào được tìm thấy
        if (!documents || documents.length === 0) {
            return res.status(404).json({ message: 'No documents found for this folder' });
        }

        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};