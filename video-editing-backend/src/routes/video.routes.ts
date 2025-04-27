import express from 'express';
import { uploadVideo, trimVideo, addSubtitles, renderVideo, getVideoStatus, downloadFinalVideo } from '../controllers/video.controller';
import { upload } from '../middlewares/fileUpload.middleware';

const router = express.Router();

router.post('/upload', upload.single('video'), uploadVideo);
router.post('/:id/trim', trimVideo);
router.post('/:id/subtitles', addSubtitles);
router.post('/:id/render', renderVideo);
router.get('/:id/status', getVideoStatus);
router.get('/:id/download', downloadFinalVideo);

export default router;
