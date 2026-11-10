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
