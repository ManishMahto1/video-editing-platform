import React, { useState } from 'react';
import { addSubtitles } from '../api';

interface Props {
  videoId: string;
  onSubtitled: () => void;
}

const SubtitleForm: React.FC<Props> = ({ videoId, onSubtitled }) => {
  const [srtFile, setSrtFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSrtFile(e.target.files[0]);
    }
  };

  const handleAdd = async () => {
    if (!srtFile) {
      alert('Please select an SRT file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('srtFile', srtFile);
      await addSubtitles(videoId, formData);
      onSubtitled();
    } catch (error) {
      console.error('Error adding subtitles:', error);
      alert('Failed to add subtitles');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="font-semibold">Add Subtitles</h3>
      <input
        type="file"
        accept=".srt"
        onChange={handleFileChange}
        className="w-full border p-1 rounded mb-2"
      />
       <button
        onClick={handleAdd}
        className="p-2 bg-green-500 text-white rounded"
        disabled={!srtFile}
      >
        Add Subtitles
      </button>
    </div>
  );
};

export default SubtitleForm;


/* import React, { useState } from 'react';
import { addSubtitles } from '../api';

interface Props { videoId: string; onSubtitled: () => void; }

const SubtitleForm: React.FC<Props> = ({ videoId, onSubtitled }) => {
  const [text, setText] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const handleAdd = async () => {
    await addSubtitles(videoId, text, start, end);
    onSubtitled();
  };
  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="font-semibold">Add Subtitles</h3>     <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Subtitle text" className="w-full border p-1 rounded mb-2"></textarea>
      <input type="number" value={start} onChange={e=>setStart(+e.target.value)} placeholder="Start sec" className="border p-1 rounded mr-2" />
      <input type="number" value={end} onChange={e=>setEnd(+e.target.value)} placeholder="End sec" className="border p-1 rounded mr-2" />
      <button onClick={handleAdd} className="p-2 bg-green-500 text-white rounded">Add Subtitles</button>
    </div>
  );
};
export default SubtitleForm;
 */