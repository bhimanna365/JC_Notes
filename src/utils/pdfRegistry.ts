import { PDFDocument } from '../types';
import { PDF_DOCUMENTS } from '../data/pdfManifest';

const LOCAL_STORAGE_KEY = 'jc_community_uploaded_pdfs';

// In-memory list of all PDFs, initialized with compile-time PDF_DOCUMENTS
let dynamicPdfList: PDFDocument[] = [...PDF_DOCUMENTS];
let listeners: Array<() => void> = [];

/**
 * Normalizes any incoming PDF object (from API, Socket.IO, or localStorage) into a strictly-typed PDFDocument
 */
export function normalizePdfDocument(item: any): PDFDocument | null {
  if (!item) return null;
  const filename = item.filename || item.name;
  if (!filename || typeof filename !== 'string') return null;

  const storedName = item.storedFilename || filename;
  const relPath = (item.relPath || `community/${storedName}`).replace(/\\/g, '/');
  const safeStoredBasename = (item.storedFilename || filename).replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const id = item.id || `pdf-content-community-${safeStoredBasename}`;

  const cleanTitle = item.title || filename.replace(/\.pdf$/i, '').replace(/[_\-\.]/g, ' ').trim();
  const isCommunity = Boolean(item.isCommunityUpload || item.folder === 'community' || relPath.startsWith('community/'));

  // Ensure robust keywords array for searchEngine
  let keywords: string[] = [];
  if (Array.isArray(item.keywords)) {
    keywords = [...item.keywords];
  } else {
    keywords = [
      cleanTitle,
      filename,
      filename.replace(/\.pdf$/i, ''),
      item.subjectName || '',
      item.subjectCode || '',
      'Community Upload',
      'Notes'
    ].filter(Boolean);
  }

  return {
    id,
    filename,
    title: cleanTitle,
    relPath,
    url: item.url || `/raw-pdf/${encodeURIComponent(relPath)}`,
    folder: item.folder || (isCommunity ? 'community' : 'notes'),
    subfolder: item.subfolder || '',
    unit: item.unit || (isCommunity ? 'Community Shared Material' : 'General'),
    category: item.category || (isCommunity ? 'Community Uploads' : 'Study Material'),
    subjectCode: item.subjectCode || (isCommunity ? 'COMMUNITY' : null),
    subjectName: item.subjectName || (isCommunity ? 'Student Community Notes' : undefined),
    sizeBytes: Number(item.sizeBytes) || 0,
    sizeFormatted: item.sizeFormatted || item.size || 'PDF Document',
    lastModified: item.lastModified || new Date().toISOString().split('T')[0],
    isManualRecord: Boolean(item.isManualRecord),
    isLabResource: Boolean(item.isLabResource),
    labType: item.labType || null,
    isSyllabus: Boolean(item.isSyllabus),
    isPYQ: Boolean(item.isPYQ),
    isCommunityUpload: isCommunity,
    keywords,
    relatedNoteId: item.relatedNoteId
  };
}

/**
 * Load cached community uploads from browser localStorage
 */
function loadLocalUploadedPdfs(): PDFDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizePdfDocument).filter((d): d is PDFDocument => d !== null);
    }
  } catch (err) {
    console.warn('Failed to read cached community PDFs:', err);
  }
  return [];
}

/**
 * Persist community uploaded PDFs in browser localStorage for offline & instant reload access
 */
function saveLocalUploadedPdfs(list: PDFDocument[]) {
  if (typeof window === 'undefined') return;
  try {
    const communityOnly = list.filter(p => p.isCommunityUpload || p.folder === 'community' || p.relPath.startsWith('community/'));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(communityOnly));
  } catch (err) {
    console.warn('Failed to save cached community PDFs:', err);
  }
}

// Pre-fill in-memory registry with cached items on initial module evaluation
const initialCached = loadLocalUploadedPdfs();
for (const cached of initialCached) {
  if (!dynamicPdfList.some(p => p.id === cached.id || p.relPath.toLowerCase() === cached.relPath.toLowerCase())) {
    dynamicPdfList.unshift(cached);
  }
}

function notifyListeners() {
  listeners.forEach(fn => {
    try { fn(); } catch (e) { console.error('Error in PDF registry listener:', e); }
  });
}

