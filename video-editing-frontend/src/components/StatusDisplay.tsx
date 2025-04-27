import React, { useEffect, useState } from 'react';
import { getStatus } from '../api';

interface Props { videoId: string; }

const StatusDisplay: React.FC<Props> = ({ videoId }) => {
  const [status, setStatus] = useState('');
  useEffect(() => {
    const check = async () => {
      const res = await getStatus(videoId);
      setStatus(res.data.status);
    };
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [videoId]);
  return <div className="mt-4">Status: <span className="font-bold">{status}</span></div>;
};
export default StatusDisplay;