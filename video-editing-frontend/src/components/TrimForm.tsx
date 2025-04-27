import React, { useState } from 'react';
import { trimVideo } from '../api';

interface Props { videoId: string; onTrimmed: () => void; }

const TrimForm: React.FC<Props> = ({ videoId, onTrimmed }) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const handleTrim = async () => {
    await trimVideo(videoId, start, end);
    onTrimmed();
  };
  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h3 className="font-semibold">Trim Video</h3>
      <input type="number" value={start} onChange={e => setStart(+e.target.value)} placeholder="Start sec" className="border p-1 rounded mr-2" />
      <input type="number" value={end} onChange={e => setEnd(+e.target.value)} placeholder="End sec" className="border p-1 rounded mr-2" />
      <button onClick={handleTrim} className="p-2 bg-green-500 text-white rounded">Trim</button>
    </div>
  );
};
export default TrimForm;