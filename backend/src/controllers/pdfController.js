import fs from 'fs';
import path from 'path';
import * as contentService from '../services/contentService.js';
import { contentRoot } from '../utils/pathHelper.js';

export function streamPDF(req, res) {
  const { id } = req.params;
  const doc = contentService.getPDFById(id);
  
  if (!doc) {
    return res.status(404).json({ success: false, error: 'Document not found' });
  }

  const filePath = contentService.resolvePhysicalPdfPath(doc.relPath);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Physical PDF file not found' });
  }

  const stat = fs.statSync(filePath);
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
    res.setHeader('Content-Disposition', `inline; filename="${doc.filename}"`);
    res.setHeader('Accept-Ranges', 'bytes');

    fs.createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `inline; filename="${doc.filename}"`);
  res.setHeader('Accept-Ranges', 'bytes');

  fs.createReadStream(filePath).pipe(res);
}

export function getInventory(req, res) {
  try {
    const all = contentService.getAllPDFs();
    return res.json(all);
  } catch (err) {
    console.error('Failed to get PDF inventory:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
