import React from 'react';
import { X, BookOpen, Code2, Trash2, ArrowRight } from 'lucide-react';
import { NOTES } from '../data/notesData';
import { LAB_PROGRAMS } from '../data/labsData';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedNoteIds: string[];
  onRemoveBookmark: (id: string) => void;
  onOpenNote: (noteId: string) => void;
  onOpenLab: (labId: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedNoteIds,
  onRemoveBookmark,
  onOpenNote,
  onOpenLab
}) => {
  if (!isOpen) return null;

  const bookmarkedNotes = NOTES.filter(n => bookmarkedNoteIds.includes(n.id));
  const bookmarkedLabs = LAB_PROGRAMS.filter(l => bookmarkedNoteIds.includes(l.id));
  const totalCount = bookmarkedNotes.length + bookmarkedLabs.length;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ alignItems: 'flex-start', justifyContent: 'flex-end', padding: 0 }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 110,
          animation: 'slideLeft 200ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Saved Bookmarks
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {totalCount} saved study items
            </span>
          </div>

          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {totalCount === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No bookmarks saved yet
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                Click the bookmark icon while reading study notes or lab experiments to save them here for quick exam revision.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Notes Bookmarks */}
              {bookmarkedNotes.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Study Notes ({bookmarkedNotes.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {bookmarkedNotes.map(n => (
                      <div
                        key={n.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div 
                          onClick={() => {
                            onOpenNote(n.id);
                            onClose();
                          }}
                          style={{ cursor: 'pointer', flex: 1 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                            <BookOpen size={12} style={{ color: 'var(--accent-primary)' }} />
                            <span>{n.subjectCode} • Unit {n.unitNumber}</span>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {n.title}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveBookmark(n.id)}
                          style={{ color: 'var(--text-muted)', padding: '0.3rem', borderRadius: '4px' }}
                          title="Remove bookmark"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Programs Bookmarks */}
              {bookmarkedLabs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Lab Programs ({bookmarkedLabs.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {bookmarkedLabs.map(l => (
                      <div
                        key={l.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div 
                          onClick={() => {
                            onOpenLab(l.id);
                            onClose();
                          }}
                          style={{ cursor: 'pointer', flex: 1 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                            <Code2 size={12} style={{ color: '#059669' }} />
                            <span>{l.subjectCode} • {l.number}</span>
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {l.title}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveBookmark(l.id)}
                          style={{ color: 'var(--text-muted)', padding: '0.3rem', borderRadius: '4px' }}
                          title="Remove bookmark"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
