import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Code2, FileText, ArrowRight, CornerDownLeft, FlaskConical } from 'lucide-react';
import { searchAll } from '../utils/searchEngine';
import { syncPdfInventory, subscribeToPdfRegistry } from '../utils/pdfRegistry';
import { SearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'notes' | 'subjects' | 'labs' | 'pyq' | 'pdf'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      // Sync latest uploaded PDFs from backend in background
      syncPdfInventory().then(() => {
        if (query.trim()) {
          setResults(searchAll(query, activeFilter));
        }
      });
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Subscribe to real-time additions (e.g. from Socket.IO or background uploads)
  useEffect(() => {
    const unsubscribe = subscribeToPdfRegistry(() => {
      if (query.trim()) {
        setResults(searchAll(query, activeFilter));
      }
    });
    return unsubscribe;
  }, [query, activeFilter]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const res = searchAll(query, activeFilter);
    setResults(res);
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onNavigate(results[selectedIndex].route);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  const handleSelect = (route: string) => {
    onNavigate(route);
    onClose();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'note': return <BookOpen size={16} style={{ color: 'var(--accent-primary)' }} />;
      case 'pdf': return <FileText size={16} style={{ color: '#ef4444' }} />;
      case 'lab': return <FlaskConical size={16} style={{ color: '#10b981' }} />;
      case 'pyq': return <FileText size={16} style={{ color: '#d97706' }} />;
      default: return <BookOpen size={16} style={{ color: '#7c3aed' }} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        {/* Input Header */}
        <div className="search-modal-header">
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search notes, original PDFs, lab programs, courses..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
            >
              <X size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="kbd-badge"
            style={{ cursor: 'pointer' }}
          >
            ESC
          </button>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '0.4rem', padding: '0.6rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', overflowX: 'auto' }}>
          {(['all', 'notes', 'pdf', 'subjects', 'labs', 'pyq'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeFilter === f ? 'var(--text-primary)' : 'var(--bg-surface)',
                color: activeFilter === f ? 'var(--bg-surface)' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {f === 'pyq' ? 'Exam Papers' : f === 'pdf' ? 'PDF Notes' : f === 'labs' ? 'Laboratory' : f}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="search-results-list">
          {query.trim() === '' ? (
            <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Instant Academic Search
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                Search for topics like <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>"Binary Search Tree"</span>, <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>"Booth's Algorithm"</span>, <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>"Friend Functions"</span>, or course code <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>"24CS330"</span>.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                No academic resources found
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                No matching material for "{query}". Try checking your spelling or selecting another filter.
              </p>
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={item.id}
                className={`search-result-item ${selectedIndex === idx ? 'selected' : ''}`}
                onClick={() => handleSelect(item.route)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="search-result-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getIconForType(item.type)}
                    <span>{item.title}</span>
                  </div>
                  <span className="badge" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    {item.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.subtitle}
                </div>
                {item.snippet && (
                  <div className="search-result-snippet">
                    {item.snippet}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.25rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-app)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span><kbd className="kbd-badge">↑</kbd> <kbd className="kbd-badge">↓</kbd> to navigate</span>
            <span><kbd className="kbd-badge">↵</kbd> to open</span>
          </div>
          <span>JC Student Notes Search</span>
        </div>
      </div>
    </div>
  );
};
