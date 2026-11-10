import React, { useState } from 'react';
import { LabProgram } from '../types';
import { LAB_PROGRAMS } from '../data/labsData';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Search, 
  Terminal, 
  Cpu, 
  Layers, 
  CheckCircle,
  Clock,
  HardDrive
} from 'lucide-react';

interface LabViewerProps {
  initialLabId?: string;
  onSelectSubject?: (subjectCode: string) => void;
}

export const LabViewer: React.FC<LabViewerProps> = ({ initialLabId }) => {
  const [selectedLabId, setSelectedLabId] = useState<string>(initialLabId || LAB_PROGRAMS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'c' | 'cpp'>('all');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeLab = LAB_PROGRAMS.find(l => l.id === selectedLabId) || LAB_PROGRAMS[0];

  const filteredLabs = LAB_PROGRAMS.filter(lab => {
    const matchesSearch = 
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = languageFilter === 'all' || lab.language === languageFilter;
    return matchesSearch && matchesLang;
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeLab.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([activeLab.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeLab.id}.${activeLab.language === 'cpp' ? 'cpp' : 'c'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="subject-code-tag">24CS36L & 24CS310</span>
          <span className="meta-pill">Laboratory Programs & Solutions</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Programming & Laboratory Manual
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Complete, verified C and C++ source code, step-by-step algorithms, sample inputs/outputs, and complexity analysis for all curriculum lab assignments.
        </p>
      </div>

      {/* 2-Column Layout: Sidebar of Experiments + Main Code Pane */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: List of Lab Programs */}
        <div 
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Search inside labs */}
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter experiments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-app)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          {/* Language filter pills */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem' }}>
            {(['all', 'c', 'cpp'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(lang)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: languageFilter === lang ? 'var(--text-primary)' : 'var(--bg-elevated)',
                  color: languageFilter === lang ? 'var(--bg-surface)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {lang === 'all' ? 'All (18)' : lang === 'c' ? 'C (16)' : 'C++ (2)'}
              </button>
            ))}
          </div>

          {/* List items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '600px', overflowY: 'auto' }}>
            {filteredLabs.map(lab => {
              const isSelected = lab.id === selectedLabId;
              return (
                <button
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-strong)' : '1px solid transparent',
                    transition: 'all var(--duration-fast) ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {lab.number}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 700, 
                        padding: '0.1rem 0.35rem', 
                        borderRadius: '3px',
                        backgroundColor: lab.language === 'cpp' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(37, 99, 235, 0.15)',
                        color: lab.language === 'cpp' ? '#059669' : '#2563eb'
                      }}
                    >
                      {lab.language.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 600 : 400, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {lab.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lab Detail Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Header Card */}
          <div 
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="subject-code-tag">{activeLab.number}</span>
                <span className="meta-pill">{activeLab.subjectCode}</span>
                <span className="meta-pill">{activeLab.language.toUpperCase()}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleDownloadCode}
                  title="Download source code"
                >
                  <Download size={14} />
                  Download
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleCopyCode}
                  title="Copy code to clipboard"
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {activeLab.title}
            </h2>

            {/* Problem Statement Callout */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              <strong>Problem Statement:</strong>
              <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>{activeLab.question}</p>
            </div>
          </div>

          {/* Concept & Algorithm */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Concept */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <Cpu size={16} style={{ color: 'var(--accent-primary)' }} />
                Conceptual Background
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {activeLab.concept}
              </p>
            </div>

            {/* Algorithm Steps */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <Layers size={16} style={{ color: '#059669' }} />
                Algorithm
              </div>
              <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {activeLab.algorithm.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Full Source Code Block */}
          <div className="code-block-container" style={{ margin: 0 }}>
            <div className="code-block-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Code2 size={14} />
                <span>{activeLab.id}.{activeLab.language === 'cpp' ? 'cpp' : 'c'}</span>
              </div>
              <button className="code-copy-btn" onClick={handleCopyCode}>
                {copiedCode ? <Check size={13} style={{ color: '#4ade80' }} /> : <Copy size={13} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="code-block-body" style={{ maxHeight: '480px', overflowY: 'auto' }}>
              <code>{activeLab.code}</code>
            </pre>
          </div>

          {/* Sample Input / Output */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              <Terminal size={16} style={{ color: '#d97706' }} />
              Sample Execution Input & Output
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  INPUT SCENARIO:
                </div>
                <pre style={{ backgroundColor: 'var(--code-bg)', color: 'var(--code-text)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {activeLab.sampleInput}
                </pre>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  EXPECTED OUTPUT:
                </div>
                <pre style={{ backgroundColor: 'var(--code-bg)', color: '#4ade80', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {activeLab.sampleOutput}
                </pre>
              </div>
            </div>
          </div>

          {/* Complexity & Viva Points */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Complexity */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} style={{ color: 'var(--accent-primary)' }} />
                Complexity Analysis
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div><strong>Time Complexity:</strong> <span style={{ color: 'var(--text-secondary)' }}>{activeLab.complexity.time}</span></div>
                <div><strong>Space Complexity:</strong> <span style={{ color: 'var(--text-secondary)' }}>{activeLab.complexity.space}</span></div>
              </div>
            </div>

            {/* Viva Key Points */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={15} style={{ color: '#059669' }} />
                Practical Exam & Viva Voce Points
              </div>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {activeLab.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
