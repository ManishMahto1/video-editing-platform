import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ffmpeg from 'fluent-ffmpeg';
import { NextFunction } from 'express';
const prisma = new PrismaClient();

// Linux common path
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');

// File path setup
const videoFolderPath = path.join(__dirname, '../../uploads/');

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



export const addSubtitles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { subtitleText, startTime, endTime } = req.body;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) res.status(404).json({ error: 'Video not found' });

    const outputPath = path.join(videoFolderPath, `subtitled_${video?.name}`);
    ffmpeg(video?.uploadUrl)
      .outputOptions([`-vf subtitles=${subtitleText}:force_style='Alignment=2'`])
      .output(outputPath)
      .on('end', async () => {
        await prisma.video.update({
          where: { id },
          data: { finalUrl: `subtitled_${video?.name}`, status: 'rendered' }
        });
        res.json({ message: 'Subtitles added successfully', filePath: outputPath });
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: 'Error adding subtitles' });
  }
};


// Render Final Video Handler
export const renderVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
