import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Send, 
  ShieldCheck, 
  Users, 
  Radio, 
  AlertCircle, 
  RefreshCw, 
  ArrowDown, 
  Sparkles,
  Info,
  Clock,
  Paperclip,
  Upload,
  Library,
  FileText,
  FileCode,
  FileSpreadsheet,
  File,
  Image as ImageIcon,
  Download,
  BookOpen,
  ExternalLink,
  Search,
  X,
  Check,
  CheckCircle2
} from 'lucide-react';
import { registerUploadedPdf } from '../utils/pdfRegistry';

export interface ChatFile {
  name: string;
  url: string;
  type: string; // 'pdf' | 'document' | 'presentation' | 'image' | 'text' | 'file'
  size: string;
  sizeBytes?: number;
  relPath?: string;
  isExisting?: boolean;
}

export interface ChatMessage {
  id: string;
  name: 'Anamika';
  author: 'Anamika';
  message: string;
  text: string;
  file?: ChatFile;
  timestamp: number;
  formattedTime?: string;
}

export interface ExistingWebsiteFile {
  id: string;
  name: string;
  title: string;
  relPath: string;
  url: string;
  size: string;
  sizeBytes: number;
  category: string;
  subjectCode: string;
  subjectName: string;
  isExisting?: boolean;
}

interface CommunityChatProps {
  onNavigate?: (route: string) => void;
}

