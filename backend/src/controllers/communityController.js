import path from 'path';
import { getRecentMessages, createMessage, broadcastMessage, broadcastPdfRegistered } from '../services/communityChatService.js';
import {
  uploadMiddleware,
  registerUploadedPdfInInventory,
  getAvailableWebsiteFiles,
  streamCommunityFile,
  sanitizeFilename,
  getFileCategory,
  formatBytes,
  uploadFileToSupabaseStorage,
  MIME_MAP
} from '../services/communityFileService.js';

export function getMessages(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const messages = getRecentMessages(limit);
    res.json({
      success: true,
      messages
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch community messages' });
  }
}

export function sendMessage(req, res) {
  try {
    const { text, message: msgText, file } = req.body || {};
    const content = msgText || text || '';
    const rateKey = req.ip || 'rest-client';
    const result = createMessage(content, file, rateKey);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    broadcastMessage(result.message);
    res.status(201).json({ success: true, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to post message' });
  }
}

export function uploadFile(req, res) {
  uploadMiddleware.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    try {
      const cleanName = sanitizeFilename(req.file.originalname);
      const ext = path.extname(cleanName).toLowerCase();
      const category = getFileCategory(ext);
      const formattedSize = formatBytes(req.file.size);

      // Determine public file access URL:
      // For PDFs, expose via /raw-pdf/community/... for standard viewer integration
      // For other documents/images, expose via /api/community/files/...
      const isPdf = ext === '.pdf';
      let fileUrl = isPdf 
        ? `/raw-pdf/community/${req.file.filename}` 
        : `/api/community/files/${req.file.filename}`;

      // Upload to persistent Supabase Storage if configured
      const mimeType = MIME_MAP[ext] || 'application/octet-stream';
      const cloudUrl = await uploadFileToSupabaseStorage(req.file.filename, req.file.path, mimeType);
      if (cloudUrl) {
        fileUrl = cloudUrl;
      }

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

      // Automatically register uploaded PDFs in all_pdfs_inventory.json
      let registeredPdfDoc = null;
      if (isPdf) {
        registeredPdfDoc = registerUploadedPdfInInventory(fileMeta);
        if (registeredPdfDoc) {
          broadcastPdfRegistered(registeredPdfDoc);
        }
      }

      // Automatically generate community chat message
      const text = req.body.message || req.body.text || '';
      const rateKey = req.ip || 'upload-client';
      const chatResult = createMessage(text, fileMeta, rateKey);

      if (chatResult.error) {
        return res.status(400).json({ success: false, error: chatResult.error });
      }

      // Broadcast immediately to all connected clients
      broadcastMessage(chatResult.message);

      return res.status(201).json({
        success: true,
        message: chatResult.message,
        file: fileMeta,
        registeredPdf: registeredPdfDoc
      });
    } catch (processErr) {
      console.error('Error processing uploaded file:', processErr);
      return res.status(500).json({
        success: false,
        error: 'Failed to process uploaded file'
      });
    }
  });
}

export function getCommunityFile(req, res) {
  const { filename } = req.params;
  const isDownload = req.query.download === '1' || req.query.download === 'true';
  streamCommunityFile(filename, req, res, isDownload);
}

export function getAvailableFiles(req, res) {
  try {
    const q = req.query.q || '';
    const category = req.query.category || '';
    const files = getAvailableWebsiteFiles(q, category);
    res.json({
      success: true,
      files
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to query website files' });
  }
}

export function attachExistingFile(req, res) {
  try {
    const { name, url, relPath, size, sizeBytes, type, message: msgText } = req.body || {};
    if (!name || !url) {
      return res.status(400).json({ success: false, error: 'Existing file details are required.' });
    }

    const fileMeta = {
      name: sanitizeFilename(name),
      url,
      relPath: relPath || '',
      size: size || 'Available',
      sizeBytes: Number(sizeBytes) || 0,
      type: type || 'pdf',
      isExisting: true
    };

    const rateKey = req.ip || 'attach-client';
    const result = createMessage(msgText || '', fileMeta, rateKey);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    broadcastMessage(result.message);
    res.status(201).json({ success: true, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to attach existing file' });
  }
}
