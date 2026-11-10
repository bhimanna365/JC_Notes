import React from 'react';
import { INSTITUTION_INFO } from '../data/academicData';
import { BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer 
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        padding: '3rem 0 2rem 0'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Institutional Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div className="brand-icon" style={{ width: '2rem', height: '2rem' }}>
                <BookOpen size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                JC Notes
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Community academic study platform for Computer Science & Engineering students of {INSTITUTION_INFO.shortName}.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', lineHeight: 1.5 }}>
              <div>{INSTITUTION_INFO.department}</div>
              <div>{INSTITUTION_INFO.name}</div>
              <div>{INSTITUTION_INFO.campus}</div>
            </div>
          </div>

          {/* Academic Portals */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              Study Resources
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <button onClick={() => onNavigate('home')} style={{ color: 'var(--text-secondary)' }}>
                  Semester III Core Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('labs')} style={{ color: 'var(--text-secondary)' }}>
                  DS Lab Programs & C Codes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pyq')} style={{ color: 'var(--text-secondary)' }}>
                  Previous Year Question Papers (SEE & CIE)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} style={{ color: 'var(--text-secondary)' }}>
                  Syllabus Revision Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Governance */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              Curriculum Scheme
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>Outcome Based Education (OBE)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                <GraduationCap size={14} style={{ color: '#059669' }} />
                <span>Choice Based Credit System (CBCS)</span>
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Governed under JSS Mahavidyapeetha guidelines. Syllabus approved by Dean Academic.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with subtle developer attribution rule */}
        <div 
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} JC Student Community • JSS STU Mysuru
          </div>

          {/* Subtle developer credit mandated by Section 3 */}
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Built by <strong style={{ color: 'var(--text-secondary)' }}>Bhimanna Nayak</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
