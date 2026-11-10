import React, { useState, useMemo, useEffect } from 'react';
import { PDFDocument, PDFSubjectGroup, PDFUnitGroup } from '../types';
import { 
  PDF_DOCUMENTS, 
  ACADEMIC_PDF_SUBJECTS, 
  getTheoryPDFs,
  getSubjectGroupById 
} from '../data/pdfManifest';
import { resolvePdfUrl, downloadPdf, openPdfInNewTab } from '../utils/pdfResolver';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Download, 
  ExternalLink, 
  Eye, 
  BookOpen, 
  Folder, 
  HardDrive, 
  Calendar, 
  ArrowUpDown,
  FileText,
  X,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Cpu,
  Database,
  Code2,
  Binary,
  Sigma,
  BookMarked,
  GraduationCap,
  FlaskConical,
  FolderOpen
} from 'lucide-react';

interface PDFLibraryProps {
  onOpenPDF: (pdf: PDFDocument) => void;
  onOpenNote?: (noteId: string) => void;
  onSelectSubject?: (code: string) => void;
  onNavigateToLaboratory?: () => void;
  onNavigateToPYQ?: () => void;
  onNavigateToSyllabus?: () => void;
  initialSubjectId?: string;
  initialUnitName?: string;
  initialCategory?: string;
}

// Visual theme mapping for academic subjects
const SUBJECT_THEMES: Record<string, { color: string; bgSoft: string; borderSoft: string; icon: React.ReactNode }> = {
  '24cs320': {
    color: '#0284c7', // Sky Blue
    bgSoft: 'rgba(2, 132, 199, 0.08)',
    borderSoft: 'rgba(2, 132, 199, 0.25)',
    icon: <Cpu size={22} />
  },
  '24cs330': {
    color: '#6366f1', // Indigo
    bgSoft: 'rgba(99, 102, 241, 0.08)',
    borderSoft: 'rgba(99, 102, 241, 0.25)',
    icon: <Database size={22} />
  },
  '24cs310': {
    color: '#8b5cf6', // Violet
    bgSoft: 'rgba(139, 92, 246, 0.08)',
    borderSoft: 'rgba(139, 92, 246, 0.25)',
    icon: <Code2 size={22} />
  },
  '24cs340': {
    color: '#f59e0b', // Amber
    bgSoft: 'rgba(245, 158, 11, 0.08)',
    borderSoft: 'rgba(245, 158, 11, 0.25)',
    icon: <Binary size={22} />
  },
  '24cs350': {
    color: '#10b981', // Emerald
    bgSoft: 'rgba(16, 185, 129, 0.08)',
    borderSoft: 'rgba(16, 185, 129, 0.25)',
    icon: <Layers size={22} />
  },
  '24ma313': {
    color: '#ec4899', // Rose/Pink
    bgSoft: 'rgba(236, 72, 153, 0.08)',
    borderSoft: 'rgba(236, 72, 153, 0.25)',
    icon: <Sigma size={22} />
  },
  '24hu311': {
    color: '#06b6d4', // Cyan
    bgSoft: 'rgba(6, 182, 212, 0.08)',
    borderSoft: 'rgba(6, 182, 212, 0.25)',
    icon: <GraduationCap size={22} />
  },
  '01.syllabus-26': {
    color: '#3b82f6', // Blue
    bgSoft: 'rgba(59, 130, 246, 0.08)',
    borderSoft: 'rgba(59, 130, 246, 0.25)',
    icon: <BookMarked size={22} />
  },
  'other': {
    color: '#64748b', // Slate
    bgSoft: 'rgba(100, 116, 139, 0.08)',
    borderSoft: 'rgba(100, 116, 139, 0.25)',
    icon: <FolderOpen size={22} />
  }
};

