import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import videoRoutes from './routes/video.routes';
import './jobs/cronJobs'; // Load cron jobs

const app = express();

// Middleware
//app.use(cors());
app.use(bodyParser.json());

 // Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend origin
  credentials: true, // if you want to send cookies, Authorization headers, etc.
})); 
// Routes
app.use('/api/videos', videoRoutes);

// Swagger UI (Optional)
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Video Editing API',
      description: 'API for video uploading and editing',
      version: '1.0.0'
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
