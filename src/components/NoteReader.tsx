import React, { useState, useEffect, useMemo } from 'react';
import { Note } from '../types';
import { NOTES } from '../data/notesData';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  Type, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  List,
  Info,
  Lightbulb,
  AlertTriangle,
  Flame,
  FileText
} from 'lucide-react';

interface NoteReaderProps {
  note: Note;
  onBack: () => void;
  onOpenNote: (noteId: string) => void;
  onOpenSubject: (subjectCode: string) => void;
  onOpenPDFLibrary?: (subjectCode?: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (noteId: string) => void;
}

export const NoteReader: React.FC<NoteReaderProps> = ({
  note,
  onBack,
  onOpenNote,
  onOpenSubject,
  onOpenPDFLibrary,
  isBookmarked,
  onToggleBookmark
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll Progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scroll)));

      // Detect active TOC heading
      for (const item of [...note.tableOfContents].reverse()) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveHeadingId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [note]);

  // Previous & Next Notes navigation
  const currentIndex = NOTES.findIndex(n => n.id === note.id);
  const prevNote = currentIndex > 0 ? NOTES[currentIndex - 1] : null;
  const nextNote = currentIndex < NOTES.length - 1 ? NOTES[currentIndex + 1] : null;

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeadingId(id);
    }
  };

  const fontSizeClass = fontSize === 'sm' ? '0.95rem' : fontSize === 'lg' ? '1.15rem' : '1.05rem';

  // Markdown parser & renderer
  const renderedContent = useMemo(() => {
    const lines = note.content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks (```language ... ```)
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'text';
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        const fullCode = codeLines.join('\n');
        const codeId = `code-${elements.length}`;

        elements.push(
          <div key={codeId} className="code-block-container">
            <div className="code-block-header">
              <span>{lang.toUpperCase()}</span>
              <button 
                className="code-copy-btn"
                onClick={() => handleCopyCode(fullCode, codeId)}
              >
                {copiedCodeId === codeId ? (
                  <>
                    <Check size={13} style={{ color: '#4ade80' }} />
                    <span style={{ color: '#4ade80' }}>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="code-block-body">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // GitHub Callouts (> [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION])
      if (line.startsWith('> [!')) {
        const typeMatch = line.match(/> \[!(NOTE|TIP|WARNING|CAUTION)\]/i);
        const type = (typeMatch ? typeMatch[1].toUpperCase() : 'NOTE') as 'NOTE' | 'TIP' | 'WARNING' | 'CAUTION';
        const calloutLines: string[] = [];
        i++;
        while (i < lines.length && lines[i].startsWith('>')) {
          calloutLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        const calloutText = calloutLines.join('\n');

        const calloutClasses = {
          NOTE: 'callout callout-note',
          TIP: 'callout callout-tip',
          WARNING: 'callout callout-warn',
          CAUTION: 'callout callout-caution'
        };

        const calloutIcons = {
          NOTE: <Info size={16} style={{ color: 'var(--accent-primary)' }} />,
          TIP: <Lightbulb size={16} style={{ color: '#059669' }} />,
          WARNING: <AlertTriangle size={16} style={{ color: '#d97706' }} />,
          CAUTION: <Flame size={16} style={{ color: '#dc2626' }} />
        };

        elements.push(
          <div key={`callout-${i}`} className={calloutClasses[type]}>
            <div className="callout-title">
              {calloutIcons[type]}
              <span>{type}</span>
            </div>
            <div style={{ fontSize: '0.9rem' }}>{calloutText}</div>
          </div>
        );
        continue;
      }

      // Markdown Tables (| Header | Header |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        if (tableLines.length >= 2) {
          const headerCells = tableLines[0].split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const bodyRows = tableLines.slice(2).map(row => 
            row.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          );

          elements.push(
            <div key={`table-${i}`} className="table-container">
              <table className="markdown-table">
                <thead>
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx}>{h.replace(/\*\*/g, '')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((r, rIdx) => (
                    <tr key={rIdx}>
                      {r.map((cell, cIdx) => (
                        <td key={cIdx}>{cell.replace(/\*\*/g, '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Headings
      if (line.startsWith('# ')) {
        // Main title already shown in header
        i++;
        continue;
      } else if (line.startsWith('## ')) {
        const titleText = line.replace('## ', '').trim();
        // Match TOC ID if available
        const matchedToc = note.tableOfContents.find(t => titleText.toLowerCase().includes(t.title.toLowerCase().slice(0, 10)));
        const headingId = matchedToc ? matchedToc.id : titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        elements.push(
          <h2 key={`h2-${i}`} id={headingId}>
            {titleText}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        const titleText = line.replace('### ', '').trim();
        const headingId = titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h3 key={`h3-${i}`} id={headingId}>
            {titleText}
          </h3>
        );
      } else if (line.startsWith('---')) {
        elements.push(<hr key={`hr-${i}`} />);
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <li key={`li-${i}`}>
            {bulletText}
          </li>
        );
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${i}`}>
            {line}
          </p>
        );
      }

      i++;
    }

    return elements;
  }, [note, copiedCodeId]);

  return (
    <>
      {/* Sticky Reading Progress Top Bar */}
      <div className="reading-progress-container">
        <div 
          className="reading-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="container" style={{ padding: '1.5rem 1.25rem 4rem 1.25rem' }}>
        
        {/* Navigation Breadcrumb & Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="breadcrumbs" style={{ margin: 0 }}>
            <button onClick={onBack} style={{ color: 'var(--text-muted)' }}>
              Subjects
            </button>
            <span className="breadcrumb-sep">/</span>
            <button 
              onClick={() => onOpenSubject(note.subjectCode)} 
              style={{ color: 'var(--text-muted)', fontWeight: 600 }}
            >
              {note.subjectCode}
            </button>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              Unit {note.unitNumber}
            </span>
          </div>

          {/* Reader Tool Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Font Size Selector */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: '0.15rem' }}>
              {(['sm', 'md', 'lg'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    backgroundColor: fontSize === size ? 'var(--bg-surface)' : 'transparent',
                    color: fontSize === size ? 'var(--accent-primary)' : 'var(--text-muted)'
                  }}
                  title={`Font size ${size.toUpperCase()}`}
                >
                  {size === 'sm' ? 'A-' : size === 'md' ? 'A' : 'A+'}
                </button>
              ))}
            </div>

            <button 
              className="icon-btn"
              onClick={() => onToggleBookmark(note.id)}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
              style={{ color: isBookmarked ? 'var(--accent-primary)' : 'inherit' }}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>

            <button 
              className="icon-btn"
              onClick={handleCopyLink}
              title="Copy Note Link"
            >
              {copiedLink ? <Check size={16} style={{ color: '#059669' }} /> : <Share2 size={16} />}
            </button>

            <button 
              className="icon-btn"
              onClick={() => window.print()}
              title="Print or Save as PDF"
            >
              <Printer size={16} />
            </button>

            {onOpenPDFLibrary && (
              <button
                onClick={() => onOpenPDFLibrary(note.subjectCode)}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                title="Open original source PDF documents for this subject"
              >
                <FileText size={13} />
                <span>Original PDFs</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Editorial Reader Layout */}
        <div className="note-reader-layout">
          
          {/* Main Reading Column */}
          <article className="note-main-content">
            
            {/* Note Meta Header */}
            <header className="note-header-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="subject-code-tag">
                  {note.subjectCode}
                </span>
                <span className="meta-pill">
                  Unit {note.unitNumber}
                </span>
                <span className="meta-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={12} />
                  {note.readTime}
                </span>
              </div>

              <h1 className="note-title">
                {note.title}
              </h1>

              <div className="note-meta-bar">
                <span>{note.subjectName}</span>
                <div className="note-tags">
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="note-tag">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Markdown Body */}
            <div className="markdown-body" style={{ fontSize: fontSizeClass }}>
              {renderedContent}
            </div>

            {/* Previous & Next Article Navigation */}
            <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
              {prevNote ? (
                <button
                  onClick={() => onOpenNote(prevNote.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ChevronLeft size={14} /> Previous Note
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {prevNote.title}
                  </span>
                </button>
              ) : <div />}

              {nextNote ? (
                <button
                  onClick={() => onOpenNote(nextNote.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'right',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                    Next Note <ChevronRight size={14} />
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                    {nextNote.title}
                  </span>
                </button>
              ) : <div />}
            </nav>
          </article>

          {/* Table of Contents Sticky Sidebar */}
          <aside className="toc-sidebar">
            <div className="toc-title">
              <List size={14} />
              Table of Contents
            </div>
            <ul className="toc-list">
              {note.tableOfContents.map(item => (
                <li key={item.id}>
                  <button
                    className={`toc-link ${activeHeadingId === item.id ? 'active' : ''}`}
                    onClick={() => scrollToHeading(item.id)}
                    style={{ textAlign: 'left', width: '100%' }}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div>Subject: <strong>{note.subjectCode}</strong></div>
              <div>Curriculum: OBE / CBCS Scheme</div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
