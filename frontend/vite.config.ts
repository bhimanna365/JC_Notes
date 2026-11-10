import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function findFileRecursively(dir: string, targetFilename: string): string | null {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findFileRecursively(fullPath, targetFilename);
        if (found) return found;
      } else if (entry.isFile() && entry.name.toLowerCase() === targetFilename.toLowerCase()) {
        return fullPath;
      }
    }
  } catch (err) {
    // Ignore permission/read errors
  }
  return null;
}

function pdfServePlugin(): Plugin {
  const pdfMiddleware = (req: any, res: any, next: any) => {
    const urlPath = (req.url || '').split('?')[0];
    const isRawPdf = urlPath.startsWith('/raw-pdf/');
    const isContentPdf = urlPath.startsWith('/content/') && urlPath.toLowerCase().endsWith('.pdf');
    const isPdfsPdf = urlPath.startsWith('/pdfs/') && urlPath.toLowerCase().endsWith('.pdf');

    if (req.url && (isRawPdf || isContentPdf || isPdfsPdf)) {
      let rawPath = req.url;
      if (isRawPdf) rawPath = req.url.replace('/raw-pdf/', '');
      else if (isContentPdf) rawPath = req.url.replace(/^\/content\//, '');
      else if (isPdfsPdf) rawPath = req.url.replace(/^\/pdfs\//, 'notes/');
      
      const decodedPath = decodeURIComponent(rawPath.split('?')[0]);
      
      const workspaceRoot = path.resolve(__dirname, '..');
      const contentRoot = path.resolve(workspaceRoot, 'content');

      // Candidate 1: Direct path from workspaceRoot (e.g., content/notes/...)
      let fullPath = path.resolve(workspaceRoot, decodedPath);

      // Candidate 2: Relative to contentRoot (e.g., notes/24CS330-DS/...)
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        fullPath = path.resolve(contentRoot, decodedPath);
      }

      // Candidate 3: In content/notes/
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        fullPath = path.resolve(contentRoot, 'notes', decodedPath);
      }

      // Candidate 4: In content/laboratory/ (with legacy folder rewrites)
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        const labMapped = decodedPath
          .replace(/^24CS36L-DS-Lab\//i, 'DS-Lab/')
          .replace(/^24CS320-DSD\/DSD-LAB\//i, 'DSD-Lab/')
          .replace(/^24CS310-OOP\/OOP-Lab\//i, 'OOP-Lab/');
        fullPath = path.resolve(contentRoot, 'laboratory', labMapped);
      }

      // Candidate 5: In content/syllabus/2026/ (with legacy 01.Syllabus-26 rewrite)
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        const sylMapped = decodedPath.replace(/^01\.Syllabus-26\//i, '');
        fullPath = path.resolve(contentRoot, 'syllabus', '2026', sylMapped);
      }

      // Candidate 6: In content/pyq/
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        fullPath = path.resolve(contentRoot, 'pyq', decodedPath);
      }

      // Candidate 7: In content/other/
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        const otherMapped = decodedPath.replace(/^Other\//i, '');
        fullPath = path.resolve(contentRoot, 'other', otherMapped);
      }

      // Candidate 7.5: In content/community/
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        const commMapped = decodedPath.replace(/^community\//i, '');
        fullPath = path.resolve(contentRoot, 'community', commMapped);
      }
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        fullPath = path.resolve(contentRoot, 'community', path.basename(decodedPath));
      }

      // Candidate 8: Recursive filename fallback in content/
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        const fileNameOnly = path.basename(decodedPath);
        const foundPath = findFileRecursively(contentRoot, fileNameOnly);
        if (foundPath) {
          fullPath = foundPath;
        }
      }

      // Verify path stays within workspaceRoot to prevent directory traversal
      if (!fullPath.startsWith(workspaceRoot)) {
        res.statusCode = 403;
        res.end('Access Denied');
        return;
      }

      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const stat = fs.statSync(fullPath);
        const fileName = path.basename(fullPath);

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

          const readStream = fs.createReadStream(fullPath, { start, end });
          readStream.pipe(res);
          return;
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Accept-Ranges', 'bytes');

        const readStream = fs.createReadStream(fullPath);
        readStream.pipe(res);
        return;
      } else {
        res.statusCode = 404;
        res.end('PDF Not Found: ' + decodedPath);
        return;
      }
    }
    next();
  };

  return {
    name: 'pdf-serve-plugin',
    configureServer(server) {
      server.middlewares.use(pdfMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(pdfMiddleware);
    }
  };
}

import { Server as SocketIOServer } from 'socket.io';
import { 
  initCommunityChat, 
  createMessage, 
  broadcastMessage, 
  broadcastPdfRegistered,
  getRecentMessages 
} from '../backend/src/services/communityChatService.js';
import {
  uploadMiddleware,
  getAvailableWebsiteFiles,
  streamCommunityFile,
  registerUploadedPdfInInventory,
  sanitizeFilename,
  getFileCategory,
  formatBytes
} from '../backend/src/services/communityFileService.js';

