import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';

import { srtUpload } from '../middlewares/fileUpload.middleware';
import { log } from 'util';
const prisma = new PrismaClient();
const videoFolderPath = path.join(__dirname, '../Uploads/'); // Project root

// Ensure uploads directory exists
if (!fs.existsSync(videoFolderPath)) {
  fs.mkdirSync(videoFolderPath, { recursive: true });
}

// Set FFmpeg path for Windows
ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');



export const addSubtitles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

   console.log('Adding subtitles...')
  srtUpload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const srtFile = req.file;

      if (!srtFile) {
        return res.status(400).json({ error: 'No SRT file uploaded' });
      }

      const video = await prisma.video.findUnique({ where: { id } });
      if (!video) {
        fs.unlinkSync(srtFile.path);
        return res.status(404).json({ error: 'Video not found' });
      }

      const sanitizedName = video.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const inputPath = path.resolve(video.uploadUrl);
      const outputPath = path.join(videoFolderPath, `subtitled_${sanitizedName}`);

      if (!fs.existsSync(inputPath)) {
        fs.unlinkSync(srtFile.path);
        return res.status(404).json({ error: 'Input video file not found' });
      }

      if (!fs.existsSync(srtFile.path)) {
        fs.unlinkSync(srtFile.path);
        return res.status(400).json({ error: 'SRT file not found' });
      }

      // Log paths for debugging
      /* console.log('Input path:', inputPath);
      console.log('Output path:', outputPath);
      console.log('SRT path:', srtFile.path); */

      // Run FFmpeg with subtitles
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .videoFilters(`subtitles='${srtFile.path.replace(/\\/g, '\\\\').replace(/:/g, '\\:')}'`)
          .outputOptions(['-c:v libx264', '-c:a copy']) // Ensure MP4 compatibility
          .output(outputPath)
          .on('end', () => {
            fs.unlinkSync(srtFile.path);
            resolve();
          })
          .on('error', (error) => {
            console.error('FFmpeg error:', error);
            if (fs.existsSync(srtFile.path)) fs.unlinkSync(srtFile.path);
            reject(error);
          })
          .run();
      });

      // Update video metadata
      await prisma.video.update({
        where: { id },
        data: {
          finalUrl: path.join('/uploads', `subtitled_${sanitizedName}`), // Relative path for frontend
          status: 'rendered',
        },
      });

      res.json({
        message: 'Subtitles added successfully',
        filePath: outputPath,
      });
    } catch (error) {
      console.error('Error adding subtitles:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  });
};

// Video Upload Handler
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { originalname, size } = req.file!;
    console.log(req.file);

    const videoPath = path.join(videoFolderPath, originalname);

    // Save file locally
    fs.renameSync(req.file!.path, videoPath);

    // Save video metadata to DB
    const video = await prisma.video.create({
      data: {
        name: originalname,
        uploadUrl: videoPath,
        size,
        status: 'pending'
      }
    });

    console.log(video);


    res.status(201).json({ video });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading video' });
  }
};

// Trim Video Handler
export const trimVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Trimming video...');
  try {
    const { id } = req.params;
    const { start, end } = req.body;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const inputPath = path.resolve(video.uploadUrl);
    const outputPath = path.join(videoFolderPath, `trimmed_${video.name}`);

    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputPath)
      .on('end', async () => {
        await prisma.video.update({
          where: { id },
          data: { finalUrl: `trimmed_${video.name}`, status: 'rendered' }
        });
        res.json({ message: 'Video trimmed successfully', filePath: outputPath });
      })
      .on('error', (err) => {
        console.error('Error during trimming:', err);
        res.status(500).json({ error: 'Error trimming video' });
      })
      .run();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error trimming video' });
  }
};
// Render Final Video Handler
export const renderVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('Rendering video...');
  try {
    const { id } = req.params;
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) res.status(404).json({ error: 'Video not found' });

    const outputPath = path.join(videoFolderPath, `final_${video?.name}`);
    ffmpeg(video?.uploadUrl)
      .output(outputPath)
      .on('end', async () => {
        await prisma.video.update({
          where: { id },
          data: { finalUrl: `final_${video?.name}`, status: 'rendered' }
        });
        res.json({ message: 'Video rendering complete', filePath: outputPath });
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: 'Error rendering video' });
  }
};

// Get Video Status Handler
export const getVideoStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) res.status(404).json({ error: 'Video not found' });

  res.json({ status: video?.status });
};

// Download Final Video Handler
export const downloadFinalVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const video = await prisma.video.findUnique({ where: { id } });

  // Check if the video is found and has a finalUrl
  if (!video || !video.finalUrl) {
    res.status(404).json({ error: 'Video not rendered yet' });
  }

  // Ensure finalUrl is a string, and use it in path.join
  const filePath = path.join(videoFolderPath, video?.finalUrl!); // Use `!` to assert non-null

  res.download(filePath);
};