/**
 * Returns all available PDF documents across the entire JC Notes ecosystem (static manifest + dynamic uploads)
 */
export function getAllPdfDocuments(): PDFDocument[] {
  return dynamicPdfList;
}

/**
 * Finds a PDF document in the dynamic registry by ID, filename, or relative path
 */
export function getPdfByIdFromRegistry(idOrName: string): PDFDocument | undefined {
  if (!idOrName) return undefined;
  const q = String(idOrName).trim().toLowerCase();
  const qClean = q.replace(/^pdf-/, '');

  return dynamicPdfList.find(p => 
    p.id.toLowerCase() === q ||
    p.id.toLowerCase() === `pdf-${qClean}` ||
    p.filename.toLowerCase() === q ||
    p.filename.toLowerCase() === qClean ||
    p.relPath.toLowerCase() === q ||
    p.relPath.toLowerCase().endsWith('/' + q)
  );
}

/**
 * Dynamically registers an uploaded PDF into the global in-memory registry & localStorage cache
 */
export function registerUploadedPdf(rawDoc: any): PDFDocument | null {
  const doc = normalizePdfDocument(rawDoc);
  if (!doc) return null;

  const existingIdx = dynamicPdfList.findIndex(p => 
    p.id === doc.id || 
    p.relPath.toLowerCase() === doc.relPath.toLowerCase() ||
    (p.filename.toLowerCase() === doc.filename.toLowerCase() && p.isCommunityUpload)
  );

  if (existingIdx !== -1) {
    // Preserve keywords and update metadata
    const existing = dynamicPdfList[existingIdx];
    const mergedKeywords = Array.from(new Set([...(existing.keywords || []), ...(doc.keywords || [])]));
    dynamicPdfList[existingIdx] = { ...existing, ...doc, keywords: mergedKeywords };
  } else {
    // Insert at front of registry for immediate discovery
    dynamicPdfList.unshift(doc);
  }

  saveLocalUploadedPdfs(dynamicPdfList);
  notifyListeners();
  return doc;
}

function getApiBaseUrl(): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  if (metaEnv && (metaEnv.VITE_API_URL || metaEnv.VITE_PDF_BASE_URL)) {
    return String(metaEnv.VITE_API_URL || metaEnv.VITE_PDF_BASE_URL).replace(/\/+$/, '');
  }
  return '';
}

/**
 * Synchronizes the PDF registry with the server's all_pdfs_inventory.json
 * Guarantees that freshly uploaded files from other users or past sessions are retrieved in real-time
 */
let isSyncing = false;
export async function syncPdfInventory(): Promise<PDFDocument[]> {
  if (isSyncing) return dynamicPdfList;
  isSyncing = true;

  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/api/pdf/inventory`);
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.pdfs && Array.isArray(data.pdfs) ? data.pdfs : []);
      
      let hasNew = false;
      for (const item of list) {
        if (!item || !item.filename) continue;
        const norm = normalizePdfDocument(item);
        if (!norm) continue;

        const existsIdx = dynamicPdfList.findIndex(p => 
          p.id === norm.id || 
          p.relPath.toLowerCase() === norm.relPath.toLowerCase()
        );

        if (existsIdx === -1) {
          dynamicPdfList.unshift(norm);
          hasNew = true;
        } else if (norm.keywords && norm.keywords.length > 0) {
          // Merge fresher keywords from server inventory if available
          const existing = dynamicPdfList[existsIdx];
          const combined = Array.from(new Set([...(existing.keywords || []), ...norm.keywords]));
          if (combined.length !== (existing.keywords?.length || 0)) {
            dynamicPdfList[existsIdx].keywords = combined;
            hasNew = true;
          }
        }
      }

      if (hasNew) {
        saveLocalUploadedPdfs(dynamicPdfList);
        notifyListeners();
      }
    }
  } catch (err) {
    // Non-blocking background sync error
    console.debug('PDF inventory sync background note:', err);
  } finally {
    isSyncing = false;
  }

  return dynamicPdfList;
}

/**
 * Subscribe to real-time additions or updates in the PDF registry
 */
export function subscribeToPdfRegistry(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}
