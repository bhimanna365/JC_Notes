import json

courses = [
  {
    "id": "24CS330",
    "code": "24CS330",
    "title": "Data Structures",
    "shortName": "DS",
    "semester": 3,
    "category": "PCC",
    "categoryLabel": "Professional Core Course",
    "credits": 4,
    "hours": {
      "lecture": 60,
      "tutorial": 0,
      "practical": 0,
      "selfStudy": 60,
      "total": 120
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "Introduction to Programming in C (24CS111/211)",
    "objectives": [
      "Understand the concepts of primitive and non-primitive data structures, dynamic memory allocation and pointers.",
      "Design and implement linear data structures including Stacks, Queues, and Linked Lists with static and dynamic representations.",
      "Explore non-linear hierarchical data structures such as Binary Search Trees, AVL Trees, and Expression Trees.",
      "Master graph representation techniques, traversals (DFS/BFS), and hash tables for fast lookup."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Apply concepts of pointers, dynamic memory allocation, and structures to design abstract data types.", "level": "L3", "workingKnowledge": "WK2, WK6" },
      { "co": "CO2", "text": "Implement and analyze linear data structures (Stacks, Queues, Lists) and their real-world applications.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO3", "text": "Apply expression conversion (Infix to Postfix/Prefix) and evaluation using stack data structures.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO4", "text": "Construct and traverse Binary Search Trees and analyze tree-based operations.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO5", "text": "Implement Graph traversal algorithms (DFS, BFS) and evaluate hashing collision resolution techniques.", "level": "L3", "workingKnowledge": "WK2, WK4" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Introduction to Data Structures, Arrays and Pointers",
        "hours": 12,
        "description": "Foundational memory representation, pointer mechanics, dynamic memory allocation functions (malloc, calloc, realloc, free), array storage representation, structures and unions.",
        "topics": [
          "Concept of Data Structures: Primitive vs Non-Primitive, Linear vs Non-Linear",
          "Dynamic Memory Allocation in C: malloc(), calloc(), realloc(), free()",
          "Pointers: Pointer Arithmetic, Pointer to Pointers, Void Pointers, NULL pointer",
          "Array Representation: Static vs Dynamic arrays, Row-major and Column-major order",
          "Structures in C: Array of structures, Pointers to structures, Self-referential structures",
          "Unions and Enumerations: Memory sharing, Differences between structures and unions"
        ],
        "keyConcepts": ["Contiguous Allocation", "Dangling Pointers", "Memory Leaks", "Structure Padding"],
        "noteId": "note-ds-arrays"
      },
      {
        "unitNumber": 2,
        "title": "Stacks and Queues",
        "hours": 12,
        "description": "LIFO and FIFO data structures, array and pointer representations, expression processing, circular queue arithmetic, priority queues and deques.",
        "topics": [
          "Stack ADT: Push, Pop, Peek, Overflow and Underflow conditions",
          "Applications of Stacks: Function call recursion, Backtracking, Bracket matching",
          "Arithmetic Expression Representations: Infix, Prefix (Polish), Postfix (Reverse Polish)",
          "Infix to Postfix Conversion using Stacks with Operator Precedence and Associativity",
          "Evaluation of Postfix and Prefix Expressions",
          "Queue ADT: Enqueue, Dequeue, Linear Queue drawbacks and false overflow",
          "Circular Queue: Modulo arithmetic ((rear + 1) % MAX), boundary conditions",
          "Priority Queue: Ascending and Descending Priority Queues, Array implementation",
          "Double-Ended Queue (Deque): Input-restricted and Output-restricted variations"
        ],
        "keyConcepts": ["LIFO Principle", "FIFO Principle", "Postfix Notation", "Circular Buffering"],
        "noteId": "note-ds-stacks"
      },
      {
        "unitNumber": 3,
        "title": "Linked Lists",
        "hours": 12,
        "description": "Dynamic node-based linear structures, pointer manipulation, singly linked lists, doubly linked lists, circular linked lists, and header nodes.",
        "topics": [
          "Linked List Fundamentals: Advantages over contiguous arrays, Node anatomy",
          "Singly Linked List (SLL): Insertion at front/rear/position, Deletion at front/rear/key",
          "Searching and Traversal: Linear search, Node counting, Reversing a singly linked list",
          "Circular Linked List (CLL): Tail pointer optimization, circular traversal",
          "Doubly Linked List (DLL): Forward and backward pointers, insertion and deletion mechanics",
          "Circular Double Linked List with Header Node: Sentinel headers, boundary simplifications",
          "Applications: Polynomial representation and addition using linked lists, Memory manager"
        ],
        "keyConcepts": ["Node Pointers", "Sentinel/Header Nodes", "Memory Overhead vs Array Contiguity", "Pointer Rewiring"],
        "noteId": "note-ds-linkedlists"
      },
      {
        "unitNumber": 4,
        "title": "Trees & Binary Search Trees",
        "hours": 12,
        "description": "Hierarchical non-linear structures, binary trees, binary search trees (BST), balanced search trees, tree traversals, and applications.",
        "topics": [
          "Tree Terminologies: Root, Leaf, Height, Depth, Degree, Subtree, Level",
          "Binary Trees: Full, Complete, Perfect, Degenerate binary trees",
          "Binary Tree Traversals: Depth-First (Preorder, Inorder, Postorder) and Breadth-First (Level-order)",
          "Binary Search Tree (BST): BST Property, Searching an element, Finding Min and Max",
          "BST Operations: Insertion of a key, Deletion of a node (0, 1, or 2 children cases)",
          "Inorder Successor and Predecessor in BST",
          "Expression Trees: Construction from Postfix and Prefix, Infix extraction",
          "Threaded Binary Trees and AVL Tree basics: Rotations for height balancing"
        ],
        "keyConcepts": ["BST Invariant", "Inorder yields sorted sequence", "Recursive Tree Traversals", "2-Children Deletion by Successor"],
        "noteId": "note-ds-trees"
      },
      {
        "unitNumber": 5,
        "title": "Graphs and Hashing",
        "hours": 12,
        "description": "Non-linear network representations, graph traversals, minimum spanning trees, and hash tables for O(1) average lookup.",
        "topics": [
          "Graph Concepts: Directed/Undirected, Weighted, Cyclic/Acyclic, Connected components",
          "Graph Storage Representations: Adjacency Matrix vs Adjacency List (Time/Space comparison)",
          "Depth First Search (DFS): Algorithm using Stack / Recursion, Applications",
          "Breadth First Search (BFS): Algorithm using Queue, Shortest path on unweighted graphs",
          "Topological Sorting for DAGs: In-degree method and DFS finish-time method",
          "Minimum Spanning Trees: Prim's algorithm and Kruskal's algorithm concepts",
          "Hashing: Hash functions, Hash table, Collision resolution by Separate Chaining and Open Addressing (Linear Probing, Quadratic Probing, Double Hashing)"
        ],
        "keyConcepts": ["Adjacency Matrix vs List", "DFS Backtracking", "BFS Level-by-Level", "Hash Collision Resolution"],
        "noteId": "note-ds-graphs"
      }
    ],
    "textbooks": [
      {
        "author": "Reema Thareja",
        "title": "Data Structures Using C",
        "edition": "2nd Edition",
        "publisher": "Oxford University Press",
        "year": "2018"
      },
      {
        "author": "Narasimha Karumanchi",
        "title": "Data Structures and Algorithms Made Easy",
        "edition": "5th Edition",
        "publisher": "CareerMonk Publications",
        "year": "2020"
      },
      {
        "author": "Richard F. Gilberg and Behrouz A. Forouzan",
        "title": "Data Structures: A Pseudocode Approach with C",
        "edition": "3rd Edition",
        "publisher": "Cengage Learning",
        "year": "2013"
      }
    ],
    "referenceBooks": [
      {
        "author": "Aaron M. Tenenbaum, Yedidyah Langsam, Moshe J. Augenstein",
        "title": "Data Structures Using C",
        "edition": "1st Edition",
        "publisher": "Pearson Education",
        "year": "2008"
      },
      {
        "author": "Yashavant Kanetkar",
        "title": "Data Structures Through C",
        "edition": "3rd Edition",
        "publisher": "BPB Publications",
        "year": "2016"
      }
    ],
    "folderName": "24CS330-DS",
    "hasLab": True,
    "colorScheme": {
      "accent": "#2563eb",
      "bgSubtle": "rgba(37, 99, 235, 0.08)",
      "border": "rgba(37, 99, 235, 0.25)"
    }
  },
  {
    "id": "24CS310",
    "code": "24CS310",
    "title": "Object Oriented Programming using C++",
    "shortName": "OOP",
    "semester": 3,
    "category": "PCC",
    "categoryLabel": "Professional Core Course",
    "credits": 4,
    "hours": {
      "lecture": 45,
      "tutorial": 0,
      "practical": 30,
      "selfStudy": 45,
      "total": 120
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "Computer Concepts and C Programming",
    "objectives": [
      "Master object-oriented programming paradigms: Encapsulation, Abstraction, Inheritance, and Polymorphism.",
      "Understand memory management using new/delete, constructors, destructors, and copy semantics.",
      "Implement operator overloading for custom data types and stream operations.",
      "Apply generic programming with templates and standard template library (STL)."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Apply principles of OOP such as encapsulation, inline functions, and function overloading.", "level": "L3", "workingKnowledge": "WK1, WK4" },
      { "co": "CO2", "text": "Demonstrate the use of constructors, destructors, friend functions, and dynamic memory allocation.", "level": "L3", "workingKnowledge": "WK2, WK6" },
      { "co": "CO3", "text": "Implement compile-time polymorphism through operator overloading.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO4", "text": "Develop hierarchical class structures utilizing various modes of inheritance and virtual base classes.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO5", "text": "Implement runtime polymorphism with virtual functions, abstract classes, templates, and exception handling.", "level": "L3", "workingKnowledge": "WK2, WK6" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Principles of OOP, Functions and References",
        "hours": 9,
        "description": "Procedural vs Object Oriented paradigm, C++ tokens, reference variables, inline functions, default arguments, function overloading, scope resolution operator.",
        "topics": [
          "Paradigm shift: Procedural Programming vs Object-Oriented Programming",
          "Core OOP Concepts: Objects, Classes, Data Abstraction, Encapsulation, Inheritance, Polymorphism",
          "Tokens, Expressions and Control Structures: Reference variables (&), Scope resolution operator (::)",
          "Inline Functions: Syntax, Advantages, Situations where inline is ignored by compiler",
          "Default Arguments: Rules for assigning default values from right-to-left",
          "Function Overloading: Matching logic, Ambiguity resolution, Overloading by parameter count/type",
          "const arguments and reference parameter passing"
        ],
        "keyConcepts": ["Reference Variables", "Inline Expansion", "Name Mangling", "Default Arguments"],
        "noteId": "note-classes-cpp"
      },
      {
        "unitNumber": 2,
        "title": "Classes, Objects, Constructors and Operator Overloading",
        "hours": 9,
        "description": "Class anatomy, private/public/protected access specifiers, static members, constructors, destructors, Dynamic Memory Allocation (new/delete), friend functions, operator overloading.",
        "topics": [
          "Classes and Objects: Specification, Member function definition inside and outside class",
          "Limitations of C Structures: Inability to support member functions and access encapsulation",
          "Friend Functions and Friend Classes: Syntax, Accessing private members, Practical use cases",
          "Constructors: Default, Parameterized, Copy Constructor, Constructor Overloading, Initializer Lists",
          "Destructors: Execution order, Resource clean-up, Freeing heap memory",
          "Dynamic Memory Allocation in C++: new and delete operators, Array allocation, Comparison with malloc/free",
          "Operator Overloading: Overloading unary operators (minus, increment/decrement), Overloading binary operators (+, -, *, /)",
          "Operator Overloading using Friend Functions: Stream operators (<<, >>), Rules of operator overloading"
        ],
        "keyConcepts": ["Friendship in C++", "Deep Copy vs Shallow Copy", "Heap vs Free Store", "Operator Overloading Invariant"],
        "noteId": "note-dma-cpp"
      },
      {
        "unitNumber": 3,
        "title": "Inheritance and Reusability",
        "hours": 9,
        "description": "Class derivation, modes of inheritance, single, multilevel, multiple, hierarchical, hybrid inheritance, virtual base classes, constructors in derived classes.",
        "topics": [
          "Inheritance Concepts: Base class and Derived class, Advantages of code reuse",
          "Access Specifiers in Inheritance: Public, Protected, and Private derivation semantics",
          "Types of Inheritance: Single, Multilevel, Multiple, Hierarchical, Hybrid",
          "Ambiguity in Multiple Inheritance and Diamond Problem",
          "Virtual Base Classes: Syntax and Elimination of duplicate sub-objects",
          "Order of Constructor and Destructor Execution in Multiple and Multilevel Inheritance",
          "Passing arguments to base class constructors from derived constructors"
        ],
        "keyConcepts": ["Diamond Problem", "Virtual Base Class", "Constructor Delegation", "Protected Access"],
        "noteId": "note-classes-cpp"
      },
      {
        "unitNumber": 4,
        "title": "Pointers, Virtual Functions and Polymorphism",
        "hours": 9,
        "description": "Pointer to objects, this pointer, pointers to derived classes, virtual functions, pure virtual functions, and abstract base classes.",
        "topics": [
          "Pointers to Objects and Member Access via Arrow (->) Operator",
          "The 'this' Pointer: Disambiguating shadowed member variables, Chaining method calls",
          "Pointers to Derived Classes: Upcasting and Base class pointer pointing to Derived object",
          "Virtual Functions: Early Binding vs Late (Runtime) Binding, VTable and VPTR mechanism",
          "Rules for Virtual Functions: Virtual destructors, Non-virtual constructors",
          "Pure Virtual Functions: Syntax (= 0), Semantic meaning",
          "Abstract Base Classes: Interface design, Enforcing implementation in derived classes"
        ],
        "keyConcepts": ["VTABLE / VPTR", "Late Binding", "Pure Virtual Function", "Abstract Class"],
        "noteId": "note-friend-cpp"
      },
      {
        "unitNumber": 5,
        "title": "Templates, Exception Handling and STL",
        "hours": 9,
        "description": "Generic programming with function and class templates, exception handling with try/throw/catch, file I/O streams, and Standard Template Library.",
        "topics": [
          "Generic Programming: Need for templates, Function templates with single and multiple types",
          "Class Templates: Generic classes, Non-type template arguments, Template specialization",
          "Exception Handling: try, throw, and catch blocks, Catch-all handler (...), Rethrowing exceptions",
          "File Stream Operations: ifstream, ofstream, fstream, Opening modes, File pointers (seekg, seekp, tellg, tellp)",
          "Standard Template Library (STL): Containers (vector, list, map, deque), Iterators, Algorithms (sort, find)"
        ],
        "keyConcepts": ["Generic Template Instantiation", "Stack Unwinding", "File Stream Pointers", "STL Iterators"],
        "noteId": "note-operator-cpp"
      }
    ],
    "textbooks": [
      {
        "author": "E. Balagurusamy",
        "title": "Object Oriented Programming with C++",
        "edition": "8th Edition",
        "publisher": "McGraw Hill Education",
        "year": "2020"
      },
      {
        "author": "Robert Lafore",
        "title": "Object-Oriented Programming in C++",
        "edition": "4th Edition",
        "publisher": "Pearson Education",
        "year": "2002"
      }
    ],
    "referenceBooks": [
      {
        "author": "Bjarne Stroustrup",
        "title": "The C++ Programming Language",
        "edition": "4th Edition",
        "publisher": "Addison-Wesley",
        "year": "2013"
      },
      {
        "author": "Herbert Schildt",
        "title": "C++: The Complete Reference",
        "edition": "4th Edition",
        "publisher": "McGraw-Hill",
        "year": "2003"
      }
    ],
    "folderName": "24CS310-OOP",
    "hasLab": True,
    "colorScheme": {
      "accent": "#059669",
      "bgSubtle": "rgba(5, 150, 105, 0.08)",
      "border": "rgba(5, 150, 105, 0.25)"
    }
  },
  {
    "id": "24CS320",
    "code": "24CS320",
    "title": "Digital System Design",
    "shortName": "DSD",
    "semester": 3,
    "category": "PCC",
    "categoryLabel": "Professional Core Course",
    "credits": 4,
    "hours": {
      "lecture": 45,
      "tutorial": 0,
      "practical": 30,
      "selfStudy": 45,
      "total": 120
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "Elements of Electronics Engineering",
    "objectives": [
      "Simplify complex boolean expressions using Karnaugh Maps and Quine-McCluskey tabular reduction.",
      "Design combinational logic circuits such as Encoders, Priority Encoders, Decoders, Multiplexers, and Adders.",
      "Analyze sequential logic circuits, flip-flops, state tables, state diagrams, and excitation tables.",
      "Implement registers, synchronous and asynchronous counters, and study programmable logic devices."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Apply boolean algebra, K-Maps, and Quine-McCluskey method to simplify logic functions.", "level": "L3", "workingKnowledge": "WK1, WK3" },
      { "co": "CO2", "text": "Design combinational circuits using decoders, multiplexers, and priority encoders.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO3", "text": "Analyze sequential circuits and design flip-flops (SR, JK, D, T) with master-slave configurations.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO4", "text": "Design synchronous and asynchronous counters and shift registers.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO5", "text": "Understand programmable logic devices (PLA, PAL, CPLD, FPGA) and digital system implementations.", "level": "L2", "workingKnowledge": "WK1, WK2" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Simplification of Boolean Functions",
        "hours": 9,
        "description": "Boolean theorems, canonical forms (SOP and POS), Karnaugh maps up to 5 variables, Don't care conditions, Quine-McCluskey tabular reduction, Prime Implicants.",
        "topics": [
          "Boolean Postulates and Theorems: De Morgan's laws, Duality principle, Consensus theorem",
          "Canonical and Standard Forms: Minterms (m) and Maxterms (M), SOP and POS conversions",
          "Karnaugh Map (K-Map): 2, 3, 4 and 5-variable maps, Grouping rules (pairs, quads, octets)",
          "Incompletely Specified Functions: Don't Care conditions ('X' or 'd') and optimal grouping",
          "Quine-McCluskey (Tabular) Method: Systematic determination of Prime Implicants (PI)",
          "Prime Implicant Table: Essential Prime Implicants (EPI), Row/Column dominance reductions"
        ],
        "keyConcepts": ["Minterm / Maxterm", "Gray Code Mapping", "Don't Care Optimization", "Essential Prime Implicants"],
        "noteId": "note-dsd-kmaps"
      },
      {
        "unitNumber": 2,
        "title": "Combinational Logic Circuits",
        "hours": 9,
        "description": "Design of arithmetic circuits, magnitude comparators, decoders, encoders, priority encoders, multiplexers, and demultiplexers.",
        "topics": [
          "Binary Adders and Subtractors: Half Adder, Full Adder, Ripple Carry Adder, Half Subtractor, Full Subtractor",
          "Carry Lookahead Adder: Generate and Propagate functions, Delay reduction over ripple carry",
          "Decoders: 2-to-4, 3-to-8 line decoders with enable inputs, Active-low vs Active-high outputs",
          "Encoders and Priority Encoders: Octal-to-binary encoder, 8-to-3 Priority Encoder truth table and equations",
          "Multiplexers (MUX): 2:1, 4:1, 8:1, 16:1 MUX logic, Implementing Boolean functions using Multiplexers",
          "Demultiplexers (DEMUX) and Decoder expansion (building 4:16 decoder from two 3:8 decoders)"
        ],
        "keyConcepts": ["Priority Encoding", "Shannon Expansion with MUX", "Carry Lookahead Logic", "Active Low Enable"],
        "noteId": "note-dsd-combinational"
      },
      {
        "unitNumber": 3,
        "title": "Sequential Logic Circuits & Flip-Flops",
        "hours": 9,
        "description": "Latches vs Flip-Flops, clocked SR, JK, D, T flip-flops, race-around condition, Master-Slave flip-flop, excitation tables, state reduction.",
        "topics": [
          "Latches: SR Latch with NOR and NAND gates, Clocked SR Latch",
          "Flip-Flops: Edge-triggered D Flip-Flop, Edge-triggered JK Flip-Flop, T (Toggle) Flip-Flop",
          "Race-Around Condition in JK Flip-Flop: Causes (clock pulse width > propagation delay)",
          "Solutions to Race-Around: Master-Slave JK Flip-Flop architecture and operation timing",
          "Flip-Flop Conversion: Converting between SR, JK, D, and T flip-flops using excitation tables",
          "Sequential Circuit Design: State tables, State diagrams, State assignment, Mealy vs Moore models"
        ],
        "keyConcepts": ["Edge Triggering", "Master-Slave Isolation", "Excitation Tables", "Mealy vs Moore Machine"],
        "noteId": "note-dsd-flipflops"
      },
      {
        "unitNumber": 4,
        "title": "Registers and Counters",
        "hours": 9,
        "description": "Shift register architectures, universal shift register, ripple (asynchronous) counters, synchronous counters, up/down counters, ring and Johnson counters.",
        "topics": [
          "Shift Registers: Serial-In Serial-Out (SISO), Serial-In Parallel-Out (SIPO), Parallel-In Serial-Out (PISO), Parallel-In Parallel-Out (PIPO)",
          "Bidirectional and Universal Shift Register (74LS194) architecture",
          "Asynchronous (Ripple) Counters: Mod-8, Mod-10 (BCD Decade counter), Glitch hazards",
          "Synchronous Counters: Design methodology using T or JK flip-flops, Synchronous BCD counter",
          "Up/Down Synchronous Counters: Direction control input logic",
          "Special Shift Register Counters: Ring Counter (N states for N flip-flops) and Twisted Ring (Johnson) Counter (2N states)"
        ],
        "keyConcepts": ["SISO/SIPO/PISO/PIPO", "Propagation Delay Ripple", "Synchronous Clocking", "Ring vs Johnson Counter"],
        "noteId": "note-dsd-registers"
      },
      {
        "unitNumber": 5,
        "title": "Memory and Programmable Logic",
        "hours": 9,
        "description": "Random Access Memory (RAM), Read-Only Memory (ROM), Programmable Logic Array (PLA), Programmable Array Logic (PAL), CPLD, and FPGA architectures.",
        "topics": [
          "Memory Fundamentals: RAM, Static RAM (SRAM) cell, Dynamic RAM (DRAM) cell and refresh cycles",
          "Read Only Memory: PROM, EPROM, EEPROM, Flash memory",
          "Programmable Logic Devices: Programmable Read-Only Memory (PROM) with fixed AND, programmable OR",
          "Programmable Logic Array (PLA): Programmable AND array and programmable OR array",
          "Programmable Array Logic (PAL): Programmable AND array and fixed OR array",
          "Complex Programmable Logic Devices (CPLD) and Field Programmable Gate Arrays (FPGA) overview",
          "Hardware Description Language: Introduction to Verilog HDL module structure and testbenches"
        ],
        "keyConcepts": ["SRAM vs DRAM", "PLA vs PAL vs PROM", "Look-Up Tables (LUTs)", "Verilog HDL"],
        "noteId": "note-dsd-registers"
      }
    ],
    "textbooks": [
      {
        "author": "Donald P. Leach, Albert Paul Malvino, Goutam Saha",
        "title": "Digital Principles and Applications",
        "edition": "8th Edition",
        "publisher": "McGraw Hill Education",
        "year": "2015"
      },
      {
        "author": "M. Morris Mano, Michael D. Ciletti",
        "title": "Digital Design: With an Introduction to the Verilog HDL",
        "edition": "5th Edition",
        "publisher": "Pearson Education",
        "year": "2013"
      }
    ],
    "referenceBooks": [
      {
        "author": "Charles H. Roth Jr., Larry L. Kinney",
        "title": "Fundamentals of Logic Design",
        "edition": "7th Edition",
        "publisher": "Cengage Learning",
        "year": "2014"
      }
    ],
    "folderName": "24CS320-DSD",
    "hasLab": True,
    "colorScheme": {
      "accent": "#d97706",
      "bgSubtle": "rgba(217, 119, 6, 0.08)",
      "border": "rgba(217, 119, 6, 0.25)"
    }
  },
  {
    "id": "24CS340",
    "code": "24CS340",
    "title": "Computer Organization",
    "shortName": "CO",
    "semester": 3,
    "category": "PCC",
    "categoryLabel": "Professional Core Course",
    "credits": 3,
    "hours": {
      "lecture": 45,
      "tutorial": 0,
      "practical": 0,
      "selfStudy": 45,
      "total": 90
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "Basic Electrical & Electronics, Introduction to Programming",
    "objectives": [
      "Understand basic operational concepts, instruction sets, addressing modes, and bus structures.",
      "Explore Input/Output organization, interrupt handling mechanisms, and Direct Memory Access (DMA).",
      "Analyze the memory hierarchy including cache mapping techniques, virtual memory, and secondary storage.",
      "Master fast arithmetic algorithms: carry lookahead adders, Booth's multiplication, and restoring/non-restoring division."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Explain the basic architectural structure, instruction sequencing, and addressing modes.", "level": "L2", "workingKnowledge": "WK1, WK2" },
      { "co": "CO2", "text": "Analyze I/O data transfer mechanisms, interrupts, and DMA controllers.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO3", "text": "Evaluate memory hierarchy performance, cache mapping functions, and virtual memory translation.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO4", "text": "Apply fast computer arithmetic algorithms for integer and floating point operations.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO5", "text": "Understand basic processing unit datapaths, control unit design, and instruction pipelining.", "level": "L2", "workingKnowledge": "WK1, WK2" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Basic Structure of Computers",
        "hours": 9,
        "description": "Functional units of a computer, basic operational concepts, bus structures, performance metrics, memory locations and addresses, machine instructions.",
        "topics": [
          "Functional Units: Input, Memory (Primary and Secondary), Arithmetic and Logic Unit (ALU), Output, Control Unit",
          "Basic Operational Concepts: Instruction cycle (Fetch, Decode, Execute), Register transfers (PC, MAR, MDR, IR)",
          "Bus Structures: Single-bus vs Multiple-bus architectures, Synchronous vs Asynchronous buses",
          "Software and Performance: Elapsed time, Processor clock frequency, Basic performance equation (T = N x S / R)",
          "Memory Locations and Addresses: Byte addressability, Big-Endian vs Little-Endian byte ordering",
          "Machine Instructions and Programs: Memory operations, Instructions sequencing, Condition codes"
        ],
        "keyConcepts": ["Von Neumann Architecture", "Big-Endian vs Little-Endian", "Processor Clock & CPI", "MAR/MDR Data Bus"],
        "noteId": "note-co-basic"
      },
      {
        "unitNumber": 2,
        "title": "Addressing Modes & Input/Output Organization",
        "hours": 9,
        "description": "Instruction formats and addressing modes, I/O device access, interrupts, interrupt priority schemes, Direct Memory Access (DMA), bus arbitration.",
        "topics": [
          "Addressing Modes: Immediate, Register, Absolute (Direct), Indirect, Index, Relative, Autoincrement/Autodecrement",
          "Accessing I/O Devices: Memory-Mapped I/O vs Separate (Port-Mapped / Isolated) I/O",
          "Interrupts: Interrupt request lines, Interrupt service routine (ISR), Saving processor state",
          "Handling Multiple Devices: Polling, Vectored Interrupts, Daisy Chaining priority scheme",
          "Direct Memory Access (DMA): DMA controller registers, Burst mode vs Cycle stealing mode",
          "Bus Arbitration: Centralized arbitration (Bus Grant, Bus Request) vs Distributed arbitration"
        ],
        "keyConcepts": ["Addressing Mode Mechanics", "Memory-Mapped I/O", "Vectored ISR", "DMA Cycle Stealing"],
        "noteId": "note-co-io"
      },
      {
        "unitNumber": 3,
        "title": "The Memory System",
        "hours": 9,
        "description": "Memory hierarchy, semiconductor RAM technologies, cache memory principles, mapping functions, replacement algorithms, virtual memory and TLBs.",
        "topics": [
          "Memory Hierarchy: Speed, Size, and Cost pyramid (Registers, L1/L2/L3 Cache, Main Memory, Secondary Storage)",
          "Internal Organization of Memory Chips: Decoding rows and columns, Memory expansion (word length and capacity)",
          "Cache Memory Principles: Locality of Reference (Temporal and Spatial locality), Hit ratio and Miss penalty",
          "Cache Mapping Functions: Direct Mapping, Associative Mapping, Set-Associative Mapping (Calculations for Tag, Index, Word bits)",
          "Replacement Algorithms: Least Recently Used (LRU), FIFO, Random replacement",
          "Write Policies: Write-Through vs Write-Back (Dirty bit mechanism)",
          "Virtual Memory: Paging, Page tables, Page Faults, Translation Lookaside Buffer (TLB) address translation"
        ],
        "keyConcepts": ["Spatial & Temporal Locality", "Direct vs Set-Associative Mapping", "Write-Through vs Write-Back", "TLB Paging Hit"],
        "noteId": "note-co-memory"
      },
      {
        "unitNumber": 4,
        "title": "Arithmetic",
        "hours": 9,
        "description": "Signed integer representations, fast adder circuits, high-speed multiplication, Booth's multiplication algorithm, integer division, IEEE 754 floating-point standard.",
        "topics": [
          "Signed Number Representation: 2's complement addition and subtraction, Overflow detection",
          "Fast Adders: Carry Lookahead Adder (CLA) - Generate (G) and Propagate (P) signals",
          "Multiplication of Unsigned Numbers: Array multiplier, Shift-and-add logic",
          "Signed Operand Multiplication: Booth's Algorithm, Recoding multiplier bits (+1, 0, -1), Handling consecutive 1s",
          "Integer Division: Restoring Division algorithm and Non-Restoring Division algorithm with datapath traces",
          "Floating-Point Numbers: IEEE 754 Standard for Single Precision (32-bit) and Double Precision (64-bit)"
        ],
        "keyConcepts": ["2's Complement Overflow", "Booth's Bit-Pair Recoding", "Restoring vs Non-Restoring", "IEEE 754 Format"],
        "noteId": "note-co-arithmetic"
      },
      {
        "unitNumber": 5,
        "title": "Basic Processing Unit & Pipelining",
        "hours": 9,
        "description": "Processor internal organization, single-bus and multi-bus datapaths, execution of complete instructions, hardwired vs microprogrammed control, basic pipelining.",
        "topics": [
          "Single-Bus CPU Datapath: Register transfers, ALU inputs, Multiplexers, Instruction fetch control sequence",
          "Execution of a Complete Instruction: Fetch, Operand read, ALU operation, Result store micro-operations",
          "Multiple-Bus Organization: Advantages of 3-bus architecture in single-cycle operations",
          "Hardwired Control Unit: State flip-flops, Decoder logic, Fast execution for RISC processors",
          "Microprogrammed Control Unit: Control memory, Microinstructions, Microprogram counter (uPC), Flexibility for CISC",
          "Basic Pipelining: Instruction pipelining stages (IF, ID, EX, MEM, WB), Pipeline Hazards (Data, Structural, Control hazards)"
        ],
        "keyConcepts": ["Micro-operation Sequences", "Hardwired vs Microprogrammed", "Pipeline Hazards", "Branch Penalty"],
        "noteId": "note-co-basic"
      }
    ],
    "textbooks": [
      {
        "author": "Carl Hamacher, Zvonko Vranesic, Safwat Zaky",
        "title": "Computer Organization and Embedded Systems",
        "edition": "6th Edition",
        "publisher": "McGraw Hill",
        "year": "2012"
      },
      {
        "author": "David A. Patterson, John L. Hennessy",
        "title": "Computer Organization and Design: The Hardware/Software Interface",
        "edition": "5th Edition",
        "publisher": "Morgan Kaufmann",
        "year": "2014"
      }
    ],
    "referenceBooks": [
      {
        "author": "William Stallings",
        "title": "Computer Organization and Architecture",
        "edition": "10th Edition",
        "publisher": "Pearson Education",
        "year": "2016"
      }
    ],
    "folderName": "24CS340-CO",
    "hasLab": False,
    "colorScheme": {
      "accent": "#7c3aed",
      "bgSubtle": "rgba(124, 58, 237, 0.08)",
      "border": "rgba(124, 58, 237, 0.25)"
    }
  },
  {
    "id": "24CS350",
    "code": "24CS350",
    "title": "Discrete Mathematical Structures",
    "shortName": "DMS",
    "semester": 3,
    "category": "PCC",
    "categoryLabel": "Professional Core Course",
    "credits": 3,
    "hours": {
      "lecture": 45,
      "tutorial": 0,
      "practical": 0,
      "selfStudy": 45,
      "total": 90
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "Foundations of Engineering Mathematics",
    "objectives": [
      "Master propositional and predicate logic, truth tables, tautologies, rules of inference, and formal proofs.",
      "Analyze set operations, binary relations, equivalence relations, partial orders, Hasse diagrams, and functions.",
      "Solve recurrence relations using characteristic equations and the generating function method.",
      "Explore graph theory principles, Euler trails, Hamilton paths, planar graphs, chromatic numbers, and tree structures."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Construct truth tables, prove logical equivalences, and validate deductive arguments.", "level": "L3", "workingKnowledge": "WK1, WK2" },
      { "co": "CO2", "text": "Analyze properties of relations, determine equivalence classes, and construct Hasse diagrams.", "level": "L3", "workingKnowledge": "WK1, WK3" },
      { "co": "CO3", "text": "Apply principles of mathematical induction and solve linear homogeneous recurrence relations.", "level": "L3", "workingKnowledge": "WK1, WK2" },
      { "co": "CO4", "text": "Apply Graph Theory definitions, graph coloring, and identify Eulerian and Hamiltonian graphs.", "level": "L3", "workingKnowledge": "WK1, WK3" },
      { "co": "CO5", "text": "Understand fundamental properties of trees, spanning trees, and basic algebraic group structures.", "level": "L2", "workingKnowledge": "WK1, WK2" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Fundamentals of Logic",
        "hours": 9,
        "description": "Propositions, logical connectives, truth tables, tautology, contradiction, logical equivalence, algebra of propositions, rules of inference, predicates and quantifiers.",
        "topics": [
          "Propositions and Truth Values: Negation, Conjunction, Disjunction, Conditional, Biconditional",
          "Tautologies, Contradictions, and Contingencies: Truth table verification",
          "Logical Equivalences: De Morgan's Laws, Distributive Laws, Absorption Laws, Double Negation",
          "Step-by-step proofs of logical equivalences without using truth tables (Problems 1 to 9)",
          "Rules of Inference: Modus Ponens, Modus Tollens, Hypothetical Syllogism, Disjunctive Syllogism",
          "Predicates and Quantifiers: Universal (forall) and Existential (exists) quantifiers, Negating quantified statements"
        ],
        "keyConcepts": ["Truth Table Exhaustion", "Formal Equivalence Proofs", "Modus Ponens/Tollens", "Quantifier Duality"],
        "noteId": "note-dms-logic"
      },
      {
        "unitNumber": 2,
        "title": "Set Theory, Relations and Functions",
        "hours": 9,
        "description": "Sets and operations, Cartesian products, binary relations, matrix and digraph of relations, equivalence relations, partial orderings, Hasse diagrams, functions.",
        "topics": [
          "Set Operations: Union, Intersection, Difference, Symmetric Difference, Cartesian Products",
          "Binary Relations: Domain, Range, Matrix representation, Directed Graph representation",
          "Properties of Relations: Reflexive, Symmetric, Anti-symmetric, Transitive relations",
          "Equivalence Relations: Definition, Equivalence classes, Partitions of a set",
          "Partial Ordering Relations: Posets, Hasse Diagrams, Maximal, Minimal, Greatest, and Least elements",
          "Functions: Injective (One-to-One), Surjective (Onto), Bijective, Inverse functions, Composition of functions"
        ],
        "keyConcepts": ["Equivalence Partitioning", "Hasse Diagram Construction", "Anti-symmetry Condition", "Bijective Inverses"],
        "noteId": "note-dms-relations"
      },
      {
        "unitNumber": 3,
        "title": "Mathematical Induction & Recurrence Relations",
        "hours": 9,
        "description": "Well-ordering principle, mathematical induction, strong induction, recurrence relations, solving linear homogeneous and non-homogeneous recurrences.",
        "topics": [
          "Principle of Mathematical Induction: Base step, Inductive hypothesis, Inductive step",
          "Strong Induction (Second Principle) and Well-Ordering Property",
          "Recurrence Relations: Formulation from counting problems (Tower of Hanoi, Fibonacci numbers)",
          "Solving First-Order Linear Recurrence Relations: Iterative substitution method",
          "Solving Second-Order Linear Homogeneous Recurrence Relations with Constant Coefficients",
          "Characteristic Equation roots: Distinct real roots, Repeated roots, Complex roots",
          "Non-Homogeneous Recurrence Relations: Particular solutions for polynomial and exponential driving terms"
        ],
        "keyConcepts": ["Inductive Invariant", "Characteristic Polynomial", "Homogeneous vs Particular Solution", "Fibonacci Recurrence"],
        "noteId": "note-dms-logic"
      },
      {
        "unitNumber": 4,
        "title": "Graph Theory",
        "hours": 9,
        "description": "Graphs and multigraphs, subgraphs, isomorphism, degree of vertices, Handshaking Lemma, Euler trails and circuits, Hamilton paths and cycles, planar graphs, coloring.",
        "topics": [
          "Graph Terminology: Vertices, Edges, Simple graphs, Multigraphs, Degree of a vertex",
          "The Handshaking Lemma: Sum of degrees equals 2E, Parity of odd-degree vertices",
          "Graph Isomorphism: Invariant properties (vertex count, edge count, degree sequence)",
          "Eulerian Graphs: Euler trails and circuits, Necessary and sufficient conditions (all vertices even degree)",
          "Hamiltonian Graphs: Hamilton paths and cycles, Dirac's Theorem and Ore's Theorem",
          "Planar Graphs: Euler's Planar Formula (V - E + R = 2), Kuratowski's Theorem (K5 and K3,3)",
          "Graph Coloring: Chromatic number, Four Color Theorem, Applications to scheduling"
        ],
        "keyConcepts": ["Handshaking Lemma", "Euler's Circuit Criterion", "Planar Formula V - E + R = 2", "Chromatic Number"],
        "noteId": "note-dms-trees"
      },
      {
        "unitNumber": 5,
        "title": "Trees and Algebraic Structures",
        "hours": 9,
        "description": "Tree definitions, properties, rooted trees, spanning trees, algebraic structures: semigroups, monoids, groups, subgroups, homomorphisms.",
        "topics": [
          "Trees: Equivalent definitions (connected acyclic graph, unique path between vertices, E = V - 1)",
          "Rooted Trees and m-ary Trees: Height, Leaves, Internal vertices",
          "Spanning Trees: Finding spanning trees using DFS and BFS",
          "Minimal Spanning Tree: Prim's algorithm and Kruskal's algorithm on weighted graphs",
          "Algebraic Structures: Binary operations and properties (Closure, Associativity, Identity, Inverse)",
          "Semigroups and Monoids: Definitions and examples (Z, +), (Z, *)",
          "Groups and Subgroups: Abelian groups, Order of a group, Cyclic groups and Generators",
          "Homomorphisms and Isomorphisms of Groups"
        ],
        "keyConcepts": ["Tree Invariant E = V - 1", "Minimum Spanning Tree", "Abelian Group Axioms", "Cyclic Generators"],
        "noteId": "note-dms-trees"
      }
    ],
    "textbooks": [
      {
        "author": "Ralph P. Grimaldi",
        "title": "Discrete and Combinatorial Mathematics: An Applied Introduction",
        "edition": "5th Edition",
        "publisher": "Pearson Education",
        "year": "2004"
      },
      {
        "author": "Kenneth H. Rosen",
        "title": "Discrete Mathematics and Its Applications",
        "edition": "7th Edition",
        "publisher": "McGraw Hill Education",
        "year": "2012"
      }
    ],
    "referenceBooks": [
      {
        "author": "C. L. Liu, D. P. Mohapatra",
        "title": "Elements of Discrete Mathematics",
        "edition": "4th Edition",
        "publisher": "McGraw Hill",
        "year": "2012"
      }
    ],
    "folderName": "24CS350-DMS",
    "hasLab": False,
    "colorScheme": {
      "accent": "#0284c7",
      "bgSubtle": "rgba(2, 132, 199, 0.08)",
      "border": "rgba(2, 132, 199, 0.25)"
    }
  },
  {
    "id": "24CS36L",
    "code": "24CS36L",
    "title": "Data Structures Laboratory",
    "shortName": "DS Lab",
    "semester": 3,
    "category": "PCCL",
    "categoryLabel": "Professional Core Course Laboratory",
    "credits": 1.5,
    "hours": {
      "lecture": 0,
      "tutorial": 0,
      "practical": 45,
      "selfStudy": 45,
      "total": 90
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "C Programming Laboratory",
    "objectives": [
      "Gain practical programming experience implementing linear and non-linear data structures in C.",
      "Strengthen pointer manipulation, memory allocation, structure manipulation, and recursion skills.",
      "Implement Stack and Queue variants and apply them to expression conversion and evaluation.",
      "Implement Linked Lists, Binary Search Trees, and Graph traversals."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Implement programs to illustrate the use of pointers to arrays, structures, and functions.", "level": "L3", "workingKnowledge": "WK2, WK6" },
      { "co": "CO2", "text": "Implement operations on Linear lists with Array and Linked list representations.", "level": "L3", "workingKnowledge": "WK2, WK4" },
      { "co": "CO3", "text": "Implement Stack, Queue, Tree, and Graph data structures and analyze their operational performance.", "level": "L3", "workingKnowledge": "WK2, WK4" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Pointers and Dynamic Structures Lab Experiments",
        "hours": 9,
        "description": "Experiments 1 to 3: Pointer chains, array pointers, dynamic student structure best-of-two averaging, time structure arithmetic and normalization.",
        "topics": [
          "Exp 1: Pointer Chaining (P1 -> P2 -> P3 -> X) & Array Reversal using Pointers",
          "Exp 2: Dynamic Student Structure with Best 2 Marks Average Calculation",
          "Exp 3: Time Structure with Normalization and Time Addition via Pointers"
        ],
        "keyConcepts": ["Double Pointers", "Dynamic Memory Allocation", "Structure Pointers", "Normalization"],
        "noteId": "note-ds-arrays"
      },
      {
        "unitNumber": 2,
        "title": "Array Storage Representation Lab Experiments",
        "hours": 9,
        "description": "Experiment 4: Array storage representation with static and dynamic memory allocation, insert/delete by pos/key/order, search, and reverse.",
        "topics": [
          "Exp 4: Comprehensive Array Operations (Insert by pos/key/order, Delete by pos/key, Search, Reverse)"
        ],
        "keyConcepts": ["Static vs Dynamic Storage", "Array Compaction", "Linear Search", "In-Place Reversal"],
        "noteId": "note-ds-arrays"
      },
      {
        "unitNumber": 3,
        "title": "Linked Lists Lab Experiments",
        "hours": 9,
        "description": "Experiments 5 to 9: Singly linked list, circular singly linked list, doubly linked list, circular double linked list with header node.",
        "topics": [
          "Exp 5: Singly Linked List (Insert front/rear/pos, Delete front/rear/key, Search, Display)",
          "Exp 6: Circular Double Linked List with Header Node",
          "Exp 7: Circular Singly Linked List Operations",
          "Exp 8: Doubly Linked List Operations"
        ],
        "keyConcepts": ["Node Pointer Rewiring", "Header Sentinel Nodes", "Circular Boundary Traversal"],
        "noteId": "note-ds-linkedlists"
      },
      {
        "unitNumber": 4,
        "title": "Stacks & Queues Lab Experiments",
        "hours": 9,
        "description": "Experiments 10 to 13: Infix to postfix/prefix conversion and evaluation, Linear queue, Double-ended queue (Deque), Circular queue, and Priority queue.",
        "topics": [
          "Exp 10: Infix to Postfix Conversion & Postfix Expression Evaluation using Stacks",
          "Exp 11: Infix to Prefix Conversion & Prefix Expression Evaluation using Stacks",
          "Exp 12: Ordinary Queue & Double Ended Queue (Deque) with Dynamic Memory",
          "Exp 13: Circular Queue & Ascending Priority Queue with Dynamic Memory"
        ],
        "keyConcepts": ["Stack Operator Precedence", "Postfix Stack Evaluation", "Circular Modulo Buffer", "Priority Sorted Insertion"],
        "noteId": "note-ds-stacks"
      },
      {
        "unitNumber": 5,
        "title": "Trees & Graphs Lab Experiments",
        "hours": 9,
        "description": "Experiments 14 to 16: Binary Search Tree construction, traversals (DFS/BFS), node deletion, maximum key finding, and Graph traversal techniques.",
        "topics": [
          "Exp 14: Binary Search Tree Construction, Traversals, Max key, Node counting, Height",
          "Exp 15: Binary Search Tree Node Deletion (Leaf, One child, Two children)",
          "Exp 16: Graph Traversal Techniques (DFS and BFS)"
        ],
        "keyConcepts": ["BST Recursion", "Inorder Successor Deletion", "DFS Stack Traversal", "BFS Queue Traversal"],
        "noteId": "note-ds-trees"
      }
    ],
    "textbooks": [
      {
        "author": "Reema Thareja",
        "title": "Data Structures using C",
        "edition": "2nd Edition",
        "publisher": "Oxford University Press",
        "year": "2018"
      }
    ],
    "referenceBooks": [
      {
        "author": "Richard F. Gilberg and Behrouz A. Forouzan",
        "title": "Data Structures: A Pseudocode Approach with C",
        "edition": "3rd Edition",
        "publisher": "Cengage Learning",
        "year": "2013"
      }
    ],
    "folderName": "24CS36L-DS-Lab",
    "hasLab": True,
    "colorScheme": {
      "accent": "#dc2626",
      "bgSubtle": "rgba(220, 38, 38, 0.08)",
      "border": "rgba(220, 38, 38, 0.25)"
    }
  },
  {
    "id": "24MA313",
    "code": "24MA313",
    "title": "Engineering Mathematics - III",
    "shortName": "M3",
    "semester": 3,
    "category": "BSC",
    "categoryLabel": "Basic Science Course",
    "credits": 3,
    "hours": {
      "lecture": 45,
      "tutorial": 0,
      "practical": 0,
      "selfStudy": 45,
      "total": 90
    },
    "cieMarks": 40,
    "seeMarks": 60,
    "totalMarks": 100,
    "examDurationHours": 3,
    "prerequisites": "Engineering Mathematics - I & II",
    "objectives": [
      "To impart fundamental understanding of curve fitting, correlation, regression lines and their applications.",
      "Explore probability theory, conditional probability, and Bayes' Theorem.",
      "Analyze discrete and continuous random variables, probability mass functions, and cumulative distribution functions.",
      "Master standard probability distributions (Binomial, Poisson, Normal) and combinatorics counting techniques."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Apply least square method to fit curves and evaluate correlation coefficients and regression lines.", "level": "L2", "workingKnowledge": "WK1, WK3" },
      { "co": "CO2", "text": "Determine the nature of events and calculate conditional probabilities and Bayes' theorem applications.", "level": "L2", "workingKnowledge": "WK2, WK6" },
      { "co": "CO3", "text": "Classify random variables to determine appropriate probability distributions, mean, and variance.", "level": "L2", "workingKnowledge": "WK1, WK4" },
      { "co": "CO4", "text": "Apply Binomial, Poisson, and Normal distributions to model real-world engineering problems.", "level": "L2", "workingKnowledge": "WK1, WK4" },
      { "co": "CO5", "text": "Apply fundamental counting principles, generating functions, and rook polynomials to combinatorics problems.", "level": "L2", "workingKnowledge": "WK1, WK4" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Curve Fitting, Correlation & Regression",
        "hours": 9,
        "description": "Method of least squares, curve fitting for straight lines, parabolas, and exponential curves, Karl Pearson coefficient of correlation, regression lines.",
        "topics": [
          "Method of Least Squares: Principles and Normal Equations",
          "Fitting of Curves: Straight line (y = a + bx), Parabola of second degree (y = a + bx + cx^2)",
          "Exponential Curves: Fitting y = ae^(bx) and y = ab^x using logarithmic transformation",
          "Correlation: Scatter diagrams, Karl Pearson's coefficient of correlation (r), Properties of r",
          "Lines of Regression: Regression of Y on X and X on Y, Angle between two regression lines"
        ],
        "keyConcepts": ["Normal Equations", "Log Transformation for Exponentials", "Karl Pearson r", "Regression Slopes"],
        "noteId": "note-m3-curve"
      },
      {
        "unitNumber": 2,
        "title": "Probability",
        "hours": 9,
        "description": "Sample space, axioms of probability, conditional probability, multiplication theorem, independent events, Baye's Theorem.",
        "topics": [
          "Review of Basic Probability: Sample space, Mutually exclusive events, Axioms of probability",
          "Conditional Probability: Definition P(A|B) = P(A cap B) / P(B)",
          "Multiplication Theorem of Probability for Independent and Dependent Events",
          "Total Probability Theorem: Partition of a sample space",
          "Baye's Theorem: Formulation, Posterior probability calculation, Engineering diagnostic applications"
        ],
        "keyConcepts": ["Conditional Probability", "Total Probability Law", "Bayes' Theorem Posterior Probability"],
        "noteId": "note-m3-prob"
      },
      {
        "unitNumber": 3,
        "title": "Random Variables & Probability Distributions",
        "hours": 9,
        "description": "Discrete and Continuous random variables, probability mass function (PMF), probability density function (PDF), CDF, Mean, Variance, Binomial, Poisson and Normal distributions.",
        "topics": [
          "Random Variables: Discrete and Continuous random variables",
          "Probability Mass Function (PMF) and Probability Density Function (PDF) properties",
          "Cumulative Distribution Function (CDF): Properties and derivation of probabilities from CDF",
          "Mathematical Expectation: Mean (mu = E[X]), Variance (sigma^2 = E[X^2] - (E[X])^2), Standard Deviation",
          "Binomial Distribution: PMF P(X = r) = nCr p^r q^(n-r), Mean = np, Variance = npq",
          "Poisson Distribution: PMF P(X = r) = (e^(-m) m^r) / r!, Mean = Variance = m, Limiting case of Binomial",
          "Normal Distribution: Standard normal curve (Z = (X - mu) / sigma), Area properties, Practical problems"
        ],
        "keyConcepts": ["PMF vs PDF", "Expectation & Variance", "Binomial np / npq", "Poisson Lambda Invariant", "Standard Normal Z"],
        "noteId": "note-m3-dist"
      },
      {
        "unitNumber": 4,
        "title": "Combinatorics - I",
        "hours": 9,
        "description": "Fundamental principles of counting, permutations, combinations, pigeonhole principle, principle of inclusion and exclusion.",
        "topics": [
          "Fundamental Principles of Counting: The Rule of Sum and The Rule of Product",
          "Permutations and Combinations: Formulas, Circular permutations, Permutations with repetitions",
          "Pigeonhole Principle (PHP): Statement, Generalized Pigeonhole Principle, Applications",
          "Principle of Inclusion and Exclusion (PIE): Two-set and Three-set formulas",
          "Generalized Principle of Inclusion and Exclusion for N sets: Proof and applications"
        ],
        "keyConcepts": ["Sum & Product Rules", "Pigeonhole Lower Bound", "Inclusion-Exclusion Overlap Cancellation"],
        "noteId": "note-m3-comb"
      },
      {
        "unitNumber": 5,
        "title": "Combinatorics - II",
        "hours": 9,
        "description": "Generating functions, partitions of integers, recurrence relations, derangements, rook polynomials.",
        "topics": [
          "Generating Functions: Ordinary generating functions, Calculating coefficients of x^r",
          "Partitions of Integers: Generating function representation, Ferrers graphs",
          "Exponential Generating Functions: Definition and applications to arrangements",
          "Derangements: Definition (no element in its original position), Formula d_n = n! sum((-1)^k / k!)",
          "Rook Polynomials: Chessboard forbidden positions, Expansion formula r(C, x) = r(C_e, x) + x * r(C_s, x)"
        ],
        "keyConcepts": ["Generating Function Coefficients", "Derangement Formula d_n", "Rook Polynomial Expansion"],
        "noteId": "note-m3-comb"
      }
    ],
    "textbooks": [
      {
        "author": "Dr. K. S. Chandrashekar (Dr. KSC)",
        "title": "Engineering Mathematics - III (Advanced Mathematics)",
        "edition": "Revised Edition",
        "publisher": "Sudha Publications",
        "year": "2022"
      },
      {
        "author": "B. S. Grewal",
        "title": "Higher Engineering Mathematics",
        "edition": "44th Edition",
        "publisher": "Khanna Publishers",
        "year": "2018"
      }
    ],
    "referenceBooks": [
      {
        "author": "B. V. Ramana",
        "title": "Higher Engineering Mathematics",
        "edition": "11th Edition",
        "publisher": "Tata McGraw-Hill",
        "year": "2010"
      }
    ],
    "folderName": "24MA313-M3",
    "hasLab": False,
    "colorScheme": {
      "accent": "#4f46e5",
      "bgSubtle": "rgba(79, 70, 229, 0.08)",
      "border": "rgba(79, 70, 229, 0.25)"
    }
  },
  {
    "id": "24HU311",
    "code": "24HU311",
    "title": "Universal Human Values - II: Understanding Harmony",
    "shortName": "UHV",
    "semester": 3,
    "category": "HSMC",
    "categoryLabel": "Humanities, Social Sciences and Management Course",
    "credits": 2,
    "hours": {
      "lecture": 30,
      "tutorial": 0,
      "practical": 0,
      "selfStudy": 30,
      "total": 60
    },
    "cieMarks": 20,
    "seeMarks": 30,
    "totalMarks": 50,
    "examDurationHours": 2,
    "prerequisites": "Universal Human Values - I",
    "objectives": [
      "Develop a holistic perspective towards life, profession, and happiness based on self-exploration.",
      "Understand harmony in human being, harmony in family, society, and nature.",
      "Strengthen moral, ethical, and sustainable decision-making in professional engineering practice."
    ],
    "outcomes": [
      { "co": "CO1", "text": "Understand the process of self-exploration and recognize basic human aspirations: continuous happiness and prosperity.", "level": "L2", "workingKnowledge": "WK1" },
      { "co": "CO2", "text": "Distinguish between the needs of the Self ('I') and Body, and understand harmony between them.", "level": "L2", "workingKnowledge": "WK1" },
      { "co": "CO3", "text": "Appreciate values in human relationships and evaluate conditions for harmony in family and society.", "level": "L2", "workingKnowledge": "WK1" },
      { "co": "CO4", "text": "Understand harmony in nature, interconnectedness, mutual fulfillment, and holistic professional ethics.", "level": "L2", "workingKnowledge": "WK1" }
    ],
    "units": [
      {
        "unitNumber": 1,
        "title": "Introduction to Value Education & Self-Exploration",
        "hours": 8,
        "description": "Need for value education, basic guidelines, content and process of value education, self-exploration as the mechanism, natural acceptance vs experiential validation.",
        "topics": [
          "Understanding the Need, Basic Guidelines, and Process for Value Education",
          "Basic Human Aspirations: Continuous Happiness (Sukha) and Prosperity (Suvidha)",
          "The Method to Fulfill Basic Human Aspirations: Right Understanding, Relationship, and Physical Facilities",
          "Self-Exploration: Definition, Process, Proposal vs Acceptance, Natural Acceptance",
          "Experiential Validation: Living in accordance with natural acceptance"
        ],
        "keyConcepts": ["Sukha & Suvidha", "Natural Acceptance", "Right Understanding", "Experiential Validation"],
        "noteId": "note-uhv-harmony"
      },
      {
        "unitNumber": 2,
        "title": "Harmony in the Human Being",
        "hours": 8,
        "description": "Understanding human being as co-existence of Self ('I') and Body ('Sanyama' and 'Swasthya'), needs of Self vs needs of Body, mental activities and desires.",
        "topics": [
          "Human Being as Co-existence of Self ('I') and Body",
          "Distinguishing Needs of Self ('I') (Continuous, Qualitative) and Body (Temporary, Quantitative)",
          "Activities in Self: Desire, Thought, Expectation, Imaging, Analyzing, Selecting",
          "Sanyama (Self-Regulation) and Swasthya (Health): Harmony between Self and Body",
          "Program to Ensure Sanyama and Swasthya in Daily Routine"
        ],
        "keyConcepts": ["Self ('I') vs Body", "Qualitative vs Quantitative Needs", "Sanyama (Self-Regulation)", "Swasthya (Health)"],
        "noteId": "note-uhv-harmony"
      },
      {
        "unitNumber": 3,
        "title": "Harmony in the Family and Society",
        "hours": 8,
        "description": "Values in relationships, trust (Vishwas) and respect (Samman) as foundational values, 9 universal feelings, differentiation vs respect, undivided society (Akhanda Samaja).",
        "topics": [
          "Harmony in Family: Relationship is between Self and Self",
          "Foundational Value: Trust (Vishwas) - Exploring Intention vs Competence",
          "Respect (Samman): Complete acceptance, Overcoming Differentiation based on body, physical facilities, or beliefs",
          "Nine Universal Human Values in Relationships: Trust, Respect, Affection, Care, Guidance, Reverence, Glory, Gratitude, Love",
          "Universal Human Order: From family order to world family order (Sarvabhaum Vyavastha)"
        ],
        "keyConcepts": ["Trust (Intention vs Competence)", "Respect vs Differentiation", "Akhanda Samaja", "Universal Human Order"],
        "noteId": "note-uhv-harmony"
      },
      {
        "unitNumber": 4,
        "title": "Harmony in Nature and Holistic Professional Ethics",
        "hours": 6,
        "description": "Interconnectedness and mutual fulfillment in nature, 4 orders of nature, cyclical processes, coexistence in existence, holistic engineering ethics.",
        "topics": [
          "Understanding Harmony in Nature: The Four Orders (Material, Plant/Bio, Animal, Human order)",
          "Interconnectedness and Mutual Fulfillment among the four orders",
          "Recyclability and Self-Regulation in Nature",
          "Co-existence (Sah-Astitva) of Units in Space",
          "Holistic Technologies, Production Systems, and Management Models",
          "Professional Ethics: Competence in professional ethics, Deficiencies in current systems, Case studies"
        ],
        "keyConcepts": ["Four Orders of Nature", "Mutual Fulfillment", "Co-existence (Sah-Astitva)", "Holistic Ethics"],
        "noteId": "note-uhv-harmony"
      }
    ],
    "textbooks": [
      {
        "author": "R. R. Gaur, R. Asthana, G. P. Bagaria",
        "title": "A Foundation Course in Human Values and Professional Ethics",
        "edition": "2nd Edition",
        "publisher": "Excel Books",
        "year": "2019"
      }
    ],
    "referenceBooks": [
      {
        "author": "A. N. Tripathy",
        "title": "Human Values",
        "edition": "1st Edition",
        "publisher": "New Age International Publishers",
        "year": "2003"
      }
    ],
    "folderName": "24HU311-UHV",
    "hasLab": False,
    "colorScheme": {
      "accent": "#0d9488",
      "bgSubtle": "rgba(13, 148, 136, 0.08)",
      "border": "rgba(13, 148, 136, 0.25)"
    }
  }
]

code = '''import { Course } from '../types';

export const COURSES: Course[] = ''' + json.dumps(courses, indent=2) + ''';

export function getCourseByCode(code: string): Course | undefined {
  return COURSES.find(c => c.code.toLowerCase() === code.toLowerCase() || c.id.toLowerCase() === code.toLowerCase());
}

export function getCoursesBySemester(semId: number): Course[] {
  return COURSES.filter(c => c.semester === semId);
}
'''

with open('src/data/coursesData.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("coursesData.ts generated successfully with all 8 subjects.")
