import { QuestionPaper } from '../types';

export const QUESTION_PAPERS: QuestionPaper[] = [
  {
    "id": "pyq-see-2024-ds",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/SEE/24CS330_SEE_DS.pdf",
    "hasSolutions": true,
    "solutionNotes": "Focus on Infix to Postfix conversion steps, Binary Search Tree deletion cases (especially 2-children case using Inorder Successor), Circular Queue modulo wrap-around equations, and DFS/BFS comparisons.",
    "questionsSummary": [
      "Explain the memory representation of primitive vs non-primitive data structures and dynamic allocation using malloc/calloc.",
      "Write an algorithm to convert an infix expression into postfix using stack and trace with ((A+B)*C-(D-E))^(F+G).",
      "Develop C functions for inserting and deleting elements in a Circular Queue and explain why ordinary queues experience false overflow.",
      "Construct a Binary Search Tree for the given set of integers and write the recursive inorder, preorder, and postorder traversals.",
      "Explain collision resolution techniques in Hashing: Separate Chaining vs Open Addressing with linear probing.",
      "Write DFS traversal algorithm and trace it on the given directed graph."
    ]
  },
  {
    "id": "pyq-see-2024-oop",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/SEE/24CS310_SEE_OOPs using C++.pdf",
    "hasSolutions": true,
    "solutionNotes": "Focus on friend function access restrictions, copy constructors deep vs shallow copies, virtual base classes to eliminate diamond inheritance issues, and pure virtual functions.",
    "questionsSummary": [
      "Compare Procedural programming with Object-Oriented programming highlighting encapsulation, inheritance, and polymorphism.",
      "Explain inline functions and default arguments in C++ with suitable code snippets.",
      "What is a friend function? Write a C++ program to add two private data members of two different classes using a friend function.",
      "Explain the role of copy constructors and demonstrate the difference between shallow copy and deep copy with dynamic memory.",
      "Explain the diamond problem in multiple inheritance and demonstrate how virtual base classes resolve the ambiguity.",
      "What are virtual functions and late binding? Explain the internal working of VTable and VPTR."
    ]
  },
  {
    "id": "pyq-see-2024-dsd",
    "subjectCode": "24CS320",
    "subjectName": "Digital System Design",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/SEE/24CS320_SEE_DSD.pdf",
    "hasSolutions": false,
    "solutionNotes": "High-yield topics: 4-variable and 5-variable K-maps with don't-care conditions, Quine-McCluskey tabular method, 8-to-3 priority encoders, and Master-Slave JK flip-flop.",
    "questionsSummary": [
      "Simplify the given Boolean function using a 4-variable K-Map with don't-care conditions and draw the NAND-gate logic circuit.",
      "Using the Quine-McCluskey tabular method, determine all Prime Implicants and find the minimal Sum of Products expression.",
      "Design an 8-to-3 Priority Encoder: derive truth table, output equations, and draw gate-level schematic.",
      "Explain the race-around condition in JK flip-flops and show how a Master-Slave JK flip-flop eliminates it.",
      "Design a 3-bit Synchronous Up/Down Counter using JK flip-flops with state diagram and excitation table.",
      "Compare PROM, PLA, and PAL architectures with block diagrams."
    ]
  },
  {
    "id": "pyq-see-2024-co",
    "subjectCode": "24CS340",
    "subjectName": "Computer Organization",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/SEE/24CS340_SEE_CO.pdf",
    "hasSolutions": false,
    "solutionNotes": "Crucial topics: Booth's algorithm trace, Direct mapped vs Set-associative cache address partitioning, DMA cycle stealing, and hardwired vs microprogrammed control units.",
    "questionsSummary": [
      "Explain the basic functional units of a computer system and derive the basic performance equation.",
      "Compare Memory-Mapped I/O with Isolated (Port-Mapped) I/O and explain the daisy-chain priority interrupt mechanism.",
      "Describe Direct Memory Access (DMA) transfer modes: burst mode vs cycle stealing with controller block diagram.",
      "Explain Cache memory mapping functions: Direct mapping, Fully Associative, and Set-Associative mapping with numerical address bit calculations.",
      "Multiply (+13) by (-6) using Booth's Multiplication Algorithm showing all register contents and recoding.",
      "Explain the single-bus CPU datapath and write the complete control sequence for executing an instruction like ADD (R1), R2."
    ]
  },
  {
    "id": "pyq-see-2024-dms",
    "subjectCode": "24CS350",
    "subjectName": "Discrete Mathematical Structures",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/SEE/24CS350_SEE_DMS.pdf",
    "hasSolutions": true,
    "solutionNotes": "Focus on formal logical equivalence proofs (applying absorption, De Morgan's, and distributive laws without truth tables), equivalence relation proofs, and second-order linear recurrence relations.",
    "questionsSummary": [
      "Prove the logical equivalence ~(p v (~p ^ q)) equiv (~p ^ ~q) without constructing a truth table by citing laws of logic.",
      "State and prove the validity of an argument using rules of inference (Modus Ponens, Modus Tollens, Disjunctive Syllogism).",
      "Let R be a relation on the set of integers such that a R b iff a - b is divisible by 5. Prove that R is an equivalence relation and determine the equivalence classes.",
      "Solve the recurrence relation a_n - 6a_{n-1} + 9a_{n-2} = 0 with initial conditions a_0 = 1, a_1 = 6.",
      "State and prove Euler's Planar Formula V - E + R = 2 for a connected planar graph.",
      "Define an Abelian group and verify if the set of integers modulo 7 under multiplication modulo 7 forms a group."
    ]
  },
  {
    "id": "pyq-see-2024-m3",
    "subjectCode": "24MA313",
    "subjectName": "Engineering Mathematics - III",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/SEE/24MA313_SEE_Math.pdf",
    "hasSolutions": false,
    "solutionNotes": "Focus on least squares normal equations for y = a + bx and parabolas, Karl Pearson correlation formula, Bayes' Theorem problems, and Poisson/Normal distribution standard area tables.",
    "questionsSummary": [
      "Fit a straight line y = a + bx to the given set of data points using the principle of least squares.",
      "Calculate the Karl Pearson coefficient of correlation between sales and advertising expenditure for 10 firms.",
      "State and prove Bayes' Theorem. A bolt factory has three machines A, B, C producing bolts; find the probability that a defective bolt came from machine A.",
      "The probability that a patient recovers from a rare blood disease is 0.4. If 15 people contract the disease, find the probability that at least 10 survive using Binomial distribution.",
      "Fit a Poisson distribution to the given frequency distribution of defects per unit.",
      "Explain the Principle of Inclusion and Exclusion for three sets and solve a counting problem involving student enrollments."
    ]
  },
  {
    "id": "pyq-see-2024-uhv",
    "subjectCode": "24HU311",
    "subjectName": "Universal Human Values - II",
    "examType": "SEE",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "2 Hours",
    "filePath": "PYQ-24/SEE/24HU311_SEE_UHV.pdf",
    "hasSolutions": false,
    "solutionNotes": "Essential themes: Natural acceptance, continuous happiness (Sukha) vs physical facilities (Suvidha), Sanyama & Swasthya, Trust (Intention vs Competence), and 4 orders of nature.",
    "questionsSummary": [
      "What is the need for Value Education in technical curricula? Explain the process of Self-Exploration.",
      "Distinguish between continuous happiness (Sukha) and physical facility (Suvidha). What are the three requirements for fulfilling basic human aspirations?",
      "Explain human being as the co-existence of Self ('I') and Body. Differentiate their needs and activities.",
      "What is Trust? Differentiate between Intention and Competence in personal and professional relationships.",
      "Explain the four orders of nature (Material, Bio, Animal, Human) and their mutual fulfillment.",
      "Discuss the competence required for professional ethics in engineering design."
    ]
  },
  {
    "id": "pyq-cie1-2024-ds",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "examType": "CIE-1",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "1.15 Hours",
    "filePath": "PYQ-24/Test-1/24CS330 CIE-1_DSA.pdf",
    "hasSolutions": false,
    "solutionNotes": "Covers Unit 1 (Pointers, Dynamic allocation, Structures) and Unit 2 (Stacks, Infix-Postfix).",
    "questionsSummary": [
      "Explain malloc(), calloc(), realloc(), and free() with examples.",
      "Write a C program to implement Stack ADT using an array with Push, Pop, and Display operations.",
      "Convert the infix expression (A + B) * C - (D - E) / F to postfix expression using tabular stack trace."
    ]
  },
  {
    "id": "pyq-cie1-2024-oop",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "examType": "CIE-1",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "1.15 Hours",
    "filePath": "PYQ-24/Test-1/24CS310 CIE-1_OOPs using C++.pdf",
    "hasSolutions": true,
    "solutionNotes": "Covers inline functions, function overloading maxValue(), constructors, and friend functions.",
    "questionsSummary": [
      "Explain inline functions with advantages. Write a C++ program to calculate sum of two numbers using an inline function.",
      "Demonstrate function overloading by creating maxValue() that finds largest among: i) 2 ints ii) 2 floats iii) 3 ints.",
      "What is a constructor? Discuss rules for defining constructors in C++.",
      "Create a class Sample with two private integer data members; calculate their sum using a friend function."
    ]
  },
  {
    "id": "pyq-cie1-2024-dms",
    "subjectCode": "24CS350",
    "subjectName": "Discrete Mathematical Structures",
    "examType": "CIE-1",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "1.15 Hours",
    "filePath": "PYQ-24/Test-1/24CS350 CIE-1_DMS.pdf",
    "hasSolutions": true,
    "solutionNotes": "Covers Unit 1 Logic: Truth tables, Tautologies, De Morgan's laws, and formal equivalence proofs.",
    "questionsSummary": [
      "Verify whether ((p -> q) ^ (q -> r)) -> (p -> r) is a tautology.",
      "Without truth table, prove p v (p ^ q) equiv p (Absorption Law).",
      "Express statement using quantifiers: 'Every computer science student loves discrete mathematics'."
    ]
  },
  {
    "id": "pyq-cie3-2024-ds",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "examType": "CIE-3",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "1.15 Hours",
    "filePath": "PYQ-24/Test-2/24CS330 CIE-3_DS.pdf",
    "hasSolutions": true,
    "solutionNotes": "Complete model answers available in 'DS_CIE 3 - Modal Answers.pdf'. Detailed steps for Binary Search Trees, Deque operations, and Graph DFS.",
    "questionsSummary": [
      "Explain the delete operation in Binary Search Tree with all three child scenarios and C code.",
      "Write a C program to implement Double Ended Queue (Deque) with dynamic memory allocation.",
      "Trace DFS and BFS traversals for the given 6-vertex graph starting from vertex 0."
    ]
  },
  {
    "id": "pyq-cie3-2024-dms",
    "subjectCode": "24CS350",
    "subjectName": "Discrete Mathematical Structures",
    "examType": "CIE-3",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "1.15 Hours",
    "filePath": "PYQ-24/Test-2/24CS350 CIE-3_DMS.pdf",
    "hasSolutions": true,
    "solutionNotes": "Complete official answer key available in 'DMS_CIE 3 - Answer key.pdf'. Covers Handshaking lemma, Euler circuits, and homogeneous recurrence relations.",
    "questionsSummary": [
      "Solve recurrence relation a_n = 5a_{n-1} - 6a_{n-2} with a_0 = 1, a_1 = 4.",
      "State the Handshaking Lemma and prove that in any graph, the number of odd-degree vertices is even.",
      "Check whether the given graph has an Eulerian circuit or an Eulerian trail."
    ]
  },
  {
    "id": "pyq-cie3-2024-co",
    "subjectCode": "24CS340",
    "subjectName": "Computer Organization",
    "examType": "CIE-3",
    "year": "2024",
    "semester": 3,
    "marks": 30,
    "duration": "1.15 Hours",
    "filePath": "PYQ-24/Test-2/24CS340 CIE-3_CO.pdf",
    "hasSolutions": true,
    "solutionNotes": "Focus on Booth's multiplication trace, IEEE 754 single precision format, and microprogrammed control memory.",
    "questionsSummary": [
      "Multiply 7 by -3 using Booth's Algorithm in 4-bit representation.",
      "Represent the decimal number -12.625 in IEEE 754 single-precision 32-bit floating point format.",
      "Differentiate between Hardwired Control and Microprogrammed Control units."
    ]
  },
  {
    "id": "pyq-lab-test-2024",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab Exam",
    "examType": "Model QP",
    "year": "2024",
    "semester": 3,
    "marks": 60,
    "duration": "3 Hours",
    "filePath": "PYQ-24/24CS36L - Data Strctures Lab Test-Exam Lab Syllabus+QP.pdf",
    "hasSolutions": true,
    "solutionNotes": "Contains all 16 lab examination questions assigned during university practical exams.",
    "questionsSummary": [
      "Develop a menu driven program to convert infix expression to postfix and evaluate.",
      "Implement Circular Double Linked List with header node for ordered insertion and deletion by key.",
      "Implement Binary Search tree: construction, traversals, and node deletion.",
      "Develop a program for Student structure with dynamic memory allocation and best-two average calculation."
    ]
  }
];

export function getPYQBySubject(subjectCode: string): QuestionPaper[] {
  return QUESTION_PAPERS.filter(q => q.subjectCode.toLowerCase() === subjectCode.toLowerCase());
}

export function getPYQByExamType(examType: string): QuestionPaper[] {
  return QUESTION_PAPERS.filter(q => q.examType.toLowerCase() === examType.toLowerCase());
}
