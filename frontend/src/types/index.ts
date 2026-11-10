export type SemesterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SemesterInfo {
  id: SemesterId;
  number: number;
  title: string;
  cycle?: 'Physics Cycle' | 'Chemistry Cycle' | 'Branch Specific';
  academicYear: string;
  isActive: boolean;
  description: string;
  totalCredits: number;
  coursesCount: number;
}

export interface CourseOutcome {
  co: string;
  text: string;
  level: string; // L1, L2, L3, etc.
  workingKnowledge?: string;
}

export interface Unit {
  unitNumber: number;
  title: string;
  hours: number;
  description: string;
  topics: string[];
  keyConcepts: string[];
  noteId?: string;
}

export interface BookReference {
  author: string;
  title: string;
  edition?: string;
  publisher?: string;
  year?: string;
  isbn?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  shortName: string;
  semester: SemesterId;
  category: 'PCC' | 'BSC' | 'ESC' | 'HSMC' | 'PCCL' | 'PEC' | 'OEC';
  categoryLabel: string;
  credits: number;
  hours: {
    lecture: number;
    tutorial: number;
    practical: number;
    selfStudy: number;
    total: number;
  };
  cieMarks: number;
  seeMarks: number;
  totalMarks: number;
  examDurationHours: number;
  prerequisites?: string;
  objectives: string[];
  outcomes: CourseOutcome[];
  units: Unit[];
  textbooks: BookReference[];
  referenceBooks: BookReference[];
  folderName: string;
  hasLab: boolean;
  colorScheme: {
    accent: string;
    bgSubtle: string;
    border: string;
  };
}

export interface Note {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  unitNumber: number;
  readTime: string;
  tags: string[];
  lastUpdated: string;
  content: string;
  tableOfContents: { id: string; title: string; level: number }[];
  relatedNoteIds?: string[];
  originalFile?: string;
}

export interface LabProgram {
  id: string;
  number: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  language: 'c' | 'cpp' | 'verilog' | 'assembly';
  question: string;
  concept: string;
  algorithm: string[];
  code: string;
  sampleInput: string;
  sampleOutput: string;
  complexity: {
    time: string;
    space: string;
  };
  keyPoints: string[];
  sourceFileName?: string;
}

export interface QuestionPaper {
  id: string;
  subjectCode: string;
  subjectName: string;
  examType: 'SEE' | 'CIE-1' | 'CIE-3' | 'Model QP';
  year: '2024' | '2025' | '2026';
  semester: number;
  marks: number;
  duration: string;
  filePath: string;
  hasSolutions: boolean;
  solutionNotes?: string;
  questionsSummary: string[];
}

export interface AcademicEvent {
  date: string;
  endDate?: string;
  title: string;
  type: 'cie' | 'see' | 'academic' | 'holiday' | 'event';
  description: string;
}

export interface TimetableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  type: 'Theory' | 'Lab' | 'Tutorial';
  batch?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'subject' | 'note' | 'lab' | 'pyq' | 'syllabus' | 'pdf';
  route: string;
  snippet: string;
  badge: string;
}

export interface PDFDocument {
  id: string;
  filename: string;
  title: string;
  relPath: string;
  url: string;
  folder: string;
  subfolder: string;
  unit: string;
  category: string;
  subjectCode?: string | null;
  subjectName?: string;
  sizeBytes: number;
  sizeFormatted: string;
  lastModified: string;
  isManualRecord?: boolean;
  isLabResource?: boolean;
  labType?: 'ds' | 'dsd' | 'oop' | null;
  isSyllabus?: boolean;
  isPYQ?: boolean;
  isCommunityUpload?: boolean;
  keywords?: string[];
  relatedNoteId?: string;
}

export interface PDFUnitGroup {
  unitName: string;
  pdfCount: number;
  pdfs: PDFDocument[];
}

export interface PDFSubjectGroup {
  id: string;
  code: string;
  title: string;
  folder: string;
  category: string;
  totalPdfs: number;
  totalBytes: number;
  totalSizeFormatted: string;
  units: PDFUnitGroup[];
}

export interface LabManualRecord {
  id: string;
  title: string;
  description: string;
  filename: string;
  relPath: string;
  url: string;
  sizeFormatted: string;
  pages?: string;
  badge: string;
  format: 'pdf' | 'docx';
}

export interface LabExperiment {
  id: string;
  number: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  language?: string;
  question: string;
  concept: string;
  algorithm?: string[];
  code?: string;
  sampleInput?: string;
  sampleOutput?: string;
  complexity?: {
    time: string;
    space: string;
  };
  keyPoints?: string[];
  hardwareDetails?: string[];
  sourceFileName?: string;
  relatedPdfId?: string;
  relatedPdfUrl?: string;
  relatedPdfTitle?: string;
}

export interface LaboratoryCourse {
  id: 'ds' | 'dsd' | 'oop';
  code: string;
  title: string;
  shortName: string;
  type: 'Standalone Laboratory' | 'Integrated Practical Course';
  credits: string;
  cieMarks: number;
  seeMarks: number;
  totalMarks: number;
  contactHours: string;
  description: string;
  prerequisites: string;
  courseOutcomes: { co: string; text: string; level: string }[];
  recordsAndManuals: LabManualRecord[];
  experiments: LabExperiment[];
  supportingDocuments: {
    id: string;
    title: string;
    filename: string;
    relPath: string;
    url: string;
    sizeFormatted: string;
    format: 'pdf' | 'docx';
    description: string;
    relatedExperimentNumber?: string;
  }[];
}

