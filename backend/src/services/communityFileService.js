import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project roots
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const contentRoot = path.resolve(projectRoot, 'content');
export const communityDir = path.resolve(contentRoot, 'community');
const inventoryPath = path.resolve(projectRoot, 'all_pdfs_inventory.json');

// Ensure community storage directory exists within content
if (!fs.existsSync(communityDir)) {
  fs.mkdirSync(communityDir, { recursive: true });
}

// 50 MB file limit
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file extensions and corresponding MIME types
export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.txt',
  '.rtf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif'
];

export const MIME_MAP = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.rtf': 'application/rtf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
};

export function getFileCategory(ext) {
  const e = ext.toLowerCase();
  if (e === '.pdf') return 'pdf';
  if (e === '.doc' || e === '.docx' || e === '.rtf') return 'document';
  if (e === '.ppt' || e === '.pptx') return 'presentation';
  if (e === '.txt') return 'text';
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(e)) return 'image';
  return 'file';
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Sanitize client-supplied filename (protects against path traversal, control chars)
export function sanitizeFilename(originalName) {
  if (typeof originalName !== 'string') return 'document.pdf';
  
  // Strip null bytes, slashes, backslashes, path traversal sequences
  const base = path.basename(originalName).replace(/\0/g, '').replace(/[\/\\]/g, '');
  const clean = base.replace(/[^a-zA-Z0-9._\-\s()]/g, '_').trim();
  
  if (!clean || clean === '.' || clean === '..') {
    return 'uploaded_document' + (path.extname(originalName) || '.pdf');
  }
  return clean;
}