function communityApiPlugin(): Plugin {
  const handler = (req: any, res: any, next: any) => {
    const url = req.url || '';
    const pathname = url.split('?')[0];

    // GET /api/pdf/inventory or GET /api/pdfs
    if ((pathname === '/api/pdf/inventory' || pathname === '/api/pdfs' || pathname === '/api/pdf') && req.method === 'GET') {
      try {
        const workspaceRoot = path.resolve(__dirname, '..');
        const invPath = path.resolve(workspaceRoot, 'all_pdfs_inventory.json');
        if (fs.existsSync(invPath)) {
          const raw = fs.readFileSync(invPath, 'utf8');
          res.setHeader('Content-Type', 'application/json');
          res.end(raw);
          return;
        }
      } catch (err: any) {
        console.error('Error serving PDF inventory in frontend Vite:', err);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify([]));
      return;
    }

    // GET /api/community/messages
    if (pathname === '/api/community/messages' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, messages: getRecentMessages(60) }));
      return;
    }

    // GET /api/community/available-files
    if (pathname === '/api/community/available-files' && req.method === 'GET') {
      try {
        const parsedUrl = new URL(url, 'http://localhost:5173');
        const q = parsedUrl.searchParams.get('q') || '';
        const cat = parsedUrl.searchParams.get('category') || '';
        const files = getAvailableWebsiteFiles(q, cat);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, files }));
      } catch (e: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
      return;
    }

    // GET /api/community/files/:filename
    if (pathname.startsWith('/api/community/files/') && req.method === 'GET') {
      const filename = pathname.replace('/api/community/files/', '');
      const isDownload = url.includes('download=1') || url.includes('download=true');
      streamCommunityFile(filename, req, res, isDownload);
      return;
    }

    // POST /api/community/upload
    if (pathname === '/api/community/upload' && req.method === 'POST') {
      uploadMiddleware.single('file')(req, res, (err: any) => {
        if (err) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message || 'File upload failed' }));
          return;
        }

        if (!req.file) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'No file uploaded' }));
          return;
        }

        try {
          const cleanName = sanitizeFilename(req.file.originalname);
          const ext = path.extname(cleanName).toLowerCase();
          const category = getFileCategory(ext);
          const formattedSize = formatBytes(req.file.size);
          const isPdf = ext === '.pdf';
          const fileUrl = isPdf 
            ? `/raw-pdf/community/${req.file.filename}` 
            : `/api/community/files/${req.file.filename}`;

          const fileMeta = {
            name: cleanName,
            storedFilename: req.file.filename,
            url: fileUrl,
            type: category,
            size: formattedSize,
            sizeBytes: req.file.size,
            relPath: `community/${req.file.filename}`,
            extension: ext,
            isExisting: false
          };

          let registeredPdfDoc: any = null;
          if (isPdf) {
            registeredPdfDoc = registerUploadedPdfInInventory(fileMeta);
            if (registeredPdfDoc) {
              broadcastPdfRegistered(registeredPdfDoc);
            }
          }

          const messageText = (req.body && (req.body.message || req.body.text)) || '';
          const rateKey = req.socket?.remoteAddress || 'upload-vite';
          const chatResult = createMessage(messageText, fileMeta, rateKey);

          if (chatResult.error) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: chatResult.error }));
            return;
          }

          broadcastMessage(chatResult.message);

          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            message: chatResult.message,
            file: fileMeta,
            registeredPdf: registeredPdfDoc
          }));
        } catch (processErr: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: processErr.message }));
        }
      });
      return;
    }

    // POST /api/community/attach-existing
    if (pathname === '/api/community/attach-existing' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', (chunk: any) => { bodyData += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(bodyData || '{}');
          const { name, url: fileUrl, relPath, size, sizeBytes, type, message: msgText } = parsed;

          if (!name || !fileUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Existing file details are required.' }));
            return;
          }

          const fileMeta = {
            name: sanitizeFilename(name),
            url: fileUrl,
            relPath: relPath || '',
            size: size || 'Available',
            sizeBytes: Number(sizeBytes) || 0,
            type: type || 'pdf',
            isExisting: true
          };

          const rateKey = req.socket?.remoteAddress || 'attach-vite';
          const result = createMessage(msgText || '', fileMeta, rateKey);

          if (result.error) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: result.error }));
            return;
          }

          broadcastMessage(result.message);

          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, message: result.message }));
        } catch (e: any) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON body' }));
        }
      });
      return;
    }

    next();
  };

  return {
    name: 'community-api-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

function communitySocketPlugin(): Plugin {
  return {
    name: 'community-socket-plugin',
    configureServer(server) {
      if (server.httpServer) {
        const io = new SocketIOServer(server.httpServer, {
          cors: { origin: '*' }
        });
        initCommunityChat(io);
      }
    },
    configurePreviewServer(server) {
      if (server.httpServer) {
        const io = new SocketIOServer(server.httpServer, {
          cors: { origin: '*' }
        });
        initCommunityChat(io);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), pdfServePlugin(), communityApiPlugin(), communitySocketPlugin()],
  server: {
    port: 5173,
    open: false,
    watch: {
      ignored: [
        '**/dist/**', 
        '**/frontend/dist/**', 
        '**/.git/**', 
        '**/all_pdfs_inventory.json', 
        '**/database/community_messages.json',
        '**/content/community/**'
      ]
    }
  }
});
