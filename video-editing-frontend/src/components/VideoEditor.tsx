
import React, { useState } from 'react';
import { uploadVideo } from '../api';
import SubtitleForm from './SubtitleForm';
import TrimForm from './TrimForm';
import RenderButton from './RenderButton';
import LoadingSpinner from './LoadingSpinner';
const VideoEditor: React.FC = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setIsLoading(true);
        const response = await uploadVideo(e.target.files[0]);
        setVideoId(response.data.video.id);
      } catch (error) {
        console.error('Error uploading video:', error);
        alert('Failed to upload video');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubtitled = () => {
    alert('Subtitles added successfully!');
  };

  const handleTrimmed = () => {
    alert('Video trimmed successfully!');
  };

  const handleRendered = () => {
    alert('Video rendered successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {isLoading && <LoadingSpinner message="Uploading Video..." />}
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">Video Editor</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Upload Video</h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-colors"
          />
        </div>
        {videoId && (
          <>
            <TrimForm videoId={videoId} onTrimmed={handleTrimmed} />
            <SubtitleForm videoId={videoId} onSubtitled={handleSubtitled} />
            <RenderButton videoId={videoId} onRendered={handleRendered} />
          </>
        )}
      </div>
    </div>
  );
};

export default VideoEditor;