import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { SubjectCard } from './components/SubjectCard';
import { SubjectDetail } from './components/SubjectDetail';
import { NoteReader } from './components/NoteReader';
import { LabViewer } from './components/LabViewer';
import { PYQViewer } from './components/PYQViewer';
import { SyllabusTracker } from './components/SyllabusTracker';
import { CalendarTimetable } from './components/CalendarTimetable';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { PDFLibrary } from './components/PDFLibrary';
import { PDFViewerModal } from './components/PDFViewerModal';
import { LaboratoryHub } from './components/LaboratoryHub';
import { SyllabusHub } from './components/SyllabusHub';
import { CommunityChat } from './components/CommunityChat';
import { COURSES, getCourseByCode, getCoursesBySemester } from './data/coursesData';
import { NOTES, getNoteById } from './data/notesData';
import { LAB_PROGRAMS } from './data/labsData';
import { QUESTION_PAPERS } from './data/pyqData';
import { PDF_DOCUMENTS, getPDFById } from './data/pdfManifest';
import { findPdfDocument } from './utils/pdfResolver';
import { SEMESTERS } from './data/semestersData';
import { INSTITUTION_INFO } from './data/academicData';
import { 
  Search, 
  Code2, 
  FileText, 
  CheckSquare, 
  Calendar, 
  BookOpen, 
  Layers, 
  Sparkles,
  ArrowRight,
  FlaskConical
} from 'lucide-react';

