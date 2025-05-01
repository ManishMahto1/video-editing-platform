import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/videos' });

export const uploadVideo = (file: File) => {
  const form = new FormData();
  form.append('video', file);
  return API.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const trimVideo = (id: string, start: number, end: number) =>
  API.post(`/${id}/trim`, { start, end });

export const addSubtitles = async (id: string, formData: FormData) => {
  const response = await API.post(`/${id}/subtitles`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


/* export const addSubtitles = (id: string, text: string, startTime: number, endTime: number) =>
  API.post(`/${id}/subtitles`, { text, startTime, endTime });
 */
export const renderVideo = (id: string) =>
  API.post(`/${id}/render`);

export const getStatus = (id: string) =>
  API.get(`/${id}/status`);

export const downloadVideo = (id: string) =>
  window.open(`http://localhost:5000/api/videos/${id}/download`, '_blank');
