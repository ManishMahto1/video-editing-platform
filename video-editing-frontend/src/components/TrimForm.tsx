
import React, { useState } from 'react';
import { trimVideo } from '../api';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  videoId: string;
  onTrimmed: () => void;
}

const TrimForm: React.FC<Props> = ({ videoId, onTrimmed }) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrim = async () => {
    try {
      setIsLoading(true);
      await trimVideo(videoId, start, end);
      onTrimmed();
    } catch (error) {
      console.error('Error trimming video:', error);
      alert('Failed to trim video');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl shadow-lg mt-6 max-w-lg mx-auto transition-all duration-300 hover:shadow-xl">
      {isLoading && <LoadingSpinner message="Trimming Video..." />}
      <h3 className="text-xl font-bold text-teal-700 mb-4">Trim Video</h3>
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (seconds)</label>
          <input
            type="number"
            value={start}
            onChange={(e) => setStart(+e.target.value)}
            placeholder="0"
            min="0"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time (seconds)</label>
          <input
            type="number"
            value={end}
            onChange={(e) => setEnd(+e.target.value)}
            placeholder="0"
            min="0"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
          />
        </div>
      </div>
      <button
        onClick={handleTrim}
        className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 ${
          start <= 0 || end <= 0 || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
        }`}
        disabled={start <= 0 || end <= 0 || isLoading}
      >
        Trim Video
      </button>
    </div>
  );
};

export default TrimForm;