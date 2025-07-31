import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
  }
};

export const upload = multer({ storage, fileFilter });
