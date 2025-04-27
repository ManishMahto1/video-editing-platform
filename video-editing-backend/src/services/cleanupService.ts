import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const videoFolderPath = path.join(__dirname, '../../uploads/');

// Cleanup old videos
export const cleanupOldVideos = async () => {
  const videos = await prisma.video.findMany({
    where: {
      status: 'rendered',
      createdAt: {
        lt: new Date(new Date().getTime() - parseInt(process.env.VIDEO_CLEANUP_DAYS || '1') * 24 * 60 * 60 * 1000)
      }
    }
  });

  for (const video of videos) {
    fs.unlinkSync(path.join(videoFolderPath, video?.finalUrl!));
    await prisma.video.delete({ where: { id: video.id } });
  }
};
