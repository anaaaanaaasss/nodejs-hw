// src/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import notesRoutes from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();

// core middleware
app.use(logger);      // pino-http
app.use(cors());
app.use(express.json());

// routes
app.use(notesRoutes); // /notes, /notes/:noteId etc.

// 404 & errors
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

async function start() {
  try {
    await connectMongoDB(MONGO_URL);
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on :${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
