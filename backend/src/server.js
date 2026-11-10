import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import notesRoutes from './routes/notes.js';
import pdfsRoutes from './routes/pdfs.js';
import labRoutes from './routes/laboratory.js';
import syllabusRoutes from './routes/syllabus.js';
import pyqRoutes from './routes/pyq.js';
import communityRoutes from './routes/community.js';
import { initCommunityChat } from './services/communityChatService.js';
import fs from 'fs';
import { contentRoot, projectRoot } from './utils/pathHelper.js';

const app = express();
const httpServer = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Configurable CORS for production or development
const corsOrigin = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsOrigin === '*' ? '*' : corsOrigin.split(',').map(s => s.trim());

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range']
}));

app.use(express.json());

// Initialize Real-time Socket.IO Server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});
initCommunityChat(io);

// API Endpoints
app.use('/api/community', communityRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/laboratory', labRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/pyq', pyqRoutes);
app.use('/api/pdf', pdfsRoutes);

// Raw PDF static streaming compatibility with range request support
app.use('/raw-pdf', (req, res, next) => {
  let rawUrl = (req.url || '').split('?')[0];
  let decodedPath = decodeURIComponent(rawUrl);
  if (decodedPath.startsWith('/content/')) {
    decodedPath = decodedPath.replace(/^\/content\//, '');
  } else if (decodedPath.startsWith('/')) {
    decodedPath = decodedPath.substring(1);
  }

  const candidates = [
    path.resolve(contentRoot, decodedPath),
    path.resolve(projectRoot, decodedPath),
    path.resolve(contentRoot, 'notes', decodedPath),
    path.resolve(contentRoot, 'laboratory', decodedPath),
    path.resolve(contentRoot, 'syllabus', decodedPath),
    path.resolve(contentRoot, 'pyq', decodedPath),
    path.resolve(contentRoot, 'community', decodedPath.replace(/^community\//i, '')),
    path.resolve(contentRoot, 'community', path.basename(decodedPath)),
    path.resolve(contentRoot, 'other', decodedPath)
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      const stat = fs.statSync(c);
      const fileName = path.basename(c);
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;

        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
        res.setHeader('Content-Length', chunksize);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Accept-Ranges', 'bytes');
        return fs.createReadStream(c, { start, end }).pipe(res);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Accept-Ranges', 'bytes');
      return fs.createReadStream(c).pipe(res);
    }
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production'
  });
});

// Production Frontend Static Asset Hosting (when dist is present)
const distPath = path.resolve(projectRoot, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/raw-pdf')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, HOST, () => {
    console.log(`JC Notes Backend API server running on http://${HOST}:${PORT}`);
  });
}

export default app;
