const { uploadFileToGoogleDrive } = require('../services/GoogleAPI');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path; // Đường dẫn file được lưu tạm
        const fileName = req.file.originalname; // Tên file gốc
        const mimeType = req.file.mimetype; // Loại file

        // Upload file lên Google Drive
        const result = await uploadFileToGoogleDrive(filePath, fileName, mimeType);

        if (result.success) {
            // Xóa file tạm sau khi upload thành công
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting temporary file: ${filePath}`, err.message);
                } else {
                    console.log(`Temporary file deleted: ${filePath}`);
                }
            });

            return res.status(200).json({ message: 'File uploaded successfully', fileUrl: result.fileUrl });
        } else {
            // Nếu upload thất bại, không xóa file tạm để debug
            return res.status(500).json({ message: 'Failed to upload file', error: result.error });
        }
    } catch (error) {
        console.error('Error in uploadFile:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};