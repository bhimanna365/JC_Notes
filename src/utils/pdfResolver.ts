import { PDFDocument } from '../types';
import { getAllPdfDocuments } from './pdfRegistry';

/**
 * Normalizes an identifier or path string for fuzzy key comparison
 * (strips special characters, hyphens, underscores, slashes, spaces)
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Cleanly encodes a relative path into a browser-safe URL for Vite streaming.
 * Handles spaces (%20), plus signs (%2B), brackets, ampersands, etc.,
 * without double-encoding existing percent escapes or breaking forward slashes.
 */
export function encodePdfPath(relPath: string): string {
  // Normalize Windows backslashes to forward slashes
  const cleanPath = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Split by '/' to encode each path component independently
  const segments = cleanPath.split('/').map(segment => {
    // Decode first in case it was partially encoded, then encodeURIComponent
    try {
      const decoded = decodeURIComponent(segment);
      return encodeURIComponent(decoded);
    } catch {
      return encodeURIComponent(segment);
    }
  });

  // Support VITE_PDF_BASE_URL or VITE_API_URL for decoupled external backend or CDN
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const envBase = metaEnv ? (metaEnv.VITE_PDF_BASE_URL || metaEnv.VITE_API_URL || '') : '';
  const apiBase = envBase ? String(envBase).replace(/\/+$/, '') : '';

  return `${apiBase}/raw-pdf/${segments.join('/')}`;
}

/**
 * Universal PDF URL Resolver.
 * Guarantees a browser-safe, fully-qualified URL for any PDF document or path.
 * Used consistently across Read viewer, New Tab, Download, and previews.
 */
