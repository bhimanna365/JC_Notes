import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Moon, 
  Sun, 
  Bookmark, 
  Calendar, 
  Code2, 
  FileText, 
  CheckSquare, 
  ChevronDown, 
  Menu, 
  X,
  Layers,
  FlaskConical,
  MessageCircle
} from 'lucide-react';
import { SEMESTERS, CURRENT_SEMESTER_ID } from '../data/semestersData';
import { INSTITUTION_INFO } from '../data/academicData';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, options?: { restoreScroll?: boolean; scrollToId?: string; scrollToTop?: boolean }) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeSemester: number;
  onSelectSemester: (semId: number) => void;
  bookmarksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch,
  onOpenBookmarks,
  theme,
  onToggleTheme,
  activeSemester,
  onSelectSemester,
  bookmarksCount
}) => {
  const [isSemesterMenuOpen, setIsSemesterMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeSem = SEMESTERS.find(s => s.id === activeSemester) || SEMESTERS[2];

  const handleBrandClick = () => {
    onNavigate('home', { scrollToTop: true });
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (route: string) => {
    setIsMobileMenuOpen(false);
    if (route === 'home') {
      onNavigate('home', { scrollToId: 'curriculum-courses' });
    } else if (route === 'pdf-notes') {
      onNavigate('pdf-notes', { scrollToId: 'pdf-academic-subjects' });
    } else if (route === 'laboratory') {
      onNavigate('laboratory', { scrollToId: 'laboratory-content' });
    } else if (route === 'pyq') {
      onNavigate('pyq', { scrollToId: 'pyq-archive-content' });
    } else if (route === 'syllabus') {
      onNavigate('syllabus', { scrollToId: 'syllabus-2026-content' });
    } else {
      onNavigate(route);
    }
  };

  return (
    <header className="header-wrapper">
      <div className="header-content">
        {/* Brand Lockup */}
        <div className="brand-lockup" onClick={handleBrandClick}>
          <div className="brand-icon">
            <BookOpen size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>JC Notes</span>
              <span className="brand-badge hide-on-compact">CSE • JSS STU</span>
            </div>
            <span className="brand-subtitle hide-on-compact" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              {INSTITUTION_INFO.shortName}
            </span>
          </div>
        </div>

        {/* Semester Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="filter-chip"
            onClick={() => setIsSemesterMenuOpen(!isSemesterMenuOpen)}
            style={{ fontWeight: 600, borderColor: 'var(--border-strong)' }}
            title="Switch Semester"
          >
            <Layers size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{activeSem.title}</span>
            <ChevronDown size={14} />
          </button>

          {isSemesterMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 60,
                minWidth: '220px',
                padding: '0.4rem'
              }}
            >
              <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                SELECT SEMESTER
              </div>
              {SEMESTERS.map(sem => (
                <button
                  key={sem.id}
                  onClick={() => {
                    onSelectSemester(sem.id);
                    setIsSemesterMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.5rem 0.6rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: sem.id === activeSemester ? 'var(--bg-elevated)' : 'transparent',
                    color: sem.id === activeSemester ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: sem.id === activeSemester ? 600 : 400,
                    textAlign: 'left'
                  }}
                >
                  <span>{sem.title}</span>
                  {sem.isActive ? (
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)', borderRadius: '4px', fontWeight: 600 }}>
                      Active
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Scheme
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-item ${currentRoute === 'home' || currentRoute.startsWith('subject') ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Subjects
          </button>
          <button 
            className={`nav-item ${currentRoute.startsWith('pdf') ? 'active' : ''}`}
            onClick={() => handleNavClick('pdf-notes')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Layers size={15} style={{ color: '#ef4444' }} />
            <span>PDF Notes</span>
            <span className="nav-badge hide-on-compact" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
              142
            </span>
          </button>
          <button 
            className={`nav-item ${currentRoute.startsWith('laboratory') || currentRoute.startsWith('lab') ? 'active' : ''}`}
            onClick={() => handleNavClick('laboratory')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FlaskConical size={15} style={{ color: '#10b981' }} />
            <span>Laboratory</span>
            <span className="nav-badge hide-on-compact" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
              3 Labs
            </span>
          </button>
          <button 
            className={`nav-item ${currentRoute.startsWith('pyq') ? 'active' : ''}`}
            onClick={() => handleNavClick('pyq')}
          >
            <FileText size={15} />
            PYQ & Exams
          </button>
          <button 
            className={`nav-item ${currentRoute === 'syllabus' ? 'active' : ''}`}
            onClick={() => handleNavClick('syllabus')}
          >
            <BookOpen size={15} />
            Syllabus 2026
          </button>
          <button 
            className={`nav-item ${currentRoute === 'tracker' ? 'active' : ''}`}
            onClick={() => handleNavClick('tracker')}
          >
            <CheckSquare size={15} />
            Tracker
          </button>
          <button 
            className={`nav-item ${currentRoute === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
          >
            <Calendar size={15} />
            Schedule
          </button>
        </nav>

        {/* Actions (Search, Bookmarks, Theme Toggle, Mobile Menu) */}
        <div className="header-actions">
          <button 
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Search study notes, labs, and question papers (Ctrl+K)"
          >
            <Search size={15} />
            <span className="search-btn-text">Search</span>
            <kbd className="kbd-badge">Ctrl K</kbd>
          </button>

          {/* Anonymous Community Entry Point */}
          <button 
            className={`community-trigger-btn ${currentRoute === 'community' ? 'active' : ''}`}
            onClick={() => onNavigate('community')}
            title="Anonymous Community"
            aria-label="Anonymous Community"
          >
            <MessageCircle size={16} />
          </button>

          <button 
            className="icon-btn" 
            onClick={onOpenBookmarks} 
            title="Saved bookmarks"
            style={{ position: 'relative' }}
          >
            <Bookmark size={16} />
            {bookmarksCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {bookmarksCount}
              </span>
            )}
          </button>

          <button 
            className="icon-btn" 
            onClick={onToggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="icon-btn mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          style={{
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <button 
            className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            All Subjects
          </button>
          <button 
            className={`nav-item ${currentRoute.startsWith('pdf') ? 'active' : ''}`}
            onClick={() => handleNavClick('pdf-notes')}
          >
            <Layers size={16} style={{ color: '#ef4444' }} />
            <span>📚 Original PDF Notes Library (142 Documents)</span>
          </button>
          <button 
            className={`nav-item ${currentRoute.startsWith('laboratory') || currentRoute.startsWith('lab') ? 'active' : ''}`}
            onClick={() => handleNavClick('laboratory')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FlaskConical size={16} style={{ color: '#10b981' }} />
            <span>🧪 Laboratory (DS, DSD, OOP Records & Manuals)</span>
          </button>
          <button 
            className={`nav-item ${currentRoute.startsWith('pyq') ? 'active' : ''}`}
            onClick={() => handleNavClick('pyq')}
          >
            <FileText size={16} />
            Past Year Papers & Model Answers
          </button>
          <button 
            className={`nav-item ${currentRoute === 'syllabus' ? 'active' : ''}`}
            onClick={() => handleNavClick('syllabus')}
          >
            <BookOpen size={16} />
            📋 Official Syllabus 2026 (All 8 Subjects)
          </button>
          <button 
            className={`nav-item ${currentRoute === 'tracker' ? 'active' : ''}`}
            onClick={() => handleNavClick('tracker')}
          >
            <CheckSquare size={16} />
            Syllabus Study Tracker
          </button>
          <button 
            className={`nav-item ${currentRoute === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
          >
            <Calendar size={16} />
            Academic Calendar & Timetable
          </button>
        </div>
      )}
    </header>
  );
};