const MAX_CHAR_LIMIT = 500;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.rtf', '.png', '.jpg', '.jpeg', '.webp', '.gif'];

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileCategory(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (['.doc', '.docx', '.rtf'].includes(ext)) return 'document';
  if (['.ppt', '.pptx'].includes(ext)) return 'presentation';
  if (ext === '.txt') return 'text';
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) return 'image';
  return 'file';
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // File Sharing States
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [pendingExistingFile, setPendingExistingFile] = useState<ExistingWebsiteFile | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<ExistingWebsiteFile[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('all');
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);

  // Close attach menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setIsAttachMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  // Scroll detection to toggle "Scroll to Bottom" indicator
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 120;
    setShowScrollBottom(!isAtBottom);
  };

  // Connect to Socket.IO
  const connectSocket = () => {
    setConnectionStatus('connecting');
    setErrorMessage(null);

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const targetUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

    const socket: Socket = io(targetUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8,
      reconnectionDelay: 1500,
      timeout: 8000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      setErrorMessage(null);
    });

    socket.on('chat:init', (payload: { messages: ChatMessage[]; onlineCount: number }) => {
      if (payload && Array.isArray(payload.messages)) {
        setMessages(payload.messages);
        setTimeout(() => scrollToBottom('instant'), 80);
      }
      if (payload && typeof payload.onlineCount === 'number') {
        setOnlineCount(Math.max(payload.onlineCount, 1));
      }
    });

    socket.on('chat:message', (newMsg: ChatMessage) => {
      // Auto-register PDF attachments into the main search registry
      if (newMsg.file && (newMsg.file.type === 'pdf' || newMsg.file.name.toLowerCase().endsWith('.pdf'))) {
        registerUploadedPdf(newMsg.file);
      }

      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setTimeout(() => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        if (scrollHeight - scrollTop - clientHeight < 240) {
          scrollToBottom('smooth');
        } else {
          setShowScrollBottom(true);
        }
      }, 50);
    });

    socket.on('pdf:new', (doc: any) => {
      if (doc) {
        registerUploadedPdf(doc);
      }
    });

    socket.on('chat:online_count', (count: number) => {
      setOnlineCount(Math.max(count, 1));
    });

    socket.on('chat:error', (data: { error: string }) => {
      setErrorMessage(data.error || 'Chat error occurred');
      setIsSending(false);
    });

    socket.on('connect_error', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Fetch available website files for the "Attach Existing File" modal
  const fetchAvailableFiles = async (query = '', category = '') => {
    setIsLoadingLibrary(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category && category !== 'all') params.append('category', category);
      
      const res = await fetch(`/api/community/available-files?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.files)) {
          setLibraryFiles(data.files);
        }
      }
    } catch (err) {
      console.error('Failed to load website files:', err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  // Re-fetch when search or category filter in modal changes
  useEffect(() => {
    if (isLibraryModalOpen) {
      const timeoutId = setTimeout(() => {
        fetchAvailableFiles(librarySearch, libraryCategory);
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [librarySearch, libraryCategory, isLibraryModalOpen]);

  // Handle local file selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(`Unsupported file type '${ext}'. Allowed types: PDF, DOC, DOCX, PPT, PPTX, TXT, and Images.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`File is too large (${formatBytes(file.size)}). Maximum upload limit is 50 MB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPendingUploadFile(file);
    setPendingExistingFile(null);
    setErrorMessage(null);
    setIsAttachMenuOpen(false);

    // Reset input value so re-selecting same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Clear pending attachment
  const handleClearAttachment = () => {
    setPendingUploadFile(null);
    setPendingExistingFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send message (handles both plain text and file attachments)
  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    const hasText = Boolean(trimmed);
    const hasUpload = Boolean(pendingUploadFile);
    const hasExisting = Boolean(pendingExistingFile);

    if (!hasText && !hasUpload && !hasExisting) return;
    if (isSending) return;

    if (hasText && trimmed.length > MAX_CHAR_LIMIT) {
      setErrorMessage(`Message exceeds limit of ${MAX_CHAR_LIMIT} characters.`);
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    // Case 1: Uploading a new local file to the backend
    if (hasUpload && pendingUploadFile) {
      try {
        const formData = new FormData();
        formData.append('file', pendingUploadFile);
        if (hasText) {
          formData.append('message', trimmed);
        }

        const res = await fetch('/api/community/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'File upload failed');
        }

        // Immediately register newly uploaded study material into search index
        if (data.registeredPdf) {
          registerUploadedPdf(data.registeredPdf);
        } else if (data.file && (data.file.extension === '.pdf' || data.file.name.toLowerCase().endsWith('.pdf'))) {
          registerUploadedPdf(data.file);
        }

        // Clean up composer state
        setInputText('');
        setPendingUploadFile(null);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        setTimeout(() => scrollToBottom('smooth'), 60);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to upload file');
      } finally {
        setIsSending(false);
      }
      return;
    }

    // Case 2: Attaching an existing JC Notes website file
    if (hasExisting && pendingExistingFile) {
      try {
        const payload = {
          name: pendingExistingFile.name,
          title: pendingExistingFile.title,
          url: pendingExistingFile.url,
          relPath: pendingExistingFile.relPath,
          size: pendingExistingFile.size,
          sizeBytes: pendingExistingFile.sizeBytes,
          type: 'pdf',
          message: trimmed
        };

        const res = await fetch('/api/community/attach-existing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to attach existing file');
        }

        setInputText('');
        setPendingExistingFile(null);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        setTimeout(() => scrollToBottom('smooth'), 60);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to attach existing file');
      } finally {
        setIsSending(false);
      }
      return;
    }

    // Case 3: Standard anonymous text message
    if (!socketRef.current || !socketRef.current.connected) {
      setErrorMessage('Cannot send message: not connected to server. Retrying...');
      connectSocket();
      setIsSending(false);
      return;
    }

    socketRef.current.emit('chat:send', { text: trimmed }, (response?: { success: boolean; error?: string; message?: ChatMessage }) => {
      setIsSending(false);
      if (response && response.success === false) {
        setErrorMessage(response.error || 'Failed to send message');
      } else {
        setInputText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        setTimeout(() => scrollToBottom('smooth'), 50);
      }
    });
  };

  // Keyboard Enter handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHAR_LIMIT) {
      setInputText(text);
      if (errorMessage) setErrorMessage(null);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Open file action: Uses existing JC Notes PDF viewer modal for PDFs, new tab for other documents
  const handleOpenFile = (file: ChatFile) => {
    if (file.type === 'pdf') {
      if (onNavigate) {
        // Use existing PDF viewer modal in JC Notes without building a duplicate viewer
        const targetPath = file.relPath || file.name;
        onNavigate(`pdf/${targetPath}`);
        return;
      }
    }
    window.open(file.url, '_blank', 'noopener,noreferrer');
  };

  // Download file action
  const handleDownloadFile = (file: ChatFile) => {
    const downloadUrl = file.url.includes('?') ? `${file.url}&download=1` : `${file.url}?download=1`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render appropriate file icon
  const renderFileIcon = (type: string, name: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} />;
      case 'document':
        return <FileText size={20} />;
      case 'presentation':
        return <FileSpreadsheet size={20} />;
      case 'image':
        return <ImageIcon size={20} />;
      default:
        return <File size={20} />;
    }
  };

  // Quick suggestion chips
  const quickPrompts = [
    'Does anyone have DSA Unit 3 notes?',
    'Has anyone finished the DSD Lab record?',
    'Can someone explain Question 4 from 2024 PYQ?',
    'Anyone studying OOP inheritance tonight?'
  ];

  return (
    <div className="community-page-wrapper">
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Editorial Community Hero */}
        <div className="community-header-card">
          <div className="community-header-top">
            <div className="community-header-meta">
              <span className="community-badge">
                <Radio size={13} className={connectionStatus === 'connected' ? 'pulse-green' : 'pulse-amber'} />
                <span>{connectionStatus === 'connected' ? 'Live Channel' : 'Connecting...'}</span>
              </span>
              <span className="community-badge-outline">
                <ShieldCheck size={13} style={{ color: 'var(--accent-primary)' }} />
                <span>100% Anonymous</span>
              </span>
            </div>

            <div className="community-online-indicator">
              <Users size={14} style={{ color: connectionStatus === 'connected' ? '#10b981' : 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {onlineCount} {onlineCount === 1 ? 'Student Online' : 'Students Online'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <h1 className="community-title">
              Anonymous Student Community
            </h1>
            <p className="community-subtitle">
              Every message and note is shared completely anonymously as <strong>Anamika</strong>. Discuss syllabus topics, share PDFs or lab experiment records, and reference existing JC Notes study materials seamlessly.
            </p>
          </div>

          <div className="community-privacy-banner">
            <Info size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-primary)' }} />
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Privacy Guarantee:</strong> No student names, emails, user IDs, or IPs are collected or displayed. Every voice and file shared in this community appears strictly as <strong>Anamika</strong>.
            </div>
          </div>
        </div>

        {/* Connection Status Banner (if offline or error) */}
        {connectionStatus !== 'connected' && (
          <div className="community-status-alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={17} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {connectionStatus === 'connecting'
                  ? 'Connecting to real-time chat server...'
                  : 'Disconnected from chat server. Attempting automatic reconnection...'}
              </span>
            </div>
            <button 
              onClick={connectSocket}
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <RefreshCw size={12} className={connectionStatus === 'connecting' ? 'spin' : ''} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Chat Card */}
        <div className="community-chat-card">
          
          {/* Chat Messages Stream */}
          <div 
            className="community-messages-stream"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="community-empty-state">
                <div className="empty-state-icon">💬</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  No messages yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5, margin: '0 auto 1.25rem auto' }}>
                  Be the first to say hello, ask a study question, or attach a helpful PDF! All messages and files are completely anonymous.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {quickPrompts.slice(0, 2).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(prompt)}
                      className="quick-prompt-btn"
                    >
                      <Sparkles size={12} />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const messageText = msg.message || msg.text || '';
                const hasFile = Boolean(msg.file);
                return (
                  <div key={msg.id || index} className="chat-message-row">
                    <div className="chat-avatar-anon" title="Anonymous Participant: Anamika">
                      A
                    </div>
                    <div className="chat-message-body">
                      <div className="chat-message-header">
                        <span className="chat-author-name">Anamika</span>
                        <span className="chat-author-badge">Student</span>
                        <span className="chat-timestamp" title={new Date(msg.timestamp).toLocaleString()}>
                          <Clock size={11} style={{ marginRight: '3px' }} />
                          {msg.formattedTime || new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="chat-message-bubble">
                        {messageText && (
                          <p className="chat-message-text">{messageText}</p>
                        )}

                        {/* File Attachment Card */}
                        {hasFile && msg.file && (
                          <div className="chat-file-card">
                            {/* Image Thumbnail Preview */}
                            {msg.file.type === 'image' && (
                              <div 
                                className="chat-file-image-preview" 
                                onClick={() => setPreviewImageModal(msg.file!.url)}
                                title="Click to view full image"
                              >
                                <img src={msg.file.url} alt={msg.file.name} loading="lazy" />
                              </div>
                            )}

                            <div className="chat-file-card-content">
                              <div className={`chat-file-icon-box ${msg.file.type || 'file'}`}>
                                {renderFileIcon(msg.file.type, msg.file.name)}
                              </div>

                              <div className="chat-file-details">
                                <div className="chat-file-name" title={msg.file.name}>
                                  📎 {msg.file.name}
                                </div>
                                <div className="chat-file-meta-row">
                                  <span className="chat-file-size">{msg.file.size || 'Document'}</span>
                                  <span className="chat-file-type-badge">{msg.file.type}</span>
                                  {msg.file.isExisting && (
                                    <span className="chat-file-existing-badge" title="Referenced directly from JC Notes website library">
                                      JC Notes Material
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="chat-file-actions">
                                <button 
                                  type="button"
                                  onClick={() => handleOpenFile(msg.file!)}
                                  className="chat-file-action-btn primary"
                                  title={msg.file.type === 'pdf' ? 'Read in JC Notes PDF Viewer' : 'Open document'}
                                >
                                  {msg.file.type === 'pdf' ? <BookOpen size={13} /> : <ExternalLink size={13} />}
                                  <span>{msg.file.type === 'pdf' ? 'Open' : 'Open'}</span>
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDownloadFile(msg.file!)}
                                  className="chat-file-action-btn secondary"
                                  title="Download document to device"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button 
              className="scroll-to-bottom-btn"
              onClick={() => scrollToBottom('smooth')}
              title="Jump to latest messages"
              aria-label="Jump to latest messages"
            >
              <ArrowDown size={15} />
              <span>Latest messages</span>
            </button>
          )}

          {/* Quick Prompts Bar */}
          <div className="quick-prompts-bar">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} /> Quick prompts:
            </span>
            <div className="quick-prompts-scroll">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  className="quick-prompt-chip"
                  onClick={() => {
                    setInputText(prompt);
                    textareaRef.current?.focus();
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="chat-error-banner">
              <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Chat Composer */}
          <div className="chat-composer-box">

            {/* Attachment Preview Pill in Composer */}
            {(pendingUploadFile || pendingExistingFile) && (
              <div className="composer-attached-pill">
                <div className="attached-pill-info">
                  <Paperclip size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span className="attached-pill-name">
                    {pendingUploadFile ? pendingUploadFile.name : (pendingExistingFile?.title || pendingExistingFile?.name)}
                  </span>
                  <span className="attached-pill-size">
                    {pendingUploadFile ? formatBytes(pendingUploadFile.size) : pendingExistingFile?.size}
                  </span>
                  {pendingExistingFile && (
                    <span className="attached-pill-badge">
                      From JC Notes
                    </span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={handleClearAttachment}
                  className="attached-pill-remove"
                  title="Remove attachment"
                  aria-label="Remove attachment"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="composer-input-wrapper">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  pendingUploadFile || pendingExistingFile 
                    ? "Add an optional message for this file... (Enter to send)" 
                    : "Type your message as Anamika... (Enter to send, Shift+Enter for new line)"
                }
                className="chat-textarea"
                rows={1}
                maxLength={MAX_CHAR_LIMIT}
                disabled={connectionStatus !== 'connected'}
                aria-label="Message input"
              />
            </div>

            <div className="composer-actions-bar">
              {/* Attachment Button & Popover */}
              <div className="composer-attach-wrapper" ref={attachMenuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAttachMenuOpen(prev => !prev);
                  }}
                  className={`composer-attach-btn ${isAttachMenuOpen ? 'active' : ''}`}
                  title="Attach file or share existing JC Notes study material"
                  disabled={connectionStatus !== 'connected' || isSending}
                  aria-label="Attach file"
                >
                  <Paperclip size={15} />
                  <span>Attach</span>
                </button>

                {isAttachMenuOpen && (
                  <div className="attach-menu-popover">
                    <button
                      type="button"
                      className="attach-menu-item"
                      onClick={() => {
                        setIsAttachMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                    >
                      <div className="attach-menu-icon upload">
                        <Upload size={16} />
                      </div>
                      <div>
                        <span className="attach-menu-text-title">Upload New File</span>
                        <span className="attach-menu-text-desc">PDF, DOC, PPT, TXT, Images (max 50MB)</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="attach-menu-item"
                      onClick={() => {
                        setIsAttachMenuOpen(false);
                        setIsLibraryModalOpen(true);
                        fetchAvailableFiles();
                      }}
                    >
                      <div className="attach-menu-icon library">
                        <Library size={16} />
                      </div>
                      <div>
                        <span className="attach-menu-text-title">Attach Existing File</span>
                        <span className="attach-menu-text-desc">Reference 142+ JC Notes study files</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf,.png,.jpg,.jpeg,.webp,.gif"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
              </div>

              <div className="composer-meta">
                <span className="anon-posting-as">
                  Posting as: <strong>Anamika</strong>
                </span>
                <span className="char-count" style={{ color: inputText.length > 450 ? '#ef4444' : 'var(--text-muted)' }}>
                  {inputText.length} / {MAX_CHAR_LIMIT}
                </span>

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={
                    (!inputText.trim() && !pendingUploadFile && !pendingExistingFile) || 
                    connectionStatus !== 'connected' || 
                    isSending
                  }
                  className="btn btn-primary send-btn"
                  title="Send anonymous message (Enter)"
                  aria-label="Send anonymous message"
                >
                  {isSending ? (
                    <>
                      <RefreshCw size={13} className="spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Attach Existing JC Notes Material Modal */}
      {isLibraryModalOpen && (
        <div className="community-modal-overlay" onClick={() => setIsLibraryModalOpen(false)}>
          <div className="community-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="community-modal-header">
              <div>
                <h2 className="community-modal-title">Attach from JC Notes Library</h2>
                <p className="community-modal-subtitle">Share any of the 142+ verified study materials directly without creating duplicates</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsLibraryModalOpen(false)}
                className="community-modal-close"
                title="Close library dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="community-modal-search-box">
              <div className="modal-search-input-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by subject, topic or filename (e.g. DSA, DSD, Lab, Unit 3)..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="modal-search-input"
                  autoFocus
                />
                {librarySearch && (
                  <button 
                    type="button"
                    onClick={() => setLibrarySearch('')}
                    className="modal-search-clear"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="modal-category-filters">
                {[
                  { id: 'all', label: 'All Files' },
                  { id: '24cs330', label: 'Data Structures' },
                  { id: '24cs320', label: 'DSD' },
                  { id: '24cs310', label: 'OOP' },
                  { id: 'laboratory', label: 'Lab Manuals' },
                  { id: 'pyq', label: 'PYQ & Exams' },
                  { id: 'syllabus', label: 'Syllabus' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`modal-category-chip ${libraryCategory === filter.id ? 'active' : ''}`}
                    onClick={() => setLibraryCategory(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="community-modal-list">
              {isLoadingLibrary ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <RefreshCw size={22} className="spin" style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.85rem' }}>Loading study materials...</p>
                </div>
              ) : libraryFiles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>No study files match your query.</p>
                  <p style={{ fontSize: '0.75rem' }}>Try searching for a different subject code or topic.</p>
                </div>
              ) : (
                libraryFiles.map((file) => (
                  <div
                    key={file.id}
                    className="community-library-item"
                    onClick={() => {
                      setPendingExistingFile(file);
                      setPendingUploadFile(null);
                      setIsLibraryModalOpen(false);
                      textareaRef.current?.focus();
                    }}
                  >
                    <div className="community-library-item-left">
                      <div className="chat-file-icon-box pdf">
                        <FileText size={18} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div className="community-library-item-title" title={file.title || file.name}>
                          {file.title || file.name}
                        </div>
                        <div className="community-library-item-meta">
                          {file.subjectCode && (
                            <span className="library-item-badge">{file.subjectCode}</span>
                          )}
                          <span>{file.category || 'Study Material'}</span>
                          <span>•</span>
                          <span>{file.size}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="community-library-attach-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingExistingFile(file);
                        setPendingUploadFile(null);
                        setIsLibraryModalOpen(false);
                        textareaRef.current?.focus();
                      }}
                    >
                      <Paperclip size={12} />
                      <span>Attach</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Image Previews */}
      {previewImageModal && (
        <div className="image-lightbox-overlay" onClick={() => setPreviewImageModal(null)}>
          <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              onClick={() => setPreviewImageModal(null)}
              className="image-lightbox-close"
              title="Close image preview"
            >
              <X size={18} />
            </button>
            <img src={previewImageModal} alt="Enlarged attachment preview" />
          </div>
        </div>
      )}

    </div>
  );
};
