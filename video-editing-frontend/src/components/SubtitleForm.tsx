import React, { useState } from 'react';
import { addSubtitles } from '../api';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  videoId: string;
  onSubtitled: () => void;
}

const SubtitleForm: React.FC<Props> = ({ videoId, onSubtitled }) => {
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSrtFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    try {
      setIsLoading(true);
      if (inputMode === 'file') {
        if (!srtFile) {
          alert('Please select an SRT file');
          return;
        }
        const formData = new FormData();
        formData.append('srtFile', srtFile);
        await addSubtitles(videoId, formData);
      } else {
        if (!text || !start || !end) {
          alert('Please provide subtitle text, start time, and end time');
          return;
        }
        const timeRegex = /^\d{2}:\d{2}:\d{2},\d{3}$/;
        if (!timeRegex.test(start) || !timeRegex.test(end)) {
          alert('Start and end times must be in HH:MM:SS,mmm format');
          return;
        }
        const formData = new FormData();
        formData.append('text', text);
        formData.append('start', start);
        formData.append('end', end);
        await addSubtitles(videoId, formData);
      }
      onSubtitled();
    } catch (error) {
      console.error('Error adding subtitles:', error);
      alert('Failed to add subtitles');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg mt-6 max-w-lg mx-auto transition-all duration-300 hover:shadow-xl">
      {isLoading && <LoadingSpinner message="Adding Subtitles..." />}
      <h3 className="text-xl font-bold text-indigo-700 mb-4">Add Subtitles</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Input Mode</label>
        <select
          value={inputMode}
          onChange={(e) => setInputMode(e.target.value as 'file' | 'text')}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="file">Upload SRT File</option>
          <option value="text">Enter Subtitle Text</option>
        </select>
      </div>

      {inputMode === 'file' ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">SRT File</label>
          <input
            type="file"
            accept=".srt"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-colors"
          />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter subtitle text"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              rows={4}
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (HH:MM:SS,mmm)</label>
              <input
                type="text"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="00:00:01,000"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time (HH:MM:SS,mmm)</label>
              <input
                type="text"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="00:00:05,000"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleAdd}
        className={`w-full p-3 rounded-lg text-white font-semibold transition-all duration-300 bg-green-500 ${
          inputMode === 'file' ? !srtFile : !text || !start || !end || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        disabled={inputMode === 'file' ? !srtFile || isLoading : !text || !start || !end || isLoading}
      >
        Add Subtitles
      </button>
    </div>
  );
};

export default SubtitleForm;