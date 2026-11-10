import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Cpu, 
  Code2, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  ArrowLeft, 
  Copy, 
  Check, 
  BookOpen, 
  Sliders, 
  Layers,
  Sparkles,
  Terminal,
  FileCheck
} from 'lucide-react';
import { LABORATORY_COURSES, getLaboratoryById } from '../data/laboratoryData';
import { LaboratoryCourse, LabExperiment, PDFDocument } from '../types';
import { findPdfDocument, resolvePdfUrl, downloadPdf, openPdfInNewTab } from '../utils/pdfResolver';

interface LaboratoryHubProps {
  initialLabId?: string;
  onOpenPDF: (pdf: PDFDocument) => void;
  onSelectSubject: (courseCode: string) => void;
}

export const LaboratoryHub: React.FC<LaboratoryHubProps> = ({
  initialLabId,
  onOpenPDF,
  onSelectSubject
}) => {
  const [selectedLabId, setSelectedLabId] = useState<string | null>(initialLabId || null);
  const [activeTab, setActiveTab] = useState<'records' | 'programs' | 'supporting'>('records');
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Synchronize selectedLabId when initialLabId prop changes from routing
  useEffect(() => {
    if (initialLabId) {
      setSelectedLabId(initialLabId);
    }
  }, [initialLabId]);

  // Digital Logic Simulator state for DSD
  const [simA, setSimA] = useState<boolean>(false);
  const [simB, setSimB] = useState<boolean>(false);

  const selectedLab: LaboratoryCourse | undefined = selectedLabId 
    ? getLaboratoryById(selectedLabId) 
    : undefined;

  const currentExperiment = selectedLab?.experiments.find(e => 
    selectedExperimentId ? e.id === selectedExperimentId : true
  ) || selectedLab?.experiments[0];

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadCode = (codeText: string, filename: string) => {
    const blob = new Blob([codeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter laboratories based on search if on main landing page
  const filteredLabs = LABORATORY_COURSES.filter(lab => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lab.title.toLowerCase().includes(q) ||
      lab.code.toLowerCase().includes(q) ||
      lab.shortName.toLowerCase().includes(q) ||
      lab.description.toLowerCase().includes(q) ||
      lab.experiments.some(e => e.title.toLowerCase().includes(q) || e.question.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* 1. Header Banner */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
              PRACTICAL CURRICULUM
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>JSS STU • CSE Sem 3</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                🧪 Academic Laboratories
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px', lineHeight: 1.6 }}>
                Dedicated laboratory resource center housing authentic master laboratory records, official faculty manuals, interactive C/C++ program implementations, and hardware experiments.
              </p>
            </div>

            {/* Global Search within Labs */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lab manuals, experiments, codes..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  backgroundColor: 'var(--bg-app)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Breadcrumbs if a lab is selected */}
          {selectedLab && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => {
                  setSelectedLabId(null);
                  setSelectedExperimentId(null);
                  if (typeof window !== 'undefined') {
                    window.history.pushState(null, '', '#laboratory');
                  }
                  setTimeout(() => {
                    const el = document.getElementById('laboratory-content');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 40);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
              >
                <ArrowLeft size={16} /> All Laboratories
              </button>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {selectedLab.shortName} ({selectedLab.code})
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className="container" id="laboratory-content" style={{ marginTop: '2rem' }}>
        
        {/* VIEW A: LANDING PAGE (All 3 Laboratories) */}
        {!selectedLab && (
          <div>
            {/* Quick Stat Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Laboratory Courses
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  3 Core Labs
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  DS Lab • DSD Lab • OOP Lab
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Master Lab Records
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  3 Master Manuals
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  DS Record (53.2 MB) • DSD Record (20.5 MB)
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Programs & Experiments
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  28+ Experiments
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Verified code, algorithms & test cases
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Curriculum Assessment
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  100 Marks Each
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  CIE: 40 Marks • SEE: 60 Marks
                </div>
              </div>
            </div>

            {/* Three Primary Laboratory Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {filteredLabs.map((lab) => {
                const isDS = lab.id === 'ds';
                const isDSD = lab.id === 'dsd';
                const isOOP = lab.id === 'oop';

                const themeColor = isDS ? '#10b981' : (isDSD ? '#3b82f6' : '#8b5cf6');
                const themeBg = isDS ? 'rgba(16, 185, 129, 0.1)' : (isDSD ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)');
                const IconComponent = isDS ? FlaskConical : (isDSD ? Cpu : Code2);

                return (
                  <div
                    key={lab.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--border-subtle)',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all var(--duration-fast) ease',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                    className="lab-hub-card"
                  >
                    <div>
                      {/* Top Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: 'var(--radius-md)', backgroundColor: themeBg, color: themeColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconComponent size={26} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: themeBg, color: themeColor, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                            {lab.code}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>
                            {lab.type}
                          </div>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {lab.title}
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {lab.description}
                      </p>

                      {/* Feature Highlights List */}
                      <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FileCheck size={15} style={{ color: themeColor }} /> Available Practical Resources:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                          <li><strong>{lab.recordsAndManuals.length} Manuals & Records:</strong> {lab.recordsAndManuals.map(r => r.filename).join(', ')}</li>
                          <li><strong>{lab.experiments.length} Experiments / Programs:</strong> with algorithms & sample I/O</li>
                          <li><strong>{lab.supportingDocuments.length} Supporting Documents:</strong> assignment sheets & CIE papers</li>
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => {
                          setSelectedLabId(lab.id);
                          setActiveTab('records');
                          if (typeof window !== 'undefined') {
                            window.history.pushState(null, '', `#laboratory/${lab.id}`);
                          }
                          setTimeout(() => {
                            const el = document.getElementById('selected-lab-detail-container');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 40);
                        }}
                        className="btn btn-primary"
                        style={{ flex: 1, backgroundColor: themeColor, borderColor: themeColor, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                      >
                        Enter {lab.shortName} <ChevronRight size={16} />
                      </button>

                      {/* Quick access to Master Record */}
                      {lab.recordsAndManuals[0]?.format === 'pdf' && (
                        <button
                          onClick={() => {
                            const rec = lab.recordsAndManuals[0];
                            const canonical = findPdfDocument(rec.relPath) || findPdfDocument(rec.filename);
                            if (canonical) {
                              onOpenPDF(canonical);
                            } else {
                              onOpenPDF({
                                id: `pdf-${rec.relPath.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                                filename: rec.filename,
                                title: rec.title,
                                relPath: rec.relPath,
                                url: resolvePdfUrl(rec.relPath),
                                folder: rec.relPath.split('/')[0] || 'Laboratory',
                                subfolder: '',
                                unit: 'Laboratory Record',
                                category: lab.shortName,
                                sizeBytes: 0,
                                sizeFormatted: rec.sizeFormatted,
                                lastModified: 'Current',
                                isManualRecord: true,
                                isLabResource: true
                              });
                            }
                          }}
                          className="btn btn-outline"
                          title={`Open ${lab.recordsAndManuals[0].filename}`}
                          style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                        >
                          <BookOpen size={15} /> Read Record
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW B: SPECIFIC LABORATORY DETAIL VIEW */}
        {selectedLab && (
          <div id="selected-lab-detail-container">
            {/* Lab Overview Card */}
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                      {selectedLab.code}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)', fontWeight: 600 }}>
                      {selectedLab.credits}
                    </span>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                      CIE: {selectedLab.cieMarks} | SEE: {selectedLab.seeMarks}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedLab.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '850px' }}>
                    {selectedLab.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onSelectSubject(selectedLab.code === '24CS36L' ? '24CS330' : selectedLab.code)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <BookOpen size={15} /> View Theory Course
                  </button>
                </div>
              </div>

              {/* Course Outcomes Tags */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {selectedLab.courseOutcomes.map((co) => (
                  <div key={co.co} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem', maxWidth: '360px' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>{co.co} ({co.level}):</strong> {co.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
              <button
                onClick={() => setActiveTab('records')}
                style={{
                  padding: '0.75rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  borderBottom: activeTab === 'records' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'records' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all var(--duration-fast) ease'
                }}
              >
                <BookOpen size={16} /> Lab Records & Manuals ({selectedLab.recordsAndManuals.length})
              </button>

              <button
                onClick={() => setActiveTab('programs')}
                style={{
                  padding: '0.75rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  borderBottom: activeTab === 'programs' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'programs' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all var(--duration-fast) ease'
                }}
              >
                <Code2 size={16} /> Programs & Experiments ({selectedLab.experiments.length})
              </button>

              <button
                onClick={() => setActiveTab('supporting')}
                style={{
                  padding: '0.75rem 1.25rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  borderBottom: activeTab === 'supporting' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === 'supporting' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all var(--duration-fast) ease'
                }}
              >
                <FileText size={16} /> Supporting Files & Papers ({selectedLab.supportingDocuments.length})
              </button>
            </div>

            {/* TAB 1: LAB RECORDS & MANUALS */}
            {activeTab === 'records' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {selectedLab.recordsAndManuals.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: record.filename.toLowerCase().includes('record') 
                        ? '2px solid rgba(16, 185, 129, 0.4)' 
                        : '1px solid var(--border-subtle)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          backgroundColor: record.filename.toLowerCase().includes('record') ? 'rgba(16, 185, 129, 0.15)' : 'var(--accent-subtle)', 
                          color: record.filename.toLowerCase().includes('record') ? '#10b981' : 'var(--accent-text)', 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '4px' 
                        }}>
                          {record.badge}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {record.sizeFormatted}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {record.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
                        📁 {record.relPath}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        {record.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      {record.format === 'pdf' ? (
                        <button
                          onClick={() => {
                            const canonical = findPdfDocument(record.relPath) || findPdfDocument(record.filename);
                            if (canonical) {
                              onOpenPDF(canonical);
                            } else {
                              onOpenPDF({
                                id: `pdf-${record.relPath.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                                filename: record.filename,
                                title: record.title,
                                relPath: record.relPath,
                                url: resolvePdfUrl(record.relPath),
                                folder: record.relPath.split('/')[0] || 'Laboratory',
                                subfolder: '',
                                unit: 'Laboratory Record',
                                category: selectedLab.shortName,
                                sizeBytes: 0,
                                sizeFormatted: record.sizeFormatted,
                                lastModified: 'Current',
                                isManualRecord: true,
                                isLabResource: true
                              });
                            }
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                        >
                          <BookOpen size={16} /> Read Document
                        </button>
                      ) : (
                        <button
                          onClick={() => downloadPdf(record.url, record.filename)}
                          className="btn btn-primary"
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600 }}
                        >
                          <Download size={16} /> Download File
                        </button>
                      )}

                      <button
                        onClick={() => downloadPdf(record.url, record.filename)}
                        className="btn btn-outline"
                        title="Direct Download"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: PROGRAMS & EXPERIMENTS */}
            {activeTab === 'programs' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '1.5rem' }}>
                
                {/* Left Sidebar: Experiment Selector */}
                <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '1rem', height: 'fit-content' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    Experiments & Programs
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {selectedLab.experiments.map((exp) => {
                      const isSelected = (currentExperiment?.id === exp.id);
                      return (
                        <button
                          key={exp.id}
                          onClick={() => setSelectedExperimentId(exp.id)}
                          style={{
                            textAlign: 'left',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid transparent',
                            backgroundColor: isSelected ? 'var(--accent-subtle)' : 'transparent',
                            color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.2rem',
                            transition: 'all var(--duration-fast) ease'
                          }}
                        >
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
                            {exp.number}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500, lineHeight: 1.3 }}>
                            {exp.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Area: Experiment Details & Code Runner */}
                {currentExperiment && (
                  <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '1.75rem' }}>
                    {/* Experiment Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                            {currentExperiment.number}
                          </span>
                          {currentExperiment.language && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(5, 150, 105, 0.15)', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                              {currentExperiment.language.toUpperCase()}
                            </span>
                          )}
                          {currentExperiment.sourceFileName && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Source: {currentExperiment.sourceFileName}
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {currentExperiment.title}
                        </h3>
                      </div>

                      {/* PDF Cross Link Button */}
                      {currentExperiment.relatedPdfUrl && (
                        <button
                          onClick={() => {
                            const pdfUrl = currentExperiment.relatedPdfUrl;
                            if (!pdfUrl) return;
                            const canonical = (currentExperiment.relatedPdfId ? findPdfDocument(currentExperiment.relatedPdfId) : undefined)
                              || findPdfDocument(pdfUrl)
                              || (currentExperiment.relatedPdfTitle ? findPdfDocument(currentExperiment.relatedPdfTitle) : undefined);
                            if (canonical) {
                              onOpenPDF(canonical);
                            } else {
                              onOpenPDF({
                                id: currentExperiment.relatedPdfId || `pdf-${currentExperiment.number.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                                filename: currentExperiment.relatedPdfTitle || 'Document.pdf',
                                title: currentExperiment.relatedPdfTitle || currentExperiment.title,
                                relPath: pdfUrl.replace(/^\/raw-pdf\//, ''),
                                url: resolvePdfUrl(pdfUrl),
                                folder: 'Laboratory',
                                subfolder: '',
                                unit: 'Laboratory Experiment',
                                category: selectedLab.shortName,
                                sizeBytes: 0,
                                sizeFormatted: 'Available',
                                lastModified: 'Current',
                                isManualRecord: false,
                                isLabResource: true
                              });
                            }
                          }}
                          className="btn btn-outline"
                          style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                        >
                          <BookOpen size={15} /> Read Linked PDF
                        </button>
                      )}
                    </div>

                    {/* Question Callout */}
                    <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                        Problem Statement / Aim
                      </div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                        {currentExperiment.question}
                      </p>
                    </div>

                    {/* Concept & Algorithm */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                        Concept & Theory
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {currentExperiment.concept}
                      </p>
                    </div>

                    {currentExperiment.algorithm && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                          Step-by-Step Procedure / Algorithm
                        </h4>
                        <ol style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {currentExperiment.algorithm.map((step, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Hardware Circuit Details for DSD */}
                    {currentExperiment.hardwareDetails && (
                      <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Cpu size={16} style={{ color: '#3b82f6' }} /> ICs & Hardware Components:
                        </h4>
                        <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          {currentExperiment.hardwareDetails.map((hw, idx) => (
                            <li key={idx}>{hw}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive DSD Virtual Simulator if Exp 12 or DSD Simulator */}
                    {selectedLab.id === 'dsd' && (
                      <div style={{ backgroundColor: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid rgba(59, 130, 246, 0.4)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sliders size={18} style={{ color: '#3b82f6' }} />
                            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>
                              Interactive Digital Logic Trainer Kit Simulator
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                            Live Verification
                          </span>
                        </div>

                        {/* Interactive Switches */}
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                          <button
                            onClick={() => setSimA(!simA)}
                            style={{
                              padding: '0.6rem 1.25rem',
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              backgroundColor: simA ? '#10b981' : 'var(--border-strong)',
                              color: '#ffffff',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            Switch A: {simA ? '1 (HIGH)' : '0 (LOW)'}
                          </button>

                          <button
                            onClick={() => setSimB(!simB)}
                            style={{
                              padding: '0.6rem 1.25rem',
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              backgroundColor: simB ? '#10b981' : 'var(--border-strong)',
                              color: '#ffffff',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            Switch B: {simB ? '1 (HIGH)' : '0 (LOW)'}
                          </button>
                        </div>

                        {/* Real-time Logic Gate Outputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                          {[
                            { name: '7408 AND', out: simA && simB },
                            { name: '7432 OR', out: simA || simB },
                            { name: '7404 NOT A', out: !simA },
                            { name: '7400 NAND', out: !(simA && simB) },
                            { name: '7402 NOR', out: !(simA || simB) },
                            { name: '7486 XOR', out: (simA && !simB) || (!simA && simB) }
                          ].map(gate => (
                            <div key={gate.name} style={{ backgroundColor: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{gate.name}</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: gate.out ? '#10b981' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                                {gate.out ? '1 (ON)' : '0 (OFF)'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Syntax-Highlighted Code Block */}
                    {currentExperiment.code && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Terminal size={16} /> Verified Source Implementation:
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleCopyCode(currentExperiment.code!, currentExperiment.id)}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              {copiedCodeId === currentExperiment.id ? (
                                <>
                                  <Check size={14} style={{ color: '#10b981' }} /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={14} /> Copy Code
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDownloadCode(currentExperiment.code!, `${currentExperiment.id}.${currentExperiment.language || 'c'}`)}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <Download size={14} /> Download File
                            </button>
                          </div>
                        </div>

                        <pre style={{
                          backgroundColor: '#0f172a',
                          color: '#e2e8f0',
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          overflowX: 'auto',
                          fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                        }}>
                          <code>{currentExperiment.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Sample Output */}
                    {currentExperiment.sampleOutput && (
                      <div style={{ backgroundColor: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Verified Console Output:
                        </div>
                        <pre style={{ margin: 0, fontSize: '0.82rem', color: '#10b981', fontFamily: 'monospace' }}>
                          {currentExperiment.sampleOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SUPPORTING DOCUMENTS */}
            {activeTab === 'supporting' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {selectedLab.supportingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {doc.format.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {doc.sizeFormatted}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                        {doc.title}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                        {doc.filename}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
                        {doc.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {doc.format === 'pdf' ? (
                        <button
                          onClick={() => {
                            const canonical = findPdfDocument(doc.relPath) || findPdfDocument(doc.filename);
                            if (canonical) {
                              onOpenPDF(canonical);
                            } else {
                              onOpenPDF({
                                id: `pdf-${doc.relPath.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                                filename: doc.filename,
                                title: doc.title,
                                relPath: doc.relPath,
                                url: resolvePdfUrl(doc.relPath),
                                folder: doc.relPath.split('/')[0] || 'Laboratory',
                                subfolder: '',
                                unit: 'Laboratory Supporting Document',
                                category: selectedLab.shortName,
                                sizeBytes: 0,
                                sizeFormatted: doc.sizeFormatted,
                                lastModified: 'Current',
                                isManualRecord: false,
                                isLabResource: true
                              });
                            }
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                        >
                          <BookOpen size={14} /> Open PDF
                        </button>
                      ) : (
                        <button
                          onClick={() => downloadPdf(doc.url, doc.filename)}
                          className="btn btn-primary"
                          style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                        >
                          <Download size={14} /> Download Document
                        </button>
                      )}
                      <button
                        onClick={() => downloadPdf(doc.url, doc.filename)}
                        className="btn btn-outline"
                        title="Direct Download"
                        style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