export function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('jc_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Active Semester (Defaults to Semester 3 active branch)
  const [activeSemester, setActiveSemester] = useState<number>(3);

  // Initial Route helper from window.location.hash
  const getInitialRoute = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.replace(/^#\/?/, '');
      if (h) {
        try {
          return decodeURIComponent(h);
        } catch {
          return h;
        }
      }
    }
    return 'home';
  };

  // Routing state synchronized with URL hash
  const [route, setRoute] = useState<string>(getInitialRoute);

  // Scroll restoration map across routes
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const previousRouteRef = useRef<string>('home');

  // Robust smooth scroll targeting with RAF and retry
  const scrollToTargetElement = (elementId: string, maxAttempts = 8) => {
    if (typeof window === 'undefined') return;
    let attempts = 0;
    const executeScroll = () => {
      attempts++;
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < maxAttempts) {
        setTimeout(executeScroll, 35 * attempts);
      }
    };
    requestAnimationFrame(executeScroll);
  };

  // Smart Scroll Restoration
  const restoreScrollPosition = (targetRoute: string) => {
    if (typeof window === 'undefined') return;
    const savedPos = scrollPositionsRef.current[targetRoute];
    if (savedPos === undefined) return;
    
    window.scrollTo({ top: savedPos, behavior: 'instant' });
    let attempts = 0;
    const verifyScroll = () => {
      attempts++;
      if (Math.abs(window.scrollY - savedPos) > 40 && document.documentElement.scrollHeight > savedPos) {
        window.scrollTo({ top: savedPos, behavior: 'instant' });
      }
      if (attempts < 4) {
        setTimeout(verifyScroll, 50 * attempts);
      }
    };
    requestAnimationFrame(verifyScroll);
  };

  // Sync route with browser hash and history navigation (Back/Forward buttons)
  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      let nextRoute = 'home';
      if (hash) {
        try {
          nextRoute = decodeURIComponent(hash);
        } catch {
          nextRoute = hash;
        }
      }
      setRoute(nextRoute);

      // Restore scroll position or target meaningful section on browser Back/Forward navigation
      if (scrollPositionsRef.current[nextRoute] !== undefined && scrollPositionsRef.current[nextRoute] > 0) {
        restoreScrollPosition(nextRoute);
      } else if (nextRoute === 'pyq' || nextRoute.startsWith('pyq/') || nextRoute === 'pyq-24' || nextRoute === 'pyq-25') {
        scrollToTargetElement('pyq-archive-content');
      } else if (nextRoute === 'laboratory' || nextRoute.startsWith('laboratory/') || nextRoute === 'labs') {
        scrollToTargetElement(nextRoute.startsWith('laboratory/') && nextRoute !== 'laboratory' ? 'selected-lab-detail-container' : 'laboratory-content');
      } else if (nextRoute === 'syllabus') {
        scrollToTargetElement('syllabus-2026-content');
      } else if (nextRoute.startsWith('subject/')) {
        scrollToTargetElement('subject-detail-header');
      } else if (nextRoute.startsWith('pdf-notes/')) {
        const parts = nextRoute.split('/');
        scrollToTargetElement(parts.length > 2 ? 'pdf-unit-docs-container' : 'pdf-subject-units-container');
      } else if (nextRoute === 'pdf-notes') {
        scrollToTargetElement('pdf-academic-subjects');
      }
    };

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Bookmarks state
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jc_bookmarks');
      return saved ? JSON.parse(saved) : ['note-dma-cpp', 'ds-lab-9'];
    } catch {
      return ['note-dma-cpp', 'ds-lab-9'];
    }
  });

  // Syllabus tracker progress state
  const [completedUnits, setCompletedUnits] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jc_completed_units');
      return saved ? JSON.parse(saved) : ['24CS330-u1', '24CS310-u1'];
    } catch {
      return ['24CS330-u1', '24CS310-u1'];
    }
  });

  // Subject category filter on homepage
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'PCC' | 'BSC' | 'HSMC' | 'PCCL'>('all');

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jc_theme', theme);
  }, [theme]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('jc_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync completed units to localStorage
  useEffect(() => {
    localStorage.setItem('jc_completed_units', JSON.stringify(completedUnits));
  }, [completedUnits]);

  // Global keyboard shortcuts (Ctrl+K to open search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleUnit = (unitKey: string) => {
    setCompletedUnits(prev => 
      prev.includes(unitKey) ? prev.filter(k => k !== unitKey) : [...prev, unitKey]
    );
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset your syllabus checklist progress?')) {
      setCompletedUnits([]);
    }
  };

  // Smart Navigation router helper with scroll restoration
  const navigateTo = (
    newRoute: string,
    options?: { restoreScroll?: boolean; scrollToId?: string; scrollToTop?: boolean }
  ) => {
    // Record current scroll position before route change
    if (typeof window !== 'undefined') {
      scrollPositionsRef.current[route] = window.scrollY;
      previousRouteRef.current = route;
    }

    setRoute(newRoute);
    if (typeof window !== 'undefined') {
      const targetHash = '#' + encodeURI(newRoute);
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    }

    // Smart Scroll Restoration & Targeting
    if (typeof window !== 'undefined') {
      if (newRoute.startsWith('pdf/')) {
        // Document viewer takes 100vh viewport
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (options?.scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (options?.restoreScroll && scrollPositionsRef.current[newRoute] !== undefined && scrollPositionsRef.current[newRoute] > 0) {
        restoreScrollPosition(newRoute);
      } else if (options?.scrollToId) {
        scrollToTargetElement(options.scrollToId);
      } else if (newRoute === 'pyq' || newRoute.startsWith('pyq/') || newRoute === 'pyq-24' || newRoute === 'pyq-25') {
        scrollToTargetElement('pyq-archive-content');
      } else if (newRoute === 'laboratory' || newRoute.startsWith('laboratory/') || newRoute === 'labs' || newRoute.startsWith('lab/')) {
        scrollToTargetElement(newRoute.startsWith('laboratory/') && newRoute !== 'laboratory' ? 'selected-lab-detail-container' : 'laboratory-content');
      } else if (newRoute === 'syllabus') {
        scrollToTargetElement('syllabus-2026-content');
      } else if (newRoute === 'pdf-notes' || newRoute.startsWith('pdf-notes')) {
        if (newRoute.includes('/')) {
          const parts = newRoute.split('/');
          if (parts.length > 2) {
            scrollToTargetElement('pdf-unit-docs-container');
          } else {
            scrollToTargetElement('pdf-subject-units-container');
          }
        } else {
          scrollToTargetElement('pdf-academic-subjects');
        }
      } else if (newRoute.startsWith('subject/')) {
        scrollToTargetElement('subject-detail-header');
      } else if (newRoute === 'tracker' || newRoute === 'calendar') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (newRoute === 'home') {
        if (scrollPositionsRef.current['home'] !== undefined && scrollPositionsRef.current['home'] > 0) {
          restoreScrollPosition('home');
        }
      }
    }
  };

  // Semester Courses
  const currentSemesterCourses = getCoursesBySemester(activeSemester);
  const filteredCourses = currentSemesterCourses.filter(c => 
    categoryFilter === 'all' || c.category === categoryFilter
  );

  // Render current view
  const renderCurrentView = () => {
    if (route.startsWith('subject/')) {
      const code = route.replace('subject/', '');
      const course = getCourseByCode(code);
      if (course) {
        return (
          <SubjectDetail
            course={course}
            onBack={() => navigateTo('home', { scrollToId: 'curriculum-courses' })}
            onOpenNote={(noteId) => navigateTo(`note/${noteId}`)}
            onOpenLab={(labId) => navigateTo(`lab/${labId}`)}
            onOpenPYQ={(pyqId) => navigateTo(`pyq/${pyqId}`)}
            onOpenPDF={(pdf) => navigateTo(`pdf/${pdf.id}`)}
            onOpenPDFs={(subCode) => navigateTo(subCode ? `pdf-notes/${subCode}` : 'pdf-notes')}
            completedUnits={completedUnits}
            onToggleUnitCompletion={handleToggleUnit}
          />
        );
      }
      return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Subject Not Found
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No syllabus or study resources found for course code <code>{code}</code>. It may belong to another semester or scheme.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => navigateTo('home')} className="btn btn-primary">
                Return to Courses
              </button>
              <button onClick={() => setIsSearchOpen(true)} className="btn btn-outline">
                Search All Topics
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (route.startsWith('note/')) {
      const noteId = route.replace('note/', '');
      const note = getNoteById(noteId);
      if (note) {
        return (
          <NoteReader
            note={note}
            onBack={() => navigateTo('home')}
            onOpenNote={(id) => navigateTo(`note/${id}`)}
            onOpenSubject={(code) => navigateTo(`subject/${code}`)}
            onOpenPDFLibrary={(subCode) => navigateTo(subCode ? `pdf-notes/${subCode}` : 'pdf-notes')}
            isBookmarked={bookmarks.includes(note.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      }
      return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Study Note Not Found
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              The requested study note <code>{noteId}</code> could not be found or may have been reorganized.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => navigateTo('home')} className="btn btn-primary">
                Return to Courses
              </button>
              <button onClick={() => setIsSearchOpen(true)} className="btn btn-outline">
                Search All Notes
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (route === 'laboratory' || route.startsWith('laboratory/') || route === 'labs' || route.startsWith('lab/')) {
      const initialLabId = route.startsWith('laboratory/')
        ? route.replace('laboratory/', '')
        : (route.startsWith('lab/') ? (route.includes('cpp') ? 'oop' : 'ds') : undefined);
      return (
        <LaboratoryHub
          initialLabId={initialLabId}
          onOpenPDF={(pdf) => navigateTo(`pdf/${pdf.id}`)}
          onSelectSubject={(code) => navigateTo(`subject/${code}`)}
        />
      );
    }

    if (route === 'community' || route.startsWith('community')) {
      return (
        <CommunityChat onNavigate={navigateTo} />
      );
    }

    if (route === 'syllabus' || route === 'syllabus-2026' || route.startsWith('syllabus/')) {
      return (
        <SyllabusHub
          onBack={() => {
            const returnRoute = previousRouteRef.current && !previousRouteRef.current.startsWith('pdf/') ? previousRouteRef.current : 'home';
            navigateTo(returnRoute, { restoreScroll: true });
          }}
          onOpenPDF={(pdf) => navigateTo(`pdf/${pdf.id}`)}
          onOpenSubject={(code) => navigateTo(`subject/${code}`)}
        />
      );
    }

    if (route === 'pyq' || route.startsWith('pyq/') || route === 'pyq-24' || route === 'pyq-25') {
      const initialPyqId = route.startsWith('pyq/') && !route.startsWith('pyq/202') ? route.replace('pyq/', '') : undefined;
      const initialYear = route === 'pyq/2025' || route === 'pyq-25' ? '2025' : (route === 'pyq/2024' || route === 'pyq-24' ? '2024' : 'all');
      return (
        <PYQViewer
          initialPyqId={initialPyqId}
          initialYear={initialYear}
          onSelectSubject={(code) => navigateTo(`subject/${code}`)}
          onOpenPDF={(pdf) => navigateTo(`pdf/${pdf.id}`)}
        />
      );
    }

    if (route === 'tracker') {
      return (
        <SyllabusTracker
          completedUnits={completedUnits}
          onToggleUnit={handleToggleUnit}
          onResetProgress={handleResetProgress}
          onOpenNotes={(noteId) => navigateTo(`note/${noteId}`)}
          onOpenSubject={(code) => navigateTo(`subject/${code}`)}
        />
      );
    }

    if (route === 'calendar') {
      return (
        <CalendarTimetable
          onSelectSubject={(code) => navigateTo(`subject/${code}`)}
        />
      );
    }

    if (route === 'pdf-notes' || route.startsWith('pdf-notes?') || route.startsWith('pdf-notes/')) {
      let initialSubjectId: string | undefined;
      let initialUnitName: string | undefined;
      if (route.startsWith('pdf-notes/')) {
        const parts = route.replace('pdf-notes/', '').split('/');
        initialSubjectId = parts[0] || undefined;
        initialUnitName = parts[1] ? decodeURIComponent(parts[1]) : undefined;
      } else if (route.includes('?')) {
        const params = new URLSearchParams(route.split('?')[1]);
        initialSubjectId = params.get('subject') || undefined;
        initialUnitName = params.get('unit') || undefined;
      }

      return (
        <PDFLibrary
          onOpenPDF={(pdf) => navigateTo(`pdf/${pdf.id}`)}
          onOpenNote={(noteId) => navigateTo(`note/${noteId}`)}
          onSelectSubject={(code) => navigateTo(`subject/${code}`)}
          onNavigateToLaboratory={() => navigateTo('laboratory', { scrollToId: 'laboratory-content' })}
          onNavigateToPYQ={() => navigateTo('pyq', { scrollToId: 'pyq-archive-content' })}
          onNavigateToSyllabus={() => navigateTo('syllabus', { scrollToId: 'syllabus-2026-content' })}
          initialSubjectId={initialSubjectId}
          initialUnitName={initialUnitName}
        />
      );
    }

    if (route.startsWith('pdf/')) {
      const pdfId = route.replace(/^pdf\//, '');
      const pdf = findPdfDocument(pdfId) || getPDFById(pdfId);
      if (pdf) {
        return (
          <PDFViewerModal
            pdf={pdf}
            onBack={() => {
              let returnRoute = previousRouteRef.current && !previousRouteRef.current.startsWith('pdf/') ? previousRouteRef.current : '';
              if (!returnRoute) {
                if (pdf.isPYQ) {
                  returnRoute = pdf.folder === 'PYQ-25' || pdf.relPath.includes('PYQ-25') ? 'pyq-25' : (pdf.folder === 'PYQ-24' || pdf.relPath.includes('PYQ-24') ? 'pyq-24' : 'pyq');
                } else if (pdf.isLabResource) {
                  returnRoute = pdf.labType ? `laboratory/${pdf.labType}` : 'laboratory';
                } else if (pdf.isSyllabus) {
                  returnRoute = 'syllabus';
                } else if (pdf.subjectCode) {
                  returnRoute = `pdf-notes/${pdf.subjectCode.toLowerCase()}`;
                } else {
                  returnRoute = 'pdf-notes';
                }
              }
              navigateTo(returnRoute, { restoreScroll: true });
            }}
            onOpenNote={(noteId) => navigateTo(`note/${noteId}`)}
          />
        );
      }
      return (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              PDF unavailable
            </h2>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)', wordBreak: 'break-all', fontSize: '0.825rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              Filename: {pdfId}
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Expected location: <code>content/notes/</code> or <code>content/</code>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigateTo('pdf-notes')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={15} /> Return to PDF Library
              </button>
              <button onClick={() => setIsSearchOpen(true)} className="btn btn-outline">
                Search All Files
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default Home View
    return (
      <main>
        {/* Editorial Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-meta-strip">
              <span className="subject-code-tag">
                {INSTITUTION_INFO.shortName}
              </span>
              <span className="meta-pill">
                Department of Computer Science & Engineering
              </span>
              <span className="meta-pill">
                OBE / CBCS Autonomous Scheme
              </span>
            </div>

            <h1 className="hero-title">
              What do you want to study today?
            </h1>

            <p className="hero-subtitle">
              Instant access to verified lecture notes, complete C & C++ laboratory implementations, syllabus outlines, and past exam question papers for JSS STU students.
            </p>

            {/* Prominent Search Bar */}
            <div className="hero-search-box">
              <Search className="hero-search-icon" size={18} />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search any topic (e.g. 'Binary Search Tree', 'Booth\\'s Algorithm', 'K-Maps', '24CS330')..."
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
              <kbd 
                className="kbd-badge" 
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              >
                Ctrl K
              </kbd>
            </div>
          </div>
        </section>

        {/* Quick Portal Cards */}
        <section style={{ backgroundColor: 'var(--bg-app)', padding: '2rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))', gap: '1rem' }}>
            
            {/* 1. 📚 PDF Notes Card */}
            <div 
              onClick={() => navigateTo('pdf-notes', { scrollToId: 'pdf-academic-subjects' })}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all var(--duration-fast) ease',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.06)'
              }}
              className="quick-portal-card"
            >
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Layers size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    📚 PDF Notes
                  </span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#ef4444', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                    142
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Original theory files & syllabi
                </div>
              </div>
            </div>

            {/* 2. 🧪 Laboratory Portal */}
            <div 
              onClick={() => navigateTo('laboratory', { scrollToId: 'laboratory-content' })}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all var(--duration-fast) ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)'
              }}
              className="quick-portal-card"
            >
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FlaskConical size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    🧪 Laboratory
                  </span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#10b981', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                    3 Labs
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  DS, DSD & OOP Records & Code
                </div>
              </div>
            </div>

            {/* 3. 📋 Syllabus 2026 */}
            <div 
              onClick={() => navigateTo('syllabus', { scrollToId: 'syllabus-2026-content' })}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid rgba(59, 130, 246, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all var(--duration-fast) ease',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.06)'
              }}
              className="quick-portal-card"
            >
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    📋 Syllabus 2026
                  </span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#3b82f6', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                    8 Syllabi
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Autonomous 2026 scheme PDFs
                </div>
              </div>
            </div>

            {/* 4. 📝 Exam Papers (PYQ) */}
            <div 
              onClick={() => navigateTo('pyq', { scrollToId: 'pyq-archive-content' })}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1.5px solid rgba(217, 119, 6, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all var(--duration-fast) ease',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.06)'
              }}
              className="quick-portal-card"
            >
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(217, 119, 6, 0.12)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Exam Papers
                  </span>
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#d97706', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 700 }}>
                    29 Papers
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  PYQ 2024 & 2025 SEE + CIE
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigateTo('tracker')}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all var(--duration-fast) ease'
              }}
              className="quick-portal-card"
            >
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Syllabus Tracker
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Check off studied units & topics
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigateTo('calendar')}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all var(--duration-fast) ease'
              }}
              className="quick-portal-card"
            >
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Class Timetable
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Room schedules & CIE dates
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Dedicated Original PDF Library Showcase Banner */}
        <section className="container" style={{ paddingTop: '2rem', paddingBottom: '0.5rem' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.07) 0%, rgba(2, 132, 199, 0.07) 100%)',
              border: '1.5px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}
          >
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>
                  📚 Original Source Repository
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Exact authentic documents from _JC-Notes
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
                Original PDF Document Archive (142 Source Files)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Access complete unsummarized textbooks, handwritten lecture notes, and laboratory manuals directly in your browser.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => navigateTo('pdf-notes')}
                className="btn btn-primary"
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
              >
                <span>Browse All 142 PDFs</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="container" id="curriculum-courses" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {activeSemester === 3 ? 'Semester III Curriculum Courses' : `Semester ${activeSemester} Curriculum`}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {activeSemester === 3 ? '8 academic courses • 24.5 total credits • Complete syllabus & unit notes' : 'Autonomous CBCS Curriculum Outline'}
              </p>
            </div>

            {/* Category filter bar */}
            {activeSemester === 3 && (
              <div className="filter-bar" style={{ padding: 0 }}>
                {(['all', 'PCC', 'BSC', 'HSMC', 'PCCL'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
                  >
                    {cat === 'all' ? 'All Courses' : cat === 'PCC' ? 'Core CS' : cat === 'BSC' ? 'Basic Science' : cat === 'PCCL' ? 'Laboratories' : 'Humanities'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subjects Grid or Semester Staging Card */}
          {activeSemester !== 3 ? (
            (() => {
              const semData = SEMESTERS.find(s => s.number === activeSemester);
              return (
                <div style={{ padding: '3.5rem 2rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '640px', margin: '1rem auto' }}>
                  <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <BookOpen size={28} />
                  </div>
                  <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>Curriculum Staging</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                    {semData ? semData.title : `Semester ${activeSemester}`}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {semData?.description || 'Curriculum outline under the autonomous CBCS scheme.'}
                  </p>
                  <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-app)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
                    <span><strong>Credits:</strong> {semData?.totalCredits || 20}</span>
                    <span>•</span>
                    <span><strong>Courses:</strong> {semData?.coursesCount || 7}</span>
                    <span>•</span>
                    <span><strong>Cycle:</strong> {semData?.cycle || 'Branch Specific'}</span>
                  </div>
                  <div>
                    <button onClick={() => setActiveSemester(3)} className="btn btn-primary">
                      Switch to Active Semester III Hub
                    </button>
                  </div>
                </div>
              );
            })()
          ) : filteredCourses.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No courses found in category "{categoryFilter}".</p>
              <button onClick={() => setCategoryFilter('all')} className="btn btn-outline">
                View All Semester III Courses
              </button>
            </div>
          ) : (
            <div className="subject-grid">
              {filteredCourses.map(course => {
                const subjectUnits = course.units;
                const subjectDoneCount = subjectUnits.filter(u => completedUnits.includes(`${course.code}-u${u.unitNumber}`)).length;
                const percent = Math.round((subjectDoneCount / subjectUnits.length) * 100);

                return (
                  <SubjectCard
                    key={course.id}
                    course={course}
                    onSelectSubject={(code) => navigateTo(`subject/${code}`)}
                    onOpenNotes={(noteId) => navigateTo(`note/${noteId}`)}
                    onOpenLabs={(code) => navigateTo('labs')}
                    progressPercentage={percent}
                  />
                );
              })}
            </div>
          )}

          {/* High-Yield Study Notes Carousel / Spotlight */}
          <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Sparkles size={14} />
                  Editorial Spotlight
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Essential Theory Notes for Upcoming Exams
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {NOTES.slice(0, 4).map(note => (
                <div
                  key={note.id}
                  onClick={() => navigateTo(`note/${note.id}`)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all var(--duration-fast) ease'
                  }}
                  className="quick-portal-card"
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span className="subject-code-tag" style={{ fontSize: '0.75rem', padding: '0.1rem 0.35rem' }}>{note.subjectCode}</span>
                      <span>Unit {note.unitNumber}</span>
                      <span>•</span>
                      <span>{note.readTime}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                      {note.title}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '0.5rem' }}>
                    <span>Read Study Note</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  };

  return (
    <>
      <Header
        currentRoute={route}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSemester={activeSemester}
        onSelectSemester={(semId) => {
          setActiveSemester(semId);
          navigateTo('home');
        }}
        bookmarksCount={bookmarks.length}
      />

      {renderCurrentView()}

      {!route.startsWith('pdf/') && <Footer onNavigate={navigateTo} />}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedNoteIds={bookmarks}
        onRemoveBookmark={handleToggleBookmark}
        onOpenNote={(id) => navigateTo(`note/${id}`)}
        onOpenLab={(id) => navigateTo(`lab/${id}`)}
      />
    </>
  );
}
