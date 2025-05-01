
import React, { useState } from 'react';
import { renderVideo } from '../api';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  videoId: string;
  onRendered: () => void;
}

const RenderButton: React.FC<Props> = ({ videoId, onRendered }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRender = async () => {
    try {
      setIsLoading(true);
      await renderVideo(videoId);
      onRendered();
    } catch (error) {
      console.error('Error rendering video:', error);
      alert('Failed to render video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 max-w-lg mx-auto">
      {isLoading && <LoadingSpinner message="Rendering Video..." />}
      <button
        onClick={handleRender}
        className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
        }`}
        disabled={isLoading}
      >
        Render Final Video
      </button>
    </div>
  );
};

export default RenderButton;