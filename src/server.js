// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();

// env
const PORT = process.env.PORT ?? 3000;

// logger first to log everything
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  })
);

// standard middleware
app.use(cors());
app.use(express.json());

// routes per HW
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// 404 middleware (after routes)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// error middleware (last)
app.use((err, req, res, next) => {
  req?.log?.error?.(err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd ? 'Something went wrong. Please try again later.' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
