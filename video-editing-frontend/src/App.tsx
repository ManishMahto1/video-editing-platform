import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import TrimForm from './components/TrimForm';
import SubtitleForm from './components/SubtitleForm';
import RenderButton from './components/RenderButton';
import StatusDisplay from './components/StatusDisplay';
import DownloadButton from './components/DownloadButton';

const App: React.FC = () => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Video Editing Platform</h1>
      {!videoId && <UploadForm onUploaded={id => { setVideoId(id); setStep(2); }} />}
      {videoId && step === 2 && <TrimForm videoId={videoId} onTrimmed={() => setStep(3)} />}
      {videoId && step === 3 && <SubtitleForm videoId={videoId} onSubtitled={() => setStep(4)} />}
      {videoId && step === 4 && <RenderButton videoId={videoId} onRendered={() => setStep(5)} />}
      {videoId && step === 5 && <StatusDisplay videoId={videoId} />}
      {videoId && step === 5 && <DownloadButton videoId={videoId} />}
    </div>
  );
};

export default App;