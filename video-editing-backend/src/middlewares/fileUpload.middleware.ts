import multer from 'multer';
import path from 'path';
// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });


const videoFolderPath = path.join(__dirname, '../Uploads/'); // Project root

// Multer config for SRT
const srtStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, `temp_subtitles_${Date.now()}.srt`);
  },
});

const srtUpload = multer({
  storage: srtStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.srt')) {
      cb(null, true);
    } else {
      console.error('Invalid file type:', file.mimetype);
      
    }
  },
}).single('srtFile');

export { upload,srtUpload };
