import React from 'react';
import { renderVideo } from '../api';

interface Props { videoId: string; onRendered: () => void; }

const RenderButton: React.FC<Props> = ({ videoId, onRendered }) => {
  const handleRender = async () => { await renderVideo(videoId); onRendered(); };
  return <button onClick={handleRender} className="mt-4 p-2 bg-purple-500 text-white rounded">Render Final Video</button>;
};
export default RenderButton;