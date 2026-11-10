-- JC Notes Database Seed Data
-- Core Semester III Autonomous CBCS Courses

INSERT INTO subjects (id, code, name, category, credits, semester, display_order) VALUES
('24cs320', '24CS320', 'Digital System Design', 'PCC', 4.0, 3, 1),
('24cs330', '24CS330', 'Data Structures', 'PCC', 4.0, 3, 2),
('24cs310', '24CS310', 'Object Oriented Programming using C++', 'PCC', 3.0, 3, 3),
('24cs340', '24CS340', 'Computer Organization', 'PCC', 4.0, 3, 4),
('24cs350', '24CS350', 'Discrete Mathematical Structures', 'PCC', 3.0, 3, 5),
('24ma313', '24MA313', 'Engineering Mathematics - III', 'BSC', 3.0, 3, 6),
('24hu311', '24HU311', 'Universal Human Values - II', 'HSMC', 1.0, 3, 7),
('24cs36l', '24CS36L', 'Data Structures Lab', 'PCCL', 1.5, 3, 8),
('24cs380', '24CS380', 'Social Connect & Responsibility', 'HSMC', 1.0, 3, 9)
ON CONFLICT (code) DO NOTHING;
