import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
    ): void => {

    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are allowed (JPEG, PNG, WEBP, etc.)'));
    }
};

const diskStorage = multer.diskStorage({
  /* The `destination` and `filename` functions are part of the `diskStorage` configuration for multer. */
    destination: (_req, _file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (_req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: diskStorage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 5 
    }
});

export default upload;