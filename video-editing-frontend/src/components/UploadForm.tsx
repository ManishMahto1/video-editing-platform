import axios from 'axios';
import { useState } from 'react';
interface UploadFormProps {
  onUploaded: (id: string) => void;
}
const UploadForm: React.FC<UploadFormProps>  = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      setVideoPreview(previewUrl);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);

      const previewUrl = URL.createObjectURL(droppedFile);
      setVideoPreview(previewUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      setIsUploading(true);

      const res = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent);
          
        }
      });

      console.log('Uploaded:', res.data);
      alert('Upload successful!');
      onUploaded(res.data.video.id); // Pass the video ID to the parent component
     //console.log('Video ID:', res.data.video.id);
     // Reset
      setFile(null);
      setVideoPreview(null);
      setUploadProgress(0);
       // Pass the video ID to the parent component
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Upload a Video</h2>

      <form onSubmit={handleUpload}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: '2px dashed #aaa',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>Drag and drop a video here, or click to select</p>
          )}
          <input
            id="fileInput"
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {videoPreview && (
          <div style={{ margin: '20px 0' }}>
            <video src={videoPreview} controls width="100%" />
          </div>
        )}

        {uploadProgress > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              height: '10px',
              width: '100%',
              backgroundColor: '#ccc',
              borderRadius: '5px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${uploadProgress}%`,
                backgroundColor: '#4caf50',
                transition: 'width 0.3s ease',
              }} />
            </div>
            <p style={{ textAlign: 'center' }}>{uploadProgress}%</p>
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            width: '100%',
            backgroundColor: isUploading ? '#ccc' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