export const PDFLibrary: React.FC<PDFLibraryProps> = ({
  onOpenPDF,
  onOpenNote,
  onSelectSubject,
  onNavigateToLaboratory,
  onNavigateToPYQ,
  onNavigateToSyllabus,
  initialSubjectId,
  initialUnitName,
  initialCategory
}) => {
  // Navigation level state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(initialSubjectId || null);
  const [selectedUnitName, setSelectedUnitName] = useState<string | null>(initialUnitName || null);

  // Search & Display controls
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Handle URL or prop changes
  useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
    if (initialUnitName) {
      setSelectedUnitName(initialUnitName);
    }
  }, [initialSubjectId, initialUnitName]);

  // All Academic Theory PDFs (excludes Laboratory and PYQs)
  const allTheoryPDFs = useMemo(() => getTheoryPDFs(), []);

  // Currently active subject group
  const currentSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return getSubjectGroupById(selectedSubjectId) || null;
  }, [selectedSubjectId]);

  // Currently active unit group within active subject
  const currentUnit = useMemo(() => {
    if (!currentSubject || !selectedUnitName) return null;
    return currentSubject.units.find(u => u.unitName.toLowerCase() === selectedUnitName.toLowerCase()) || null;
  }, [currentSubject, selectedUnitName]);

  // Overall Library Statistics
  const totalLibraryStats = useMemo(() => {
    const totalCount = allTheoryPDFs.length;
    const totalBytes = allTheoryPDFs.reduce((sum, p) => sum + p.sizeBytes, 0);
    const sizeFormatted = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    const subjectsCount = ACADEMIC_PDF_SUBJECTS.length;
    return { totalCount, sizeFormatted, subjectsCount };
  }, [allTheoryPDFs]);

  // Filtered PDFs when searching globally or browsing a unit
  const displayedPDFs = useMemo(() => {
    let list: PDFDocument[] = [];

    if (searchQuery.trim()) {
      // Global / Cross-Unit Search across all academic theory PDFs
      const q = searchQuery.toLowerCase().trim();
      list = allTheoryPDFs.filter(p => 
        p.filename.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.relPath.toLowerCase().includes(q) ||
        p.unit.toLowerCase().includes(q) ||
        p.folder.toLowerCase().includes(q) ||
        (p.subjectCode && p.subjectCode.toLowerCase().includes(q)) ||
        (p.subjectName && p.subjectName.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    } else if (currentUnit) {
      // Viewing a specific unit
      list = currentUnit.pdfs;
    } else if (currentSubject) {
      // When viewing subject without a specific unit selected, show all PDFs in subject
      list = currentSubject.units.flatMap(u => u.pdfs);
    }

    // Sort list
    return [...list].sort((a, b) => {
      if (sortBy === 'name') {
        const cmp = a.filename.localeCompare(b.filename);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortBy === 'size') {
        return sortOrder === 'asc' ? a.sizeBytes - b.sizeBytes : b.sizeBytes - a.sizeBytes;
      }
      if (sortBy === 'date') {
        const cmp = a.lastModified.localeCompare(b.lastModified);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [searchQuery, allTheoryPDFs, currentSubject, currentUnit, sortBy, sortOrder]);

  // Action handlers
  const handleDownload = (e: React.MouseEvent, pdf: PDFDocument) => {
    e.stopPropagation();
    downloadPdf(pdf);
  };

  const handleOpenNewTab = (e: React.MouseEvent, pdf: PDFDocument) => {
    e.stopPropagation();
    openPdfInNewTab(pdf);
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedUnitName(null);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#pdf-notes/${subjectId}`);
    }
    setTimeout(() => {
      const el = document.getElementById('pdf-subject-units-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleSelectUnit = (unitName: string) => {
    setSelectedUnitName(unitName);
    setSearchQuery('');
    if (typeof window !== 'undefined' && selectedSubjectId) {
      window.history.pushState(null, '', `#pdf-notes/${selectedSubjectId}/${encodeURIComponent(unitName)}`);
    }
    setTimeout(() => {
      const el = document.getElementById('pdf-unit-docs-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
    setSelectedUnitName(null);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '#pdf-notes');
    }
    setTimeout(() => {
      const el = document.getElementById('pdf-academic-subjects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleBackToSubjectUnits = () => {
    setSelectedUnitName(null);
    setSearchQuery('');
    if (typeof window !== 'undefined' && selectedSubjectId) {
      window.history.pushState(null, '', `#pdf-notes/${selectedSubjectId}`);
    }
    setTimeout(() => {
      const el = document.getElementById('pdf-subject-units-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  return (
    <div className="pdf-library-page" style={{ paddingBottom: '4rem' }}>
      
      {/* Editorial Header */}
      <section 
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderBottom: '1px solid var(--border-subtle)',
          padding: '2.5rem 0'
        }}
      >
        <div className="container">
          
          {/* Breadcrumb Navigation when drilling down */}
          <nav 
            aria-label="Breadcrumb" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.825rem', 
              color: 'var(--text-muted)',
              marginBottom: '0.85rem'
            }}
          >
            <button
              onClick={handleBackToSubjects}
              style={{
                background: 'none',
                border: 'none',
                color: (selectedSubjectId || searchQuery) ? 'var(--accent-primary)' : 'var(--text-primary)',
                fontWeight: selectedSubjectId ? 500 : 700,
                cursor: selectedSubjectId ? 'pointer' : 'default',
                padding: 0
              }}
            >
              PDF Notes
            </button>

            {currentSubject && (
              <>
                <ChevronRight size={14} style={{ opacity: 0.5 }} />
                <button
                  onClick={handleBackToSubjectUnits}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: selectedUnitName ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: selectedUnitName ? 500 : 700,
                    cursor: selectedUnitName ? 'pointer' : 'default',
                    padding: 0
                  }}
                >
                  {currentSubject.title}
                </button>
              </>
            )}

            {selectedUnitName && (
              <>
                <ChevronRight size={14} style={{ opacity: 0.5 }} />
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  {selectedUnitName}
                </span>
              </>
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} />
              Original Academic Document Archive
            </span>
            <span className="meta-pill">
              {totalLibraryStats.subjectsCount} Academic Subjects
            </span>
            <span className="meta-pill">
              {totalLibraryStats.totalCount} Authentic PDFs
            </span>
            <span className="meta-pill">
              {totalLibraryStats.sizeFormatted} Total Size
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
            📚 Academic PDF Notes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '820px', lineHeight: 1.6, margin: 0 }}>
            Read and download authentic lecture slides, textbooks, and unit notes organized strictly by official subject codes and syllabus units. Practical lab records and programs are maintained separately in the <strong>Laboratory</strong> section.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '2rem' }}>
        
        {/* Laboratory Redirection Banner (Preserves absolute separation) */}
        <div 
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FlaskConical size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.98rem' }}>
                Looking for Laboratory Records, Programs, & Manuals?
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                The <strong>DS Master Record (53.2 MB)</strong>, <strong>DSD Manual Record (20.5 MB)</strong>, and <strong>OOP Lab Cycles</strong> are located in the dedicated <strong>Laboratory</strong> section.
              </div>
            </div>
          </div>
          {onNavigateToLaboratory && (
            <button
              onClick={onNavigateToLaboratory}
              className="btn btn-primary"
              style={{ backgroundColor: '#10b981', borderColor: '#10b981', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Go to Laboratory <ArrowRight size={15} />
            </button>
          )}
        </div>

        {/* Global Search & Display Toolbar */}
        <div 
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            
            {/* Global Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search 
                size={16} 
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
              />
              <input
                type="text"
                placeholder={
                  selectedUnitName && currentSubject
                    ? `Search inside ${currentSubject.title} → ${selectedUnitName}...`
                    : currentSubject
                    ? `Search inside ${currentSubject.title}...`
                    : "Search all academic PDF notes by filename, subject, unit, or topic..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.25rem 0.65rem 2.5rem',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-app)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Controls: Sort and View mode (active when viewing PDF cards) */}
            {(searchQuery || selectedUnitName) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                {/* Sort By */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <ArrowUpDown size={14} />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [b, o] = e.target.value.split('-') as ['name' | 'size' | 'date', 'asc' | 'desc'];
                      setSortBy(b);
                      setSortOrder(o);
                    }}
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-primary)',
                      fontSize: '0.825rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="name-asc">Name (A → Z)</option>
                    <option value="name-desc">Name (Z → A)</option>
                    <option value="size-desc">Size (Largest)</option>
                    <option value="size-asc">Size (Smallest)</option>
                    <option value="date-desc">Modified (Newest)</option>
                    <option value="date-asc">Modified (Oldest)</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '0.45rem 0.65rem',
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--bg-app)',
                      color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8rem'
                    }}
                    title="Grid View"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '0.45rem 0.65rem',
                      border: 'none',
                      backgroundColor: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--bg-app)',
                      color: viewMode === 'list' ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.8rem'
                    }}
                    title="List View"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Quick subject jump chips */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              overflowX: 'auto', 
              paddingBottom: '0.25rem',
              scrollbarWidth: 'thin'
            }}
          >
            <button
              onClick={handleBackToSubjects}
              className={`filter-chip ${!selectedSubjectId && !searchQuery ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap', fontSize: '0.775rem' }}
            >
              All Academic Subjects ({ACADEMIC_PDF_SUBJECTS.length})
            </button>
            {ACADEMIC_PDF_SUBJECTS.map(subj => {
              const isSelected = selectedSubjectId?.toLowerCase() === subj.id.toLowerCase() || selectedSubjectId?.toLowerCase() === subj.code.toLowerCase();
              return (
                <button
                  key={subj.id}
                  onClick={() => handleSelectSubject(subj.id)}
                  className={`filter-chip ${isSelected ? 'active' : ''}`}
                  style={{ whiteSpace: 'nowrap', fontSize: '0.775rem' }}
                >
                  {subj.title}
                  <span 
                    style={{ 
                      marginLeft: '0.35rem', 
                      opacity: 0.75, 
                      fontSize: '0.7rem',
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '10px'
                    }}
                  >
                    {subj.totalPdfs}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* CASE A: GLOBAL SEARCH ACTIVE                                         */}
        {/* ==================================================================== */}
        {searchQuery.trim() ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Search Results: Found <strong>{displayedPDFs.length}</strong> academic PDFs matching "<strong>{searchQuery}</strong>"
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', padding: '0.3rem 0.6rem' }}
              >
                Clear Search
              </button>
            </div>

            {displayedPDFs.length === 0 ? (
              <div 
                style={{ 
                  padding: '4rem 2rem', 
                  backgroundColor: 'var(--bg-surface)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid var(--border-subtle)', 
                  textAlign: 'center' 
                }}
              >
                <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  No academic PDF notes matched "{searchQuery}"
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try checking spelling, searching by subject code (e.g. "24CS320"), or browse directly by subject.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn btn-outline"
                >
                  Return to Subjects
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              renderPDFGrid(displayedPDFs)
            ) : (
              renderPDFTable(displayedPDFs)
            )}
          </div>

        ) : selectedUnitName && currentSubject ? (
          /* ==================================================================== */
          /* CASE B: LEVEL 3 — UNIT VIEW (Showing ONLY the PDFs in that Unit)     */
          /* ==================================================================== */
          <div id="pdf-unit-docs-container">
            {/* Unit Header Bar with Back Button */}
            <div 
              style={{ 
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={handleBackToSubjectUnits}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
                  title={`Back to ${currentSubject.title} Units`}
                >
                  <ArrowLeft size={16} />
                  <span>All Units</span>
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span 
                      className="badge" 
                      style={{ 
                        backgroundColor: SUBJECT_THEMES[currentSubject.id]?.bgSoft || 'var(--bg-app)', 
                        color: SUBJECT_THEMES[currentSubject.id]?.color || 'var(--accent-primary)',
                        borderColor: SUBJECT_THEMES[currentSubject.id]?.borderSoft || 'var(--border-subtle)',
                        fontWeight: 700
                      }}
                    >
                      {currentSubject.code}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {currentSubject.title}
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    📂 {selectedUnitName}
                  </h2>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="meta-pill" style={{ fontWeight: 600 }}>
                  {displayedPDFs.length} {displayedPDFs.length === 1 ? 'Document' : 'Documents'}
                </span>
                <span className="meta-pill">
                  {currentSubject.folder}/{selectedUnitName !== 'General / Other' ? selectedUnitName : ''}
                </span>
              </div>
            </div>

            {/* Render ONLY the PDFs belonging to this unit */}
            {displayedPDFs.length === 0 ? (
              <div 
                style={{ 
                  padding: '3rem', 
                  backgroundColor: 'var(--bg-surface)', 
                  borderRadius: 'var(--radius-lg)', 
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No PDF files found in this unit.</p>
              </div>
            ) : viewMode === 'grid' ? (
              renderPDFGrid(displayedPDFs)
            ) : (
              renderPDFTable(displayedPDFs)
            )}
          </div>

        ) : currentSubject ? (
          /* ==================================================================== */
          /* CASE C: LEVEL 2 — SUBJECT PAGE (Showing Real Units & Sections)       */
          /* ==================================================================== */
          <div id="pdf-subject-units-container">
            {/* Subject Banner */}
            <div 
              style={{ 
                backgroundColor: 'var(--bg-surface)',
                border: `1.5px solid ${SUBJECT_THEMES[currentSubject.id]?.borderSoft || 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                marginBottom: '1.75rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div 
                    style={{ 
                      width: '3.5rem', 
                      height: '3.5rem', 
                      borderRadius: 'var(--radius-md)', 
                      backgroundColor: SUBJECT_THEMES[currentSubject.id]?.bgSoft || 'var(--bg-app)', 
                      color: SUBJECT_THEMES[currentSubject.id]?.color || 'var(--accent-primary)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {SUBJECT_THEMES[currentSubject.id]?.icon || <FileText size={26} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                        {currentSubject.code}
                      </span>
                      <span className="meta-pill">
                        {currentSubject.totalPdfs} Total Notes
                      </span>
                      <span className="meta-pill">
                        {currentSubject.totalSizeFormatted}
                      </span>
                    </div>

                    <h2 style={{ margin: '0 0 0.4rem 0', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {currentSubject.title}
                    </h2>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Folder size={14} />
                      <span>Workspace folder: <strong>{currentSubject.folder}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBackToSubjects}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <ArrowLeft size={15} />
                  <span>All Subjects</span>
                </button>
              </div>
            </div>

            {/* Units & Sections Header */}
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  SYLLABUS UNITS & SECTIONS
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Select a unit to view and read its specific lecture notes and documents
                </p>
              </div>
              <span className="meta-pill">
                {currentSubject.units.length} {currentSubject.units.length === 1 ? 'Section' : 'Sections'} Available
              </span>
            </div>

            {/* Units Cards Grid */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '1.25rem',
                marginBottom: '2.5rem'
              }}
            >
              {currentSubject.units.map(unit => {
                const unitTotalBytes = unit.pdfs.reduce((s, p) => s + p.sizeBytes, 0);
                const unitSizeFormatted = `${(unitTotalBytes / (1024 * 1024)).toFixed(1)} MB`;
                const isGeneral = unit.unitName.includes('General');

                return (
                  <div
                    key={unit.unitName}
                    onClick={() => handleSelectUnit(unit.unitName)}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
                      position: 'relative'
                    }}
                    className="unit-card-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div 
                        style={{ 
                          width: '2.5rem', 
                          height: '2.5rem', 
                          borderRadius: 'var(--radius-sm)', 
                          backgroundColor: isGeneral ? 'rgba(100, 116, 139, 0.1)' : SUBJECT_THEMES[currentSubject.id]?.bgSoft || 'rgba(99, 102, 241, 0.1)', 
                          color: isGeneral ? '#64748b' : SUBJECT_THEMES[currentSubject.id]?.color || 'var(--accent-primary)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        {isGeneral ? <Folder size={18} /> : <FileText size={18} />}
                      </div>

                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '0.25rem 0.55rem', 
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {unit.pdfCount} {unit.pdfCount === 1 ? 'PDF' : 'PDFs'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
                      {unit.unitName}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Total Size: <strong>{unitSizeFormatted}</strong>
                    </div>

                    {/* Preview of PDFs inside this unit */}
                    <div 
                      style={{ 
                        marginTop: 'auto', 
                        paddingTop: '0.75rem', 
                        borderTop: '1px solid var(--border-subtle)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div style={{ marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Included Documents:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {unit.pdfs.slice(0, 3).map(p => (
                          <div 
                            key={p.id}
                            style={{ 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            title={p.filename}
                          >
                            <span style={{ color: 'var(--accent-primary)' }}>•</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.filename}</span>
                          </div>
                        ))}
                        {unit.pdfs.length > 3 && (
                          <div style={{ fontStyle: 'italic', opacity: 0.8 }}>
                            + {unit.pdfs.length - 3} more files
                          </div>
                        )}
                      </div>
                    </div>

                    <div 
                      style={{ 
                        marginTop: '1rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        color: 'var(--accent-primary)',
                        fontSize: '0.825rem',
                        fontWeight: 600
                      }}
                    >
                      <span>View notes</span>
                      <ArrowRight size={14} />
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick jump to all PDFs in this subject */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  All Documents in {currentSubject.title}
                </h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Browsing all {currentSubject.totalPdfs} files across all units
                </p>
              </div>
            </div>

            {viewMode === 'grid' ? renderPDFGrid(displayedPDFs) : renderPDFTable(displayedPDFs)}
          </div>

        ) : (
          /* ==================================================================== */
          /* CASE D: LEVEL 1 — PDF NOTES LANDING PAGE (Academic Subjects Cards)   */
          /* ==================================================================== */
          <div id="pdf-academic-subjects">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  ACADEMIC SUBJECTS
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                  Select an academic subject to view syllabus unit notes and study materials
                </p>
              </div>
              <span className="badge badge-accent" style={{ fontWeight: 600 }}>
                {ACADEMIC_PDF_SUBJECTS.length} Subjects Registered
              </span>
            </div>

            {/* Subjects Grid */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.25rem',
                marginBottom: '3rem'
              }}
            >
              {ACADEMIC_PDF_SUBJECTS.map(subject => {
                const theme = SUBJECT_THEMES[subject.id] || {
                  color: 'var(--accent-primary)',
                  bgSoft: 'var(--bg-app)',
                  borderSoft: 'var(--border-subtle)',
                  icon: <FileText size={22} />
                };

                return (
                  <div
                    key={subject.id}
                    onClick={() => handleSelectSubject(subject.id)}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1.5px solid ${theme.borderSoft}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      position: 'relative'
                    }}
                    className="subject-card-hover"
                  >
                    {/* Header Row: Icon + Subject Code + PDF Count */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div 
                        style={{ 
                          width: '3.25rem', 
                          height: '3.25rem', 
                          borderRadius: 'var(--radius-md)', 
                          backgroundColor: theme.bgSoft, 
                          color: theme.color, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {theme.icon}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span 
                          style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: theme.bgSoft,
                            color: theme.color,
                            border: `1px solid ${theme.borderSoft}`
                          }}
                        >
                          {subject.code}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {subject.totalSizeFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Subject Title */}
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {subject.title}
                    </h3>

                    {/* Structure Breakdown Summary: Real units and real PDF count */}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>
                      <strong>{subject.units.length} {subject.units.length === 1 ? 'Unit / Section' : 'Units'}</strong> • <strong>{subject.totalPdfs} {subject.totalPdfs === 1 ? 'PDF' : 'PDFs'}</strong>
                    </div>

                    {/* Unit tags pills preview */}
                    <div 
                      style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '0.35rem', 
                        marginBottom: '1.25rem',
                        marginTop: 'auto'
                      }}
                    >
                      {subject.units.map(u => (
                        <span 
                          key={u.unitName}
                          style={{ 
                            fontSize: '0.725rem', 
                            padding: '0.15rem 0.45rem', 
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-app)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {u.unitName} ({u.pdfCount})
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action */}
                    <div 
                      style={{ 
                        paddingTop: '0.75rem', 
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        color: theme.color,
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      <span>View notes →</span>
                      <ChevronRight size={16} />
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Quick Links / Separate Sections Pointer */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '2rem'
              }}
            >
              {/* Laboratory separation card */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: onNavigateToLaboratory ? 'pointer' : 'default'
                }}
                onClick={onNavigateToLaboratory}
              >
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Laboratory Section
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    DS Record, DSD Manual, and OOP Lab programs
                  </p>
                </div>
              </div>

              {/* PYQ Papers Pointer */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: onNavigateToPYQ ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                className="lab-hub-card"
                onClick={onNavigateToPYQ}
                title="Go to Previous Year Questions & Exam Papers"
              >
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookMarked size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    PYQ & Exam Papers →
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Access 29 original SEE & CIE question papers (2024 & 2025)
                  </p>
                </div>
              </div>

              {/* Syllabus 2026 Pointer */}
              <div 
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1.5px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: onNavigateToSyllabus ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
                className="lab-hub-card"
                onClick={onNavigateToSyllabus}
                title="Go to Official 2026 Curriculum & Syllabi"
              >
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Layers size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Syllabus 2026 →
                  </h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Official autonomous scheme documents for all 8 courses
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );

  /* ========================================================================== */
  /* HELPER: Render PDF Cards Grid                                              */
  /* ========================================================================== */
  function renderPDFGrid(pdfs: PDFDocument[]) {
    return (
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}
      >
        {pdfs.map(pdf => (
          <div
            key={pdf.id}
            onClick={() => onOpenPDF(pdf)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              minWidth: 0,
              overflow: 'hidden'
            }}
            className="pdf-card"
          >
            {/* Top: Icon + Subject/Unit Breadcrumb Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', minWidth: 0 }}>
              <div 
                style={{ 
                  width: '2.5rem', 
                  height: '2.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  color: '#ef4444', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileText size={20} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {pdf.subjectCode && (
                  <span 
                    style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      padding: '0.15rem 0.45rem', 
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-app)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {pdf.subjectCode}
                  </span>
                )}
                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    padding: '0.15rem 0.45rem', 
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}
                >
                  {pdf.unit}
                </span>
              </div>
            </div>

            {/* Title & Filename */}
            <h4 
              style={{ 
                fontSize: '0.925rem', 
                fontWeight: 700, 
                color: 'var(--text-primary)', 
                marginBottom: '0.4rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                minWidth: 0
              }}
              title={pdf.filename}
            >
              {pdf.filename}
            </h4>

            {/* Hierarchical Breadcrumb: Subject → Unit → PDF */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.3rem', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)', 
                marginBottom: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0
              }}
              title={`${pdf.subjectName || pdf.folder} → ${pdf.unit} → ${pdf.filename}`}
            >
              <Folder size={12} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {pdf.subjectName ? `${pdf.subjectName} → ${pdf.unit}` : pdf.relPath}
              </span>
            </div>

            {/* Meta details: size + date */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                marginTop: 'auto',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                minWidth: 0
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                {pdf.sizeFormatted}
              </span>
              <span>{pdf.lastModified}</span>
            </div>

            {/* Quick Action Buttons */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                marginTop: '0.75rem',
                paddingTop: '0.5rem',
                minWidth: 0
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onOpenPDF(pdf)}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                title="Open in document reader"
                aria-label={`Read ${pdf.filename}`}
              >
                <Eye size={13} />
                <span>Read</span>
              </button>

              <button
                onClick={(e) => handleOpenNewTab(e, pdf)}
                className="btn btn-ghost"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                title="Open in new browser tab"
                aria-label={`Open ${pdf.filename} in new browser tab`}
              >
                <ExternalLink size={13} />
              </button>

              <button
                onClick={(e) => handleDownload(e, pdf)}
                className="btn btn-ghost"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                title="Download original file"
                aria-label={`Download ${pdf.filename}`}
              >
                <Download size={13} />
              </button>

              {pdf.relatedNoteId && onOpenNote && (
                <button
                  onClick={() => onOpenNote(pdf.relatedNoteId!)}
                  className="btn btn-ghost"
                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}
                  title="View corresponding AI study notes"
                  aria-label={`View AI study notes for ${pdf.filename}`}
                >
                  <BookOpen size={13} />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    );
  }

  /* ========================================================================== */
  /* HELPER: Render PDF Table List View                                         */
  /* ========================================================================== */
  function renderPDFTable(pdfs: PDFDocument[]) {
    return (
      <div 
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Document Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Subject & Unit Hierarchy</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '100px' }}>Size</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, width: '110px' }}>Modified</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right', width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pdfs.map((pdf, idx) => (
              <tr 
                key={pdf.id}
                onClick={() => onOpenPDF(pdf)}
                style={{
                  borderBottom: idx < pdfs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color var(--duration-fast) ease'
                }}
                className="pdf-list-row"
              >
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <FileText size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {pdf.filename}
                    </span>
                  </div>
                </td>

                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Folder size={13} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{pdf.subjectName || pdf.folder}</span>
                    <span style={{ opacity: 0.5 }}>→</span>
                    <span className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>{pdf.unit}</span>
                  </div>
                </td>

                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {pdf.sizeFormatted}
                </td>

                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                  {pdf.lastModified}
                </td>

                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => onOpenPDF(pdf)}
                      className="btn btn-ghost"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                      title="Read PDF"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={(e) => handleOpenNewTab(e, pdf)}
                      className="btn btn-ghost"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                      title="Open in new tab"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, pdf)}
                      className="btn btn-ghost"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </button>
                    {pdf.relatedNoteId && onOpenNote && (
                      <button
                        onClick={() => onOpenNote(pdf.relatedNoteId!)}
                        className="btn btn-ghost"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}
                        title="View AI study notes"
                      >
                        <BookOpen size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};
