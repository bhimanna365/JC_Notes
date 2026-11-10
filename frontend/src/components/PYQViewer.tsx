import React, { useState, useMemo, useEffect } from 'react';
import { QUESTION_PAPERS } from '../data/pyqData';
import { QuestionPaper, PDFDocument } from '../types';
import { getPYQPDFs } from '../data/pdfManifest';
import { resolvePdfUrl, downloadPdf, openPdfInNewTab } from '../utils/pdfResolver';
import { 
  FileText, 
  Search, 
  Download, 
  ExternalLink, 
  Eye, 
  HelpCircle, 
  Clock, 
  Award,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Calendar,
  Layers,
  BookOpen,
  Filter,
  CheckCircle2,
  Folder
} from 'lucide-react';

interface PYQViewerProps {
  initialPyqId?: string;
  initialYear?: '2024' | '2025' | 'all';
  onSelectSubject?: (subjectCode: string) => void;
  onOpenPDF?: (pdf: PDFDocument) => void;
}

type TabType = 'all' | '2025' | '2024' | 'SEE' | 'CIE-1' | 'CIE-3' | 'Model' | 'interactive';

export const PYQViewer: React.FC<PYQViewerProps> = ({ 
  initialPyqId, 
  initialYear = 'all',
  onSelectSubject,
  onOpenPDF 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialYear !== 'all' ? initialYear : 'all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(initialPyqId || null);

  // Synchronize tab when initialYear prop changes via routing
  useEffect(() => {
    if (initialYear && initialYear !== 'all') {
      setActiveTab(initialYear);
    }
  }, [initialYear]);

  // All 29 original PDFs from PYQ-24 and PYQ-25
  const allPyqPdfs = useMemo(() => getPYQPDFs(), []);

  // Filtered original PDFs
  const filteredPdfs = useMemo(() => {
    return allPyqPdfs.filter(pdf => {
      // 1. Tab filter
      let matchesTab = true;
      const fnLower = pdf.filename.toLowerCase();
      const relLower = pdf.relPath.toLowerCase();

      if (activeTab === '2025') {
        matchesTab = pdf.folder === 'PYQ-25' || relLower.includes('pyq-25');
      } else if (activeTab === '2024') {
        matchesTab = pdf.folder === 'PYQ-24' || relLower.includes('pyq-24');
      } else if (activeTab === 'SEE') {
        matchesTab = fnLower.includes('see') || relLower.includes('/see/');
      } else if (activeTab === 'CIE-1') {
        matchesTab = fnLower.includes('cie-1') || fnLower.includes('cie1') || relLower.includes('test-1');
      } else if (activeTab === 'CIE-3') {
        matchesTab = fnLower.includes('cie-3') || fnLower.includes('cie2') || relLower.includes('test-2');
      } else if (activeTab === 'Model') {
        matchesTab = fnLower.includes('model') || fnLower.includes('test-exam') || fnLower.includes('answer key') || fnLower.includes('modal answers');
      } else if (activeTab === 'interactive') {
        return false;
      }

      // 2. Subject filter
      const matchesSubject = 
        subjectFilter === 'all' || 
        (pdf.subjectCode && pdf.subjectCode.toLowerCase() === subjectFilter.toLowerCase()) ||
        fnLower.includes(subjectFilter.toLowerCase());

      // 3. Search query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        pdf.filename.toLowerCase().includes(q) ||
        (pdf.subjectCode && pdf.subjectCode.toLowerCase().includes(q)) ||
        (pdf.subjectName && pdf.subjectName.toLowerCase().includes(q)) ||
        pdf.unit.toLowerCase().includes(q) ||
        pdf.folder.toLowerCase().includes(q);

      return matchesTab && matchesSubject && matchesSearch;
    });
  }, [allPyqPdfs, activeTab, subjectFilter, searchQuery]);

  // Filtered interactive question papers
  const filteredInteractivePapers = useMemo(() => {
    return QUESTION_PAPERS.filter(qp => {
      const matchesSubject = subjectFilter === 'all' || qp.subjectCode.toLowerCase() === subjectFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        qp.subjectName.toLowerCase().includes(q) ||
        qp.subjectCode.toLowerCase().includes(q) ||
        qp.questionsSummary.some(quest => quest.toLowerCase().includes(q));

      return matchesSubject && matchesSearch;
    });
  }, [subjectFilter, searchQuery]);

  // Distinct subjects available across PYQs
  const availableSubjects = [
    { code: '24CS310', name: 'OOP C++' },
    { code: '24CS320', name: 'DSD' },
    { code: '24CS330', name: 'Data Structures' },
    { code: '24CS340', name: 'CO' },
    { code: '24CS350', name: 'DMS' },
    { code: '24CS36L', name: 'DS Lab' },
    { code: '24MA313', name: 'Math III' },
    { code: '24HU311', name: 'UHV' }
  ];

  // Helper for exam tag color and label
  const getExamTag = (pdf: PDFDocument) => {
    const fn = pdf.filename.toLowerCase();
    const rel = pdf.relPath.toLowerCase();

    if (fn.includes('see') || rel.includes('/see/')) {
      return { label: 'SEE Exam', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)' };
    }
    if (fn.includes('cie-1') || fn.includes('cie1') || rel.includes('test-1')) {
      return { label: 'CIE-1 Test', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' };
    }
    if (fn.includes('cie-3') || fn.includes('cie2') || rel.includes('test-2')) {
      return { label: 'CIE-3 / CIE-2', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)' };
    }
    if (fn.includes('model') || fn.includes('modal answers') || fn.includes('answer key')) {
      return { label: 'Model QP / Solutions', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' };
    }
    if (fn.includes('structures lab test') || fn.includes('lab test')) {
      return { label: 'Lab Test Exam', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' };
    }
    return { label: 'Official Paper', color: '#64748b', bg: 'var(--bg-elevated)' };
  };

  const getYearBadge = (pdf: PDFDocument) => {
    if (pdf.folder === 'PYQ-25' || pdf.relPath.includes('PYQ-25')) {
      return { label: '2025', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
    return { label: '2024', bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const hash = tab === 'all' ? '#pyq' : (tab === '2025' || tab === '2024' ? `#pyq-${tab === '2025' ? '25' : '24'}` : `#pyq/${tab}`);
      window.history.pushState(null, '', hash);
    }
    setTimeout(() => {
      const el = document.getElementById('pyq-content-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  return (
    <div className="container" id="pyq-archive-content" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      
      {/* Header Banner */}
      <div 
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid rgba(217, 119, 6, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-accent" style={{ backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#d97706', borderColor: 'rgba(217, 119, 6, 0.25)', fontWeight: 700 }}>
            📁 Official Examination Archive
          </span>
          <span className="meta-pill">29 Authentic Exam PDFs</span>
          <span className="meta-pill">PYQ-24 (25 Papers)</span>
          <span className="meta-pill">PYQ-25 (4 Papers)</span>
          <span className="meta-pill">Autonomous SEE & CIE</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
          📝 Previous Year Questions & Examination Archive
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
          Study authentic question papers from recent semester examinations. Includes full semester end papers (<strong>SEE</strong>), continuous internal evaluations (<strong>CIE-1 & CIE-3</strong>), model question papers with solutions, and laboratory test papers for <strong>JSS STU</strong> Computer Science students.
        </p>

        {/* Global Search input */}
        <div style={{ marginTop: '1.5rem', position: 'relative', maxWidth: '520px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search exam papers by subject code (e.g. 24CS330), year (2025, 2024), SEE, CIE..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Main Examination Portals & Year Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* Primary Year & Exam Type Tabs */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            overflowX: 'auto', 
            paddingBottom: '0.35rem',
            scrollbarWidth: 'thin'
          }}
        >
          <button
            onClick={() => handleTabChange('all')}
            className={`filter-chip ${activeTab === 'all' ? 'active' : ''}`}
            style={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            All Papers (29)
          </button>

          <button
            onClick={() => handleTabChange('2025')}
            className={`filter-chip ${activeTab === '2025' ? 'active' : ''}`}
            style={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            ⭐ PYQ 2025 (4 Papers)
          </button>

          <button
            onClick={() => handleTabChange('2024')}
            className={`filter-chip ${activeTab === '2024' ? 'active' : ''}`}
            style={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            📚 PYQ 2024 (25 Papers)
          </button>

          <button
            onClick={() => handleTabChange('SEE')}
            className={`filter-chip ${activeTab === 'SEE' ? 'active' : ''}`}
            style={{ fontSize: '0.825rem' }}
          >
            SEE Exams (9)
          </button>

          <button
            onClick={() => handleTabChange('CIE-1')}
            className={`filter-chip ${activeTab === 'CIE-1' ? 'active' : ''}`}
            style={{ fontSize: '0.825rem' }}
          >
            CIE-1 Tests (8)
          </button>

          <button
            onClick={() => handleTabChange('CIE-3')}
            className={`filter-chip ${activeTab === 'CIE-3' ? 'active' : ''}`}
            style={{ fontSize: '0.825rem' }}
          >
            CIE-2 & 3 Tests (10)
          </button>

          <button
            onClick={() => handleTabChange('Model')}
            className={`filter-chip ${activeTab === 'Model' ? 'active' : ''}`}
            style={{ fontSize: '0.825rem' }}
          >
            Model QPs & Lab (4)
          </button>

          <button
            onClick={() => handleTabChange('interactive')}
            className={`filter-chip ${activeTab === 'interactive' ? 'active' : ''}`}
            style={{ fontSize: '0.825rem' }}
          >
            Interactive Questions ({QUESTION_PAPERS.length})
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Subject:
          </span>
          <button
            onClick={() => setSubjectFilter('all')}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: subjectFilter === 'all' ? 'var(--text-primary)' : 'var(--bg-elevated)',
              color: subjectFilter === 'all' ? 'var(--bg-surface)' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            All Courses
          </button>

          {availableSubjects.map(sub => (
            <button
              key={sub.code}
              onClick={() => setSubjectFilter(sub.code)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: subjectFilter === sub.code ? 'var(--text-primary)' : 'var(--bg-elevated)',
                color: subjectFilter === sub.code ? 'var(--bg-surface)' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {sub.code} ({sub.name})
            </button>
          ))}
        </div>
      </div>

      <div id="pyq-content-results">
        {/* ==================================================================== */}
        {/* VIEW 1: ORIGINAL EXAMINATION PDF ARCHIVE (Default)                    */}
        {/* ==================================================================== */}
        {activeTab !== 'interactive' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredPdfs.length}</strong> official examination document{filteredPdfs.length === 1 ? '' : 's'}
                {activeTab !== 'all' && ` under ${activeTab}`}
                {subjectFilter !== 'all' && ` for ${subjectFilter}`}
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', padding: '0.25rem 0.5rem' }}
                >
                  Clear Search
                </button>
              )}
            </div>

            {filteredPdfs.length === 0 ? (
              <div 
                style={{ 
                  padding: '3.5rem 1.5rem', 
                  backgroundColor: 'var(--bg-surface)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-lg)', 
                  textAlign: 'center' 
                }}
              >
                <FileText size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  No examination papers matched your criteria
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Try switching to "All Papers" or reset subject filters.
                </p>
                <button 
                  onClick={() => { setActiveTab('all'); setSubjectFilter('all'); setSearchQuery(''); }}
                  className="btn btn-primary btn-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
                  gap: '1.25rem' 
                }}
              >
                {filteredPdfs.map(pdf => {
                  const examTag = getExamTag(pdf);
                  const yearTag = getYearBadge(pdf);

                  return (
                    <div
                      key={pdf.id}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all var(--duration-fast) ease'
                      }}
                      className="pdf-card"
                    >
                      {/* Top Badges Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span 
                            style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              padding: '0.15rem 0.5rem', 
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: yearTag.bg,
                              color: yearTag.color,
                              border: `1px solid ${yearTag.border}`
                            }}
                          >
                            {yearTag.label}
                          </span>

                          <span 
                            style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 600, 
                              padding: '0.15rem 0.5rem', 
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: examTag.bg,
                              color: examTag.color
                            }}
                          >
                            {examTag.label}
                          </span>
                        </div>

                        {pdf.subjectCode && (
                          <span className="subject-code-tag" style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>
                            {pdf.subjectCode}
                          </span>
                        )}
                      </div>

                      {/* Paper Title / Filename */}
                      <h4 
                        style={{ 
                          fontSize: '0.975rem', 
                          fontWeight: 700, 
                          color: 'var(--text-primary)', 
                          marginBottom: '0.4rem',
                          lineHeight: 1.35
                        }}
                        title={pdf.filename}
                      >
                        {pdf.filename}
                      </h4>

                      {/* Subject Name */}
                      {pdf.subjectName && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>
                          {pdf.subjectName}
                        </div>
                      )}

                      {/* Hierarchy info */}
                      <div 
                        style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          marginTop: 'auto',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid var(--border-subtle)',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <Folder size={12} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {pdf.relPath}
                        </span>
                        <span style={{ marginLeft: 'auto', fontWeight: 600, flexShrink: 0 }}>
                          {pdf.sizeFormatted}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          onClick={() => onOpenPDF ? onOpenPDF(pdf) : openPdfInNewTab(pdf)}
                          className="btn btn-primary"
                          style={{ flex: 1, fontSize: '0.78rem', padding: '0.4rem 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                          title="Open original examination PDF in document reader"
                        >
                          <Eye size={13} />
                          <span>Read Exam Paper</span>
                        </button>

                        <button
                          onClick={() => openPdfInNewTab(pdf)}
                          className="btn btn-ghost"
                          style={{ padding: '0.4rem 0.55rem', fontSize: '0.78rem' }}
                          title="Open raw PDF in new browser tab"
                        >
                          <ExternalLink size={14} />
                        </button>

                        <button
                          onClick={() => downloadPdf(pdf)}
                          className="btn btn-ghost"
                          style={{ padding: '0.4rem 0.55rem', fontSize: '0.78rem' }}
                          title="Download original examination document"
                        >
                          <Download size={14} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: INTERACTIVE QUESTION PAPERS ARCHIVE (Preserves all data)      */}
        {/* ==================================================================== */}
        {activeTab === 'interactive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Structured topic-by-topic question outlines and model solutions:
            </div>

            {filteredInteractivePapers.map(qp => {
              const isExpanded = expandedCardId === qp.id;

              return (
                <div
                  key={qp.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'border-color var(--duration-fast) ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="subject-code-tag">{qp.subjectCode}</span>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '0.15rem 0.5rem', 
                          borderRadius: '4px',
                          backgroundColor: qp.examType === 'SEE' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                          color: qp.examType === 'SEE' ? '#2563eb' : '#d97706'
                        }}
                      >
                        {qp.examType} Exam ({qp.year})
                      </span>
                      {qp.hasSolutions && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FileCheck size={11} /> Model Solutions
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span>Duration: <strong>{qp.duration}</strong></span>
                      <span>Max Marks: <strong>{qp.marks}</strong></span>
                    </div>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {qp.subjectName}
                  </h3>

                  {qp.solutionNotes && (
                    <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderLeft: '3px solid var(--accent-primary)' }}>
                      <strong>Exam Focus & Solutions Note:</strong> {qp.solutionNotes}
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setExpandedCardId(isExpanded ? null : qp.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--accent-primary)',
                        padding: '0.25rem 0'
                      }}
                    >
                      <span>{isExpanded ? 'Hide Questions' : `View ${qp.questionsSummary.length} Exam Questions`}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isExpanded && (
                      <div style={{ marginTop: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                        <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {qp.questionsSummary.map((q, idx) => (
                            <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                              {q}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Source Archive: <code style={{ fontSize: '0.75rem' }}>{qp.filePath}</code></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
