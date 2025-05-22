import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { uploadExcel, sendTestEmail, sendBulkEmails } from '../controllers/emailController';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueSuffix = `${timestamp}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

// File filter for Excel files
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowedExtensions = ['.xlsx', '.xls'];
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/octet-stream' // Sometimes Excel files are sent with this
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  // Logging for debugging
  console.log('File upload attempt:', {
    originalname: file.originalname,
    mimetype: mime,
    extension: ext
  });

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(mime)) {
    console.log('File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.warn('File rejected:', {
      filename: file.originalname,
      extension: ext,
      mimetype: mime
    });
    cb(new Error(`Only Excel files (.xlsx, .xls) are allowed.`));
  }
};

// Setup multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Define routes
const router = express.Router();

router.post('/upload', upload.single('file'), uploadExcel);
router.post('/send-test', sendTestEmail);
router.post('/send-bulk', sendBulkEmails);

export default router;
