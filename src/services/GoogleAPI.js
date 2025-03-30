const { google } = require('googleapis');
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const uploadFileToGoogleDrive = async (filePath, fileName, mimeType) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName, // Tên file trên Google Drive
                mimeType: mimeType
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath) // Đọc file từ đường dẫn
            }
        });

        // Đặt quyền public cho file
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Lấy link public của file
        const fileUrl = `https://drive.google.com/uc?id=${response.data.id}&export=download`;
        return { success: true, fileUrl };
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error.message);
        return { success: false, error: error.message };
    }
};

const deleteFileFromGoogleDrive = async (fileId) => {
    try {
        await drive.files.delete({
            fileId: fileId,
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting file from Google Drive:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { uploadFileToGoogleDrive, deleteFileFromGoogleDrive };
