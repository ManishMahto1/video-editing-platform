import React from 'react';
import { downloadVideo } from '../api';

interface Props { videoId: string; }

const DownloadButton: React.FC<Props> = ({ videoId }) => (
  <button onClick={() => downloadVideo(videoId)} className="mt-4 p-2 bg-blue-600 text-white rounded">Download Video</button>
);
export default DownloadButton;