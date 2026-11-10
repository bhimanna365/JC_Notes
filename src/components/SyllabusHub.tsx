import React, { useState } from 'react';
import { PDFDocument } from '../types';
import { getSyllabusPDFs } from '../data/pdfManifest';
import { resolvePdfUrl, downloadPdf, openPdfInNewTab } from '../utils/pdfResolver';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Eye, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Cpu,
  Database,
  Code2,
  Binary,
  Sigma
} from 'lucide-react';

interface SyllabusHubProps {
  onBack: () => void;
  onOpenPDF: (pdf: PDFDocument) => void;
  onOpenSubject?: (subjectCode: string) => void;
}

const SYLLABUS_METADATA: Record<string, { code: string; title: string; credits: number; hours: string; category: string; icon: React.ReactNode; color: string; bgSoft: string }> = {
  'co-syllabus.pdf': {
    code: '24CS340',
    title: 'Computer Organization',
    credits: 4,
    hours: '4:0:0',
    category: 'Core CS (PCC)',
    icon: <Binary size={22} />,
    color: '#f59e0b',
    bgSoft: 'rgba(245, 158, 11, 0.1)'
  },
  'dms-syllabus.pdf': {
    code: '24CS350',
    title: 'Discrete Mathematical Structures',
    credits: 3,
    hours: '3:0:0',
    category: 'Core CS (PCC)',
    icon: <Layers size={22} />,
    color: '#10b981',
    bgSoft: 'rgba(16, 185, 129, 0.1)'
  },
  'ds-lab.pdf': {
    code: '24CS36L',
    title: 'Data Structures Laboratory',
    credits: 1.5,
    hours: '0:0:3',
    category: 'Practical (PCCL)',
    icon: <Code2 size={22} />,
    color: '#059669',
    bgSoft: 'rgba(5, 150, 105, 0.1)'
  },
  'ds-syllabus.pdf': {
    code: '24CS330',
    title: 'Data Structures',
    credits: 4,
    hours: '3:0:2',
    category: 'Core CS (PCC)',
    icon: <Database size={22} />,
    color: '#6366f1',
    bgSoft: 'rgba(99, 102, 241, 0.1)'
  },
  'dsd-syllabus.pdf': {
    code: '24CS320',
    title: 'Digital System Design',
    credits: 4,
    hours: '3:0:2',
    category: 'Core CS (PCC)',
    icon: <Cpu size={22} />,
    color: '#0284c7',
    bgSoft: 'rgba(2, 132, 199, 0.1)'
  },
  'uhv-syllabus.pdf': {
    code: '24HU311',
    title: 'Universal Human Values - II',
    credits: 1,
    hours: '1:0:0',
    category: 'Humanities (HSMC)',
    icon: <GraduationCap size={22} />,
    color: '#06b6d4',
    bgSoft: 'rgba(6, 182, 212, 0.1)'
  },
  'math-3-syllabus.pdf': {
    code: '24MA313',
    title: 'Engineering Mathematics - III',
    credits: 3,
    hours: '3:0:0',
    category: 'Basic Science (BSC)',
    icon: <Sigma size={22} />,
    color: '#ec4899',
    bgSoft: 'rgba(236, 72, 153, 0.1)'
  },
  'oop-syllabus.pdf': {
    code: '24CS310',
    title: 'Object Oriented Programming using C++',
    credits: 3,
    hours: '3:0:0',
    category: 'Core CS (PCC)',
    icon: <Code2 size={22} />,
    color: '#8b5cf6',
    bgSoft: 'rgba(139, 92, 246, 0.1)'
  }
};

export const SyllabusHub: React.FC<SyllabusHubProps> = ({
  onBack,
  onOpenPDF,
  onOpenSubject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const syllabusPdfs = getSyllabusPDFs();

  const filteredPdfs = syllabusPdfs.filter(pdf => {
    const meta = SYLLABUS_METADATA[pdf.filename.toLowerCase()] || { code: '', title: pdf.title };
    const q = searchQuery.toLowerCase();
    return (
      pdf.filename.toLowerCase().includes(q) ||
      meta.code.toLowerCase().includes(q) ||
      meta.title.toLowerCase().includes(q) ||
      meta.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container" id="syllabus-2026-content" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      
      {/* Top Back Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} style={{ color: '#059669' }} />
          <span>Official Autonomous 2026 Scheme • JSS Science & Technology University</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div 
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid rgba(37, 99, 235, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={12} />
            01.Syllabus-26
          </span>
          <span className="meta-pill">8 Academic Syllabi</span>
          <span className="meta-pill">Autonomous CBCS / OBE</span>
          <span className="meta-pill">Semester III Computer Science</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
          📋 Official Curriculum & Syllabi 2026
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
          Authentic syllabus specifications directly from the academic board of <strong>JSS STU (SJCE Mysuru)</strong>. Contains exact unit breakdowns, credit allocations, prerequisite proficiencies, lecture hours, practical experiments, and textbook/reference recommendations.
        </p>

        {/* Search Bar */}
        <div style={{ marginTop: '1.5rem', position: 'relative', maxWidth: '480px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Filter syllabus by course code or subject name..."
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

      {/* Syllabi Cards Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', 
          gap: '1.25rem' 
        }}
      >
        {filteredPdfs.map(pdf => {
          const meta = SYLLABUS_METADATA[pdf.filename.toLowerCase()] || {
            code: pdf.subjectCode || '2026',
            title: pdf.title,
            credits: 3,
            hours: '3:0:0',
            category: 'Academic Syllabus',
            icon: <FileText size={22} />,
            color: 'var(--accent-primary)',
            bgSoft: 'var(--bg-elevated)'
          };

          return (
            <div
              key={pdf.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all var(--duration-fast) ease'
              }}
              className="lab-hub-card"
            >
              {/* Header: Icon + Code + Credits */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div 
                  style={{ 
                    width: '3.25rem', 
                    height: '3.25rem', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: meta.bgSoft, 
                    color: meta.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {meta.icon}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span className="subject-code-tag" style={{ fontSize: '0.8rem', padding: '0.2rem 0.55rem' }}>
                    {meta.code}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {meta.credits} Credits • {meta.hours}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                {meta.title}
              </h3>

              {/* Category pill */}
              <div style={{ marginBottom: '1rem' }}>
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: 'var(--bg-elevated)', 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  {meta.category}
                </span>
              </div>

              {/* File Specs */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                <span>File: <code>{pdf.filename}</code></span>
                <span style={{ fontWeight: 600 }}>{pdf.sizeFormatted}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => onOpenPDF(pdf)}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Eye size={14} />
                  <span>Read Syllabus</span>
                </button>

                <button
                  onClick={() => openPdfInNewTab(pdf)}
                  className="btn btn-ghost"
                  style={{ padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
                  title="Open syllabus PDF in new browser tab"
                >
                  <ExternalLink size={15} />
                </button>

                <button
                  onClick={() => downloadPdf(pdf)}
                  className="btn btn-ghost"
                  style={{ padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
                  title="Download original 2026 syllabus PDF"
                >
                  <Download size={15} />
                </button>

                {onOpenSubject && (
                  <button
                    onClick={() => onOpenSubject(meta.code)}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.6rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                    title="View full course materials and notes"
                  >
                    Course
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
