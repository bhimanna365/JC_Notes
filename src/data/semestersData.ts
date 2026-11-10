import { SemesterInfo } from '../types';

export const SEMESTERS: SemesterInfo[] = [
  {
    "id": 1,
    "number": 1,
    "title": "Semester I",
    "cycle": "Physics Cycle",
    "academicYear": "2024-25",
    "isActive": false,
    "description": "Foundational engineering sciences, Mathematics I, Engineering Physics, C Programming, and Electrical Engineering.",
    "totalCredits": 19,
    "coursesCount": 7
  },
  {
    "id": 2,
    "number": 2,
    "title": "Semester II",
    "cycle": "Chemistry Cycle",
    "academicYear": "2024-25",
    "isActive": false,
    "description": "Engineering Mathematics II, Engineering Chemistry, Engineering Mechanics, Electronics, and Graphics Design.",
    "totalCredits": 19,
    "coursesCount": 7
  },
  {
    "id": 3,
    "number": 3,
    "title": "Semester III",
    "cycle": "Branch Specific",
    "academicYear": "2026-27",
    "isActive": true,
    "description": "Core Computer Science curriculum: Data Structures, OOP using C++, Digital System Design, Computer Organization, Discrete Math, M3 & Labs.",
    "totalCredits": 24.5,
    "coursesCount": 8
  },
  {
    "id": 4,
    "number": 4,
    "title": "Semester IV",
    "cycle": "Branch Specific",
    "academicYear": "2026-27",
    "isActive": false,
    "description": "Operating Systems, Design & Analysis of Algorithms, Data Communication, Software Engineering, Linear Algebra & DAA Lab.",
    "totalCredits": 24.5,
    "coursesCount": 8
  },
  {
    "id": 5,
    "number": 5,
    "title": "Semester V",
    "cycle": "Branch Specific",
    "academicYear": "2027-28",
    "isActive": false,
    "description": "Computer Networks, Database Management Systems, Theory of Computation, Artificial Intelligence, Professional Electives & DBMS Lab.",
    "totalCredits": 23.5,
    "coursesCount": 8
  },
  {
    "id": 6,
    "number": 6,
    "title": "Semester VI",
    "cycle": "Branch Specific",
    "academicYear": "2027-28",
    "isActive": false,
    "description": "Internet of Things, Machine Learning, Principles of Compilers, Cryptography & Network Security, Cloud Computing & ML Lab.",
    "totalCredits": 23.5,
    "coursesCount": 8
  },
  {
    "id": 7,
    "number": 7,
    "title": "Semester VII",
    "cycle": "Branch Specific",
    "academicYear": "2028-29",
    "isActive": false,
    "description": "Advanced electives, Open electives, Major Project Phase I, and Industry Internship.",
    "totalCredits": 20,
    "coursesCount": 5
  },
  {
    "id": 8,
    "number": 8,
    "title": "Semester VIII",
    "cycle": "Branch Specific",
    "academicYear": "2028-29",
    "isActive": false,
    "description": "Major Project Phase II, Seminar, and Technical Paper Publication.",
    "totalCredits": 16,
    "coursesCount": 3
  }
];
export const CURRENT_SEMESTER_ID = 3;
