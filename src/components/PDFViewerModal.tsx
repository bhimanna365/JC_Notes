import React, { useEffect, useMemo, useState } from 'react';
import { PDFDocument } from '../types';
import { resolvePdfUrl, downloadPdf, openPdfInNewTab } from '../utils/pdfResolver';
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  BookOpen, 
  FileText, 
  HardDrive, 
  Calendar,
  Folder,
  Layers,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface PDFViewerModalProps {
  pdf: PDFDocument;
  onBack: () => void;
  onOpenNote?: (noteId: string) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  pdf,
  onBack,
  onOpenNote
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Listen for Escape key to close viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Use the universal reliable PDF resolver
  const resolvedUrl = useMemo(() => resolvePdfUrl(pdf), [pdf]);

  // Reset loading state when pdf changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    // Timeout safety: if iframe doesn't fire load in 4s, hide spinner
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [resolvedUrl]);

  const handleDownload = () => {
    downloadPdf(pdf);
  };

  const handleOpenNewTab = () => {
    openPdfInNewTab(pdf);
  };

  // If pdf is somehow completely missing
  if (!pdf || !resolvedUrl) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '540px', margin: '0 auto', backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            PDF unavailable
          </h2>
          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)', wordBreak: 'break-all', fontSize: '0.825rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            Filename: {pdf?.filename || 'Unknown'}
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Expected location: <code>{pdf?.relPath || 'content/notes/'}</code>
          </p>
          <button onClick={onBack} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={15} /> Return to PDF Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container">
      {/* Viewer Action Toolbar */}
      <div className="pdf-viewer-toolbar">
        {/* Left: Back button & Title info */}
        <div className="pdf-viewer-info">
          <button 
            onClick={onBack}
            className="btn btn-ghost"
            style={{ 
              padding: '0.45rem 0.65rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              fontSize: '0.825rem',
              flexShrink: 0 
            }}
            title="Back to PDF Library (Esc)"
            aria-label="Back to PDF Library"
          >
            <ArrowLeft size={16} />
            <span className="hide-on-mobile">Back</span>
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', flexShrink: 0 }} />

          <div className="pdf-viewer-title-group">
            <div className="pdf-viewer-title-row">
              <FileText size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <h2 
                className="pdf-viewer-filename"
                title={pdf.filename}
              >
                {pdf.filename}
              </h2>
              {pdf.isManualRecord && (
                <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', flexShrink: 0 }}>
                  Record
                </span>
              )}
            </div>

            <div className="pdf-viewer-meta-row">
              {pdf.subjectName && (
                <>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {pdf.subjectCode || pdf.subjectName}
                  </span>
                  <span>→</span>
                </>
              )}
              {pdf.unit && (
                <span className="badge badge-accent" style={{ fontSize: '0.62rem', padding: '0.05rem 0.3rem' }}>
                  {pdf.unit}
                </span>
              )}
              <span className="hide-on-compact">•</span>
              <span className="hide-on-compact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Folder size={11} />
                {pdf.folder}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <HardDrive size={11} />
                {pdf.sizeFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="pdf-viewer-actions">
          {pdf.relatedNoteId && onOpenNote && (
            <button
              onClick={() => onOpenNote(pdf.relatedNoteId!)}
              className="btn btn-outline"
              style={{ 
                fontSize: '0.78rem', 
                padding: '0.4rem 0.65rem', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                color: 'var(--accent-primary)', 
                borderColor: 'var(--accent-primary)' 
              }}
              title="Open corresponding AI study notes with explanation"
              aria-label="View AI Study Notes"
            >
              <BookOpen size={13} />
              <span className="hide-on-mobile">AI Notes</span>
            </button>
          )}

          <button
            onClick={handleOpenNewTab}
            className="btn btn-ghost"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Open raw PDF in new browser tab"
            aria-label="Open PDF in new tab"
          >
            <ExternalLink size={14} />
            <span className="hide-on-mobile">New Tab</span>
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Download original PDF document"
            aria-label="Download original PDF"
          >
            <Download size={14} />
            <span className="hide-on-mobile">Download</span>
          </button>
        </div>
      </div>

      {/* Embedded Native Browser PDF Viewer */}
      <div className="pdf-viewer-frame-container">
        {/* Loading Indicator */}
        {isLoading && (
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: '#525659', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#ffffff', 
              zIndex: 5,
              gap: '0.75rem' 
            }}
          >
            <Loader2 size={32} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading authentic PDF document...</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>{pdf.filename}</div>
          </div>
        )}

        <iframe
          src={`${resolvedUrl}#toolbar=1&navpanes=1&statusbar=1`}
          title={pdf.title || pdf.filename}
          className="pdf-viewer-iframe"
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />

        {/* Fallback if iframe fails to load */}
        {hasError && (
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'var(--bg-app)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '2rem', 
              textAlign: 'center', 
              zIndex: 6 
            }}
          >
            <AlertTriangle size={36} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Direct PDF Viewing Recommended
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '460px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Your browser environment restricts embedded PDF frames for this document. You can open it directly in a dedicated tab or download the original file.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={handleOpenNewTab} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <ExternalLink size={15} /> Open in New Tab
              </button>
              <button onClick={handleDownload} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        )}

        <noscript>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
            <p>Your browser requires direct access to view PDF files.</p>
            <a href={resolvedUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
              Open PDF Directly
            </a>
          </div>
        </noscript>
      </div>
    </div>
  );
};
