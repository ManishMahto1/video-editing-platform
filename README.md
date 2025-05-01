Video Editing Platform
A web-based video editing platform that allows users to upload videos, trim them, add subtitles (via .srt files or raw text), and render the final video. The frontend is built with React, TypeScript, and Tailwind CSS, providing a modern and responsive UI with a processing spinner for user feedback. The backend uses Node.js, Express, TypeScript, Prisma (with MySQL), and FFmpeg for video processing.
Table of Contents

Features
Tech Stack
Prerequisites
Project Structure
Setup Instructions
Backend Setup
Frontend Setup


Video Upload: Upload MP4 videos for editing.
Trimming: Trim videos by specifying start and end times.
Subtitles: Add subtitles via .srt file upload or raw text input with timestamps (HH:MM:SS,mmm).
Rendering: Render the final edited video with applied changes.
User-Friendly UI: Modern, responsive frontend with loading spinners and animations.
Backend Processing: Efficient video processing using FFmpeg and Prisma for database management.

Tech Stack
Frontend

React: UI library for building components.
TypeScript: Static typing for improved code quality.
Tailwind CSS: Utility-first CSS for styling.
Axios: HTTP client for API requests.

Backend

Node.js: JavaScript runtime for the server.
Express: Web framework for API routes.
TypeScript: Static typing for backend code.
Prisma: ORM for MySQL database.
FFmpeg: Video processing for trimming and subtitle overlay.
Multer: Middleware for handling file uploads.

Database

MySQL: Relational database for storing video metadata.

Prerequisites

Node.js (v16 or higher): Download
MySQL (v8 or higher): Download
FFmpeg: Download and add to system PATH (e.g., C:\ffmpeg\bin)
Git: For cloning the repository.
Nodemon (optional): For backend development with auto-restart.

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

Setup Instructions
Backend Setup

Clone the Repository:
git clone <https://github.com/ManishMahto1/video-editing-platform>
cd video-editing-platform/video-editing-backend


Install Dependencies:
npm install


Set Up MySQL:

Install MySQL and start the server.
Create a database:CREATE DATABASE video_editor;


Update .env with your MySQL credentials:DATABASE_URL="mysql://<user>:<password>@localhost:3306/video_editor"
PORT=5000
STORAGE_PATH=./Uploads




Set Up FFmpeg:

Download FFmpeg and extract to C:\ffmpeg.
Add C:\ffmpeg\bin to your system PATH.
Verify:ffmpeg -version




Run Prisma Migrations:
npx prisma migrate dev --name init


Create Uploads Directory:
mkdir Uploads


Start the Backend:
npm run dev

The server will run on http://localhost:5000.


Frontend Setup

Navigate to Frontend:
cd ../video-editing-frontend


Install Dependencies:
npm install


Set Up Tailwind CSS (if not already configured):

Ensure tailwind.config.js and src/index.css are set up (see Tailwind Docs).
Verify Tailwind classes work in components.


Start the Frontend:
npm start

The app will run on http://localhost:5173.


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
