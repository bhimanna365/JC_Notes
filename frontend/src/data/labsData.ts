import { LabProgram } from '../types';

export const LAB_PROGRAMS: LabProgram[] = [
  {
    "id": "ds-lab-1a",
    "number": "Experiment 1a",
    "title": "Triple Pointer Chain (P1 -> P2 -> P3 -> X)",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Create 3 pointers called P1, P2, P3 and an integer variable X where P1 points to P2, P2 points to P3 and P3 points to X. Demonstrate how to read and retrieve the value of X using P1, P2 and P3.",
    "concept": "Demonstrates multi-level pointer indirection. An integer variable X has a memory address. Pointer P3 holds the address of X (&X). Pointer P2 holds the address of P3 (&P3). Pointer P1 holds the address of P2 (&P1). Dereferencing ***P1 resolves three memory hops to access the base integer.",
    "algorithm": [
      "Declare an integer variable X with an initial value or read from user.",
      "Declare single pointer int *P3, double pointer int **P2, and triple pointer int ***P1.",
      "Assign address of X to P3: P3 = &X.",
      "Assign address of P3 to P2: P2 = &P3.",
      "Assign address of P2 to P1: P1 = &P2.",
      "Retrieve value using ***P1 by cascading dereferences: *P1 yields P2, **P1 yields P3, ***P1 yields X.",
      "Print original value X and retrieved value ***P1 to confirm equality."
    ],
    "code": "#include <stdio.h>\n\nint main() {\n    int X;\n    // P3 points to an integer (X)\n    int *P3;\n    // P2 points to a pointer to an integer (P3)\n    int **P2;\n    // P1 points to a pointer to a pointer to an integer (P2)\n    int ***P1;\n\n    printf(\"Enter value for X: \");\n    if (scanf(\"%d\", &X) != 1) return 1;\n\n    // Establish the pointer chain\n    P3 = &X;   // P3 points to the address of X\n    P2 = &P3;  // P2 points to the address of P3\n    P1 = &P2;  // P1 points to the address of P2\n\n    // Retrieve the value of X using the pointer chain\n    int retrieved_X = ***P1;\n\n    printf(\"\\n--- Pointer Indirection Chain Results ---\\n\");\n    printf(\"Value of X: %d\\n\", X);\n    printf(\"Address of X (&X): %p\\n\", (void*)&X);\n    printf(\"Value stored in P3 (address of X): %p\\n\", (void*)P3);\n    printf(\"Value stored in P2 (address of P3): %p\\n\", (void*)P2);\n    printf(\"Value stored in P1 (address of P2): %p\\n\", (void*)P1);\n    printf(\"Value retrieved using ***P1: %d\\n\", retrieved_X);\n\n    return 0;\n}",
    "sampleInput": "Enter value for X: 42",
    "sampleOutput": "--- Pointer Indirection Chain Results ---\nValue of X: 42\nAddress of X (&X): 0x7ffd9b8a1c3c\nValue stored in P3 (address of X): 0x7ffd9b8a1c3c\nValue stored in P2 (address of P3): 0x7ffd9b8a1c40\nValue stored in P1 (address of P2): 0x7ffd9b8a1c48\nValue retrieved using ***P1: 42",
    "complexity": {
      "time": "O(1) constant time dereferencing",
      "space": "O(1) auxiliary pointer variables"
    },
    "keyPoints": [
      "Pointers to pointers allow dynamic data structures (e.g. dynamic 2D matrices, pointer arrays).",
      "Always match the indirection level: int *** takes address of int **, not int *.",
      "Dereferencing NULL or uninitialized pointers causes Segmentation Fault (SIGSEGV)."
    ],
    "sourceFileName": "24CS36L-DS-Lab/Pgm 1.pdf"
  },
  {
    "id": "ds-lab-1b",
    "number": "Experiment 1b",
    "title": "Array Traversal & In-Place Reversal via Pointers",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Create a pointer to an integer array, read and display the contents using pointer, and also display the contents in reverse order using pointer.",
    "concept": "Arrays in C are stored in contiguous memory locations. An array name evaluates to the base address of the first element (&arr[0]). Pointer arithmetic (ptr + i) increments the memory address by i * sizeof(element), allowing forward and backward traversals without array indexing syntax.",
    "algorithm": [
      "Declare an integer array of size N and an integer pointer ptr.",
      "Assign base address of array to pointer: ptr = arr.",
      "Read N integers using pointer notation: *(ptr + i).",
      "Display array elements in forward order from i = 0 to N - 1.",
      "Display array elements in reverse order from i = N - 1 down to 0 using *(ptr + i)."
    ],
    "code": "#include <stdio.h>\n#define MAX 10\n\nint main() {\n    int arr[MAX];\n    int *ptr;\n    int n, i;\n\n    printf(\"Enter number of elements (max %d): \", MAX);\n    if (scanf(\"%d\", &n) != 1 || n <= 0 || n > MAX) return 1;\n\n    ptr = arr; // Base address assignment\n\n    printf(\"Enter %d integers:\\n\", n);\n    for (i = 0; i < n; i++) {\n        scanf(\"%d\", (ptr + i));\n    }\n\n    printf(\"\\nArray elements in forward order:\\n\");\n    for (i = 0; i < n; i++) {\n        printf(\"%d (at %p)  \", *(ptr + i), (void*)(ptr + i));\n    }\n\n    printf(\"\\n\\nArray elements in reverse order:\\n\");\n    for (i = n - 1; i >= 0; i--) {\n        printf(\"%d  \", *(ptr + i));\n    }\n    printf(\"\\n\");\n\n    return 0;\n}",
    "sampleInput": "Enter number of elements (max 10): 5\nEnter 5 integers: 10 20 30 40 50",
    "sampleOutput": "Array elements in forward order:\n10 (at 0x7ffd10)  20 (at 0x7ffd14)  30 (at 0x7ffd18)  40 (at 0x7ffd1c)  50 (at 0x7ffd20)\n\nArray elements in reverse order:\n50  40  30  20  10",
    "complexity": {
      "time": "O(N) linear scan",
      "space": "O(1) auxiliary pointer"
    },
    "keyPoints": [
      "Pointer addition (ptr + 1) jumps by sizeof(int) (usually 4 bytes on 32/64-bit systems).",
      "*(ptr + i) is mathematically identical to ptr[i] and arr[i].",
      "Out of bound pointer access results in undefined behavior."
    ],
    "sourceFileName": "24CS36L-DS-Lab/Pgm 1.pdf"
  },
  {
    "id": "ds-lab-2",
    "number": "Experiment 2",
    "title": "Dynamic Student Structure with Best-of-Two Averaging",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Define a structure called Student with the members: Name, Reg_no, marks in 3 tests and average_marks. Develop a menu driven program to perform the following by writing separate function for each operation: a) read information of N students b) display student's information c) calculate the average of best two test marks of each student. Note: Allocate memory dynamically and illustrate the use of pointer to an array of structure.",
    "concept": "Demonstrates heap allocation for user-defined records. malloc(n * sizeof(struct Student)) reserves a contiguous chunk of memory on the heap. Arrow operator (->) or (*(p + i)).member accesses attributes of dynamically allocated structures.",
    "algorithm": [
      "Define struct Student with Name, Reg_no, float marks[3], and average_marks.",
      "In main, prompt for N students and allocate heap block: p = (struct Student *)malloc(n * sizeof(struct Student)).",
      "readStudents(p, n): Iterate over students and populate fields using (p + i)->member.",
      "calculateAverage(p, n): For each student, find sum of highest two marks: sum = (m1 + m2 + m3) - min(m1, m2, m3), then set average_marks = sum / 2.",
      "displayStudents(p, n): Format and print student table with registration number, name, test scores, and computed average.",
      "Free dynamically allocated memory before program exit: free(p)."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint n = 0;\n\ntypedef struct student\n{\n    char name[100];\n    int reg_no;\n    int m1, m2, m3;\n    int avg;\n} s;\n\nvoid read(s *std)\n{\n    printf(\"Enter the name of the student : \");\n    scanf(\"%s\", &std[n].name);\n    printf(\"Enter the register number of the student : \");\n    scanf(\"%d\", &std[n].reg_no);\n    printf(\"Enter the marks obatained in three subjects : \");\n    scanf(\"%d %d %d\", &std[n].m1, &std[n].m2, &std[n].m3);\n    std[n].avg = 0;\n    n++;\n}\n\nvoid display(s *std)\n{\n    printf(\"Name\\tRegister Number\\tM1\\tM2\\tM3\\tAverage\\n\");\n    for (int i = 0; i < n; i++)\n    {\n        printf(\"%s\\t%d\\t\\t%d\\t%d\\t%d\\t%d\\n\", std[i].name, std[i].reg_no, std[i].m1, std[i].m2, std[i].m3, std[i].avg);\n    }\n}\n\ns calcAvg(s *std)\n{\n    int min;\n    for (int i = 0; i < n; i++)\n    {\n        if (std[i].m1 < std[i].m2)\n        {\n            if (std[i].m1 < std[i].m3)\n                min = std[i].m1;\n            else\n                min = std[i].m3;\n        }\n        else if (std[i].m2 < std[i].m1)\n        {\n            if (std[i].m2 < std[i].m3)\n                min = std[i].m2;\n            else\n                min = std[i].m3;\n        }\n        else\n        {\n            if (std[i].m3 < std[i].m1)\n            {\n                min = std[i].m3;\n            }\n            else\n                min = std[i].m1;\n        }\n        int total = std[i].m1 + std[i].m2 + std[i].m3;\n        std[i].avg = (total - min) / 2.0;\n    }\n}\n\nint main()\n{\n    int ch;\n    s *stdz = NULL;\n    while (1)\n    {\n        printf(\"1.Read\\t2.Display\\t3.Calculate Average\\n\");\n        printf(\"Enter your choice\\n\");\n        scanf(\"%d\", &ch);\n        switch (ch)\n        {\n        case 1:\n            stdz = (s *)realloc(stdz, (n + 1) * sizeof(s));\n            read(stdz);\n            break;\n\n        case 2:\n            display(stdz);\n            break;\n\n        case 3:\n            calcAvg(stdz);\n            break;\n        }\n    }\n}",
    "sampleInput": "Enter number of students: 2\nMenu Choice: 1 (Read Students)\nStudent 1 Name: Rahul, Reg_no: 101, Marks: 18.5 19.0 16.0\nStudent 2 Name: Ananya, Reg_no: 102, Marks: 14.0 19.5 20.0\nMenu Choice: 2 (Calculate Average)\nMenu Choice: 3 (Display Information)",
    "sampleOutput": "----------- STUDENT INFORMATION -----------\nStudent 1\nName : Rahul\nRegister No.   : 101\nTest 1 Marks   : 18.50\nTest 2 Marks   : 19.00\nTest 3 Marks   : 16.00\nAverage (Best 2): 18.75\n\nStudent 2\nName : Ananya\nRegister No.   : 102\nTest 1 Marks   : 14.00\nTest 2 Marks   : 19.50\nTest 3 Marks   : 20.00\nAverage (Best 2): 19.75",
    "complexity": {
      "time": "O(N) for read, calculate, and display",
      "space": "O(N) dynamically allocated heap memory"
    },
    "keyPoints": [
      "Best two out of three calculation: sum = (m1 + m2 + m3) - min(m1, min(m2, m3)).",
      "Pointers to structures use the arrow operator (->) for member access.",
      "Dynamic allocation allows sizing at runtime rather than compile-time static bounds."
    ],
    "sourceFileName": "24CS330-DS/Codes/StudentStructure.c"
  },
  {
    "id": "ds-lab-3",
    "number": "Experiment 3",
    "title": "Time Structure Normalization & Arithmetic",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Define a structure called Time containing 3 integer members (hour, minute, second). Develop a menu driven program to perform: a) Read(T) b) Display(T) c) Update(T) d) Add(T1, T2). Update increments time by 1 second and normalizes (seconds >= 60 roll into minutes, minutes >= 60 roll into hours, hours >= 24 reset to 0). While adding two time variables, normalize resultant time value.",
    "concept": "Models modular arithmetic with mixed-radix bases (seconds/minutes base 60, hours base 24). Passing pointers to structure (Time *t) allows direct in-place mutation without copying whole structs.",
    "algorithm": [
      "Define struct Time with hour, minute, second.",
      "normalizeTime(Time *t): Add floor(second / 60) to minute, set second %= 60. Add floor(minute / 60) to hour, set minute %= 60. Reset hour %= 24.",
      "updateTime(Time *t): Increment second by 1, then invoke normalizeTime(t).",
      "addTime(Time t1, Time t2): Resultant hour = t1.hour + t2.hour, minute = t1.minute + t2.minute, second = t1.second + t2.second. Then normalize result.",
      "Display formatted time as HH:MM:SS with leading zero padding."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Time {\n    int hour;\n    int minute;\n    int second;\n} Time;\n\n// Normalize time (handles second and minute rollovers and 24-hr clock reset)\nvoid normalizeTime(Time *t) {\n    t->minute += t->second / 60;\n    t->second %= 60;\n    t->hour += t->minute / 60;\n    t->minute %= 60;\n    t->hour %= 24;\n}\n\nvoid readTime(Time *t) {\n    printf(\"Enter hour (0-23): \");\n    scanf(\"%d\", &t->hour);\n    printf(\"Enter minute (0-59): \");\n    scanf(\"%d\", &t->minute);\n    printf(\"Enter second (0-59): \");\n    scanf(\"%d\", &t->second);\n    normalizeTime(t);\n}\n\nvoid displayTime(Time t) {\n    printf(\"%02d:%02d:%02d\\n\", t.hour, t.minute, t.second);\n}\n\nvoid updateTime(Time *t) {\n    t->second += 1;\n    normalizeTime(t);\n}\n\nTime addTime(Time t1, Time t2) {\n    Time res;\n    res.hour = t1.hour + t2.hour;\n    res.minute = t1.minute + t2.minute;\n    res.second = t1.second + t2.second;\n    normalizeTime(&res);\n    return res;\n}\n\nint main() {\n    Time T1 = {0, 0, 0}, T2 = {0, 0, 0}, T3;\n    int choice;\n\n    do {\n        printf(\"\\n========== TIME MANAGEMENT MENU ==========\\n\");\n        printf(\"1. Read Time T1\\n\");\n        printf(\"2. Display Time T1\\n\");\n        printf(\"3. Update Time T1 (Increment by 1 sec)\\n\");\n        printf(\"4. Add Two Times (T1 + T2)\\n\");\n        printf(\"5. Exit\\n\");\n        printf(\"===========================================\\n\");\n        printf(\"Enter your choice: \");\n        if (scanf(\"%d\", &choice) != 1) break;\n\n        switch (choice) {\n            case 1:\n                readTime(&T1);\n                break;\n            case 2:\n                printf(\"Current Time T1: \");\n                displayTime(T1);\n                break;\n            case 3:\n                updateTime(&T1);\n                printf(\"Updated Time T1 (+1s): \");\n                displayTime(T1);\n                break;\n            case 4:\n                printf(\"Enter second time (T2):\\n\");\n                readTime(&T2);\n                T3 = addTime(T1, T2);\n                printf(\"Resultant Added Time (T1 + T2): \");\n                displayTime(T3);\n                break;\n            case 5:\n                printf(\"Exiting...\\n\");\n                break;\n            default:\n                printf(\"Invalid choice!\\n\");\n        }\n    } while (choice != 5);\n\n    return 0;\n}",
    "sampleInput": "Choice: 1 (Read T1: 11 hrs, 59 mins, 59 secs)\nChoice: 3 (Update T1)\nChoice: 4 (Add T2: 02 hrs, 15 mins, 20 secs)",
    "sampleOutput": "Current Time T1: 11:59:59\nUpdated Time T1 (+1s): 12:00:00\nResultant Added Time (T1 + T2): 14:15:20",
    "complexity": {
      "time": "O(1) constant arithmetic operations",
      "space": "O(1) scalar structure memory"
    },
    "keyPoints": [
      "Carry generation handles cascading overflows (e.g., 59s -> 00s with +1 minute, 59m -> 00m with +1 hour).",
      "Format specifier %02d prints numbers with leading zero if less than 10 (e.g. 09 instead of 9).",
      "Passing by pointer enables direct state alteration."
    ],
    "sourceFileName": "24CS36L-DS-Lab/Program 3.pdf"
  },
  {
    "id": "ds-lab-4",
    "number": "Experiment 4",
    "title": "Comprehensive Array Operations with Dynamic Allocation",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to implement the following operations on an array of integers with dynamic memory allocation: i) Insert by position ii) Delete by position iii) Insert by key iv) Delete by key v) Insert by order vi) Search by key vii) Search by position viii) Reverse the contents. Display the array contents after each operation.",
    "concept": "Demonstrates contiguous array shifts. Insertion requires right-shifting elements from the target index to the end. Deletion requires left-shifting elements towards the beginning to maintain continuity. Reversal swaps symmetric elements from both ends toward the middle in O(N/2).",
    "algorithm": [
      "Allocate dynamic array using calloc(capacity, sizeof(int)).",
      "Insert by Position: Validate 0 <= pos <= n. Right shift elements from index n-1 down to pos. Assign arr[pos] = value; increment n.",
      "Delete by Position: Validate 0 <= pos < n. Left shift elements from pos up to n-2. Decrement n.",
      "Insert by Key: Search for key index. If found, right shift subsequent elements and insert after key.",
      "Delete by Key: Search for key. If found, call delete by position on that index.",
      "Insert by Order: Scan sorted array until arr[i] > value. Shift remaining elements right and insert at index i.",
      "Search: Linear search returns matching index or -1 if not found.",
      "Reverse: Use two pointers / indices (left = 0, right = n-1) and swap arr[left] with arr[right] until left >= right."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\nvoid read(int *arr, int n)\n{\n    int i;\n    for (i = 0; i < n; i++)\n    {\n        scanf(\"%d\", (arr + i));\n    }\n}\nvoid display(int *arr, int n)\n{\n    int i;\n    for (i = 0; i < n; i++)\n    {\n        printf(\" %d \", *(arr + i));\n    }\n}\nvoid search(int *arr, int n, int key)\n{\n    int i, flag = 0;\n    for (i = 0; i < n; i++)\n    {\n        if (key == *(arr + i))\n        {\n            printf(\" %d found at %d \", key, i + 1);\n            flag = 1;\n        }\n    }\n    if (flag == 0)\n    {\n        printf(\" element not found \");\n    }\n}\nvoid insert_ele(int *arr, int *n, int value, int pos)\n{\n\n    int i;\n    if (pos >= 0 && pos <= *n - 1)\n    {\n        arr = (int *)realloc(arr, (*(n) + 1) * sizeof(int));\n        for (i = *n - 1; i >= pos; i--)\n        {\n            *(arr + i + 1) = *(arr + i);\n        }\n\n        *(arr + pos) = value;\n        (*n)++;\n        display(arr, *n);\n    }\n    else\n        printf(\"Inavlid Position\\n\");\n}\nvoid delete (int *arr, int *n, int pos)\n{\n    int i;\n    if (pos >= 0 && pos <= *n - 1)\n    {\n        for (i = pos; i <= *n - 1; i++)\n        {\n            *(arr + i) = *(arr + i + 1);\n        }\n        arr = (int *)realloc(arr, (*(n) + 1) * sizeof(int));\n        (*n)--;\n        display(arr, *n);\n    }\n    else\n    {\n        printf(\"Inavlid Position\\n\");\n    }\n}\nvoid delete_vl(int *arr, int *n, int value)\n{\n    int i, flag = 0;\n    for (i = 0; i < *n; i++)\n    {\n        if (*(arr + i) == value)\n        {\n            flag = 1;\n            for (int j = i; j <= *n - 1; j++)\n            {\n                *(arr + j) = *(arr + j + 1);\n            }\n            arr = (int *)realloc(arr, (*(n)-1) * sizeof(int));\n            (*n)--;\n            display(arr, *n);\n            return;\n        }\n    }\n    if (flag == 0)\n    {\n        printf(\"value not found\");\n    }\n}\n\nvoid main()\n{\n    int size, ch, key, pos, value, *arr;\n    while (1)\n    {\n        printf(\" \\n1.Read \\n2.Display\\n3.Search\\n4.Insert\\n5.Delete\\n6.DeleteByVal\\n7.Exit\\n\");\n        printf(\"Enter your choice\\n\");\n        scanf(\"%d\", &ch);\n        switch (ch)\n        {\n        case 1:\n            printf(\"enter the size of the array\\n\");\n            scanf(\"%d\", &size);\n            printf(\"enter the elements\\n\");\n            arr = (int *)calloc(size, sizeof(int));\n            if (arr == NULL)\n            {\n                printf(\"memory error\");\n            }\n            read(arr, size);\n            break;\n        case 2:\n            printf(\"the elements are \\n\");\n            display(arr, size);\n            break;\n        case 3:\n            printf(\"enter the key to searched\\n \");\n            scanf(\"%d\", &key);\n            search(arr, size, key);\n            break;\n        case 4:\n            printf(\"enter the postion and value of the new key\\n\");\n            scanf(\"%d %d\", &pos, &value);\n            insert_ele(arr, &size, value, pos);\n            break;\n        case 5:\n            printf(\"enter the postion to be deleted\\n\");\n            scanf(\"%d\", &pos);\n            delete (arr, &size, pos);\n            break;\n        case 6:\n            printf(\"enter the value to be deleted\\n\");\n            scanf(\"%d\", &value);\n            delete_vl(arr, &size, value);\n            break;\n        case 7:\n            exit(0);\n            break;\n        default:\n            printf(\"entered value is wrong\");\n            break;\n        }\n    }\n}",
    "sampleInput": "Enter size: 5, Elements: 10 20 30 40 50\nMenu: Insert 25 at position 2\nMenu: Delete element at position 4\nMenu: Reverse array",
    "sampleOutput": "After Insert by Position 2:\n10  20  25  30  40  50\n\nAfter Delete by Position 4:\n10  20  25  30  50\n\nAfter Reverse:\n50  30  25  20  10",
    "complexity": {
      "time": "Insert/Delete: O(N) due to element shifting; Search: O(N); Reverse: O(N)",
      "space": "O(N) contiguous heap memory"
    },
    "keyPoints": [
      "Array insertion in the middle has worst-case time complexity of O(N) due to memory shifting.",
      "Array deletion leaves no holes in contiguous array storage.",
      "Static arrays have fixed capacities, while dynamic arrays can be resized using realloc()."
    ],
    "sourceFileName": "24CS330-DS/Codes/ArrayDMA.c"
  },
  {
    "id": "ds-lab-5",
    "number": "Experiment 5",
    "title": "Singly Linked List (SLL) Core Operations",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Implement single linked list to perform the following operations: i) Insert front ii) Insert rear iii) Insert at position iv) Delete front v) Delete rear vi) Delete a node with given key vii) Search for an item by position. Display the list contents after each operation.",
    "concept": "Singly linked lists store nodes composed of a data payload and a pointer to the next node. Unlike arrays, elements do not require contiguous memory, eliminating reallocation and shift overheads during insertions at the head.",
    "algorithm": [
      "Define struct Node with int data and struct Node *next.",
      "createNode(val): Allocate sizeof(struct Node) on heap, set data = val and next = NULL.",
      "Insert Front: newNode->next = head; head = newNode. (O(1))",
      "Insert Rear: Traverse until temp->next == NULL; set temp->next = newNode. (O(N))",
      "Insert at Position: Traverse to pos - 1; splice newNode between temp and temp->next.",
      "Delete Front: temp = head; head = head->next; free(temp). (O(1))",
      "Delete Rear: Traverse to second-to-last node; free last node; set temp->next = NULL. (O(N))",
      "Delete Key: Search for key; adjust previous pointer to bypass target node; free target node."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint size = 0;\n\ntypedef struct node\n{\n    int data;\n    struct node *next;\n} node;\n\nnode *display(node *head)\n{\n    node *temp = head;\n\n    if (size == 0)\n    {\n        printf(\"Linked list empty\\n\");\n        return head;\n    }\n\n    printf(\"Linked list is--> \");\n    while (temp != NULL)\n    {\n        printf(\"%d->\", temp->data);\n        temp = temp->next;\n    }\n    return head;\n}\n\nnode *insertAtPos(node *head, int pos, int data)\n{\n    node *newnode = (node *)malloc(sizeof(node));\n    newnode->data = data;\n    newnode->next = NULL;\n    if (pos <= 0 || pos > size + 1)\n    {\n        printf(\"Inavlid Position\\n\");\n        return head;\n    }\n    if (size == 0)\n    {\n        head = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head;\n        newnode->next = head;\n        head = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    if (pos == size + 1)\n    {\n        node *temp = head;\n        while (temp->next != NULL)\n        {\n            temp = temp->next;\n        }\n        temp->next = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    else\n    {\n        node *temp = head;\n        int i = 1;\n        while (i < pos - 1)\n        {\n            temp = temp->next;\n            i++;\n        }\n        newnode->next = temp->next;\n        temp->next = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n}\n\nnode *deleteAtPosition(node *head, int pos)\n{\n    if (size == 0)\n    {\n        printf(\"List is empty\\n\");\n        return;\n    }\n\n    if (pos <= 0 || pos > size)\n    {\n        printf(\"Inavlid Position\\n\");\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head;\n        head = head->next;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n\n    if (pos == size)\n    {\n        node *temp = head;\n        node *p = NULL;\n        while (temp->next != NULL)\n        {\n            p = temp;\n            temp = temp->next;\n        }\n        p->next = NULL;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n\n    else\n    {\n        int i = 1;\n        node *temp = head;\n        node *prev;\n        while (i < pos)\n        {\n            prev = temp;\n            temp = temp->next;\n            i++;\n        }\n\n        prev->next = temp->next;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n}\n\nnode *reverse(node *head)\n{\n    node *temp = head;\n    node *curr = NULL;\n    node *prev = NULL;\n\n    while (temp != NULL)\n    {\n        curr = temp->next;\n        temp->next = prev;\n        prev = temp;\n        temp = curr;\n    }\n\n    head = prev;\n    display(head);\n    return head;\n}\n\nnode *searchByKey(node *head, int key)\n{\n    node *temp = head;\n    int i = 1;\n    while (temp != NULL)\n    {\n        if (temp->data == key)\n        {\n            printf(\"Key %d found in %d position\\n\", key, i);\n            return head;\n        }\n        temp = temp->next;\n        i++;\n    }\n\n    if (temp == NULL)\n    {\n        printf(\"Key not found in the list\\n\");\n        return head;\n    }\n}\n\nint main()\n{\n    node *head = NULL;\n    int ch, data, pos, key;\n    while (1)\n    {\n        printf(\"\\n1.InsertAtPos\\n2.DeleteAtPos\\n3.Display\\n4.Reverse\\n5.SearchByKey\\n\");\n        printf(\"Enter your choice\\n\");\n        scanf(\"%d\", &ch);\n\n        switch (ch)\n        {\n        case 1:\n            printf(\"Enter position\\n\");\n            scanf(\"%d\", &pos);\n            printf(\"Enter data\\n\");\n            scanf(\"%d\", &data);\n            head = insertAtPos(head, pos, data);\n            break;\n\n        case 2:\n            printf(\"Enter position\\n\");\n            scanf(\"%d\", &pos);\n            head = deleteAtPosition(head, pos);\n            break;\n\n        case 3:\n            head = display(head);\n            break;\n\n        case 4:\n            head = reverse(head);\n            break;\n\n        case 5:\n            printf(\"Enter the key to be searched\\n\");\n            scanf(\"%d\", &key);\n            searchByKey(head, key);\n            break;\n        }\n    }\n}",
    "sampleInput": "Operations:\n1. Insert Front: 30\n2. Insert Front: 20\n3. Insert Front: 10\n4. Insert Rear: 40\n5. Delete Front\n6. Display",
    "sampleOutput": "List elements: 10 -> 20 -> 30 -> 40 -> NULL\nDeleted element from front: 10\nList elements: 20 -> 30 -> 40 -> NULL",
    "complexity": {
      "time": "Insert/Delete Front: O(1); Insert/Delete Rear: O(N); Search: O(N)",
      "space": "O(N) node heap memory with extra pointer per element"
    },
    "keyPoints": [
      "Head pointer is the sole handle to the entire list; losing it creates a memory leak.",
      "Special edge cases: empty list (head == NULL) and single-node list (head->next == NULL).",
      "Always free deleted nodes to prevent heap memory exhaustion."
    ],
    "sourceFileName": "24CS330-DS/Codes/SinglyLinkedList.c"
  },
  {
    "id": "ds-lab-6",
    "number": "Experiment 6",
    "title": "Circular Double Linked List with Header Node",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Implement circular double linked list with header node to perform the following operations: i) Insert by order ii) Insert front iii) Delete by position iv) Delete by key v) Search by position vi) Search by key. Display the list contents after each operation.",
    "concept": "A circular doubly linked list connects the last node's next pointer back to the header node, and the header's prev pointer to the last node. The dummy header node eliminates special-case checks for empty lists and head deletions.",
    "algorithm": [
      "Header node initialization: head->next = head; head->prev = head.",
      "Insert Front: Splicing newNode between head and head->next: newNode->next = head->next; newNode->prev = head; head->next->prev = newNode; head->next = newNode.",
      "Insert Rear: Splicing newNode between head->prev (last node) and head.",
      "Insert by Order: Traverse list until temp->next == head or temp->next->data > val. Splice newNode after temp.",
      "Delete: Update temp->prev->next = temp->next and temp->next->prev = temp->prev, then free(temp).",
      "Traversal: Start at head->next and proceed until current == head."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct node\n{\n    int data;\n    struct node *prev;\n    struct node *next;\n} node;\n\nnode *create(int data)\n{\n    node *newnode = (node *)malloc(sizeof(node));\n    newnode->data = data;\n    newnode->next = newnode->prev = newnode;\n    return newnode;\n}\n\nvoid display(node *head)\n{\n    if (head->data == 0)\n    {\n        printf(\"List Empty\\n\");\n        return;\n    }\n    node *temp = head->next;\n    while (temp != head)\n    {\n        printf(\"%d->\", temp->data);\n        temp = temp->next;\n    }\n}\n\nnode *insertAt(node *head, int data, int pos)\n{\n    node *newnode = (node *)malloc(sizeof(node));\n    newnode->next = NULL;\n    newnode->prev = NULL;\n    newnode->data = data;\n\n    if (head->data == 0)\n    {\n        head->next = newnode;\n        newnode->prev = head;\n        head->data++;\n        newnode->next = head;\n        display(head);\n        return head;\n    }\n\n    if (pos <= 0 || pos > (head->data) + 1)\n    {\n        printf(\"Inavlid Position\\n\");\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head->next;\n        newnode->next = head->next;\n        head->next = newnode;\n        newnode->prev = head;\n        head->data++;\n        display(head);\n        return head;\n    }\n\n    if (pos == (head->data) + 1)\n    {\n        node *temp = head;\n        while (temp->next != head)\n        {\n            temp = temp->next;\n        }\n\n        temp->next = newnode;\n        newnode->prev = temp;\n        newnode->next = head;\n        head->data++;\n        display(head);\n        return head;\n    }\n\n    else\n    {\n        int i = 1;\n        node *temp = head->next;\n        while (i < pos - 1)\n        {\n            temp = temp->next;\n            i++;\n        }\n        newnode->next = temp->next;\n        temp->next->prev = newnode;\n        newnode->prev = temp;\n        temp->next = newnode;\n        head->data++;\n        display(head);\n        return head;\n    }\n}\n\nnode *removeAt(node *head, int pos)\n{\n    if (pos <= 0 || pos >= (head->data) + 1)\n    {\n        printf(\"Inavlid Position\\n\");\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *p = head->next;\n        head->next = p->next;\n        p->next->prev = head;\n        free(p);\n        head->data--;\n        display(head);\n        return head;\n    }\n\n    if (pos == (head->data))\n    {\n        node *temp = head->next;\n        node *p = NULL;\n        while (temp->next != head)\n        {\n            p = temp;\n            temp = temp->next;\n        }\n        p->next = temp->next;\n        free(temp);\n        head->data--;\n        display(head);\n        return head;\n    }\n\n    else\n    {\n        int i = 1;\n        node *temp = head->next;\n        while (i < pos)\n        {\n            temp = temp->next;\n            i++;\n        }\n        temp->prev->next = temp->next;\n        temp->next->prev = temp->prev;\n        free(temp);\n        head->data--;\n        display(head);\n        return head;\n    }\n}\n\nnode *reverse(node *head)\n{\n\n    if (head->data == 0)\n    {\n        printf(\"List is empty\\n\");\n        return head;\n    }\n\n    node *temp = head->next;\n    node *p = head;\n    node *curr = NULL;\n\n    while (temp != head)\n    {\n        curr = temp->next;\n        temp->next = p;\n        temp->prev = curr;\n        p = temp;\n        temp = curr;\n    }\n    head->next = p;\n    display(head);\n    return head;\n}\n\nint main()\n{\n\n    int ch, data, pos = 0, val;\n    node *head = create(0);\n    while (1)\n    {\n        printf(\"\\n1.InsertAt\\n2.DeleteAt\\n3.Reverse\\n4.SearchByKey\\n\");\n        printf(\"Enter your choice\\n\");\n        scanf(\"%d\", &ch);\n        switch (ch)\n        {\n        case 1:\n            printf(\"Enter the data\\n\");\n            scanf(\"%d\", &data);\n            printf(\"Enter Position\\n\");\n            scanf(\"%d\", &pos);\n            head = insertAt(head, data, pos);\n            break;\n\n        case 2:\n            printf(\"Enter Position\\n\");\n            scanf(\"%d\", &pos);\n            head = removeAt(head, pos);\n            break;\n\n        case 3:\n            head = reverse(head);\n            break;\n\n        case 4:\n            display(head);\n            break;\n\n        default:\n            break;\n        }\n    }\n}",
    "sampleInput": "Menu:\n1. Insert 20 by order\n2. Insert 10 by order\n3. Insert 30 by order\n4. Display",
    "sampleOutput": "Header <-> 10 <-> 20 <-> 30 <-> (Back to Header)\nTotal nodes: 3",
    "complexity": {
      "time": "Insert front/rear: O(1); Ordered insert/search: O(N); Deletion given pointer: O(1)",
      "space": "O(N) with 2 pointers (prev, next) per node"
    },
    "keyPoints": [
      "Header node contains no active student data; acts as a permanent anchor.",
      "Bidirectional links permit two-way traversals (forward and backward).",
      "No NULL pointers exist in a circular doubly linked list."
    ],
    "sourceFileName": "24CS330-DS/Codes/CircularDoubleLinkedListWithHeader.c"
  },
  {
    "id": "ds-lab-7",
    "number": "Experiment 7",
    "title": "Circular Singly Linked List (CSLL)",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Implement single circular linked list to perform: i) Insert Front ii) Insert Rear iii) Delete Front iv) Delete Rear v) Search by key vi) Display. Display list contents after each operation.",
    "concept": "In a circular singly linked list, the last node points back to the first node instead of NULL. Keeping a pointer to the 'last' (tail) node allows both O(1) insertion at front (last->next) and O(1) insertion at rear.",
    "algorithm": [
      "Insert Front: If list empty, last = newNode; last->next = last. Else, newNode->next = last->next; last->next = newNode.",
      "Insert Rear: newNode->next = last->next; last->next = newNode; last = newNode.",
      "Delete Front: If single node, free(last); last = NULL. Else, temp = last->next; last->next = temp->next; free(temp).",
      "Delete Rear: Traverse to node preceding last; update temp->next = last->next; free(last); last = temp.",
      "Display: Traverse from last->next until pointer loops back to last->next."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint size = 0;\n\ntypedef struct node\n{\n    int data;\n    struct node *next;\n} node;\n\nnode *display(node *head)\n{\n    if (size == 0)\n    {\n        printf(\"List empty\\n\");\n        return head;\n    }\n    node *temp = head;\n    printf(\"Linked list is\\n\");\n    do\n    {\n        printf(\"%d->\", temp->data);\n        temp = temp->next;\n    } while (temp != head);\n}\n\nnode *insertAtPos(node *head, int pos, int data)\n{\n    node *newnode = (node *)malloc(sizeof(node));\n    newnode->next = NULL;\n    newnode->data = data;\n\n    if (size == 0)\n    {\n        head = newnode;\n        newnode->next = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    if (pos <= 0 || pos > size + 1)\n    {\n        printf(\"Inavlid Position\\n\");\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head;\n        while (temp->next != head)\n        {\n            temp = temp->next;\n        }\n\n        newnode->next = head;\n        temp->next = newnode;\n        head = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    if (pos == size + 1)\n    {\n        node *temp = head;\n        while (temp->next != head)\n        {\n            temp = temp->next;\n        }\n        temp->next = newnode;\n        newnode->next = head;\n        size++;\n        display(head);\n        return head;\n    }\n\n    else\n    {\n        node *temp = head;\n        int i = 1;\n        while (i < pos - 1)\n        {\n            temp = temp->next;\n            i++;\n        }\n        newnode->next = temp->next;\n        temp->next = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n}\n\nnode *deleteAtPos(node *head, int pos)\n{\n    if (size == 0)\n    {\n        printf(\"List empty\\n\");\n        display(head);\n        return head;\n    }\n\n    if (pos <= 0 || pos >= size + 1)\n    {\n        printf(\"Invalid Position\\n\");\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head;\n        node *p = head;\n        while (temp->next != head)\n        {\n            temp = temp->next;\n        }\n        temp->next = head->next;\n        head = head->next;\n        free(p);\n        size--;\n        display(head);\n        return head;\n    }\n\n    if (pos == size)\n    {\n        node *temp = head;\n        node *p;\n        while (temp->next != head)\n        {\n            p = temp;\n            temp = temp->next;\n        }\n        p->next = temp->next;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n\n    else\n    {\n        node *temp = head;\n        node *p;\n        int i = 1;\n        while (i < pos)\n        {\n            p = temp;\n            temp = temp->next;\n            i++;\n        }\n        p->next = temp->next;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n}\n\nnode *reverse(node *head)\n{\n    node *temp = head;\n    node *curr = NULL;\n    node *p = NULL;\n\n    do\n    {\n        curr = temp->next;\n        temp->next = p;\n        p = temp;\n        temp = curr;\n    } while (temp != head);\n\n    head->next = p;\n    head = p;\n    display(head);\n    return head;\n}\n\nnode *deleteByKey(node *head, int key)\n{\n    node *temp = head;\n    int i = 1;\n    do\n    {\n        if (temp->data == key)\n        {\n            head = deleteAtPos(head, i);\n            return head;\n        }\n        temp = temp->next;\n        i++;\n    } while (temp != head);\n\n    if (temp == head)\n    {\n        printf(\"Key not found in the list\\n\");\n        return head;\n    }\n}\n\nint main()\n{\n    node *head = NULL;\n    int ch, data, pos, key;\n    while (1)\n    {\n        printf(\"\\n1.InsertAtPos\\n2.DeleteAtPos\\n3.Display\\n4.Reverse\\n5.DeleteByKey\\n\");\n        printf(\"Enter your choice\\n\");\n        scanf(\"%d\", &ch);\n\n        switch (ch)\n        {\n        case 1:\n            printf(\"Enter position\\n\");\n            scanf(\"%d\", &pos);\n            printf(\"Enter data\\n\");\n            scanf(\"%d\", &data);\n            head = insertAtPos(head, pos, data);\n            break;\n\n        case 2:\n            printf(\"Enter position\\n\");\n            scanf(\"%d\", &pos);\n            head = deleteAtPos(head, pos);\n            break;\n\n        case 3:\n            head = display(head);\n            break;\n\n        case 4:\n            head = reverse(head);\n            break;\n\n        case 5:\n            printf(\"Enter the key to be deleted\\n\");\n            scanf(\"%d\", &key);\n            deleteByKey(head, key);\n            break;\n        }\n    }\n}",
    "sampleInput": "Insert Front: 100\nInsert Rear: 200\nInsert Rear: 300\nDisplay",
    "sampleOutput": "Circular List: 100 -> 200 -> 300 -> (loops to 100)",
    "complexity": {
      "time": "Insert Front/Rear (with tail pointer): O(1); Delete Rear: O(N)",
      "space": "O(N) node storage"
    },
    "keyPoints": [
      "Useful for round-robin CPU scheduling and circular media playlists.",
      "Loop condition in while loop must be ptr != head instead of ptr != NULL to avoid infinite looping."
    ],
    "sourceFileName": "24CS330-DS/Codes/CircularLinkedList.c"
  },
  {
    "id": "ds-lab-8",
    "number": "Experiment 8",
    "title": "Doubly Linked List (DLL) Non-Circular Operations",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Implement double (non-circular) linked list to perform the following operations: i) Insert by position ii) Delete rear iii) Delete at position iv) Search for an item by value v) Display forward and backward.",
    "concept": "Every node contains two link fields: prev pointing to the predecessor node and next pointing to the successor. The first node's prev is NULL and the last node's next is NULL.",
    "algorithm": [
      "Node structure: int data; struct Node *prev, *next;",
      "Insert by Position: Traverse to pos - 1. Wire newNode->next = temp->next; newNode->prev = temp; if (temp->next) temp->next->prev = newNode; temp->next = newNode.",
      "Delete Rear: Traverse to last node where temp->next == NULL. Update temp->prev->next = NULL; free(temp).",
      "Display Backward: Traverse forward to tail, then traverse backwards using ptr->prev."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\nint size = 0;\n\ntypedef struct node\n{\n    int data;\n    struct node *prev;\n    struct node *next;\n} node;\n\nnode *display(node *head)\n{\n    node *temp = head;\n\n    if (size == 0)\n    {\n        printf(\"Linked list empty\\n\");\n        return head;\n    }\n\n    printf(\"Linked list is\\n\");\n    while (temp != NULL)\n    {\n        printf(\"%d->\", temp->data);\n        temp = temp->next;\n    }\n    return head;\n}\n\nnode *insertAtPos(node *head, int data, int pos)\n{\n    node *newnode = (node *)malloc(sizeof(node));\n    newnode->next = NULL;\n    newnode->prev = NULL;\n    newnode->data = data;\n\n    if (pos <= 0 || pos > size + 1)\n    {\n        printf(\"Invalid Position\\n\");\n        display(head);\n        return head;\n    }\n\n    if (size == 0)\n    {\n        head = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head;\n        newnode->next = temp;\n        temp->prev = newnode;\n        head = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    if (pos == size + 1)\n    {\n        node *temp = head;\n        while (temp->next != NULL)\n        {\n            temp = temp->next;\n        }\n        newnode->prev = temp;\n        temp->next = newnode;\n        size++;\n        display(head);\n        return head;\n    }\n\n    // else\n    // {\n    //     int i = 1;\n    //     node *temp = head;\n    //     while (i < pos - 1)\n    //     {\n    //         temp = temp->next;\n    //     }\n    //     newnode->next = temp->next;\n    //     temp->next = newnode;\n    //     newnode->prev = temp;\n    //     size++;\n    //     display(head);\n    //     return head;\n    // }\n}\n\nnode *deleteAtPos(node *head, int pos)\n{\n\n    if (size == 0)\n    {\n        printf(\"Linked list is empty\\n\");\n        return head;\n    }\n\n    if (pos <= 0 || pos > size)\n    {\n        printf(\"Invalid position\");\n        display(head);\n        return head;\n    }\n\n    if (pos == 1)\n    {\n        node *temp = head;\n        head = head->next;\n        head->prev = NULL;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n\n    if (pos == size)\n    {\n        node *temp = head;\n        node *p;\n        while (temp->next != NULL)\n        {\n            p = temp;\n            temp = temp->next;\n        }\n        p->next = NULL;\n        free(temp);\n        size--;\n        display(head);\n        return head;\n    }\n\n    // else\n    // {\n\n    // }\n}\n\nnode *reverse(node *head)\n{\n    node *temp = head;\n    node *prev = NULL;\n    node *curr = NULL;\n    while (temp != NULL)\n    {\n        curr = temp->next;\n        temp->next = prev;\n        temp->prev = curr;\n        prev = temp;\n        temp = curr;\n    }\n\n    head = prev;\n    display(head);\n    return head;\n}\n\nnode *deleteByKey(node *head, int key)\n{\n    node *temp = head;\n    int i = 1;\n    while (temp != NULL)\n    {\n\n        if (temp->data == key)\n        {\n            if (i == 1)\n            {\n                head = head->next;\n                free(temp);\n                size--;\n                display(head);\n                return head;\n            }\n            if (i == size)\n            {\n                temp->prev->next = NULL;\n                free(temp);\n                size--;\n                display(head);\n                return head;\n            }\n            else\n            {\n                temp->prev->next = temp->next;\n                temp->next->prev = temp->prev;\n                free(temp);\n                size--;\n                display(head);\n                return head;\n            }\n        }\n        temp = temp->next;\n        i++;\n    }\n\n    if (temp == NULL)\n    {\n        printf(\"Key not found in the list\\n\");\n        return head;\n    }\n}\n\nint main()\n{\n    node *head = NULL;\n    int ch, data, pos, key;\n    while (1)\n    {\n        printf(\"\\n1.InsertAtPos\\n2.DeleteAtPos\\n3.Display\\n4.Reverse\\n5.DeleteByKey\\n\");\n        printf(\"Enter your choice\\n\");\n        scanf(\"%d\", &ch);\n\n        switch (ch)\n        {\n        case 1:\n            printf(\"Enter position\\n\");\n            scanf(\"%d\", &pos);\n            printf(\"Enter data\\n\");\n            scanf(\"%d\", &data);\n            head = insertAtPos(head, data, pos);\n            break;\n\n        case 2:\n            printf(\"Enter position\\n\");\n            scanf(\"%d\", &pos);\n            head = deleteAtPos(head, pos);\n            break;\n\n        case 3:\n            head = display(head);\n            break;\n\n        case 4:\n            head = reverse(head);\n            break;\n\n        case 5:\n            printf(\"Enter the key to be deleted\\n\");\n            scanf(\"%d\", &key);\n            deleteByKey(head, key);\n            break;\n        }\n    }\n}",
    "sampleInput": "Insert 10, 20, 30\nDisplay Forward\nDisplay Backward",
    "sampleOutput": "Forward: NULL <- 10 <-> 20 <-> 30 -> NULL\nBackward: NULL <- 30 <-> 20 <-> 10 -> NULL",
    "complexity": {
      "time": "Search: O(N); Insert at pos: O(N); Delete node when pointer known: O(1)",
      "space": "O(N) with 2 pointers per node"
    },
    "keyPoints": [
      "Allows bidirectional traversal without circular wrap-around.",
      "Requires careful synchronization of both prev and next pointers during splices."
    ],
    "sourceFileName": "24CS330-DS/Codes/DoublyLinkedList.c"
  },
  {
    "id": "ds-lab-9",
    "number": "Experiment 9",
    "title": "Infix to Postfix Conversion & Postfix Expression Evaluation",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to convert infix expression to postfix expression using stack and evaluate the postfix expression. (Test for nested parenthesized expressions). Note: Define Stack structure and implement the operations. Use different stacks for conversion and evaluation.",
    "concept": "Human notation is Infix (A + B). Compilers convert infix expressions into Postfix / Reverse Polish Notation (AB+) because postfix requires no parentheses and respects operator precedence strictly from left to right. Stacks manage operator precedence during conversion and operand values during evaluation.",
    "algorithm": [
      "Infix to Postfix:",
      "1. Scan infix from left to right.",
      "2. If operand (alphanumeric), append directly to postfix string.",
      "3. If '(', push onto operator stack.",
      "4. If ')', pop from stack and append to postfix until '(' is encountered; discard '(' .",
      "5. If operator (+, -, *, /, ^), while stack not empty and precedence(stack[top]) >= precedence(current), pop and append. Then push current operator.",
      "6. Pop remaining operators from stack.",
      "Postfix Evaluation:",
      "1. Scan postfix string. If digit operand, push its integer value onto evaluation stack.",
      "2. If operator, pop two operands: op2 = pop(), op1 = pop(). Apply op1 <operator> op2 and push result.",
      "3. Final result is at top of evaluation stack."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <ctype.h>\n#include <string.h>\n#define capacity 50\ntypedef struct stack\n{\n    char arr[capacity];\n    int top;\n} stack;\nint isFull(stack *s)\n{\n    return s->top == capacity - 1;\n}\nint isEmpty(stack *s)\n{\n    return s->top == -1;\n}\nvoid push(stack *s, char item)\n{\n    if (isFull(s))\n    {\n        printf(\"Stack overflow\\n\");\n        return;\n    }\n    s->arr[++(s->top)] = item;\n}\nchar pop(stack *s)\n{\n    if (isEmpty(s))\n    {\n        printf(\"Stack undeflow\\n\");\n        return ' ';\n    }\n    return s->arr[(s->top)--];\n}\nchar peek(stack *s)\n{\n    if (isEmpty(s))\n    {\n        printf(\"Stack undeflow\\n\");\n        return ' ';\n    }\n    return s->arr[(s->top)];\n}\nint precedence(char s)\n{\n    if (s == '^' || s == '$')\n        return 4;\n    if (s == '/' || s == '*')\n        return 3;\n    if (s == '+' || s == '-')\n        return 2;\n    else\n        return 1;\n}\nint isOperator(char op)\n{\n    return (op == '$' || op == '^' || op == '*' || op == '/' || op == '+' || op == '-');\n}\nvoid infix_to_postfix(char infix[])\n{\n    char postfix[50];\n    int j = 0;\n    stack *s = (stack *)malloc(sizeof(stack));\n    s->top = -1;\n    for (int i = 0; infix[i] != '\\0'; i++)\n    {\n        if (infix[i] == '(')\n        {\n            push(s, infix[i]);\n        }\n        else if (infix[i] == ')')\n        {\n            while (peek(s) != '(')\n            {\n                postfix[j] = pop(s);\n                j++;\n            }\n            pop(s);\n        }\n        else if (isOperator(infix[i]))\n        {\n            if (!isEmpty(s) && (precedence(infix[i]) <= precedence(peek(s))))\n            {\n                postfix[j] = pop(s);\n                j++;\n            }\n            push(s, infix[i]);\n        }\n        else\n        {\n            postfix[j] = infix[i];\n            j++;\n        }\n    }\n    while (!isEmpty(s))\n    {\n        postfix[j] = pop(s);\n        j++;\n    }\n    postfix[j] = '\\0';\n    for (int i = 0; postfix[i] != '\\0'; i++)\n    {\n        printf(\"%c\", postfix[i]);\n    }\n}\nvoid infixToPrefix(char infix[])\n{\n    // strrev(infix);\n    char prefix[50];\n    int j = 0;\n    int i = 0;\n    stack *s = (stack *)malloc(sizeof(stack));\n    s->top = -1;\n    // for (int i = 0; infix[i] != '\\0'; i++)\n    for (i = strlen(infix) - 1; i >= 0; i--)\n    {\n        if (infix[i] == ')')\n        {\n            push(s, infix[i]);\n        }\n        else if (infix[i] == '(')\n        {\n            while (peek(s) != ')')\n            {\n                prefix[j] = pop(s);\n                j++;\n            }\n            pop(s);\n        }\n        else if (isOperator(infix[i]))\n        {\n            if (!isEmpty(s) && (precedence(infix[i]) < precedence(peek(s))))\n            {\n                prefix[j] = pop(s);\n                j++;\n            }\n            push(s, infix[i]);\n        }\n        else\n        {\n            prefix[j] = infix[i];\n            j++;\n        }\n    }\n    while (!isEmpty(s))\n    {\n        prefix[j] = pop(s);\n        j++;\n    }\n    prefix[j] = '\\0';\n    // strrev(prefix);\n    // for (int i = 0; prefix[i] != '\\0'; i++)\n    for (int i = strlen(prefix) - 1; i >= 0; i--)\n    {\n        printf(\"%c\", prefix[i]);\n    }\n}\nvoid main()\n{\n    char infix[50];\n    int len = 0;\n    // char infix[] = \"(A+B)*(C+D)\";\n    printf(\"Enter your expression\\n\");\n    scanf(\"%s\", infix);\n    printf(\"Postfix expression : \");\n    infix_to_postfix(infix);\n    printf(\"\\nPrefix expression : \");\n    infixToPrefix(infix);\n}",
    "sampleInput": "Infix Expression: ((A + B) * C - (D - E)) ^ (F + G)",
    "sampleOutput": "Infix: ((A + B) * C - (D - E)) ^ (F + G)\nPostfix: AB+C*DE--FG+^\n\nEvaluation Test: 5 3 + 2 * 4 2 - -\nResult: 14",
    "complexity": {
      "time": "O(N) linear scan over expression length",
      "space": "O(N) stack auxiliary memory"
    },
    "keyPoints": [
      "Precedence: ^ (highest, 3) > * / (2) > + - (1) > ( (lowest inside stack).",
      "Order of popped operands during evaluation is crucial: op2 is popped first, op1 second; compute op1 - op2, not op2 - op1.",
      "Handles arbitrary nested parenthesized expressions."
    ],
    "sourceFileName": "24CS330-DS/Codes/InfixToPostfixPrefix.c"
  },
  {
    "id": "ds-lab-10",
    "number": "Experiment 10",
    "title": "Infix to Prefix Conversion & Prefix Expression Evaluation",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to convert infix expression to prefix expression using stack and evaluate the prefix expression (Test for nested parenthesized expressions).",
    "concept": "Prefix / Polish notation places operators before operands (+ A B). Conversion involves reversing the infix string, inverting parentheses, running modified postfix conversion (using strict > precedence instead of >= due to right-associativity), and reversing the output.",
    "algorithm": [
      "Reverse the infix string.",
      "Swap '(' with ')' and vice versa.",
      "Convert reversed infix to postfix using stack with strict greater-than operator precedence check.",
      "Reverse the resulting postfix expression to obtain the true Prefix expression.",
      "Prefix Evaluation: Scan prefix expression from RIGHT to LEFT. If operand, push onto stack. If operator, pop op1 = pop(), op2 = pop(); push (op1 <operator> op2). Result is on stack top."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <ctype.h>\n\n#define capacity 50\ntypedef struct stack\n{\n    char arr[capacity];\n    int top;\n} stack;\n\nint isFull(stack *s)\n{\n    return (s->top == capacity - 1);\n}\n\nint isEmpty(stack *s)\n{\n    return (s->top == -1);\n}\n\nvoid push(stack *s, int data)\n{\n    if (isFull(s))\n    {\n        printf(\"Stack Overflow\\n\");\n        return;\n    }\n    s->arr[(++s->top)] = data;\n}\n\nint pop(stack *s)\n{\n    if (isEmpty(s))\n    {\n        printf(\"Stack Underflow\\n\");\n        return;\n    }\n    return s->arr[(s->top)--];\n}\n\nint isOperator(char c)\n{\n    if (c == '-' || c == '+' || c == '*' || c == '/')\n        return 1;\n    else\n        return 0;\n}\n\nint giveResult(int n1, int n2, char op)\n{\n    if (op == '*')\n        return n1 * n2;\n    else if (op == '/')\n        return n1 / n2;\n    else if (op == '+')\n        return n1 + n2;\n    else if (op == '-')\n        return n1 - n2;\n}\n\nint postfixEvaluation(char *postfix)\n{\n    int i = 0, i1, i2, result = 0;\n    stack *s = (stack *)malloc(sizeof(stack));\n    s->top = -1;\n    for (i = 0; postfix[i] != '\\0'; i++)\n    {\n        if (!isOperator(postfix[i]))\n            push(s, postfix[i] - '0');\n        else if (isOperator(postfix[i]))\n        {\n            i2 = pop(s);\n            i1 = pop(s);\n            result = giveResult(i1, i2, postfix[i]);\n            push(s, result);\n        }\n    }\n    return result;\n}\n\nint prefixEvaluation(char *prefix)\n{\n    int i = 0, i1, i2, result = 0;\n    stack *s = (stack *)malloc(sizeof(stack));\n    s->top = -1;\n    strrev(prefix);\n    for (i = 0; prefix[i] != '\\0'; i++)\n    {\n        if (!isOperator(prefix[i]))\n        {\n            push(s, prefix[i] - '0');\n        }\n        else if (isOperator(prefix[i]))\n        {\n            i1 = pop(s);\n            i2 = pop(s);\n            result = giveResult(i1, i2, prefix[i]);\n            push(s, result);\n        }\n    }\n    return result;\n}\n\nint main()\n{\n    int result = 0, ch;\n    char postfix[50];\n    char prefix[50];\n    printf(\"1.PostfixEvaluation\\t2.PrefixEvaluation\\n\");\n    scanf(\"%d\", &ch);\n    switch (ch)\n    {\n    case 1:\n        printf(\"Enter the postfix expression to be evaluated\\n\");\n        scanf(\"%s\", postfix);\n        result = postfixEvaluation(postfix);\n        printf(\"Result\\n%d\", result);\n        break;\n\n    case 2:\n        printf(\"Enter the prefix expression to be evaluated\\n\");\n        scanf(\"%s\", prefix);\n        result = prefixEvaluation(prefix);\n        printf(\"Result\\n%d\", result);\n        break;\n    }\n    return 0;\n}",
    "sampleInput": "Infix: (A + B) * (C - D)",
    "sampleOutput": "Infix: (A + B) * (C - D)\nPrefix: * + A B - C D\n\nPrefix Evaluation Test: - + * 2 3 4 5\nResult: (2 * 3 + 4) - 5 = 5",
    "complexity": {
      "time": "O(N) string reversals and stack scans",
      "space": "O(N) stack and temporary buffer"
    },
    "keyPoints": [
      "Prefix evaluation scans right-to-left, popping op1 first, then op2.",
      "Stack-based evaluation does not require an expression parse tree."
    ],
    "sourceFileName": "24CS330-DS/Codes/PostfixPrefixEvaluation.c"
  },
  {
    "id": "ds-lab-11",
    "number": "Experiment 11",
    "title": "Ordinary Linear Queue & Double Ended Queue (Deque)",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to implement the following types of Queues with array representation by allocating memory dynamically: i) Ordinary Linear Queue ii) Double ended Queue (Deque). Note: Define Queue structure and implement operations.",
    "concept": "Ordinary queue follows First-In First-Out (FIFO). Deque (Double Ended Queue) generalizes the queue to allow insertions and deletions at both Front and Rear ends.",
    "algorithm": [
      "Ordinary Queue: insertRear (increment rear and store) and deleteFront (retrieve front and increment front).",
      "Deque Operations:",
      "1. insertRear: arr[++rear] = val.",
      "2. deleteFront: val = arr[front++].",
      "3. insertFront: arr[--front] = val (if front > 0).",
      "4. deleteRear: val = arr[rear--] (if rear >= front)."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct queue\n{\n    int data;\n    int front, rear;\n    int capacity;\n    int *arr;\n} q;\n\nq *create(q *qu)\n{\n    qu = (q *)malloc(sizeof(q));\n    qu->capacity = 40;\n    qu->arr = (int *)malloc(qu->capacity * sizeof(int));\n    qu->front = qu->rear = -1;\n    return qu;\n}\n\nint isEmpty(q *qu)\n{\n    return (qu->front == -1);\n}\n\nint isFull(q *qu)\n{\n    return (qu->rear == qu->capacity - 1);\n}\n\nvoid enQueueRear(q *qu, int data)\n{\n    if (isFull(qu))\n    {\n        printf(\"Queue Overflow\\n\");\n        return;\n    }\n    qu->rear++;\n    qu->arr[qu->rear] = data;\n\n    if (qu->front == -1)\n        qu->front = qu->rear;\n\n    return;\n}\n\nvoid enQueueFront(q *qu, int data)\n{\n    if (isFull(qu))\n    {\n        printf(\"Queue Overflow\\n\");\n        return;\n    }\n    if (qu->front == -1)\n    {\n        qu->rear++;\n        qu->arr[qu->rear] = data;\n        qu->front == qu->rear;\n        return;\n    }\n    else\n    {\n        qu->front--;\n        if (qu->front == -1)\n        {\n            printf(\"Queue OverFlow\\n\");\n            qu->front++;\n        }\n        qu->arr[qu->front] = data;\n        return;\n    }\n}\n\nint deQueueFront(q *qu)\n{\n    if (isEmpty(qu))\n    {\n        printf(\"Queue Underflow\\n\");\n        return;\n    }\n\n    int data = (qu->arr[qu->front]);\n    if (qu->front == qu->rear)\n        qu->rear = qu->front = -1;\n    else\n    {\n        qu->front++;\n    }\n    return data;\n}\n\nint deQueueRear(q *qu)\n{\n    if (isEmpty(qu))\n    {\n        printf(\"Queue Underflow\\n\");\n        return;\n    }\n\n    int data = qu->arr[qu->rear];\n\n    if (qu->front == qu->rear)\n        qu->rear = qu->front = -1;\n    else\n        qu->rear--;\n\n    return data;\n}\n\nvoid display(q *qu)\n{\n    if (isEmpty(qu))\n    {\n        printf(\"Empty Queue\\n\");\n        return;\n    }\n    else\n    {\n        for (int i = qu->front; i <= qu->rear; i++)\n        {\n            printf(\"%d\\t\", qu->arr[i]);\n        }\n    }\n}\n\nint main()\n{\n    q *qu = create(qu);\n    int ch, data;\n\n    while (1)\n    {\n        printf(\"\\n1.EnqueueRear\\n2.DequeueFront\\n3.EnqueueFront\\n4.DequeueRear\\n5.Display\\n6.Exit\\n\");\n        scanf(\"%d\", &ch);\n        switch (ch)\n        {\n        case 1:\n            printf(\"Enter data\\n\");\n            scanf(\"%d\", &data);\n            enQueueRear(qu, data);\n            break;\n\n        case 2:\n            printf(\"Deleted data is %d\\n\", deQueueFront(qu));\n            break;\n\n        case 3:\n            printf(\"Enter data\\n\");\n            scanf(\"%d\", &data);\n            enQueueFront(qu, data);\n            break;\n\n        case 4:\n            printf(\"Deleted data is %d\\n\", deQueueRear(qu));\n            break;\n\n        case 5:\n            display(qu);\n            break;\n\n        case 6:\n            exit(0);\n        }\n    }\n}",
    "sampleInput": "Deque Operations:\n1. Insert Rear: 10\n2. Insert Rear: 20\n3. Insert Front: 5\n4. Delete Rear\n5. Display",
    "sampleOutput": "Deque Contents: 5  10\nDeleted from Rear: 20",
    "complexity": {
      "time": "O(1) for all insert and delete operations at both ends",
      "space": "O(Capacity) dynamically allocated array"
    },
    "keyPoints": [
      "Linear Queue suffers from 'false overflow': rear reaches capacity even if front slots are freed.",
      "Deque supports both stack-like (LIFO) and queue-like (FIFO) behaviors."
    ],
    "sourceFileName": "24CS330-DS/Codes/DoubleEndedQueue.c"
  },
  {
    "id": "ds-lab-12",
    "number": "Experiment 12",
    "title": "Circular Queue & Priority Queue",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to implement the following types of Queues with array representation by allocating memory dynamically: i) Circular Queue ii) Priority Queue. Note: Define Queue structure and implement the operations.",
    "concept": "Circular Queue wraps indices modulo capacity: rear = (rear + 1) % MAX. This solves linear queue memory wastage. Priority Queue arranges items so that the item with the highest (or lowest) priority is served first regardless of insertion order.",
    "algorithm": [
      "Circular Queue:",
      "1. Enqueue: check if (rear + 1) % MAX == front (Queue Full). Else, rear = (rear + 1) % MAX; arr[rear] = val; count++.",
      "2. Dequeue: check if count == 0 (Queue Empty). Else, val = arr[front]; front = (front + 1) % MAX; count--; return val.",
      "Ascending Priority Queue:",
      "1. Enqueue: Search for insertion index where arr[i] > val; shift higher elements right; insert val in sorted slot.",
      "2. Dequeue: Minimum element is always at front (index 0); pop in O(1) and shift remaining elements."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct queue\n{\n    int front;\n    int data;\n    int rear;\n    int *arr;\n    int size;\n} q;\n\nq *create(q *qu)\n{\n    qu = (q *)malloc(sizeof(q));\n    qu->size = 10;\n    qu->front = qu->rear = -1;\n    qu->arr = (int *)malloc(qu->size * sizeof(int));\n    return qu;\n}\n\nint isEmpty(q *qu)\n{\n    return (qu->front == -1);\n}\n\nint isFull(q *qu)\n{\n    return (((qu->rear + 1) % qu->size) == qu->front);\n}\n\nvoid enQueue(q *qu, int data)\n{\n    if (isFull(qu))\n    {\n        printf(\"Overflow\\n\");\n        return;\n    }\n    qu->rear = (qu->rear + 1) % qu->size;\n    qu->arr[qu->rear] = data;\n\n    if (qu->front == -1)\n    {\n        qu->front = qu->rear;\n    }\n    return;\n}\n\nint deQueue(q *qu)\n{\n    int data;\n    if (isEmpty(qu))\n    {\n        printf(\"Underflow\\n\");\n        return;\n    }\n\n    else\n    {\n        data = qu->arr[qu->front];\n        if (qu->front == qu->rear)\n            qu->front = qu->rear = -1;\n        else\n            qu->front = (qu->front + 1) % qu->size;\n    }\n    return data;\n}\n\nvoid display(q *qu)\n{\n    if (isEmpty(qu))\n        printf(\"Empty Queue\\n\");\n\n    else\n    {\n        for (int i = qu->front; i <= qu->rear; i++)\n        {\n            printf(\"%d\\t\", (qu->arr[i]));\n        }\n    }\n}\n\nint main()\n{\n    q *qu = create(qu);\n    int ch, data;\n\n    while (1)\n    {\n        printf(\"\\n1.Enqueue\\n2.Dequeue\\n3.Display\\n4.Exit\\n\");\n        scanf(\"%d\", &ch);\n        switch (ch)\n        {\n        case 1:\n            printf(\"Enter data\\n\");\n            scanf(\"%d\", &data);\n            enQueue(qu, data);\n            break;\n\n        case 2:\n            printf(\"Deleted data is %d\\n\", deQueue(qu));\n            break;\n\n        case 3:\n            display(qu);\n            break;\n\n        case 4:\n            exit(0);\n        }\n    }\n}",
    "sampleInput": "Circular Queue (Max 3):\n1. Enqueue 10\n2. Enqueue 20\n3. Enqueue 30\n4. Dequeue (returns 10)\n5. Enqueue 40 (wraps around to index 0)\n6. Display",
    "sampleOutput": "Dequeued: 10\nCircular Queue Elements: 20  30  40\n(Wrapped successfully into freed index 0)",
    "complexity": {
      "time": "Circular Queue: O(1) Enqueue & Dequeue; Priority Queue Array: O(N) Enqueue, O(1) Dequeue",
      "space": "O(MAX) allocated buffer"
    },
    "keyPoints": [
      "Circular Queue utilizes modulo operator (%) to recycle freed positions.",
      "count variable or (front == (rear + 1) % MAX) disambiguates between Queue Full and Queue Empty."
    ],
    "sourceFileName": "24CS330-DS/Codes/CircularQueue.c"
  },
  {
    "id": "ds-lab-13",
    "number": "Experiment 13",
    "title": "Binary Search Tree (BST) Construction & Traversals",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to implement Binary Search tree with the following operations: i) Construction ii) Traversals (DFS: Inorder, Preorder, Postorder and BFS: Level order) iii) Finding node with Maximum key value and printing details along with parent iv) Counting total nodes v) Finding tree height.",
    "concept": "A Binary Search Tree enforces the ordering property: for every node, all keys in its left subtree are strictly smaller, and all keys in its right subtree are strictly greater. Inorder traversal of a BST always yields sorted keys.",
    "algorithm": [
      "insert(root, key): If root is NULL, return createNode(key). If key < root->data, root->left = insert(root->left, key). Else if key > root->data, root->right = insert(root->right, key).",
      "Inorder(root): Traverse Left, Visit Root, Traverse Right. (Produces sorted order)",
      "Preorder(root): Visit Root, Traverse Left, Traverse Right.",
      "Postorder(root): Traverse Left, Traverse Right, Visit Root.",
      "findMax(root): Traverse along right child pointers until root->right == NULL. The rightmost node has the maximum key.",
      "countNodes(root): 0 if NULL, else 1 + countNodes(root->left) + countNodes(root->right).",
      "findHeight(root): 0 if NULL, else 1 + max(findHeight(root->left), findHeight(root->right))."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *left;\n    struct Node *right;\n};\n\nstruct Node* createNode(int value) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = value;\n    newNode->left = NULL;\n    newNode->right = NULL;\n    return newNode;\n}\n\nstruct Node* insert(struct Node* root, int key) {\n    if (root == NULL) return createNode(key);\n    if (key < root->data)\n        root->left = insert(root->left, key);\n    else if (key > root->data)\n        root->right = insert(root->right, key);\n    return root;\n}\n\nvoid inorder(struct Node* root) {\n    if (root != NULL) {\n        inorder(root->left);\n        printf(\"%d \", root->data);\n        inorder(root->right);\n    }\n}\n\nvoid preorder(struct Node* root) {\n    if (root != NULL) {\n        printf(\"%d \", root->data);\n        preorder(root->left);\n        preorder(root->right);\n    }\n}\n\nvoid postorder(struct Node* root) {\n    if (root != NULL) {\n        postorder(root->left);\n        postorder(root->right);\n        printf(\"%d \", root->data);\n    }\n}\n\nint countNodes(struct Node* root) {\n    if (root == NULL) return 0;\n    return 1 + countNodes(root->left) + countNodes(root->right);\n}\n\nint findHeight(struct Node* root) {\n    if (root == NULL) return 0;\n    int lh = findHeight(root->left);\n    int rh = findHeight(root->right);\n    return (lh > rh ? lh : rh) + 1;\n}\n\nvoid findMaxWithParent(struct Node* root) {\n    if (root == NULL) {\n        printf(\"Tree is empty!\\n\");\n        return;\n    }\n    struct Node* parent = NULL;\n    struct Node* curr = root;\n    while (curr->right != NULL) {\n        parent = curr;\n        curr = curr->right;\n    }\n    printf(\"Maximum Key: %d\\n\", curr->data);\n    if (parent != NULL)\n        printf(\"Parent Node: %d\\n\", parent->data);\n    else\n        printf(\"Node is the Root (No parent)\\n\");\n}\n\nint main() {\n    struct Node* root = NULL;\n    int choice, val, n, i;\n\n    do {\n        printf(\"\\n========== BST MENU ==========\\n\");\n        printf(\"1. Insert Elements\\n\");\n        printf(\"2. Inorder Traversal (Sorted)\\n\");\n        printf(\"3. Preorder Traversal\\n\");\n        printf(\"4. Postorder Traversal\\n\");\n        printf(\"5. Find Maximum Key & Parent\\n\");\n        printf(\"6. Total Node Count & Height\\n\");\n        printf(\"7. Exit\\n\");\n        printf(\"==============================\\n\");\n        printf(\"Choice: \");\n        if (scanf(\"%d\", &choice) != 1) break;\n\n        switch (choice) {\n            case 1:\n                printf(\"How many keys to insert? \");\n                scanf(\"%d\", &n);\n                printf(\"Enter %d integers:\\n\", n);\n                for (i = 0; i < n; i++) {\n                    scanf(\"%d\", &val);\n                    root = insert(root, val);\n                }\n                break;\n            case 2:\n                printf(\"Inorder Traversal: \");\n                inorder(root);\n                printf(\"\\n\");\n                break;\n            case 3:\n                printf(\"Preorder Traversal: \");\n                preorder(root);\n                printf(\"\\n\");\n                break;\n            case 4:\n                printf(\"Postorder Traversal: \");\n                postorder(root);\n                printf(\"\\n\");\n                break;\n            case 5:\n                findMaxWithParent(root);\n                break;\n            case 6:\n                printf(\"Total Nodes: %d\\n\", countNodes(root));\n                printf(\"Tree Height: %d\\n\", findHeight(root));\n                break;\n            case 7:\n                printf(\"Exiting BST module...\\n\");\n                break;\n            default:\n                printf(\"Invalid choice!\\n\");\n        }\n    } while (choice != 7);\n\n    return 0;\n}",
    "sampleInput": "Insert keys: 50, 30, 70, 20, 40, 60, 80\nChoice 2 (Inorder)\nChoice 5 (Find Max)\nChoice 6 (Count & Height)",
    "sampleOutput": "Inorder Traversal: 20 30 40 50 60 70 80\nMaximum Key: 80\nParent Node: 70\nTotal Nodes: 7\nTree Height: 3",
    "complexity": {
      "time": "Average: O(log N) search/insert; Worst case (skewed): O(N); Traversals: O(N)",
      "space": "O(H) recursion call stack depth"
    },
    "keyPoints": [
      "Inorder traversal always yields nodes in ascending sorted sequence.",
      "Rightmost node is maximum; leftmost node is minimum.",
      "Degenerate / skewed BST degrades to a linked list with O(N) operations."
    ],
    "sourceFileName": "24CS330-DS/tree graph.pdf"
  },
  {
    "id": "ds-lab-14",
    "number": "Experiment 14",
    "title": "Binary Search Tree Node Deletion",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to implement Binary Search tree deletion: Searching a node by key and deleting if exists (node to be deleted may be: leaf node, non-leaf node with one child, or non-leaf node with two children).",
    "concept": "Node deletion in a BST has three fundamental cases: Case 1: Node is a leaf (free node and return NULL). Case 2: Node has one child (bypass node and return child). Case 3: Node has two children (find Inorder Successor - smallest in right subtree, copy successor's value into current node, and recursively delete successor).",
    "algorithm": [
      "deleteNode(root, key):",
      "1. If root == NULL, key not found.",
      "2. If key < root->data, root->left = deleteNode(root->left, key).",
      "3. Else if key > root->data, root->right = deleteNode(root->right, key).",
      "4. Else key matches root->data:",
      "   a. If left child is NULL, return right child.",
      "   b. If right child is NULL, return left child.",
      "   c. If two children exist, find inorder successor (minValueNode(root->right)), copy data to root, and delete successor from right subtree."
    ],
    "code": "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *left, *right;\n};\n\nstruct Node* createNode(int value) {\n    struct Node* n = (struct Node*)malloc(sizeof(struct Node));\n    n->data = value;\n    n->left = n->right = NULL;\n    return n;\n}\n\nstruct Node* insert(struct Node* root, int key) {\n    if (root == NULL) return createNode(key);\n    if (key < root->data) root->left = insert(root->left, key);\n    else if (key > root->data) root->right = insert(root->right, key);\n    return root;\n}\n\nstruct Node* minValueNode(struct Node* node) {\n    struct Node* current = node;\n    while (current && current->left != NULL)\n        current = current->left;\n    return current;\n}\n\nstruct Node* deleteNode(struct Node* root, int key) {\n    if (root == NULL) return root;\n\n    if (key < root->data)\n        root->left = deleteNode(root->left, key);\n    else if (key > root->data)\n        root->right = deleteNode(root->right, key);\n    else {\n        // Case 1: No child or Case 2: One child\n        if (root->left == NULL) {\n            struct Node* temp = root->right;\n            free(root);\n            return temp;\n        } else if (root->right == NULL) {\n            struct Node* temp = root->left;\n            free(root);\n            return temp;\n        }\n\n        // Case 3: Two children\n        // Get inorder successor (smallest in the right subtree)\n        struct Node* temp = minValueNode(root->right);\n        root->data = temp->data;\n        // Delete the inorder successor\n        root->right = deleteNode(root->right, temp->data);\n    }\n    return root;\n}\n\nvoid inorder(struct Node* root) {\n    if (root != NULL) {\n        inorder(root->left);\n        printf(\"%d \", root->data);\n        inorder(root->right);\n    }\n}\n\nint main() {\n    struct Node* root = NULL;\n    // Build tree: 50, 30, 20, 40, 70, 60, 80\n    int keys[] = {50, 30, 20, 40, 70, 60, 80};\n    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);\n\n    printf(\"Initial BST Inorder: \");\n    inorder(root);\n    printf(\"\\n\");\n\n    printf(\"\\n1. Deleting leaf node (20):\\n\");\n    root = deleteNode(root, 20);\n    inorder(root);\n    printf(\"\\n\");\n\n    printf(\"\\n2. Deleting node with one child (30):\\n\");\n    root = deleteNode(root, 30);\n    inorder(root);\n    printf(\"\\n\");\n\n    printf(\"\\n3. Deleting node with two children (50 - root):\\n\");\n    root = deleteNode(root, 50);\n    inorder(root);\n    printf(\"\\n\");\n\n    return 0;\n}",
    "sampleInput": "Delete keys: 20 (leaf), 30 (one child), 50 (two children)",
    "sampleOutput": "Initial BST Inorder: 20 30 40 50 60 70 80\n\n1. Deleting leaf node (20):\n30 40 50 60 70 80\n\n2. Deleting node with one child (30):\n40 50 60 70 80\n\n3. Deleting node with two children (50 - root):\n40 60 70 80",
    "complexity": {
      "time": "O(H) where H is tree height (O(log N) balanced, O(N) worst case)",
      "space": "O(H) recursion stack"
    },
    "keyPoints": [
      "Inorder successor is the smallest node in the right subtree.",
      "Inorder predecessor (largest in left subtree) can also be used as a valid replacement.",
      "The successor will always have at most one child (its right child)."
    ],
    "sourceFileName": "24CS330-DS/tree graph.pdf"
  },
  {
    "id": "ds-lab-15",
    "number": "Experiment 15",
    "title": "Graph Traversal Techniques (DFS and BFS)",
    "subjectCode": "24CS36L",
    "subjectName": "Data Structures Lab",
    "language": "c",
    "question": "Develop a menu driven program to implement Graph traversal techniques: i) Depth First Search (DFS) ii) Breadth First Search (BFS) for an undirected graph represented by an adjacency matrix.",
    "concept": "DFS explores as deep as possible along each branch before backtracking, naturally implemented with a recursive call stack or explicit LIFO stack. BFS explores neighbor vertices level by level, utilizing a FIFO queue.",
    "algorithm": [
      "Input adjacency matrix adj[N][N] and starting vertex start.",
      "DFS(vertex, visited[]):",
      "1. Mark vertex as visited and print.",
      "2. For every adjacent neighbor i from 0 to N-1 where adj[vertex][i] == 1:",
      "   If !visited[i], recursively call DFS(i, visited).",
      "BFS(start, N):",
      "1. Initialize visited array to 0. Enqueue start and mark visited[start] = 1.",
      "2. While queue is not empty: curr = dequeue(); print curr.",
      "3. For every adjacent neighbor i where adj[curr][i] == 1 and !visited[i]: mark visited[i] = 1 and enqueue i."
    ],
    "code": "#include <stdio.h>\n#define MAX 10\n\nint adj[MAX][MAX];\nint visited[MAX];\nint queue[MAX];\nint front = 0, rear = -1;\n\nvoid enqueue(int v) {\n    queue[++rear] = v;\n}\n\nint dequeue() {\n    return queue[front++];\n}\n\nint isQueueEmpty() {\n    return front > rear;\n}\n\nvoid dfs(int v, int n) {\n    visited[v] = 1;\n    printf(\"%d \", v);\n    for (int i = 0; i < n; i++) {\n        if (adj[v][i] == 1 && !visited[i]) {\n            dfs(i, n);\n        }\n    }\n}\n\nvoid bfs(int start, int n) {\n    for (int i = 0; i < n; i++) visited[i] = 0;\n    front = 0; rear = -1;\n\n    enqueue(start);\n    visited[start] = 1;\n\n    printf(\"BFS Order: \");\n    while (!isQueueEmpty()) {\n        int curr = dequeue();\n        printf(\"%d \", curr);\n\n        for (int i = 0; i < n; i++) {\n            if (adj[curr][i] == 1 && !visited[i]) {\n                visited[i] = 1;\n                enqueue(i);\n            }\n        }\n    }\n    printf(\"\\n\");\n}\n\nint main() {\n    int n, edges, u, v, start;\n\n    printf(\"Enter number of vertices: \");\n    if (scanf(\"%d\", &n) != 1) return 1;\n\n    printf(\"Enter number of edges: \");\n    scanf(\"%d\", &edges);\n\n    // Initialize adjacency matrix\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            adj[i][j] = 0;\n\n    printf(\"Enter edges (u v) 0-indexed:\\n\");\n    for (int i = 0; i < edges; i++) {\n        scanf(\"%d %d\", &u, &v);\n        adj[u][v] = 1;\n        adj[v][u] = 1; // Undirected\n    }\n\n    printf(\"Enter start vertex for traversals: \");\n    scanf(\"%d\", &start);\n\n    for (int i = 0; i < n; i++) visited[i] = 0;\n    printf(\"\\nDFS Order: \");\n    dfs(start, n);\n    printf(\"\\n\");\n\n    bfs(start, n);\n\n    return 0;\n}",
    "sampleInput": "Vertices: 5, Edges: 5\nEdges: 0 1, 0 2, 1 3, 1 4, 2 4\nStart: 0",
    "sampleOutput": "DFS Order: 0 1 3 4 2 \nBFS Order: 0 1 2 3 4",
    "complexity": {
      "time": "O(V^2) with adjacency matrix representation (O(V + E) with adjacency list)",
      "space": "O(V) visited array and queue/recursion stack"
    },
    "keyPoints": [
      "BFS guarantees the shortest path on unweighted graphs.",
      "DFS is used for topological sorting, cycle detection, and strongly connected components.",
      "Visited array prevents infinite cycles on graphs with cycles."
    ],
    "sourceFileName": "24CS330-DS/tree graph.pdf"
  },
  {
    "id": "cpp-lab-1",
    "number": "OOP Lab 1",
    "title": "Quadratic Equation Roots Solver in C++",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "language": "cpp",
    "question": "Write a C++ program to find and output all the roots of a quadratic equation ax^2 + bx + c = 0, handling real and distinct, real and equal, and complex roots.",
    "concept": "Uses discriminant Delta = b^2 - 4ac to classify root types: Delta > 0 gives two real roots, Delta = 0 gives real identical roots (-b / 2a), and Delta < 0 gives complex conjugate roots (realPart +- i * imagPart). Demonstrates standard I/O (cin, cout) and cmath library.",
    "algorithm": [
      "Input coefficients a, b, c. If a == 0, report linear equation error.",
      "Compute discriminant: d = b * b - 4 * a * c.",
      "If d > 0: root1 = (-b + sqrt(d)) / (2*a); root2 = (-b - sqrt(d)) / (2*a).",
      "If d == 0: root1 = -b / (2*a); roots are equal.",
      "If d < 0: realPart = -b / (2*a); imagPart = sqrt(-d) / (2*a); roots are realPart +- i * imagPart."
    ],
    "code": "#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    double a, b, c, discriminant, root1, root2, realPart, imagPart;\n\n    cout << \"Enter coefficients a, b and c: \";\n    if (!(cin >> a >> b >> c)) return 1;\n\n    if (a == 0) {\n        cout << \"Invalid: 'a' cannot be 0 for a quadratic equation.\" << endl;\n        return 1;\n    }\n\n    discriminant = b * b - 4 * a * c;\n\n    if (discriminant > 0) {\n        root1 = (-b + sqrt(discriminant)) / (2 * a);\n        root2 = (-b - sqrt(discriminant)) / (2 * a);\n        cout << \"Roots are real and different.\" << endl;\n        cout << \"Root 1 = \" << root1 << endl;\n        cout << \"Root 2 = \" << root2 << endl;\n    } else if (discriminant == 0) {\n        root1 = -b / (2 * a);\n        cout << \"Roots are real and identical.\" << endl;\n        cout << \"Root 1 = Root 2 = \" << root1 << endl;\n    } else {\n        realPart = -b / (2 * a);\n        imagPart = sqrt(-discriminant) / (2 * a);\n        cout << \"Roots are complex and distinct.\" << endl;\n        cout << \"Root 1 = \" << realPart << \" + \" << imagPart << \"i\" << endl;\n        cout << \"Root 2 = \" << realPart << \" - \" << imagPart << \"i\" << endl;\n    }\n\n    return 0;\n}",
    "sampleInput": "Enter coefficients a, b and c: 1 -5 6",
    "sampleOutput": "Roots are real and different.\nRoot 1 = 3\nRoot 2 = 2",
    "complexity": {
      "time": "O(1) constant arithmetic",
      "space": "O(1) stack variables"
    },
    "keyPoints": [
      "Avoid division by zero by verifying a != 0.",
      "sqrt(-discriminant) provides positive magnitude for imaginary components."
    ],
    "sourceFileName": "24CS310-OOP/OOP-Lab/lab 1 cycle.docx"
  },
  {
    "id": "cpp-lab-2",
    "number": "OOP Lab 2",
    "title": "Temperature Tabulation Matrix for 5 Cities over 6 Days",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "language": "cpp",
    "question": "The daily maximum temperatures recorded for 5 cities during the first 6 days of January month have to be tabulated. Write a C++ program to read the data and find the city and day corresponding to highest temperature and lowest temperature.",
    "concept": "Demonstrates 2D array representation and matrix traversal. Tracks simultaneous global maximum and minimum values along with row (city) and column (day) coordinates.",
    "algorithm": [
      "Declare matrix float temp[5][6] for 5 cities and 6 days.",
      "Initialize maxTemp and minTemp to temp[0][0].",
      "Traverse rows i from 0 to 4 and columns j from 0 to 5.",
      "If temp[i][j] > maxTemp: update maxTemp, maxCity = i + 1, maxDay = j + 1.",
      "If temp[i][j] < minTemp: update minTemp, minCity = i + 1, minDay = j + 1.",
      "Display formatted table, highest temperature with coordinates, and lowest temperature with coordinates."
    ],
    "code": "#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    const int CITIES = 5;\n    const int DAYS = 6;\n    double temp[CITIES][DAYS];\n\n    cout << \"Enter maximum temperatures for 5 cities across 6 days:\" << endl;\n    for (int i = 0; i < CITIES; i++) {\n        cout << \"Enter temperatures for City \" << i + 1 << \" (Days 1 to 6): \";\n        for (int j = 0; j < DAYS; j++) {\n            cin >> temp[i][j];\n        }\n    }\n\n    double maxTemp = temp[0][0];\n    double minTemp = temp[0][0];\n    int maxCity = 1, maxDay = 1;\n    int minCity = 1, minDay = 1;\n\n    for (int i = 0; i < CITIES; i++) {\n        for (int j = 0; j < DAYS; j++) {\n            if (temp[i][j] > maxTemp) {\n                maxTemp = temp[i][j];\n                maxCity = i + 1;\n                maxDay = j + 1;\n            }\n            if (temp[i][j] < minTemp) {\n                minTemp = temp[i][j];\n                minCity = i + 1;\n                minDay = j + 1;\n            }\n        }\n    }\n\n    cout << \"\\n============= TEMPERATURE TABULATION (C) =============\" << endl;\n    cout << setw(10) << \"City / Day\";\n    for (int d = 1; d <= DAYS; d++) cout << setw(8) << \"Day \" << d;\n    cout << endl;\n\n    for (int i = 0; i < CITIES; i++) {\n        cout << setw(10) << \"City \" << i + 1;\n        for (int j = 0; j < DAYS; j++) {\n            cout << setw(8) << fixed << setprecision(1) << temp[i][j];\n        }\n        cout << endl;\n    }\n\n    cout << \"\\n--- Temperature Analysis ---\" << endl;\n    cout << \"Highest Temperature: \" << maxTemp << \" C (Recorded in City \" << maxCity << \" on Day \" << maxDay << \")\" << endl;\n    cout << \"Lowest Temperature : \" << minTemp << \" C (Recorded in City \" << minCity << \" on Day \" << minDay << \")\" << endl;\n\n    return 0;\n}",
    "sampleInput": "Matrix of 30 temperature values for 5 cities across 6 days",
    "sampleOutput": "Highest Temperature: 36.5 C (Recorded in City 3 on Day 4)\nLowest Temperature : 12.0 C (Recorded in City 1 on Day 2)",
    "complexity": {
      "time": "O(CITIES * DAYS) = O(30) = O(1) bounded scan",
      "space": "O(CITIES * DAYS) 2D array matrix"
    },
    "keyPoints": [
      "Row-major order memory indexing.",
      "Formatted printing with <iomanip> setw() and setprecision()."
    ],
    "sourceFileName": "24CS310-OOP/OOP-Lab/lab 2 cycle.docx"
  }
];

export function getLabById(id: string): LabProgram | undefined {
  return LAB_PROGRAMS.find(l => l.id.toLowerCase() === id.toLowerCase());
}

export function getLabsBySubject(subjectCode: string): LabProgram[] {
  return LAB_PROGRAMS.filter(l => l.subjectCode.toLowerCase() === subjectCode.toLowerCase());
}
