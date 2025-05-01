# Video Editing Platform

This is a full-stack video editing platform that allows users to upload, trim, add subtitles, render, and download videos. The project is divided into two parts: the **backend** and the **frontend**.

## Features

- **Frontend**:
  - Built with React, TypeScript, and Vite.
  - Upload videos, trim, add subtitles, and render them.
  - Real-time status updates and video download functionality.

- **Backend**:
  - Built with Node.js, Express, and Prisma.
  - Handles video uploads, processing, and storage.
  - Provides REST APIs for video editing operations.
  - Scheduled cleanup of old videos using `node-cron`.

---

## Project Structure
Project Structure
video-editing-platform/
├── video-editing-backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── videoController.ts  # API logic (e.g., addSubtitles)
│   │   ├── routes/
│   │   │   └── videoRoutes.ts     # API routes
│   │   ├── middlewares/
│   │   │   └── fileUpload.middleware.ts
│   │   ├── Uploads/               # Stores videos and .srt files
│   │   └── server.ts              # Express server entry point
│   ├── prisma/
│   │   └── schema.prisma          # Prisma schema
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── video-editing-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.tsx # Spinner for processing feedback
│   │   │   ├── SubtitleForm.tsx   # Form for adding subtitles
│   │   │   ├── TrimForm.tsx       # Form for trimming videos
│   │   │   ├── RenderButton.tsx   # Button for rendering videos
│   │   │   └── VideoEditor.tsx    # Main page combining components
│   │   ├── api/
│   │   │   └── api.ts             # API client (Axios)
│   │   ├── index.css              # Tailwind CSS
│   │   └── index.tsx              # App entry point
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── README.md




## Setup Instructions
Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ManishMahto1/video-editing-platform
   cd backend
   ```
2.Navigate to backend:
```bash
 cd ../video-editing-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   ```bash
    Create a `.env` file in the `backend` directory and add the following variables:
    #DATABASE_URL=postgresql://username:password@localhost:5432/
    VIDEO_CLEANUP_DAYS=1
    DATABASE_URL="mysql://root:Manish@123@localhost:3306/video_editing_platform"

    VITE_API_URL=http://localhost:5000/api
    STORAGE_PATH=./Uploads
   ```

5. Run the backend server:
   ```bash
   Install MySQL and start the server.
   Create a database:CREATE DATABASE video_editor;
   ```

6.Set Up FFmpeg:
   ```bash
   Download FFmpeg and extract to C:\ffmpeg.
   Add C:\ffmpeg\bin to your system PATH.
   Verify:ffmpeg -version
   ```


7.Run Prisma Migrations:
 ```bash
   npx prisma migrate dev --name init
   ```

8.Start the Backend:
```bash
  npm run dev
  The server will run on http://localhost:5000.
   ```



Frontend Setup

1.Navigate to Frontend:

```bash
 cd ../video-editing-frontend
   ```

2.Install Dependencies:

```bash
 npm install
   ```


3.Tailwind css setup
```bash
 Set Up Tailwind CSS (if not already configured):
Ensure tailwind.config.js and src/index.css are set up (see Tailwind Docs).
Verify Tailwind classes work in components.
   ```


4.Start the Frontend:

```bash
 npm start
 The app will run on http://localhost:5173.
   ```





```bash

Usage

Access the App:Open http://localhost:5173 in your browser.

Upload a Video:

Use the "Upload Video" section to upload an MP4 file.
A loading spinner will appear during upload.


Trim the Video:

In the "Trim Video" form, enter start and end times (in seconds).
Click "Trim Video" to process. A spinner will show during processing.


Add Subtitles:

In the "Add Subtitles" form, choose:
Upload SRT File: Select an .srt file (e.g., 1\n00:00:01,000 --> 00:00:05,000\nHello, world!).
Enter Subtitle Text: Input text, start time, and end time (e.g., 00:00:01,000).


Click "Add Subtitles". A spinner will appear.


Render the Video:

Click "Render Final Video" to generate the edited video.
Download the final video via the provided link.






Spinner Not Showing:

Check isLoading state in components.
Inspect browser console for React errors.


Backend API Errors:

Ensure MySQL is running and DATABASE_URL is correct.
Verify Uploads/ path in .env.


UI Issues:

Confirm Tailwind CSS is set up correctly.
Test responsiveness on mobile devices.




Licens
This project is licensed under the MIT License. See the LICENSE file for details.
