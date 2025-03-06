const express = require('express');
const router = express.Router();
const submissionFolderController = require('../controllers/submissionfolderController');


// Define routes and map them to controller methods
router.get('/', submissionFolderController.getAllSubmissionFolders);
router.post('/', submissionFolderController.createSubmissionFolder);
router.get('/:id', submissionFolderController.getSubmissionFolderById);
router.put('/:id', submissionFolderController.updateSubmissionFolderById);
router.delete('/:id', submissionFolderController.deleteSubmissionFolderById);



module.exports = router;