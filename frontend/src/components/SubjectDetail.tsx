import React, { useState } from 'react';
import { Course, PDFDocument } from '../types';
import { getNotesBySubject } from '../data/notesData';
import { getLabsBySubject } from '../data/labsData';
import { getPYQBySubject } from '../data/pyqData';
import { getPDFsBySubject } from '../data/pdfManifest';
import { 
  ArrowLeft, 
  BookOpen, 
  Code2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  BookMarked,
  Eye,
  Layers
} from 'lucide-react';
import { findPdfDocument } from '../utils/pdfResolver';

const COURSE_SYLLABUS_MAP: Record<string, string> = {
  '24CS310': 'oop-syllabus.pdf',
  '24CS320': 'DSD-syllabus.pdf',
  '24CS330': 'DS-syllabus.pdf',
  '24CS340': 'CO-syllabus.pdf',
  '24CS350': 'DMS-syllabus.pdf',
  '24CS36L': 'DS-lab.pdf',
  '24HU311': 'UHV-syllabus.pdf',
  '24MA313': 'math-3-syllabus.pdf',
};

interface SubjectDetailProps {
  course: Course;
  onBack: () => void;
  onOpenNote: (noteId: string) => void;
  onOpenLab: (labId: string) => void;
  onOpenPYQ: (pyqId: string) => void;
  onOpenPDF?: (pdf: PDFDocument) => void;
  onOpenPDFs?: (subjectCode: string) => void;
  completedUnits: string[];
  onToggleUnitCompletion: (unitKey: string) => void;
}