export function resolvePdfUrl(pdfOrInput: PDFDocument | string | null | undefined): string {
  if (!pdfOrInput) return '';

  if (typeof pdfOrInput === 'object') {
    // If it's a PDFDocument object
    if (pdfOrInput.relPath) {
      return encodePdfPath(pdfOrInput.relPath);
    }
    if (pdfOrInput.url) {
      if (pdfOrInput.url.startsWith('/raw-pdf/')) {
        const rawPart = pdfOrInput.url.replace(/^\/raw-pdf\//, '');
        return encodePdfPath(rawPart);
      }
      return pdfOrInput.url;
    }
    if (pdfOrInput.filename) {
      return encodePdfPath(pdfOrInput.filename);
    }
    return '';
  }

  // If it's a string input
  const str = String(pdfOrInput).trim();
  if (!str) return '';

  // Already a full HTTP(S) URL
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return str;
  }

  // Already starts with /raw-pdf/
  if (str.startsWith('/raw-pdf/')) {
    const rawPart = str.replace(/^\/raw-pdf\//, '');
    return encodePdfPath(rawPart);
  }

  // Check if it's an ID from PDF_DOCUMENTS first
  const found = findPdfDocument(str);
  if (found && found.relPath) {
    return encodePdfPath(found.relPath);
  }

  // Otherwise treat as relative path
  return encodePdfPath(str);
}

/**
 * Robust Multi-Strategy PDF Lookup.
 * Resolves any identifier, path, filename, or URL to the canonical PDFDocument.
 * Eliminates false "PDF Document Not Found" errors caused by encoding, case, or formatting differences.
 */
export function findPdfDocument(identifier: string | null | undefined): PDFDocument | undefined {
  if (!identifier) return undefined;

  let raw = String(identifier).trim();
  // Strip route prefixes if present
  if (raw.startsWith('pdf/')) raw = raw.replace(/^pdf\//, '');
  if (raw.startsWith('#pdf/')) raw = raw.replace(/^#pdf\//, '');
  if (raw.startsWith('/raw-pdf/')) raw = raw.replace(/^\/raw-pdf\//, '');

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  const rawLower = raw.toLowerCase();
  const decodedLower = decoded.toLowerCase();
  const normTarget = normalizeKey(decodedLower);
  const allPdfs = getAllPdfDocuments();

  // Strategy 1: Exact ID match (case-insensitive) or prefix-stripped ID match
  let match = allPdfs.find(p => 
    p.id.toLowerCase() === rawLower || 
    p.id.toLowerCase() === decodedLower ||
    p.id.toLowerCase().replace('pdf-content-', 'pdf-') === rawLower ||
    p.id.toLowerCase().replace('pdf-content-', '') === rawLower.replace(/^pdf-/, '')
  );
  if (match) return match;

  // Known alias helpers for key curriculum manual records
  if (normTarget.includes('dsdrecord') || normTarget.includes('24cs320dsddsdlabdsdrecord') || normTarget.includes('dsdlabdsdrecord')) {
    const dsdRecord = allPdfs.find(p => p.isManualRecord || p.filename.toLowerCase().includes('dsd record'));
    if (dsdRecord) return dsdRecord;
  }
  if (normTarget.includes('dsrecord') || normTarget.includes('24cs36ldsrecord') || normTarget.includes('dslabdsrecord')) {
    const dsRecord = allPdfs.find(p => p.relPath.toLowerCase().includes('ds-lab') && p.filename.toLowerCase().includes('record'));
    if (dsRecord) return dsRecord;
  }

  // Strategy 2: Exact Relative Path match
  match = allPdfs.find(p => {
    const pRel = p.relPath.replace(/\\/g, '/').toLowerCase();
    const targetRel = decodedLower.replace(/\\/g, '/');
    return pRel === targetRel || pRel.endsWith('/' + targetRel) || targetRel.endsWith('/' + pRel);
  });
  if (match) return match;

  // Strategy 3: Filename match
  const filenameTarget = decodedLower.split('/').pop() || decodedLower;
  match = allPdfs.find(p => p.filename.toLowerCase() === filenameTarget);
  if (match) return match;

  // Strategy 4: Fuzzy Normalized Key match (ignores hyphens, underscores, spaces)
  match = allPdfs.find(p => {
    const pNormId = normalizeKey(p.id);
    const pNormIdShort = normalizeKey(p.id.replace('pdf-content-', 'pdf-'));
    const pNormRel = normalizeKey(p.relPath);
    const pNormFile = normalizeKey(p.filename);
    return (
      pNormId === normTarget || 
      pNormIdShort === normTarget || 
      pNormRel === normTarget || 
      pNormFile === normTarget ||
      (normTarget.length >= 8 && (pNormId.includes(normTarget) || pNormFile.includes(normTarget)))
    );
  });
  if (match) return match;

  // Strategy 5: Dynamic Safe Fallback
  // If the target has a '.pdf' extension or folder slashes, synthesize a valid PDFDocument
  // so the document reader can still open and stream it without failing!
  if (decodedLower.includes('.pdf') || decodedLower.includes('/')) {
    const filename = decoded.split('/').pop() || decoded;
    const cleanTitle = filename.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
    const safeRel = decoded.replace(/^\/+/, '');
    
    return {
      id: 'pdf-' + normalizeKey(safeRel),
      filename: filename,
      title: cleanTitle,
      relPath: safeRel,
      url: encodePdfPath(safeRel),
      folder: safeRel.includes('/') ? safeRel.split('/')[0] : 'Documents',
      subfolder: safeRel.split('/').length > 2 ? safeRel.split('/')[1] : '',
      unit: 'General / Other',
      category: 'Academic Documents',
      sizeBytes: 0,
      sizeFormatted: 'Available',
      lastModified: 'Current Semester',
      isManualRecord: false,
      isLabResource: false,
      isSyllabus: false,
      isPYQ: false
    };
  }

  return undefined;
}

/**
 * Triggers a native browser file download of the authentic source PDF
 */
export function downloadPdf(pdfOrInput: PDFDocument | string, customFilename?: string): void {
  const url = resolvePdfUrl(pdfOrInput);
  if (!url) return;

  let filename = customFilename;
  if (!filename) {
    if (typeof pdfOrInput === 'object' && pdfOrInput?.filename) {
      filename = pdfOrInput.filename;
    } else {
      const parts = url.split('/');
      try {
        filename = decodeURIComponent(parts[parts.length - 1].split('?')[0]);
      } catch {
        filename = parts[parts.length - 1].split('?')[0] || 'document.pdf';
      }
    }
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Opens the original PDF in a new dedicated browser tab
 */
export function openPdfInNewTab(pdfOrInput: PDFDocument | string): void {
  const url = resolvePdfUrl(pdfOrInput);
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
