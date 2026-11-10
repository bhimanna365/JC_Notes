import fs from 'fs';
import path from 'path';
import { contentRoot, inventoryPath, projectRoot } from '../utils/pathHelper.js';

let cachedInventory = null;
let lastInventoryMtime = 0;

export function invalidateInventoryCache() {
  cachedInventory = null;
  lastInventoryMtime = 0;
}

export function loadInventory() {
  if (fs.existsSync(inventoryPath)) {
    try {
      const stat = fs.statSync(inventoryPath);
      if (cachedInventory && stat.mtimeMs === lastInventoryMtime) {
        return cachedInventory;
      }
      const data = fs.readFileSync(inventoryPath, 'utf8');
      cachedInventory = JSON.parse(data);
      lastInventoryMtime = stat.mtimeMs;
      return cachedInventory;
    } catch (e) {
      console.error('Error reading inventory json:', e);
      if (cachedInventory) return cachedInventory;
    }
  }
  return [];
}

export function getAllPDFs() {
  return loadInventory();
}

export function getPDFById(id) {
  const all = getAllPDFs();
  const rawLower = String(id).trim().toLowerCase();
  const q = rawLower.replace(/^pdf-/, '');

  let found = all.find(p => 
    p.id.toLowerCase() === rawLower || 
    p.id.toLowerCase() === `pdf-${q}` || 
    p.id.toLowerCase().replace('pdf-content-', 'pdf-') === rawLower ||
    p.filename.toLowerCase() === q ||
    p.filename.toLowerCase() === rawLower
  );
  if (found) return found;

  // Key manual record aliases
  if (rawLower.includes('dsd') && rawLower.includes('record')) {
    return all.find(p => p.isManualRecord || p.filename.toLowerCase().includes('dsd record'));
  }
  if (rawLower.includes('ds') && rawLower.includes('record')) {
    return all.find(p => p.relPath.toLowerCase().includes('ds-lab') && p.filename.toLowerCase().includes('record'));
  }

  return undefined;
}

export function getPDFsBySubject(code) {
  const all = getAllPDFs();
  return all.filter(p => p.subjectCode && p.subjectCode.toLowerCase() === code.toLowerCase());
}

export function getLaboratoryPDFs(labType) {
  const all = getAllPDFs();
  if (labType) return all.filter(p => p.isLabResource && p.labType === labType);
  return all.filter(p => p.isLabResource);
}

export function getPYQPDFs(year) {
  const all = getAllPDFs();
  if (year) return all.filter(p => p.isPYQ && (p.category.includes(year) || p.folder.includes(year)));
  return all.filter(p => p.isPYQ);
}

export function getSyllabusPDFs() {
  const all = getAllPDFs();
  return all.filter(p => p.isSyllabus);
}

export function resolvePhysicalPdfPath(relPath) {
  if (!relPath) return null;

  // Direct candidate from projectRoot
  let candidate = path.resolve(projectRoot, relPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // Directly in contentRoot
  candidate = path.resolve(contentRoot, relPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // Laboratory rewrites
  const labMapped = relPath
    .replace(/^24CS36L-DS-Lab\//i, 'DS-Lab/')
    .replace(/^24CS320-DSD\/DSD-LAB\//i, 'DSD-Lab/')
    .replace(/^24CS310-OOP\/OOP-Lab\//i, 'OOP-Lab/');
  candidate = path.resolve(contentRoot, 'laboratory', labMapped);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // Syllabus rewrites
  const sylMapped = relPath.replace(/^01\.Syllabus-26\//i, '');
  candidate = path.resolve(contentRoot, 'syllabus', '2026', sylMapped);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // Filename fallback from inventory
  const filename = path.basename(relPath).toLowerCase();
  for (const p of getAllPDFs()) {
    if (p.filename.toLowerCase() === filename) {
      const pCandidate = path.resolve(projectRoot, p.relPath);
      if (fs.existsSync(pCandidate)) return pCandidate;
    }
  }

  return null;
}