// Upload file to persistent Supabase Storage bucket (community-files) if configured
export async function uploadFileToSupabaseStorage(storedFilename, localFilePath, mimeType) {
  const supabaseUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/+$/, '') : '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    if (!fs.existsSync(localFilePath)) return null;
    const fileBuffer = fs.readFileSync(localFilePath);
    const endpoint = `${supabaseUrl}/storage/v1/object/community-files/${encodeURIComponent(storedFilename)}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': mimeType || 'application/octet-stream',
        'x-upsert': 'true'
      },
      body: fileBuffer
    });
    if (res.ok) {
      return `${supabaseUrl}/storage/v1/object/public/community-files/${encodeURIComponent(storedFilename)}`;
    }
  } catch (err) {
    console.warn('Failed to upload file to Supabase Storage:', err.message);
  }
  return null;
}

// Storage configuration with diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(communityDir)) {
      fs.mkdirSync(communityDir, { recursive: true });
    }
    cb(null, communityDir);
  },
  filename: (req, file, cb) => {
    const cleanOriginal = sanitizeFilename(file.originalname);
    const ext = path.extname(cleanOriginal).toLowerCase();
    const nameWithoutExt = path.basename(cleanOriginal, ext).substring(0, 60);
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const safeStoredName = `${nameWithoutExt}_${uniqueSuffix}${ext}`;
    cb(null, safeStoredName);
  }
});

// Multer upload instance
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const clean = sanitizeFilename(file.originalname);
    const ext = path.extname(clean).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`Unsupported file type '${ext}'. Allowed types: PDF, DOC, DOCX, PPT, PPTX, TXT, Images.`));
    }
    cb(null, true);
  }
});

// Acronym preservation set for academic course titles
const ACRONYMS = new Set(['DSA', 'OOP', 'DSD', 'CO', 'DMS', 'UHV', 'PYQ', 'CIE', 'SEE', 'PDF', 'II', 'III', 'IV', 'ML', 'AI', 'OS', 'DBMS', 'CN']);

function formatTitle(name) {
  const withoutExt = name.replace(/\.pdf$/i, '');
  const clean = withoutExt.replace(/_\d{10,}_[a-z0-9]+/i, '').replace(/[_\-\.]/g, ' ').trim();
  return clean.split(/\s+/).map(w => {
    const u = w.toUpperCase();
    return ACRONYMS.has(u) ? u : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function detectSubjectFromFilename(filename) {
  const lower = filename.toLowerCase();
  if (['dsa', 'data structure', 'tree', 'graph', 'stack', 'queue', 'linked', 'algo', '24cs330'].some(k => lower.includes(k))) {
    return {
      code: '24CS330',
      name: 'Data Structures',
      category: 'Data Structures',
      relatedNoteId: 'note-ds-stacks',
      extraKeywords: ['DSA', 'Data Structures', 'Data Structures and Algorithms', 'DSA Complete Notes']
    };
  }
  if (['dsd', 'digital', 'kmap', 'boolean', 'verilog', '24cs320'].some(k => lower.includes(k))) {
    return {
      code: '24CS320',
      name: 'Digital System Design',
      category: 'Digital System Design',
      relatedNoteId: 'note-dsd-kmaps',
      extraKeywords: ['DSD', 'Digital System Design', 'Digital Design']
    };
  }
  if (['oop', 'c++', 'cpp', 'object oriented', 'inheritance', '24cs310'].some(k => lower.includes(k))) {
    return {
      code: '24CS310',
      name: 'Object Oriented Programming using C++',
      category: 'OOP with C++',
      relatedNoteId: 'note-dma-cpp',
      extraKeywords: ['OOP', 'Object Oriented Programming', 'C++']
    };
  }
  if (['co', 'computer organization', 'architecture', 'pipelining', '24cs340'].some(k => lower.includes(k))) {
    return {
      code: '24CS340',
      name: 'Computer Organization',
      category: 'Computer Organization',
      relatedNoteId: 'note-co-memory',
      extraKeywords: ['CO', 'Computer Organization', 'Computer Architecture']
    };
  }
  if (['dms', 'discrete', 'relation', 'set theory', 'logic', '24cs350'].some(k => lower.includes(k))) {
    return {
      code: '24CS350',
      name: 'Discrete Mathematical Structures',
      category: 'Discrete Mathematics',
      relatedNoteId: 'note-dms-logic',
      extraKeywords: ['DMS', 'Discrete Mathematics', 'Discrete Mathematical Structures']
    };
  }
  if (['math', 'm3', 'fourier', 'laplace', '24ma313'].some(k => lower.includes(k))) {
    return {
      code: '24MA313',
      name: 'Engineering Mathematics - III',
      category: 'Mathematics III',
      relatedNoteId: 'note-m3-curve',
      extraKeywords: ['Math 3', 'Engineering Mathematics', 'M3']
    };
  }
  if (['uhv', 'human values', 'harmony', '24hu311'].some(k => lower.includes(k))) {
    return {
      code: '24HU311',
      name: 'Universal Human Values - II',
      category: 'Universal Human Values',
      relatedNoteId: 'note-uhv-harmony',
      extraKeywords: ['UHV', 'Universal Human Values', 'Human Values']
    };
  }
  return {
    code: 'COMMUNITY',
    name: 'Student Community Notes',
    category: 'Community Uploads',
    relatedNoteId: undefined,
    extraKeywords: ['Community Upload', 'Student Notes']
  };
}

import { execFile } from 'child_process';

// Automatically register uploaded PDF in all_pdfs_inventory.json and update index
export function registerUploadedPdfInInventory(fileMeta) {
  if (!fileMeta.extension || fileMeta.extension.toLowerCase() !== '.pdf') return null;

  try {
    if (!fs.existsSync(inventoryPath)) return null;
    const raw = fs.readFileSync(inventoryPath, 'utf8');
    const inventory = JSON.parse(raw);

    const safeStoredBasename = fileMeta.storedFilename.replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const docId = `pdf-content-community-${safeStoredBasename}`;
    
    // Check if already registered
    const existing = inventory.find(item => item.id === docId || item.filename === fileMeta.storedFilename);
    if (existing) return existing;

    const subjectData = detectSubjectFromFilename(fileMeta.name);
    const cleanTitle = formatTitle(fileMeta.name);

    // Build comprehensive search keywords
    const keywordsSet = new Set([
      cleanTitle,
      fileMeta.name,
      fileMeta.name.replace(/\.pdf$/i, ''),
      fileMeta.storedFilename,
      fileMeta.name.replace(/[_\-\.]/g, ' '),
      subjectData.name,
      subjectData.code,
      'Community Upload',
      'Community Shared',
      'Notes',
      ...(subjectData.extraKeywords || [])
    ]);

    const newInventoryEntry = {
      id: docId,
      filename: fileMeta.name,
      title: cleanTitle,
      relPath: fileMeta.relPath,
      url: `/raw-pdf/${encodeURIComponent(fileMeta.relPath)}`,
      folder: 'community',
      subfolder: '',
      unit: 'Community Shared Material',
      category: 'Community Uploads',
      subjectCode: subjectData.code,
      subjectName: subjectData.name,
      sizeBytes: fileMeta.sizeBytes,
      sizeFormatted: fileMeta.size,
      lastModified: new Date().toISOString().split('T')[0],
      isManualRecord: false,
      isLabResource: false,
      isSyllabus: false,
      isPYQ: false,
      isCommunityUpload: true,
      keywords: Array.from(keywordsSet)
    };

    if (subjectData.relatedNoteId) {
      newInventoryEntry.relatedNoteId = subjectData.relatedNoteId;
    }

    inventory.unshift(newInventoryEntry);
    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2), 'utf8');

    // Automatically trigger scripts/content-index/index_content.py asynchronously to keep pdfManifest.ts synced
    const indexScript = path.resolve(projectRoot, 'scripts', 'content-index', 'index_content.py');
    if (fs.existsSync(indexScript)) {
      execFile('python', [indexScript], { cwd: projectRoot }, (err) => {
        if (err) {
          console.warn('Note: Background index_content.py script notification:', err.message);
        }
      });
    }

    return newInventoryEntry;
  } catch (err) {
    console.error('Failed to register PDF in inventory:', err);
    return null;
  }
}

// Fetch all existing website files from all_pdfs_inventory.json for referencing
export function getAvailableWebsiteFiles(searchQuery = '', categoryFilter = '') {
  try {
    if (!fs.existsSync(inventoryPath)) return [];
    const data = fs.readFileSync(inventoryPath, 'utf8');
    const parsed = JSON.parse(data);

    let results = Array.isArray(parsed) ? parsed : [];

    if (categoryFilter && categoryFilter !== 'all') {
      const cat = categoryFilter.toLowerCase();
      results = results.filter(f => 
        (f.category && f.category.toLowerCase().includes(cat)) ||
        (f.folder && f.folder.toLowerCase().includes(cat)) ||
        (f.subjectCode && f.subjectCode.toLowerCase() === cat)
      );
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      results = results.filter(f => 
        (f.title && f.title.toLowerCase().includes(q)) ||
        (f.filename && f.filename.toLowerCase().includes(q)) ||
        (f.subjectCode && f.subjectCode.toLowerCase().includes(q)) ||
        (f.subjectName && f.subjectName.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q))
      );
    }

    return results.slice(0, 100).map(f => ({
      id: f.id,
      name: f.filename,
      title: f.title || f.filename,
      relPath: f.relPath,
      url: f.url || `/raw-pdf/${encodeURIComponent(f.relPath)}`,
      size: f.sizeFormatted || 'Available',
      sizeBytes: f.sizeBytes || 0,
      category: f.category || 'Study Material',
      subjectCode: f.subjectCode || '',
      subjectName: f.subjectName || '',
      isExisting: true
    }));
  } catch (err) {
    console.error('Failed to load available website files:', err);
    return [];
  }
}

// Stream or download a file stored in content/community
export function streamCommunityFile(filename, req, res, asDownload = false) {
  const safeFilename = path.basename(filename);
  const filePath = path.resolve(communityDir, safeFilename);

  // Security: Prevent path traversal
  if (!filePath.startsWith(communityDir)) {
    res.statusCode = 403;
    return res.end('Access denied');
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.statusCode = 404;
    return res.end('File not found');
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(safeFilename).toLowerCase();
  const mimeType = MIME_MAP[ext] || 'application/octet-stream';
  const disposition = asDownload ? 'attachment' : 'inline';

  // Support range requests
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = (end - start) + 1;

    res.statusCode = 206;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
    res.setHeader('Content-Length', chunksize);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `${disposition}; filename="${safeFilename}"`);
    res.setHeader('Accept-Ranges', 'bytes');
    return fs.createReadStream(filePath, { start, end }).pipe(res);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `${disposition}; filename="${safeFilename}"`);
  res.setHeader('Accept-Ranges', 'bytes');
  fs.createReadStream(filePath).pipe(res);
}
