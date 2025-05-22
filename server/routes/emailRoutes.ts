import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadExcel, sendTestEmail, sendBulkEmails } from '../controllers/emailController';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, String(uniqueSuffix) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Log file details for debugging
    console.log('File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Check file extension
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Check MIME type - Excel files have specific MIME types
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/octet-stream' // Sometimes Excel files are detected as this
    ];
    
    // Accept file if extension OR mimetype matches
    if (allowedExtensions.includes(fileExtension) || allowedMimeTypes.includes(file.mimetype)) {
      console.log('File accepted:', file.originalname);
      return cb(null, true);
    } else {
      console.log('File rejected:', {
        filename: file.originalname,
        extension: fileExtension,
        mimetype: file.mimetype
      });
      cb(new Error(`Only Excel files (.xlsx, .xls) are allowed. Received: ${file.originalname} with type: ${file.mimetype}`));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

router.post('/upload', upload.single('file'), uploadExcel);
router.post('/send-test', sendTestEmail);
router.post('/send-bulk', sendBulkEmails);

export default router;