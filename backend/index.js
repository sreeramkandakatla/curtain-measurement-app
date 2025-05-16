import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import uploadRoute from './routes/uploadRoute.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', uploadRoute);  // e.g., http://localhost:5000/api/upload

// Serve frontend static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the frontend build (dist)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve React's index.html for unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

//for local deployment

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import uploadRoute from './routes/uploadRoute.js';

// dotenv.config();

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });

// app.use('/api', uploadRoute);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server started on port ${PORT}`);
// });
