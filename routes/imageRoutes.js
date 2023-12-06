import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadsFunc, getImages } from '../controllers/imagesController.js';
const router = express.Router();
const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), uploadsFunc);
router.get('/', getImages);
export default router;
