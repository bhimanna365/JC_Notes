import React from 'react';
import { COURSES } from '../data/coursesData';
import { 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SyllabusTrackerProps {
  completedUnits: string[];
  onToggleUnit: (unitKey: string) => void;
  onResetProgress: () => void;
  onOpenNotes: (noteId: string) => void;
  onOpenSubject: (subjectCode: string) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  completedUnits,
  onToggleUnit,
  onResetProgress,
  onOpenNotes,
  onOpenSubject
}) => {
  const totalUnits = COURSES.reduce((acc, c) => acc + c.units.length, 0);
  const completedCount = completedUnits.length;
  const overallPercentage = totalUnits > 0 ? Math.round((completedCount / totalUnits) * 100) : 0;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="subject-code-tag">Self-Study Planner</span>
          <span className="meta-pill">Local Storage Sync</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Syllabus Study Tracker
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track your revision progress across all 8 subjects and 40 units for CIEs and Semester End Examinations. Progress is saved automatically on this device.
        </p>
      </div>

      {/* Overall Progress Hero Card */}
      <div 
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Semester III Revision Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {overallPercentage}%
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({completedCount} of {totalUnits} units completed)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onResetProgress}
              title="Reset all checkboxes"
            >
              <RotateCcw size={14} />
              Reset Tracker
            </button>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div style={{ height: '10px', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${overallPercentage}%`, 
              background: 'linear-gradient(90deg, #2563eb, #3b82f6, #10b981)',
              transition: 'width 400ms ease'
            }} 
          />
        </div>

        {overallPercentage === 100 && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>
            <Sparkles size={18} />
            Outstanding! You have revised the entire Semester III syllabus!
          </div>
        )}
      </div>

      {/* Grid of Subject Checklists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {COURSES.map(course => {
          const subjectUnits = course.units;
          const subjectDoneCount = subjectUnits.filter(u => completedUnits.includes(`${course.code}-u${u.unitNumber}`)).length;
          const subjectPercent = Math.round((subjectDoneCount / subjectUnits.length) * 100);

          return (
            <div 
              key={course.code}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Subject Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="subject-code-tag">{course.code}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: course.colorScheme.accent }}>
                    {subjectPercent}% done
                  </span>
                </div>

                <h3 
                  onClick={() => onOpenSubject(course.code)}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', cursor: 'pointer' }}
                >
                  {course.title}
                </h3>

                {/* Progress bar per subject */}
                <div style={{ height: '4px', backgroundColor: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${subjectPercent}%`, 
                      backgroundColor: course.colorScheme.accent,
                      transition: 'width 300ms ease'
                    }} 
                  />
                </div>

                {/* Unit Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {course.units.map(unit => {
                    const unitKey = `${course.code}-u${unit.unitNumber}`;
                    const isChecked = completedUnits.includes(unitKey);

                    return (
                      <div 
                        key={unit.unitNumber}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          padding: '0.4rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isChecked ? 'var(--bg-elevated)' : 'transparent',
                          transition: 'background-color var(--duration-fast) ease'
                        }}
                      >
                        <button
                          onClick={() => onToggleUnit(unitKey)}
                          style={{ color: isChecked ? '#059669' : 'var(--text-faint)', marginTop: '2px', display: 'flex' }}
                          title={isChecked ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>

                        <div style={{ flex: 1 }}>
                          <span 
                            onClick={() => onToggleUnit(unitKey)}
                            style={{ 
                              fontSize: '0.85rem', 
                              fontWeight: 500, 
                              color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: isChecked ? 'line-through' : 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Unit {unit.unitNumber}: {unit.title}
                          </span>

                          {unit.noteId && (
                            <button
                              onClick={() => onOpenNotes(unit.noteId!)}
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.2rem', 
                                fontSize: '0.7rem', 
                                color: 'var(--accent-primary)',
                                marginLeft: '0.5rem',
                                fontWeight: 600
                              }}
                            >
                              <BookOpen size={10} /> Notes
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenSubject(course.code)}
                >
                  View Subject Syllabus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
