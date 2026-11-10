-- JC Notes Database Schema
-- Schema for future relational persistence (PostgreSQL / MySQL / SQLite)

CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    credits NUMERIC(3,1) NOT NULL DEFAULT 4.0,
    semester INT NOT NULL DEFAULT 3,
    display_order INT NOT NULL DEFAULT 99,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(50) PRIMARY KEY,
    subject_code VARCHAR(20) REFERENCES subjects(code) ON DELETE CASCADE,
    unit_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_documents (
    id VARCHAR(100) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    relative_path TEXT NOT NULL,
    subject_code VARCHAR(20) REFERENCES subjects(code),
    unit VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    is_manual_record BOOLEAN DEFAULT FALSE,
    is_lab_resource BOOLEAN DEFAULT FALSE,
    is_syllabus BOOLEAN DEFAULT FALSE,
    is_pyq BOOLEAN DEFAULT FALSE,
    last_modified DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_papers (
    id VARCHAR(100) PRIMARY KEY,
    academic_document_id VARCHAR(100) REFERENCES academic_documents(id) ON DELETE CASCADE,
    year VARCHAR(10) NOT NULL,
    exam_type VARCHAR(50) NOT NULL, -- 'SEE', 'CIE-1', 'CIE-2', 'CIE-3', 'Model QP'
    subject_code VARCHAR(20) REFERENCES subjects(code),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_progress (
    user_id VARCHAR(100) NOT NULL,
    document_id VARCHAR(100) REFERENCES academic_documents(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, document_id)
);

-- ==============================================================================
-- Community Chat Persistent Storage (Supabase / PostgreSQL)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS community_messages (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(50) NOT NULL DEFAULT 'Anamika',
    author VARCHAR(50) NOT NULL DEFAULT 'Anamika',
    message TEXT NOT NULL,
    text TEXT NOT NULL,
    file JSONB DEFAULT NULL,
    timestamp BIGINT NOT NULL,
    formatted_time VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering history quickly
CREATE INDEX IF NOT EXISTS idx_community_messages_timestamp ON community_messages(timestamp DESC);

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Security Policy: Allow public read access so students can view message history
CREATE POLICY "Allow public read on community_messages" ON community_messages FOR SELECT USING (true);

-- Security Note: NO public INSERT policy is created.
-- Direct client inserts via the Supabase public anon key are blocked by default.
-- Community messages must be submitted exclusively through the Node.js backend API
-- (which enforces XSS sanitization, length limits, rate limiting, and author anonymity)
-- and written using SUPABASE_SERVICE_ROLE_KEY.

