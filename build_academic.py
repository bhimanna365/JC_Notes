import json
import os

# Load C programs
with open('c_programs_dump.json', 'r', encoding='utf-8') as f:
    c_codes = json.load(f)

print("Writing academicData.ts...")
academic_data_content = '''import { AcademicEvent, TimetableSlot } from '../types';

export const INSTITUTION_INFO = {
  name: 'JSS Science and Technology University',
  shortName: 'JSS STU (SJCE)',
  campus: 'Mysuru, Karnataka, India',
  department: 'Department of Computer Science and Engineering',
  program: 'Bachelor of Engineering (B.E.) in Computer Science & Engineering',
  autonomousBody: 'JSS Mahavidyapeetha',
  accreditation: 'Approved by AICTE, Lead Institution for World Bank Assistance under TEQIP Scheme',
  currentSemester: 3,
  academicYear: '2026-27'
};

export const ACADEMIC_CALENDAR: AcademicEvent[] = [
  {
    date: '2026-09-01',
    title: 'Commencement of III Semester Classes',
    type: 'academic',
    description: 'Beginning of teaching-learning process for Odd Semester 2026-27.'
  },
  {
    date: '2026-10-10',
    endDate: '2026-10-14',
    title: 'Continuous Internal Evaluation - 1 (CIE-1)',
    type: 'cie',
    description: 'First cycle test covering Unit 1 and initial topics of Unit 2 across all subjects.'
  },
  {
    date: '2026-11-01',
    title: 'Kannada Rajyotsava',
    type: 'holiday',
    description: 'State holiday celebrating Karnataka Formation Day.'
  },
  {
    date: '2026-11-16',
    endDate: '2026-11-20',
    title: 'Continuous Internal Evaluation - 2 (CIE-2 / Event)',
    type: 'cie',
    description: 'Second internal assessment / Event evaluation for theory and laboratory courses.'
  },
  {
    date: '2026-12-14',
    endDate: '2026-12-18',
    title: 'Continuous Internal Evaluation - 3 (CIE-3)',
    type: 'cie',
    description: 'Final internal evaluation covering full syllabus prior to semester end.'
  },
  {
    date: '2026-12-28',
    title: 'Last Working Day for III Semester',
    type: 'academic',
    description: 'Closing of instructional days and finalization of CIE marks and attendance.'
  },
  {
    date: '2027-01-04',
    endDate: '2027-01-11',
    title: 'Practical Examinations (DS Lab 24CS36L)',
    type: 'see',
    description: 'Semester End Practical Lab Examination by Internal and External Examiners.'
  },
  {
    date: '2027-01-16',
    endDate: '2027-02-05',
    title: 'Semester End Theory Examinations (SEE)',
    type: 'see',
    description: 'University theory examinations for all 3rd semester subjects (100 marks scale).'
  },
  {
    date: '2027-02-15',
    title: 'Commencement of IV Semester Classes',
    type: 'academic',
    description: 'Start of Even Semester academic session (IV Semester).'
  }
];

export const TIMETABLE_SLOTS: TimetableSlot[] = [
  // Monday
  { day: 'Monday', time: '08:00 - 09:00', subjectCode: '24MA313', subjectName: 'Engg. Mathematics - III', room: 'CS-101', type: 'Theory' },
  { day: 'Monday', time: '09:00 - 10:00', subjectCode: '24CS330', subjectName: 'Data Structures', room: 'CS-101', type: 'Theory' },
  { day: 'Monday', time: '10:30 - 11:30', subjectCode: '24CS310', subjectName: 'OOP using C++', room: 'CS-101', type: 'Theory' },
  { day: 'Monday', time: '11:30 - 12:30', subjectCode: '24CS340', subjectName: 'Computer Organization', room: 'CS-101', type: 'Theory' },
  { day: 'Monday', time: '01:30 - 04:30', subjectCode: '24CS36L', subjectName: 'DS Lab (Batch A)', room: 'Programming Lab 2', type: 'Lab', batch: 'Batch A' },

  // Tuesday
  { day: 'Tuesday', time: '08:00 - 09:00', subjectCode: '24CS320', subjectName: 'Digital System Design', room: 'CS-101', type: 'Theory' },
  { day: 'Tuesday', time: '09:00 - 10:00', subjectCode: '24CS350', subjectName: 'Discrete Mathematical Structures', room: 'CS-101', type: 'Theory' },
  { day: 'Tuesday', time: '10:30 - 11:30', subjectCode: '24MA313', subjectName: 'Engg. Mathematics - III', room: 'CS-101', type: 'Theory' },
  { day: 'Tuesday', time: '11:30 - 12:30', subjectCode: '24CS330', subjectName: 'Data Structures', room: 'CS-101', type: 'Theory' },
  { day: 'Tuesday', time: '01:30 - 04:30', subjectCode: '24CS36L', subjectName: 'DS Lab (Batch B)', room: 'Programming Lab 2', type: 'Lab', batch: 'Batch B' },

  // Wednesday
  { day: 'Wednesday', time: '08:00 - 09:00', subjectCode: '24CS340', subjectName: 'Computer Organization', room: 'CS-101', type: 'Theory' },
  { day: 'Wednesday', time: '09:00 - 10:00', subjectCode: '24CS310', subjectName: 'OOP using C++', room: 'CS-101', type: 'Theory' },
  { day: 'Wednesday', time: '10:30 - 11:30', subjectCode: '24CS320', subjectName: 'Digital System Design', room: 'CS-101', type: 'Theory' },
  { day: 'Wednesday', time: '11:30 - 12:30', subjectCode: '24HU311', subjectName: 'Universal Human Values - II', room: 'CS-101', type: 'Theory' },
  { day: 'Wednesday', time: '01:30 - 03:30', subjectCode: '24CS310', subjectName: 'OOP Lab Practice', room: 'Software Lab 1', type: 'Lab' },

  // Thursday
  { day: 'Thursday', time: '08:00 - 09:00', subjectCode: '24CS350', subjectName: 'Discrete Mathematical Structures', room: 'CS-101', type: 'Theory' },
  { day: 'Thursday', time: '09:00 - 10:00', subjectCode: '24CS330', subjectName: 'Data Structures', room: 'CS-101', type: 'Theory' },
  { day: 'Thursday', time: '10:30 - 11:30', subjectCode: '24MA313', subjectName: 'Engg. Mathematics - III', room: 'CS-101', type: 'Theory' },
  { day: 'Thursday', time: '11:30 - 12:30', subjectCode: '24CS340', subjectName: 'Computer Organization', room: 'CS-101', type: 'Theory' },
  { day: 'Thursday', time: '01:30 - 04:30', subjectCode: '24CS36L', subjectName: 'DS Lab (Batch C)', room: 'Programming Lab 2', type: 'Lab', batch: 'Batch C' },

  // Friday
  { day: 'Friday', time: '08:00 - 09:00', subjectCode: '24CS310', subjectName: 'OOP using C++', room: 'CS-101', type: 'Theory' },
  { day: 'Friday', time: '09:00 - 10:00', subjectCode: '24CS320', subjectName: 'Digital System Design', room: 'CS-101', type: 'Theory' },
  { day: 'Friday', time: '10:30 - 11:30', subjectCode: '24CS350', subjectName: 'Discrete Mathematical Structures', room: 'CS-101', type: 'Theory' },
  { day: 'Friday', time: '11:30 - 12:30', subjectCode: '24HU311', subjectName: 'Universal Human Values - II', room: 'CS-101', type: 'Theory' },
  { day: 'Friday', time: '01:30 - 03:30', subjectCode: '24CS320', subjectName: 'DSD Hardware Simulation Lab', room: 'Digital Electronics Lab', type: 'Lab' },

  // Saturday
  { day: 'Saturday', time: '08:30 - 10:30', subjectCode: '24CS330', subjectName: 'Data Structures Remedial & Tutorial', room: 'CS-101', type: 'Tutorial' },
  { day: 'Saturday', time: '10:45 - 12:45', subjectCode: '24MA313', subjectName: 'Math Problem Solving Session', room: 'CS-101', type: 'Tutorial' }
];
'''

with open('src/data/academicData.ts', 'w', encoding='utf-8') as f:
    f.write(academic_data_content)

print("academicData.ts written.")
