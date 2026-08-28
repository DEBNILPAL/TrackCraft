import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config';

// Ensure upload directory exists
if (!fs.existsSync(CONFIG.UPLOAD_DIR)) {
  fs.mkdirSync(CONFIG.UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, CONFIG.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}_${uniqueSuffix}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Allowed file types: Images, PDFs, Docs, Diagrams, Archives
    const allowedExtensions = /\.(jpg|jpeg|png|gif|svg|pdf|doc|docx|zip|json|txt|md)$/i;
    if (allowedExtensions.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file extension. Only PNG, JPG, SVG, PDF, DOC, ZIP files are allowed.'));
    }
  },
});
