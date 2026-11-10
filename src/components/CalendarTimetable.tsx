import React, { useState } from 'react';
import { ACADEMIC_CALENDAR, TIMETABLE_SLOTS, INSTITUTION_INFO } from '../data/academicData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Layers, 
  ChevronRight,
  Sparkles,
  Building
} from 'lucide-react';

interface CalendarTimetableProps {
  onSelectSubject: (code: string) => void;
}

export const CalendarTimetable: React.FC<CalendarTimetableProps> = ({ onSelectSubject }) => {
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'timetable'>('calendar');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

  const currentDaySlots = TIMETABLE_SLOTS.filter(s => s.day === selectedDay);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'cie':
        return { bg: 'rgba(37, 99, 235, 0.12)', text: '#2563eb', label: 'CIE Internal' };
      case 'see':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#4f46e5', label: 'SEE University Exam' };
      case 'holiday':
        return { bg: 'rgba(217, 119, 6, 0.12)', text: '#d97706', label: 'Holiday' };
      default:
        return { bg: 'rgba(5, 150, 105, 0.12)', text: '#059669', label: 'Academic Term' };
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="subject-code-tag">{INSTITUTION_INFO.shortName}</span>
          <span className="meta-pill">{INSTITUTION_INFO.academicYear} Academic Schedule</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Academic Schedule & Class Timetable
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Official academic calendar reference dates for CIEs and SEEs, alongside class schedule for III Semester Computer Science & Engineering.
        </p>
      </div>

      {/* Sub-tab switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`filter-chip ${activeSubTab === 'calendar' ? 'active' : ''}`}
        >
          <Calendar size={15} />
          Academic Calendar 2026-27
        </button>
        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`filter-chip ${activeSubTab === 'timetable' ? 'active' : ''}`}
        >
          <Clock size={15} />
          CSE Class Timetable
        </button>
      </div>

      {/* Tab 1: Academic Calendar */}
      {activeSubTab === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
          {ACADEMIC_CALENDAR.map((event, idx) => {
            const style = getTypeStyle(event.type);

            return (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 700, 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: 'var(--radius-full)', 
                        backgroundColor: style.bg, 
                        color: style.text 
                      }}
                    >
                      {style.label}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {event.date} {event.endDate ? `to ${event.endDate}` : ''}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {event.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {event.description}
                  </p>
                </div>

                <div 
                  style={{
                    minWidth: '55px',
                    height: '55px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {new Date(event.date).getDate()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Timetable */}
      {activeSubTab === 'timetable' && (
        <div>
          {/* Day Selector Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: selectedDay === d ? 'var(--text-primary)' : 'var(--bg-surface)',
                  color: selectedDay === d ? 'var(--bg-surface)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap'
                }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Time Slot Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '820px' }}>
            {currentDaySlots.map((slot, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Time Badge */}
                  <div 
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--accent-primary)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      minWidth: '125px',
                      textAlign: 'center'
                    }}
                  >
                    {slot.time}
                  </div>

                  {/* Subject Details */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span className="subject-code-tag">{slot.subjectCode}</span>
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          padding: '0.1rem 0.45rem', 
                          borderRadius: '4px',
                          backgroundColor: slot.type === 'Lab' ? 'rgba(5, 150, 105, 0.12)' : slot.type === 'Tutorial' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                          color: slot.type === 'Lab' ? '#059669' : slot.type === 'Tutorial' ? '#d97706' : '#2563eb'
                        }}
                      >
                        {slot.type} {slot.batch ? `(${slot.batch})` : ''}
                      </span>
                    </div>

                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {slot.subjectName}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} />
                    <span>{slot.room}</span>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSelectSubject(slot.subjectCode)}
                  >
                    Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
