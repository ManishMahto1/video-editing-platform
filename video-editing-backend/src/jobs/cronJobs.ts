import cron from 'node-cron';
import { cleanupOldVideos } from '../services/cleanupService';

// Clean up old videos every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running cleanup job...');
  await cleanupOldVideos();
});
