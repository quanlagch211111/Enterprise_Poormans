const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Define routes and map them to controller methods
router.get('/', documentController.getAllDocuments);
router.post('/', documentController.createDocument);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', documentController.updateDocumentById);
router.delete('/:id', documentController.deleteDocumentById);
router.get('/folder/:folder_id', documentController.getDocumentsByFolderId);
module.exports = router;