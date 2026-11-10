import json

with open('c_programs_dump.json', 'r', encoding='utf-8') as f:
    c_codes = json.load(f)

labs = [
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
    "code": """#include <stdio.h>

int main() {
    int X;
    // P3 points to an integer (X)
    int *P3;
    // P2 points to a pointer to an integer (P3)
    int **P2;
    // P1 points to a pointer to a pointer to an integer (P2)
    int ***P1;

    printf("Enter value for X: ");
    if (scanf("%d", &X) != 1) return 1;

    // Establish the pointer chain
    P3 = &X;   // P3 points to the address of X
    P2 = &P3;  // P2 points to the address of P3
    P1 = &P2;  // P1 points to the address of P2

    // Retrieve the value of X using the pointer chain
    int retrieved_X = ***P1;

    printf("\\n--- Pointer Indirection Chain Results ---\\n");
    printf("Value of X: %d\\n", X);
    printf("Address of X (&X): %p\\n", (void*)&X);
    printf("Value stored in P3 (address of X): %p\\n", (void*)P3);
    printf("Value stored in P2 (address of P3): %p\\n", (void*)P2);
    printf("Value stored in P1 (address of P2): %p\\n", (void*)P1);
    printf("Value retrieved using ***P1: %d\\n", retrieved_X);

    return 0;
}""",
    "sampleInput": "Enter value for X: 42",
    "sampleOutput": """--- Pointer Indirection Chain Results ---
Value of X: 42
Address of X (&X): 0x7ffd9b8a1c3c
Value stored in P3 (address of X): 0x7ffd9b8a1c3c
Value stored in P2 (address of P3): 0x7ffd9b8a1c40
Value stored in P1 (address of P2): 0x7ffd9b8a1c48
Value retrieved using ***P1: 42""",
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
    "code": """#include <stdio.h>
#define MAX 10

int main() {
    int arr[MAX];
    int *ptr;
    int n, i;

    printf("Enter number of elements (max %d): ", MAX);
    if (scanf("%d", &n) != 1 || n <= 0 || n > MAX) return 1;

    ptr = arr; // Base address assignment

    printf("Enter %d integers:\\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", (ptr + i));
    }

    printf("\\nArray elements in forward order:\\n");
    for (i = 0; i < n; i++) {
        printf("%d (at %p)  ", *(ptr + i), (void*)(ptr + i));
    }

    printf("\\n\\nArray elements in reverse order:\\n");
    for (i = n - 1; i >= 0; i--) {
        printf("%d  ", *(ptr + i));
    }
    printf("\\n");

    return 0;
}""",
    "sampleInput": """Enter number of elements (max 10): 5
Enter 5 integers: 10 20 30 40 50""",
    "sampleOutput": """Array elements in forward order:
10 (at 0x7ffd10)  20 (at 0x7ffd14)  30 (at 0x7ffd18)  40 (at 0x7ffd1c)  50 (at 0x7ffd20)

Array elements in reverse order:
50  40  30  20  10""",
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
    "code": c_codes.get("StudentStructure.c", ""),
    "sampleInput": """Enter number of students: 2
Menu Choice: 1 (Read Students)
Student 1 Name: Rahul, Reg_no: 101, Marks: 18.5 19.0 16.0
Student 2 Name: Ananya, Reg_no: 102, Marks: 14.0 19.5 20.0
Menu Choice: 2 (Calculate Average)
Menu Choice: 3 (Display Information)""",
    "sampleOutput": """----------- STUDENT INFORMATION -----------
Student 1
Name : Rahul
Register No.   : 101
Test 1 Marks   : 18.50
Test 2 Marks   : 19.00
Test 3 Marks   : 16.00
Average (Best 2): 18.75

Student 2
Name : Ananya
Register No.   : 102
Test 1 Marks   : 14.00
Test 2 Marks   : 19.50
Test 3 Marks   : 20.00
Average (Best 2): 19.75""",
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
    "code": """#include <stdio.h>
#include <stdlib.h>

typedef struct Time {
    int hour;
    int minute;
    int second;
} Time;

// Normalize time (handles second and minute rollovers and 24-hr clock reset)
void normalizeTime(Time *t) {
    t->minute += t->second / 60;
    t->second %= 60;
    t->hour += t->minute / 60;
    t->minute %= 60;
    t->hour %= 24;
}

void readTime(Time *t) {
    printf("Enter hour (0-23): ");
    scanf("%d", &t->hour);
    printf("Enter minute (0-59): ");
    scanf("%d", &t->minute);
    printf("Enter second (0-59): ");
    scanf("%d", &t->second);
    normalizeTime(t);
}

void displayTime(Time t) {
    printf("%02d:%02d:%02d\\n", t.hour, t.minute, t.second);
}

void updateTime(Time *t) {
    t->second += 1;
    normalizeTime(t);
}

Time addTime(Time t1, Time t2) {
    Time res;
    res.hour = t1.hour + t2.hour;
    res.minute = t1.minute + t2.minute;
    res.second = t1.second + t2.second;
    normalizeTime(&res);
    return res;
}

int main() {
    Time T1 = {0, 0, 0}, T2 = {0, 0, 0}, T3;
    int choice;

    do {
        printf("\\n========== TIME MANAGEMENT MENU ==========\\n");
        printf("1. Read Time T1\\n");
        printf("2. Display Time T1\\n");
        printf("3. Update Time T1 (Increment by 1 sec)\\n");
        printf("4. Add Two Times (T1 + T2)\\n");
        printf("5. Exit\\n");
        printf("===========================================\\n");
        printf("Enter your choice: ");
        if (scanf("%d", &choice) != 1) break;

        switch (choice) {
            case 1:
                readTime(&T1);
                break;
            case 2:
                printf("Current Time T1: ");
                displayTime(T1);
                break;
            case 3:
                updateTime(&T1);
                printf("Updated Time T1 (+1s): ");
                displayTime(T1);
                break;
            case 4:
                printf("Enter second time (T2):\\n");
                readTime(&T2);
                T3 = addTime(T1, T2);
                printf("Resultant Added Time (T1 + T2): ");
                displayTime(T3);
                break;
            case 5:
                printf("Exiting...\\n");
                break;
            default:
                printf("Invalid choice!\\n");
        }
    } while (choice != 5);

    return 0;
}""",
    "sampleInput": """Choice: 1 (Read T1: 11 hrs, 59 mins, 59 secs)
Choice: 3 (Update T1)
Choice: 4 (Add T2: 02 hrs, 15 mins, 20 secs)""",
    "sampleOutput": """Current Time T1: 11:59:59
Updated Time T1 (+1s): 12:00:00
Resultant Added Time (T1 + T2): 14:15:20""",
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
    "code": c_codes.get("ArrayDMA.c", c_codes.get("ArrayOperationsStatic.c", "")),
    "sampleInput": """Enter size: 5, Elements: 10 20 30 40 50
Menu: Insert 25 at position 2
Menu: Delete element at position 4
Menu: Reverse array""",
    "sampleOutput": """After Insert by Position 2:
10  20  25  30  40  50

After Delete by Position 4:
10  20  25  30  50

After Reverse:
50  30  25  20  10""",
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
    "code": c_codes.get("SinglyLinkedList.c", ""),
    "sampleInput": """Operations:
1. Insert Front: 30
2. Insert Front: 20
3. Insert Front: 10
4. Insert Rear: 40
5. Delete Front
6. Display""",
    "sampleOutput": """List elements: 10 -> 20 -> 30 -> 40 -> NULL
Deleted element from front: 10
List elements: 20 -> 30 -> 40 -> NULL""",
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
    "code": c_codes.get("CircularDoubleLinkedListWithHeader.c", ""),
    "sampleInput": """Menu:
1. Insert 20 by order
2. Insert 10 by order
3. Insert 30 by order
4. Display""",
    "sampleOutput": """Header <-> 10 <-> 20 <-> 30 <-> (Back to Header)
Total nodes: 3""",
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
    "code": c_codes.get("CircularLinkedList.c", ""),
    "sampleInput": """Insert Front: 100
Insert Rear: 200
Insert Rear: 300
Display""",
    "sampleOutput": """Circular List: 100 -> 200 -> 300 -> (loops to 100)""",
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
    "code": c_codes.get("DoublyLinkedList.c", ""),
    "sampleInput": """Insert 10, 20, 30
Display Forward
Display Backward""",
    "sampleOutput": """Forward: NULL <- 10 <-> 20 <-> 30 -> NULL
Backward: NULL <- 30 <-> 20 <-> 10 -> NULL""",
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
    "code": c_codes.get("InfixToPostfixPrefix.c", c_codes.get("PostfixPrefixEvaluation.c", "")),
    "sampleInput": "Infix Expression: ((A + B) * C - (D - E)) ^ (F + G)",
    "sampleOutput": """Infix: ((A + B) * C - (D - E)) ^ (F + G)
Postfix: AB+C*DE--FG+^

Evaluation Test: 5 3 + 2 * 4 2 - -
Result: 14""",
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
    "code": c_codes.get("PostfixPrefixEvaluation.c", c_codes.get("InfixToPostfixPrefix.c", "")),
    "sampleInput": "Infix: (A + B) * (C - D)",
    "sampleOutput": """Infix: (A + B) * (C - D)
Prefix: * + A B - C D

Prefix Evaluation Test: - + * 2 3 4 5
Result: (2 * 3 + 4) - 5 = 5""",
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
    "code": c_codes.get("DoubleEndedQueue.c", c_codes.get("queue_DQ.c", "")),
    "sampleInput": """Deque Operations:
1. Insert Rear: 10
2. Insert Rear: 20
3. Insert Front: 5
4. Delete Rear
5. Display""",
    "sampleOutput": """Deque Contents: 5  10
Deleted from Rear: 20""",
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
    "code": c_codes.get("CircularQueue.c", c_codes.get("queue_cq.c", "")),
    "sampleInput": """Circular Queue (Max 3):
1. Enqueue 10
2. Enqueue 20
3. Enqueue 30
4. Dequeue (returns 10)
5. Enqueue 40 (wraps around to index 0)
6. Display""",
    "sampleOutput": """Dequeued: 10
Circular Queue Elements: 20  30  40
(Wrapped successfully into freed index 0)""",
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
    "code": """#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

struct Node* insert(struct Node* root, int key) {
    if (root == NULL) return createNode(key);
    if (key < root->data)
        root->left = insert(root->left, key);
    else if (key > root->data)
        root->right = insert(root->right, key);
    return root;
}

void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

void preorder(struct Node* root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorder(root->left);
        preorder(root->right);
    }
}

void postorder(struct Node* root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->data);
    }
}

int countNodes(struct Node* root) {
    if (root == NULL) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}

int findHeight(struct Node* root) {
    if (root == NULL) return 0;
    int lh = findHeight(root->left);
    int rh = findHeight(root->right);
    return (lh > rh ? lh : rh) + 1;
}

void findMaxWithParent(struct Node* root) {
    if (root == NULL) {
        printf("Tree is empty!\\n");
        return;
    }
    struct Node* parent = NULL;
    struct Node* curr = root;
    while (curr->right != NULL) {
        parent = curr;
        curr = curr->right;
    }
    printf("Maximum Key: %d\\n", curr->data);
    if (parent != NULL)
        printf("Parent Node: %d\\n", parent->data);
    else
        printf("Node is the Root (No parent)\\n");
}

int main() {
    struct Node* root = NULL;
    int choice, val, n, i;

    do {
        printf("\\n========== BST MENU ==========\\n");
        printf("1. Insert Elements\\n");
        printf("2. Inorder Traversal (Sorted)\\n");
        printf("3. Preorder Traversal\\n");
        printf("4. Postorder Traversal\\n");
        printf("5. Find Maximum Key & Parent\\n");
        printf("6. Total Node Count & Height\\n");
        printf("7. Exit\\n");
        printf("==============================\\n");
        printf("Choice: ");
        if (scanf("%d", &choice) != 1) break;

        switch (choice) {
            case 1:
                printf("How many keys to insert? ");
                scanf("%d", &n);
                printf("Enter %d integers:\\n", n);
                for (i = 0; i < n; i++) {
                    scanf("%d", &val);
                    root = insert(root, val);
                }
                break;
            case 2:
                printf("Inorder Traversal: ");
                inorder(root);
                printf("\\n");
                break;
            case 3:
                printf("Preorder Traversal: ");
                preorder(root);
                printf("\\n");
                break;
            case 4:
                printf("Postorder Traversal: ");
                postorder(root);
                printf("\\n");
                break;
            case 5:
                findMaxWithParent(root);
                break;
            case 6:
                printf("Total Nodes: %d\\n", countNodes(root));
                printf("Tree Height: %d\\n", findHeight(root));
                break;
            case 7:
                printf("Exiting BST module...\\n");
                break;
            default:
                printf("Invalid choice!\\n");
        }
    } while (choice != 7);

    return 0;
}""",
    "sampleInput": """Insert keys: 50, 30, 70, 20, 40, 60, 80
Choice 2 (Inorder)
Choice 5 (Find Max)
Choice 6 (Count & Height)""",
    "sampleOutput": """Inorder Traversal: 20 30 40 50 60 70 80
Maximum Key: 80
Parent Node: 70
Total Nodes: 7
Tree Height: 3""",
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
    "code": """#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left, *right;
};

struct Node* createNode(int value) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->data = value;
    n->left = n->right = NULL;
    return n;
}

struct Node* insert(struct Node* root, int key) {
    if (root == NULL) return createNode(key);
    if (key < root->data) root->left = insert(root->left, key);
    else if (key > root->data) root->right = insert(root->right, key);
    return root;
}

struct Node* minValueNode(struct Node* node) {
    struct Node* current = node;
    while (current && current->left != NULL)
        current = current->left;
    return current;
}

struct Node* deleteNode(struct Node* root, int key) {
    if (root == NULL) return root;

    if (key < root->data)
        root->left = deleteNode(root->left, key);
    else if (key > root->data)
        root->right = deleteNode(root->right, key);
    else {
        // Case 1: No child or Case 2: One child
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }

        // Case 3: Two children
        // Get inorder successor (smallest in the right subtree)
        struct Node* temp = minValueNode(root->right);
        root->data = temp->data;
        // Delete the inorder successor
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}

void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node* root = NULL;
    // Build tree: 50, 30, 20, 40, 70, 60, 80
    int keys[] = {50, 30, 20, 40, 70, 60, 80};
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);

    printf("Initial BST Inorder: ");
    inorder(root);
    printf("\\n");

    printf("\\n1. Deleting leaf node (20):\\n");
    root = deleteNode(root, 20);
    inorder(root);
    printf("\\n");

    printf("\\n2. Deleting node with one child (30):\\n");
    root = deleteNode(root, 30);
    inorder(root);
    printf("\\n");

    printf("\\n3. Deleting node with two children (50 - root):\\n");
    root = deleteNode(root, 50);
    inorder(root);
    printf("\\n");

    return 0;
}""",
    "sampleInput": "Delete keys: 20 (leaf), 30 (one child), 50 (two children)",
    "sampleOutput": """Initial BST Inorder: 20 30 40 50 60 70 80

1. Deleting leaf node (20):
30 40 50 60 70 80

2. Deleting node with one child (30):
40 50 60 70 80

3. Deleting node with two children (50 - root):
40 60 70 80""",
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
    "code": """#include <stdio.h>
#define MAX 10

int adj[MAX][MAX];
int visited[MAX];
int queue[MAX];
int front = 0, rear = -1;

void enqueue(int v) {
    queue[++rear] = v;
}

int dequeue() {
    return queue[front++];
}

int isQueueEmpty() {
    return front > rear;
}

void dfs(int v, int n) {
    visited[v] = 1;
    printf("%d ", v);
    for (int i = 0; i < n; i++) {
        if (adj[v][i] == 1 && !visited[i]) {
            dfs(i, n);
        }
    }
}

void bfs(int start, int n) {
    for (int i = 0; i < n; i++) visited[i] = 0;
    front = 0; rear = -1;

    enqueue(start);
    visited[start] = 1;

    printf("BFS Order: ");
    while (!isQueueEmpty()) {
        int curr = dequeue();
        printf("%d ", curr);

        for (int i = 0; i < n; i++) {
            if (adj[curr][i] == 1 && !visited[i]) {
                visited[i] = 1;
                enqueue(i);
            }
        }
    }
    printf("\\n");
}

int main() {
    int n, edges, u, v, start;

    printf("Enter number of vertices: ");
    if (scanf("%d", &n) != 1) return 1;

    printf("Enter number of edges: ");
    scanf("%d", &edges);

    // Initialize adjacency matrix
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            adj[i][j] = 0;

    printf("Enter edges (u v) 0-indexed:\\n");
    for (int i = 0; i < edges; i++) {
        scanf("%d %d", &u, &v);
        adj[u][v] = 1;
        adj[v][u] = 1; // Undirected
    }

    printf("Enter start vertex for traversals: ");
    scanf("%d", &start);

    for (int i = 0; i < n; i++) visited[i] = 0;
    printf("\\nDFS Order: ");
    dfs(start, n);
    printf("\\n");

    bfs(start, n);

    return 0;
}""",
    "sampleInput": """Vertices: 5, Edges: 5
Edges: 0 1, 0 2, 1 3, 1 4, 2 4
Start: 0""",
    "sampleOutput": """DFS Order: 0 1 3 4 2 
BFS Order: 0 1 2 3 4""",
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
    "code": """#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a, b, c, discriminant, root1, root2, realPart, imagPart;

    cout << "Enter coefficients a, b and c: ";
    if (!(cin >> a >> b >> c)) return 1;

    if (a == 0) {
        cout << "Invalid: 'a' cannot be 0 for a quadratic equation." << endl;
        return 1;
    }

    discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
        root1 = (-b + sqrt(discriminant)) / (2 * a);
        root2 = (-b - sqrt(discriminant)) / (2 * a);
        cout << "Roots are real and different." << endl;
        cout << "Root 1 = " << root1 << endl;
        cout << "Root 2 = " << root2 << endl;
    } else if (discriminant == 0) {
        root1 = -b / (2 * a);
        cout << "Roots are real and identical." << endl;
        cout << "Root 1 = Root 2 = " << root1 << endl;
    } else {
        realPart = -b / (2 * a);
        imagPart = sqrt(-discriminant) / (2 * a);
        cout << "Roots are complex and distinct." << endl;
        cout << "Root 1 = " << realPart << " + " << imagPart << "i" << endl;
        cout << "Root 2 = " << realPart << " - " << imagPart << "i" << endl;
    }

    return 0;
}""",
    "sampleInput": "Enter coefficients a, b and c: 1 -5 6",
    "sampleOutput": """Roots are real and different.
Root 1 = 3
Root 2 = 2""",
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
    "code": """#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    const int CITIES = 5;
    const int DAYS = 6;
    double temp[CITIES][DAYS];

    cout << "Enter maximum temperatures for 5 cities across 6 days:" << endl;
    for (int i = 0; i < CITIES; i++) {
        cout << "Enter temperatures for City " << i + 1 << " (Days 1 to 6): ";
        for (int j = 0; j < DAYS; j++) {
            cin >> temp[i][j];
        }
    }

    double maxTemp = temp[0][0];
    double minTemp = temp[0][0];
    int maxCity = 1, maxDay = 1;
    int minCity = 1, minDay = 1;

    for (int i = 0; i < CITIES; i++) {
        for (int j = 0; j < DAYS; j++) {
            if (temp[i][j] > maxTemp) {
                maxTemp = temp[i][j];
                maxCity = i + 1;
                maxDay = j + 1;
            }
            if (temp[i][j] < minTemp) {
                minTemp = temp[i][j];
                minCity = i + 1;
                minDay = j + 1;
            }
        }
    }

    cout << "\\n============= TEMPERATURE TABULATION (C) =============" << endl;
    cout << setw(10) << "City / Day";
    for (int d = 1; d <= DAYS; d++) cout << setw(8) << "Day " << d;
    cout << endl;

    for (int i = 0; i < CITIES; i++) {
        cout << setw(10) << "City " << i + 1;
        for (int j = 0; j < DAYS; j++) {
            cout << setw(8) << fixed << setprecision(1) << temp[i][j];
        }
        cout << endl;
    }

    cout << "\\n--- Temperature Analysis ---" << endl;
    cout << "Highest Temperature: " << maxTemp << " C (Recorded in City " << maxCity << " on Day " << maxDay << ")" << endl;
    cout << "Lowest Temperature : " << minTemp << " C (Recorded in City " << minCity << " on Day " << minDay << ")" << endl;

    return 0;
}""",
    "sampleInput": "Matrix of 30 temperature values for 5 cities across 6 days",
    "sampleOutput": """Highest Temperature: 36.5 C (Recorded in City 3 on Day 4)
Lowest Temperature : 12.0 C (Recorded in City 1 on Day 2)""",
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
]

code = '''import { LabProgram } from '../types';

export const LAB_PROGRAMS: LabProgram[] = ''' + json.dumps(labs, indent=2) + ''';

export function getLabById(id: string): LabProgram | undefined {
  return LAB_PROGRAMS.find(l => l.id.toLowerCase() === id.toLowerCase());
}

export function getLabsBySubject(subjectCode: string): LabProgram[] {
  return LAB_PROGRAMS.filter(l => l.subjectCode.toLowerCase() === subjectCode.toLowerCase());
}
'''

with open('src/data/labsData.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Generated src/data/labsData.ts with", len(labs), "lab programs.")
