const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const googleDriveController = require('../controllers/GoogleDriveController');

// Cấu hình multer để lưu file tạm thời
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Thư mục lưu file tạm
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên file
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), googleDriveController.uploadFile);

module.exports = router;