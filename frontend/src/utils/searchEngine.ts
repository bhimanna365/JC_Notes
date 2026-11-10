import { COURSES } from '../data/coursesData';
import { NOTES } from '../data/notesData';
import { LAB_PROGRAMS } from '../data/labsData';
import { LABORATORY_COURSES } from '../data/laboratoryData';
import { QUESTION_PAPERS } from '../data/pyqData';
import { getAllPdfDocuments } from './pdfRegistry';
import { SearchResult } from '../types';

export function searchAll(query: string, filterType: string = 'all'): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: { item: SearchResult; score: number }[] = [];

  // 1. Search Courses & Subjects
  if (filterType === 'all' || filterType === 'subjects' || filterType === 'syllabus') {
    for (const c of COURSES) {
      let score = 0;
      if (c.code.toLowerCase() === q) score += 100;
      else if (c.code.toLowerCase().includes(q)) score += 50;

      if (c.title.toLowerCase().includes(q)) score += 40;
      if (c.shortName.toLowerCase().includes(q)) score += 30;

      // Search units and topics
      const matchingTopic = c.units.flatMap(u => u.topics).find(t => t.toLowerCase().includes(q));
      if (matchingTopic) score += 25;

      const matchingUnit = c.units.find(u => u.title.toLowerCase().includes(q) || u.description.toLowerCase().includes(q));
      if (matchingUnit) score += 20;

      if (score > 0) {
        results.push({
          score,
          item: {
            id: `course-${c.code}`,
            title: `${c.code}: ${c.title}`,
            subtitle: `${c.categoryLabel} • ${c.credits} Credits • Semester ${c.semester}`,
            type: 'subject',
            route: `subject/${c.code}`,
            snippet: matchingTopic
              ? `Topic match: "${matchingTopic}"`
              : matchingUnit
              ? `Unit ${matchingUnit.unitNumber}: ${matchingUnit.title}`
              : `Semester ${c.semester} course in ${c.categoryLabel}. Includes ${c.units.length} syllabus units and textbook references.`,
            badge: c.category
          }
        });
      }
    }
  }

  // 2. Search Notes
  if (filterType === 'all' || filterType === 'notes') {
    for (const n of NOTES) {
      let score = 0;
      if (n.title.toLowerCase().includes(q)) score += 60;
      if (n.subjectCode.toLowerCase().includes(q)) score += 30;
      if (n.tags.some(t => t.toLowerCase().includes(q))) score += 35;

      const contentLower = n.content.toLowerCase();
      const contentIdx = contentLower.indexOf(q);
      if (contentIdx !== -1) score += 15;

      if (score > 0) {
        let snippet = '';
        if (contentIdx !== -1) {
          const start = Math.max(0, contentIdx - 40);
          const end = Math.min(n.content.length, contentIdx + q.length + 60);
          snippet = '...' + n.content.substring(start, end).replace(/[#*`_]/g, '') + '...';
        } else {
          snippet = `Unit ${n.unitNumber} study note for ${n.subjectName}. Tags: ${n.tags.join(', ')}`;
        }

        results.push({
          score,
          item: {
            id: `note-${n.id}`,
            title: n.title,
            subtitle: `${n.subjectCode} • Unit ${n.unitNumber} • ${n.readTime}`,
            type: 'note',
            route: `note/${n.id}`,
            snippet,
            badge: 'Note'
          }
        });
      }
    }
  }

  // 3. Search Laboratory Hubs, Master Records & Programs
  if (filterType === 'all' || filterType === 'labs') {
    for (const lab of LABORATORY_COURSES) {
      let labScore = 0;
      if (lab.code.toLowerCase().includes(q)) labScore += 70;
      if (lab.shortName.toLowerCase().includes(q)) labScore += 60;
      if (lab.title.toLowerCase().includes(q)) labScore += 50;

      if (labScore > 0) {
        results.push({
          score: labScore,
          item: {
            id: `lab-hub-${lab.id}`,
            title: `${lab.shortName} (${lab.code}): ${lab.title}`,
            subtitle: `${lab.type} • ${lab.credits} • ${lab.recordsAndManuals.length} Records/Manuals`,
            type: 'lab',
            route: `laboratory/${lab.id}`,
            snippet: lab.description,
            badge: 'Laboratory'
          }
        });
      }

      // Search Lab Master Records
      for (const rec of lab.recordsAndManuals) {
        let recScore = 0;
        if (rec.title.toLowerCase().includes(q)) recScore += 80;
        if (rec.filename.toLowerCase().includes(q)) recScore += 70;
        if ((q.includes('record') || q.includes('manual')) && rec.filename.toLowerCase().includes('record')) recScore += 65;

        if (recScore > 0) {
          results.push({
            score: recScore,
            item: {
              id: `lab-rec-${rec.id}`,
              title: rec.title,
              subtitle: `${lab.shortName} • ${rec.sizeFormatted} • ${rec.badge}`,
              type: 'lab',
              route: `laboratory/${lab.id}`,
              snippet: rec.description,
              badge: 'Master Record'
            }
          });
        }
      }
    }

    for (const l of LAB_PROGRAMS) {
      let score = 0;
      if (l.number.toLowerCase().includes(q)) score += 70;
      if (l.title.toLowerCase().includes(q)) score += 60;
      if (l.subjectCode.toLowerCase().includes(q)) score += 30;
      if (l.question.toLowerCase().includes(q)) score += 25;
      if (l.concept.toLowerCase().includes(q)) score += 20;

      if (score > 0) {
        results.push({
          score,
          item: {
            id: `lab-${l.id}`,
            title: `${l.number}: ${l.title}`,
            subtitle: `${l.subjectCode} • ${l.language.toUpperCase()} • Time Complexity: ${l.complexity.time}`,
            type: 'lab',
            route: `lab/${l.id}`,
            snippet: l.question.length > 130 ? l.question.substring(0, 130) + '...' : l.question,
            badge: l.language.toUpperCase()
          }
        });
      }
    }
  }

  // 4. Search Question Papers (PYQ)
  if (filterType === 'all' || filterType === 'pyq') {
    for (const qp of QUESTION_PAPERS) {
      let score = 0;
      if (qp.subjectCode.toLowerCase().includes(q)) score += 40;
      if (qp.subjectName.toLowerCase().includes(q)) score += 40;
      if (qp.examType.toLowerCase().includes(q)) score += 50;
      if (qp.year.includes(q)) score += 30;

      const matchingQuestion = qp.questionsSummary.find(item => item.toLowerCase().includes(q));
      if (matchingQuestion) score += 35;

      if (score > 0) {
        results.push({
          score,
          item: {
            id: `pyq-${qp.id}`,
            title: `${qp.subjectCode} - ${qp.examType} Exam (${qp.year})`,
            subtitle: `${qp.subjectName} • ${qp.duration} • Max Marks: ${qp.marks}`,
            type: 'pyq',
            route: `pyq/${qp.id}`,
            snippet: matchingQuestion
              ? `Question: "${matchingQuestion}"`
              : `Past year exam paper with ${qp.questionsSummary.length} analyzed questions. ${qp.hasSolutions ? 'Includes model solutions.' : ''}`,
            badge: qp.examType
          }
        });
      }
    }
  }

  // 5. Search Original PDF Documents & Community Uploads
  if (filterType === 'all' || filterType === 'pdf') {
    const allPdfs = getAllPdfDocuments();
    for (const pdf of allPdfs) {
      let score = 0;
      const fnLower = pdf.filename.toLowerCase();
      const fnClean = fnLower.replace(/\.pdf$/i, '').replace(/[_\-\.]/g, ' ').trim();
      const titleLower = (pdf.title || '').toLowerCase();
      const titleClean = titleLower.replace(/[_\-\.]/g, ' ').trim();
      const qClean = q.replace(/[_\-\.]/g, ' ').trim();
      const qWords = qClean.split(/\s+/).filter(Boolean);

      // Exact filename / title match
      if (fnLower === q) score += 120;
      else if (titleLower === q) score += 115;
      else if (fnLower.includes(q)) score += 85;
      else if (titleLower.includes(q)) score += 80;
      else if (fnClean.includes(qClean)) score += 75;
      else if (titleClean.includes(qClean)) score += 70;

      // Multi-word search (e.g. "dsa complete notes", "dsa notes", "complete notes")
      if (qWords.length > 1 && qWords.every(w => fnClean.includes(w) || titleClean.includes(w) || (pdf.keywords && pdf.keywords.some((k: string) => k.toLowerCase().includes(w))))) {
        score += 65;
      }

      // Keywords match (indexed keywords like DSA, Data Structures, etc.)
      if (pdf.keywords && Array.isArray(pdf.keywords)) {
        for (const kw of pdf.keywords) {
          const kwLower = kw.toLowerCase();
          const kwClean = kwLower.replace(/[_\-\.]/g, ' ').trim();
          if (kwLower === q || kwClean === qClean) {
            score += 65;
            break;
          } else if (kwLower.includes(q) || kwClean.includes(qClean) || (qWords.length > 1 && qWords.every(w => kwLower.includes(w)))) {
            score += 50;
            break;
          }
        }
      }

      // Academic and subject fields
      if (pdf.subjectCode && (pdf.subjectCode.toLowerCase() === q || pdf.subjectCode.toLowerCase().includes(q))) score += 55;
      if (pdf.subjectName && pdf.subjectName.toLowerCase().includes(q)) score += 45;
      if (pdf.unit && pdf.unit.toLowerCase().includes(q)) score += 40;
      if (pdf.folder && pdf.folder.toLowerCase().includes(q)) score += 35;
      if (pdf.category && pdf.category.toLowerCase().includes(q)) score += 35;
      if (pdf.relPath && pdf.relPath.toLowerCase().includes(q)) score += 25;
      if (pdf.isManualRecord && (q.includes('manual') || q.includes('record') || q.includes('dsd'))) score += 50;

      if (score > 0) {
        const isCommunity = Boolean(pdf.isCommunityUpload || pdf.folder === 'community' || pdf.relPath.startsWith('community/'));
        const subjectLabel = isCommunity 
          ? (pdf.subjectName ? `${pdf.subjectName} (Community)` : 'Community Shared') 
          : (pdf.subjectName || pdf.category || pdf.folder);
        const unitLabel = isCommunity ? (pdf.category || 'Community Upload') : (pdf.unit || 'General');
        
        // Display title: clean formatted title
        const displayTitle = pdf.title || pdf.filename.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');

        results.push({
          score,
          item: {
            id: `pdf-${pdf.id}`,
            title: displayTitle,
            subtitle: `${subjectLabel} → ${unitLabel} • ${pdf.sizeFormatted}`,
            type: 'pdf',
            route: `pdf/${pdf.id}`,
            snippet: isCommunity
              ? `Community study material: ${pdf.filename} (${pdf.sizeFormatted}). Categorized under ${pdf.subjectName || 'Community Uploads'}.`
              : `Hierarchical path: ${subjectLabel} → ${unitLabel} → ${pdf.filename} (${pdf.sizeFormatted})`,
            badge: isCommunity ? 'Community' : (pdf.isManualRecord ? 'Record' : 'PDF')
          }
        });
      }
    }
  }

  // Sort descending by relevance score
  results.sort((a, b) => b.score - a.score);
  return results.map(r => r.item);
}
