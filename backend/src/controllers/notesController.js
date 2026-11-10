import * as contentService from '../services/contentService.js';

export function getAllNotes(req, res) {
  const notes = contentService.getAllPDFs();
  res.json({ success: true, count: notes.length, data: notes });
}

export function getNoteById(req, res) {
  const { id } = req.params;
  const doc = contentService.getPDFById(id);
  if (!doc) {
    return res.status(404).json({ success: false, error: 'Document not found' });
  }
  res.json({ success: true, data: doc });
}

export function getLaboratory(req, res) {
  const { type } = req.query;
  const docs = contentService.getLaboratoryPDFs(type);
  res.json({ success: true, count: docs.length, data: docs });
}

export function getSyllabus(req, res) {
  const docs = contentService.getSyllabusPDFs();
  res.json({ success: true, count: docs.length, data: docs });
}

export function getPYQ(req, res) {
  const { year } = req.query;
  const docs = contentService.getPYQPDFs(year);
  res.json({ success: true, count: docs.length, data: docs });
}
