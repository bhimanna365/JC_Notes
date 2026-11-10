import React from 'react';
import { Course } from '../types';
import { BookOpen, Code2, ArrowRight, FileCheck, Layers } from 'lucide-react';

interface SubjectCardProps {
  course: Course;
  onSelectSubject: (code: string) => void;
  onOpenNotes: (noteId: string) => void;
  onOpenLabs?: (code: string) => void;
  progressPercentage?: number;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  course,
  onSelectSubject,
  onOpenNotes,
  onOpenLabs,
  progressPercentage = 0
}) => {
  const firstNoteId = course.units.find(u => u.noteId)?.noteId;

  return (
    <div className="subject-card">
      <div>
        {/* Header Badges */}
        <div className="subject-card-header">
          <span className="subject-code-tag">{course.code}</span>
          <span 
            className="subject-category-badge"
            style={{ 
              backgroundColor: course.colorScheme.bgSubtle,
              color: course.colorScheme.accent,
              border: `1px solid ${course.colorScheme.border}`
            }}
          >
            {course.category} • {course.credits} Credits
          </span>
        </div>

        {/* Title */}
        <h3 
          className="subject-card-title"
          onClick={() => onSelectSubject(course.code)}
          style={{ cursor: 'pointer' }}
        >
          {course.title}
        </h3>

        {/* Metadata Strip */}
        <div className="subject-card-meta">
          <span>{course.units.length} Syllabus Units</span>
          <span>•</span>
          <span>{course.hours.lecture}h Lecture</span>
          {course.hours.practical > 0 && (
            <>
              <span>•</span>
              <span>{course.hours.practical}h Practical</span>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {progressPercentage > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <span>Study Progress</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progressPercentage}%</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${progressPercentage}%`, 
                  backgroundColor: course.colorScheme.accent,
                  transition: 'width 300ms ease'
                }} 
              />
            </div>
          </div>
        )}

        {/* Units Quick Preview */}
        <div className="subject-card-units">
          {course.units.slice(0, 3).map(u => (
            <div key={u.unitNumber} className="unit-mini-item">
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', minWidth: '45px' }}>
                Unit {u.unitNumber}:
              </span>
              <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {u.title}
              </span>
            </div>
          ))}
          {course.units.length > 3 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '0.4rem' }}>
              + {course.units.length - 3} more units in curriculum
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="subject-card-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => onSelectSubject(course.code)}
        >
          Course Overview
          <ArrowRight size={13} />
        </button>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {course.hasLab && onOpenLabs && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onOpenLabs(course.code)}
              title="Open Lab Programs"
            >
              <Code2 size={13} />
              Labs
            </button>
          )}

          {firstNoteId && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onOpenNotes(firstNoteId)}
            >
              <BookOpen size={13} />
              Read Notes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