export const SubjectDetail: React.FC<SubjectDetailProps> = ({
  course,
  onBack,
  onOpenNote,
  onOpenLab,
  onOpenPYQ,
  onOpenPDF,
  onOpenPDFs,
  completedUnits,
  onToggleUnitCompletion
}) => {
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);

  const subjectNotes = getNotesBySubject(course.code);
  const subjectLabs = getLabsBySubject(course.code);
  const subjectPYQs = getPYQBySubject(course.code);
  const subjectPDFs = getPDFsBySubject(course.code);

  const isUnitCompleted = (uNum: number) => completedUnits.includes(`${course.code}-u${uNum}`);

  return (
    <div className="container" id="subject-detail-header" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Back button & Breadcrumb */}
      <button 
        className="btn btn-secondary btn-sm"
        onClick={onBack}
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={14} />
        Back to Subjects
      </button>

      {/* Main Course Header Banner */}
      <div 
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span className="subject-code-tag" style={{ fontSize: '1rem', padding: '0.3rem 0.75rem' }}>
            {course.code}
          </span>
          <span 
            className="subject-category-badge"
            style={{ 
              backgroundColor: course.colorScheme.bgSubtle,
              color: course.colorScheme.accent,
              border: `1px solid ${course.colorScheme.border}`,
              fontSize: '0.8rem'
            }}
          >
            {course.categoryLabel} ({course.category})
          </span>
          <span className="meta-pill">
            <Award size={13} />
            {course.credits} Credits
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          {course.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={15} style={{ color: 'var(--text-muted)' }} />
            Total Hours: <strong>{course.hours.total} hrs</strong> (L: {course.hours.lecture}, T: {course.hours.tutorial}, P: {course.hours.practical})
          </span>
          <span>•</span>
          <span>
            Assessment: <strong>CIE {course.cieMarks}</strong> + <strong>SEE {course.seeMarks}</strong> = <strong>{course.totalMarks} Marks</strong>
          </span>
          <span>•</span>
          <span>
            Exam Duration: <strong>{course.examDurationHours} Hours</strong>
          </span>
        </div>

        {course.prerequisites && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>Course Prerequisite:</strong> {course.prerequisites}
          </div>
        )}

        {/* Quick Academic Resource Access Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          {COURSE_SYLLABUS_MAP[course.code] && onOpenPDF && (
            <button
              onClick={() => {
                const sDoc = findPdfDocument(COURSE_SYLLABUS_MAP[course.code]);
                if (sDoc) onOpenPDF(sDoc);
              }}
              className="btn btn-outline"
              style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              title="Read official 2026 syllabus PDF"
            >
              <BookOpen size={14} />
              <span>Official 2026 Syllabus PDF</span>
            </button>
          )}

          {onOpenPDFs && (
            <button
              onClick={() => onOpenPDFs(course.code)}
              className="btn btn-secondary"
              style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title={`Browse ${subjectPDFs.length} original notes and lecture slides`}
            >
              <Layers size={14} style={{ color: '#ef4444' }} />
              <span>Original PDF Notes ({subjectPDFs.length})</span>
            </button>
          )}

          <button
            onClick={() => onOpenPYQ(course.code)}
            className="btn btn-secondary"
            style={{ fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title={`View exam papers for ${course.code}`}
          >
            <FileText size={14} style={{ color: '#d97706' }} />
            <span>Exam Papers (PYQ)</span>
          </button>
        </div>
      </div>

      {/* Grid: 2 Columns for Syllabus Units vs Course Info Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Units & Syllabus */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Syllabus Units & Study Material
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {course.units.length} Units Approved by Dean Academic
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {course.units.map(unit => {
              const isExpanded = expandedUnit === unit.unitNumber;
              const completed = isUnitCompleted(unit.unitNumber);

              return (
                <div 
                  key={unit.unitNumber}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'border-color var(--duration-fast) ease'
                  }}
                >
                  {/* Unit Accordion Header */}
                  <div 
                    onClick={() => setExpandedUnit(isExpanded ? null : unit.unitNumber)}
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor: isExpanded ? 'var(--bg-subtle)' : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleUnitCompletion(`${course.code}-u${unit.unitNumber}`);
                        }}
                        style={{ color: completed ? '#059669' : 'var(--text-faint)', display: 'flex' }}
                        title={completed ? 'Mark as incomplete' : 'Mark as studied'}
                      >
                        <CheckCircle2 size={20} />
                      </button>

                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: course.colorScheme.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Unit {unit.unitNumber} • {unit.hours} Hours
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {unit.title}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {unit.noteId && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenNote(unit.noteId!);
                          }}
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          <BookOpen size={12} />
                          Notes
                        </button>
                      )}
                      {isExpanded ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>

                  {/* Expanded Unit Body */}
                  {isExpanded && (
                    <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                        {unit.description}
                      </p>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          Detailed Curriculum Topics:
                        </div>
                        <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {unit.topics.map((t, idx) => (
                            <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {unit.keyConcepts.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Core Concepts:
                          </span>
                          {unit.keyConcepts.map((kc, i) => (
                            <span key={i} className="note-tag" style={{ fontSize: '0.75rem' }}>
                              {kc}
                            </span>
                          ))}
                        </div>
                      )}

                      {unit.noteId && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)' }}>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => onOpenNote(unit.noteId!)}
                          >
                            <BookOpen size={14} />
                            Read Comprehensive Unit Notes
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Course Outcomes (COs) */}
          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              Course Outcomes (COs)
            </h3>
            <div className="table-container">
              <table className="markdown-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>CO</th>
                    <th>Statement</th>
                    <th style={{ width: '90px' }}>Bloom's</th>
                  </tr>
                </thead>
                <tbody>
                  {course.outcomes.map(co => (
                    <tr key={co.co}>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{co.co}</td>
                      <td>{co.text}</td>
                      <td>
                        <span className="kbd-badge">{co.level}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Books, Labs, Past Papers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Related Lab Programs */}
          {subjectLabs.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                <Code2 size={16} style={{ color: '#059669' }} />
                Laboratory Programs ({subjectLabs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {subjectLabs.map(lab => (
                  <button
                    key={lab.id}
                    onClick={() => onOpenLab(lab.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'all var(--duration-fast) ease'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                      {lab.number}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {lab.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Past Year Question Papers */}
          {subjectPYQs.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                <FileText size={16} style={{ color: '#d97706' }} />
                Question Papers & CIE ({subjectPYQs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {subjectPYQs.map(pyq => (
                  <button
                    key={pyq.id}
                    onClick={() => onOpenPYQ(pyq.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {pyq.examType} ({pyq.year})
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {pyq.marks} Marks • {pyq.duration}
                      </div>
                    </div>
                    {pyq.hasSolutions && (
                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontWeight: 600 }}>
                        Key
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Original Source PDFs Section */}
          {subjectPDFs.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <FileText size={16} style={{ color: '#ef4444' }} />
                  Original Source PDFs ({subjectPDFs.length})
                </div>
                {onOpenPDFs && (
                  <button
                    onClick={() => onOpenPDFs(course.code)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {subjectPDFs.slice(0, 5).map(pdf => (
                  <div
                    key={pdf.id}
                    onClick={() => onOpenPDF ? onOpenPDF(pdf) : window.open(pdf.url, '_blank')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: pdf.isManualRecord ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all var(--duration-fast) ease'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, marginRight: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pdf.filename}
                        </span>
                        {pdf.isManualRecord && (
                          <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                            Record
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {pdf.sizeFormatted} • {pdf.folder}
                      </div>
                    </div>
                    <Eye size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Textbooks & Reference Books */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              <BookMarked size={16} style={{ color: 'var(--accent-primary)' }} />
              Prescribed Textbooks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {course.textbooks.map((b, i) => (
                <div key={i} style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {b.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {b.author} • {b.edition}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    {b.publisher} ({b.year})
                  </div>
                </div>
              ))}
            </div>

            {course.referenceBooks.length > 0 && (
              <>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', margin: '1rem 0 0.5rem 0' }}>
                  Reference Books:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {course.referenceBooks.map((rb, idx) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      • <strong>{rb.title}</strong> by {rb.author}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
