import { LaboratoryCourse } from '../types';

export const LABORATORY_COURSES: LaboratoryCourse[] = [
  {
    id: 'ds',
    code: '24CS36L',
    title: 'Data Structures Laboratory',
    shortName: 'DS Lab',
    type: 'Standalone Laboratory',
    credits: '1.5 Credits (L:0, T:0, P:3)',
    cieMarks: 40,
    seeMarks: 60,
    totalMarks: 100,
    contactHours: '45 Practical Hours',
    description: 'Practical implementation of primitive and abstract data structures in C. Focuses on pointers, dynamic memory allocation, linear structures (Stacks, Queues, Linked Lists), and non-linear structures (Binary Search Trees, Heaps, Graphs).',
    prerequisites: 'C Programming, Pointers, and Basic Memory Architecture',
    courseOutcomes: [
      { co: 'CO1', text: 'Implement programs to illustrate the use of pointers to arrays, structures and functions.', level: 'L3' },
      { co: 'CO2', text: 'Implement operations on Linear lists with Array and Linked list representations and analyze performance.', level: 'L3' },
      { co: 'CO3', text: 'Implement Stacks, Queues, Trees, and Graphs with static or dynamic memory allocation, and use stacks for expression evaluation.', level: 'L3' }
    ],
    recordsAndManuals: [
      {
        id: 'ds-record-pdf',
        title: 'DS Master Laboratory Record',
        description: 'Authentic student laboratory record (53.2 MB) containing all verified practical implementations, memory layout diagrams, pointers to structures, linked lists, stacks, and tree traversals.',
        filename: 'DS Record.pdf',
        relPath: '24CS36L-DS-Lab/DS Record.pdf',
        url: '/raw-pdf/24CS36L-DS-Lab/DS%20Record.pdf',
        sizeFormatted: '53.17 MB',
        pages: 'Complete Practical Record',
        badge: 'Official Master Record',
        format: 'pdf'
      },
      {
        id: 'ds-lab-syllabus-pdf',
        title: 'Official 24CS36L Laboratory Syllabus',
        description: 'Complete autonomous syllabus document detailing weekly program schedule, CO-PO alignments, CIE assessment rubric, and SEE laboratory exam pattern.',
        filename: 'Syllabus-24CS36L-DS Lab.pdf',
        relPath: '24CS36L-DS-Lab/Syllabus-24CS36L-DS Lab.pdf',
        url: '/raw-pdf/24CS36L-DS-Lab/Syllabus-24CS36L-DS%20Lab.pdf',
        sizeFormatted: '885 KB',
        pages: 'Syllabus & Guidelines',
        badge: 'JSS STU Syllabus',
        format: 'pdf'
      },
      {
        id: 'ds-scheme-syllabus-pdf',
        title: 'Departmental DS Lab Curriculum Spec',
        description: 'Official department syllabus scheme extracted from 01.Syllabus-26 for 3rd semester computer science.',
        filename: 'DS-lab.pdf',
        relPath: '01.Syllabus-26/DS-lab.pdf',
        url: '/raw-pdf/01.Syllabus-26/DS-lab.pdf',
        sizeFormatted: '1.30 MB',
        pages: 'Curriculum Scheme',
        badge: 'Scheme Reference',
        format: 'pdf'
      }
    ],
    experiments: [
      {
        id: 'ds-lab-1a',
        number: 'Experiment 1a',
        title: 'Triple Pointer Chain (P1 -> P2 -> P3 -> X)',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Create 3 pointers called P1, P2, P3 and an integer variable X where P1 points to P2, P2 points to P3 and P3 points to X. Demonstrate how to read and retrieve the value of X using P1, P2 and P3.',
        concept: 'Demonstrates multi-level pointer indirection. Variable X has a memory address. Pointer P3 holds &X. Pointer P2 holds &P3. Pointer P1 holds &P2. Dereferencing ***P1 resolves three memory hops to access the base integer.',
        algorithm: [
          'Declare int X, int *P3, int **P2, and int ***P1.',
          'Assign P3 = &X, P2 = &P3, P1 = &P2.',
          'Read integer value into X.',
          'Retrieve value using ***P1 by cascading dereferences: *P1 yields P2, **P1 yields P3, ***P1 yields X.',
          'Print original value and retrieved pointer chain values.'
        ],
        code: `#include <stdio.h>

int main() {
    int X;
    int *P3;    // Pointer to integer
    int **P2;   // Pointer to pointer to integer
    int ***P1;  // Pointer to pointer to pointer to integer

    printf("Enter value for X: ");
    if (scanf("%d", &X) != 1) return 1;

    // Establish the pointer chain
    P3 = &X;   // P3 points to address of X
    P2 = &P3;  // P2 points to address of P3
    P1 = &P2;  // P1 points to address of P2

    // Retrieve value using triple indirection
    int retrieved_X = ***P1;

    printf("\\n--- Pointer Indirection Chain Results ---\\n");
    printf("Value of X: %d\\n", X);
    printf("Address of X (&X): %p\\n", (void*)&X);
    printf("Value stored in P3 (address of X): %p\\n", (void*)P3);
    printf("Value stored in P2 (address of P3): %p\\n", (void*)P2);
    printf("Value stored in P1 (address of P2): %p\\n", (void*)P1);
    printf("Value retrieved using ***P1: %d\\n", retrieved_X);

    return 0;
}`,
        sampleInput: 'Enter value for X: 42',
        sampleOutput: 'Value of X: 42\nValue retrieved using ***P1: 42',
        complexity: { time: 'O(1) constant time', space: 'O(1) auxiliary variables' },
        keyPoints: [
          'Pointer to pointer indirection is fundamental to dynamic 2D arrays and linked lists.',
          'Always verify pointer indirection levels match to avoid memory faults.'
        ],
        sourceFileName: '24CS36L-DS-Lab/Pgm 1.pdf',
        relatedPdfId: 'pdf-24cs36l-ds-lab-pgm-1',
        relatedPdfUrl: '/raw-pdf/24CS36L-DS-Lab/Pgm%201.pdf',
        relatedPdfTitle: 'Pgm 1.pdf'
      },
      {
        id: 'ds-lab-1b',
        number: 'Experiment 1b',
        title: 'Array Traversal & In-Place Reversal via Pointers',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Create a pointer to an integer array, read and display the contents using pointer, and also display the contents in reverse order using pointer.',
        concept: 'Arrays in C evaluate to the base address of element 0. Pointer arithmetic *(ptr + i) increments the memory address by i * sizeof(element), allowing forward and backward traversals without array indexing syntax.',
        algorithm: [
          'Declare integer array arr[MAX] and integer pointer ptr.',
          'Assign ptr = arr.',
          'Read N integers using scanf("%d", ptr + i).',
          'Display forward order from i = 0 to N-1 using *(ptr + i).',
          'Display reverse order from i = N-1 down to 0 using *(ptr + i).'
        ],
        code: `#include <stdio.h>
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

    printf("\\nArray in forward order:\\n");
    for (i = 0; i < n; i++) {
        printf("%d ", *(ptr + i));
    }

    printf("\\n\\nArray in reverse order:\\n");
    for (i = n - 1; i >= 0; i--) {
        printf("%d ", *(ptr + i));
    }
    printf("\\n");

    return 0;
}`,
        sampleInput: 'Enter number of elements: 5\nEnter 5 integers: 10 20 30 40 50',
        sampleOutput: 'Array in forward order:\n10 20 30 40 50\nArray in reverse order:\n50 40 30 20 10',
        complexity: { time: 'O(N) linear pass', space: 'O(1) auxiliary pointer' },
        keyPoints: [
          'ptr + i advances by i * sizeof(int) bytes.',
          'Base address arr is a constant pointer; ptr can be incremented.'
        ],
        sourceFileName: '24CS36L-DS-Lab/Pgm 1.pdf',
        relatedPdfId: 'pdf-24cs36l-ds-lab-pgm-1',
        relatedPdfUrl: '/raw-pdf/24CS36L-DS-Lab/Pgm%201.pdf',
        relatedPdfTitle: 'Pgm 1.pdf'
      },
      {
        id: 'ds-lab-2',
        number: 'Experiment 2',
        title: 'Student Database with Dynamic Struct Pointers & Best-of-2 Average',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Define a structure called Student with members: Name, Reg_no, marks in 3 tests and average_marks. Develop a menu driven program to perform: a) read information of N students b) display student information c) calculate average of best two test marks of each student using pointer to dynamically allocated array of structures.',
        concept: 'Demonstrates dynamic memory allocation for structures via malloc. Structure pointer access uses the arrow operator (->). Best-of-two average identifies the minimum mark of 3 tests and averages the remaining two: (m1 + m2 + m3 - min) / 2.0.',
        algorithm: [
          'Define struct Student with name, reg_no, marks[3], average_marks.',
          'Allocate dynamic memory: struct Student *p = malloc(n * sizeof(struct Student)).',
          'Read N students details using pointer arithmetic (p + i)->member.',
          'For each student, find minimum among marks[0], marks[1], marks[2].',
          'Calculate average_marks = (marks[0] + marks[1] + marks[2] - min) / 2.0.',
          'Display tabulated student results.'
        ],
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Student {
    char Name[30];
    int Reg_no;
    float marks[3];
    float average_marks;
};

void readStudents(struct Student *p, int n) {
    for (int i = 0; i < n; i++) {
        printf("\\nEnter details of Student %d:\\n", i + 1);
        printf("Name: ");
        scanf("%s", (p + i)->Name);
        printf("Register Number: ");
        scanf("%d", &(p + i)->Reg_no);
        printf("Enter 3 test marks: ");
        for (int j = 0; j < 3; j++) {
            scanf("%f", &(p + i)->marks[j]);
        }
    }
}

void calculateAverage(struct Student *p, int n) {
    for (int i = 0; i < n; i++) {
        float min = (p + i)->marks[0];
        float sum = (p + i)->marks[0];
        for (int j = 1; j < 3; j++) {
            sum += (p + i)->marks[j];
            if ((p + i)->marks[j] < min) {
                min = (p + i)->marks[j];
            }
        }
        (p + i)->average_marks = (sum - min) / 2.0f;
    }
}

void displayStudents(struct Student *p, int n) {
    printf("\\n--- Student Academic Performance ---\\n");
    for (int i = 0; i < n; i++) {
        printf("Reg No: %d | Name: %s | Marks: %.1f, %.1f, %.1f | Best-of-2 Avg: %.2f\\n",
            (p + i)->Reg_no, (p + i)->Name,
            (p + i)->marks[0], (p + i)->marks[1], (p + i)->marks[2],
            (p + i)->average_marks);
    }
}

int main() {
    int n;
    printf("Enter number of students: ");
    if (scanf("%d", &n) != 1 || n <= 0) return 1;

    struct Student *students = (struct Student *)malloc(n * sizeof(struct Student));
    if (!students) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    readStudents(students, n);
    calculateAverage(students, n);
    displayStudents(students, n);

    free(students);
    return 0;
}`,
        sampleInput: 'Enter number of students: 2\nStudent 1: Alice, 101, 18 20 15\nStudent 2: Bob, 102, 12 19 17',
        sampleOutput: 'Reg No: 101 | Name: Alice | Best-of-2 Avg: 19.00\nReg No: 102 | Name: Bob | Best-of-2 Avg: 18.00',
        complexity: { time: 'O(N) time for processing N students', space: 'O(N) dynamic heap allocation' },
        keyPoints: [
          'Always free dynamically allocated memory to prevent memory leaks.',
          'Using (sum - min)/2.0 computes best-of-2 in constant time per student.'
        ],
        sourceFileName: '24CS36L-DS-Lab/Pgm 2_New.docx'
      },
      {
        id: 'ds-lab-3',
        number: 'Experiment 3',
        title: 'Stack Operations (Push, Pop, Peek, Display) with Array',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Develop a menu-driven program in C to implement Stack operations (Push, Pop, Peek, Display) using an array. Demonstrate Overflow and Underflow conditions.',
        concept: 'A Stack is a Last-In First-Out (LIFO) linear data structure. Elements are added and removed from the top pointer. Pushing beyond capacity causes Overflow; popping from an empty stack causes Underflow.',
        algorithm: [
          'Initialize top = -1 and capacity MAX.',
          'Push: If top == MAX - 1, output Overflow; otherwise increment top and store item.',
          'Pop: If top == -1, output Underflow; otherwise return stack[top] and decrement top.',
          'Peek: Return stack[top] without removing.',
          'Display: Traverse from top down to 0.'
        ],
        code: `#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow! Cannot push %d\\n", val);
        return;
    }
    stack[++top] = val;
    printf("Pushed %d onto stack\\n", val);
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow! Stack is empty\\n");
        return -1;
    }
    return stack[top--];
}

void display() {
    if (top == -1) {
        printf("Stack is empty\\n");
        return;
    }
    printf("Stack elements (top to bottom): ");
    for (int i = top; i >= 0; i--) {
        printf("%d ", stack[i]);
    }
    printf("\\n");
}

int main() {
    push(10);
    push(20);
    push(30);
    display();
    printf("Popped element: %d\\n", pop());
    display();
    return 0;
}`,
        sampleInput: 'Menu options: 1. Push 2. Pop 3. Display 4. Exit',
        sampleOutput: 'Pushed 10\nPushed 20\nPushed 30\nStack elements: 30 20 10\nPopped element: 30',
        complexity: { time: 'O(1) for push, pop, and peek', space: 'O(MAX) static array' },
        sourceFileName: '24CS36L-DS-Lab/Program 3.pdf',
        relatedPdfId: 'pdf-24cs36l-ds-lab-program-3',
        relatedPdfUrl: '/raw-pdf/24CS36L-DS-Lab/Program%203.pdf',
        relatedPdfTitle: 'Program 3.pdf'
      },
      {
        id: 'ds-lab-4',
        number: 'Experiment 4',
        title: 'Infix to Postfix Conversion & Postfix Expression Evaluation',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Design a program in C to convert a valid infix expression to a postfix expression using a character stack, and evaluate the resulting postfix expression.',
        concept: 'Uses Dijkstra Shunting-yard algorithm for infix to postfix conversion. Operands are output directly; operators are pushed based on precedence and associativity. Parentheses enforce evaluation order. Postfix evaluation uses an operand stack.',
        algorithm: [
          'Scan infix expression from left to right.',
          'If operand, append to postfix output.',
          'If opening parenthesis "(", push to operator stack.',
          'If closing parenthesis ")", pop and output operators until "(" is encountered.',
          'If operator, pop operators of greater or equal precedence, then push current operator.',
          'Evaluate postfix: scan tokens; push operands; for operator, pop 2 operands, compute result, and push back.'
        ],
        code: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    if (op == '^') return 3;
    return 0;
}

void infixToPostfix(char *infix, char *postfix) {
    char stack[100];
    int top = -1, k = 0;

    for (int i = 0; infix[i] != '\\0'; i++) {
        char ch = infix[i];
        if (isalnum(ch)) {
            postfix[k++] = ch;
        } else if (ch == '(') {
            stack[++top] = ch;
        } else if (ch == ')') {
            while (top != -1 && stack[top] != '(') {
                postfix[k++] = stack[top--];
            }
            if (top != -1) top--; // Pop '('
        } else {
            while (top != -1 && precedence(stack[top]) >= precedence(ch)) {
                postfix[k++] = stack[top--];
            }
            stack[++top] = ch;
        }
    }
    while (top != -1) {
        postfix[k++] = stack[top--];
    }
    postfix[k] = '\\0';
}

int main() {
    char infix[] = "((A+B)*C)-D";
    char postfix[100];
    infixToPostfix(infix, postfix);
    printf("Infix Expression  : %s\\n", infix);
    printf("Postfix Expression: %s\\n", postfix);
    return 0;
}`,
        sampleInput: 'Infix: ((A+B)*C)-D',
        sampleOutput: 'Postfix: AB+C*D-',
        complexity: { time: 'O(N) linear time scan', space: 'O(N) operator stack' },
        sourceFileName: '24CS36L-DS-Lab/Program 4.pdf',
        relatedPdfId: 'pdf-24cs36l-ds-lab-program-4',
        relatedPdfUrl: '/raw-pdf/24CS36L-DS-Lab/Program%204.pdf',
        relatedPdfTitle: 'Program 4.pdf'
      },
      {
        id: 'ds-lab-5',
        number: 'Experiment 5',
        title: 'Singly Linked List (Insert Front/Rear, Delete, Search, Display)',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Implement a singly linked list in C supporting node insertion at front, insertion at rear, deletion of a node by key value, linear search, and list traversal.',
        concept: 'Singly linked list is a linear collection of nodes where each node contains data and a pointer to the next node. Allows dynamic sizing without memory reallocation.',
        algorithm: [
          'Create node structure with int data and struct Node *next.',
          'Insert Front: allocate node, set next = head, update head.',
          'Insert Rear: allocate node, traverse to last node, link last->next = new_node.',
          'Delete Key: find key, update predecessor->next = current->next, free current node.',
          'Display: traverse from head printing each node until NULL.'
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node* createNode(int data) {
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

struct Node* insertFront(struct Node *head, int data) {
    struct Node *newNode = createNode(data);
    newNode->next = head;
    return newNode;
}

struct Node* insertRear(struct Node *head, int data) {
    struct Node *newNode = createNode(data);
    if (!head) return newNode;
    struct Node *temp = head;
    while (temp->next) temp = temp->next;
    temp->next = newNode;
    return head;
}

void display(struct Node *head) {
    struct Node *temp = head;
    printf("List: ");
    while (temp) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node *head = NULL;
    head = insertFront(head, 20);
    head = insertFront(head, 10);
    head = insertRear(head, 30);
    display(head);
    return 0;
}`,
        sampleInput: 'Insert front 20, Insert front 10, Insert rear 30',
        sampleOutput: 'List: 10 -> 20 -> 30 -> NULL',
        complexity: { time: 'O(1) Insert Front, O(N) Insert Rear & Search', space: 'O(N) heap allocations' },
        sourceFileName: '24CS36L-DS-Lab/Program 5.docx'
      },
      {
        id: 'ds-lab-6',
        number: 'Experiment 6',
        title: 'Circular Queue Implementation with Array',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Implement a circular queue using an array in C. Support Enqueue, Dequeue, and Display operations with modulo arithmetic to prevent memory wastage of linear queues.',
        concept: 'Circular queue connects rear back to front using modulo operator (rear + 1) % MAX, allowing reused empty slots from previous dequeue operations.',
        algorithm: [
          'Initialize front = -1, rear = -1.',
          'Enqueue: Check if (rear + 1) % MAX == front (Queue Full). Otherwise update rear = (rear + 1) % MAX and store item.',
          'Dequeue: Check if front == -1 (Queue Empty). If front == rear, reset to -1; otherwise front = (front + 1) % MAX.',
          'Display: Loop from front to rear using modulo indexing.'
        ],
        code: `#include <stdio.h>
#define SIZE 5

int queue[SIZE];
int front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % SIZE == front) {
        printf("Queue is Full!\\n");
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % SIZE;
    queue[rear] = val;
    printf("Enqueued %d\\n", val);
}

int dequeue() {
    if (front == -1) {
        printf("Queue is Empty!\\n");
        return -1;
    }
    int val = queue[front];
    if (front == rear) {
        front = rear = -1;
    } else {
        front = (front + 1) % SIZE;
    }
    return val;
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    printf("Dequeued: %d\\n", dequeue());
    enqueue(40);
    return 0;
}`,
        sampleInput: 'Enqueue 10, 20, 30; Dequeue; Enqueue 40',
        sampleOutput: 'Enqueued 10\nEnqueued 20\nEnqueued 30\nDequeued: 10\nEnqueued 40',
        complexity: { time: 'O(1) Enqueue and Dequeue', space: 'O(SIZE) static memory' },
        sourceFileName: '24CS36L-DS-Lab/DS Record.pdf'
      },
      {
        id: 'ds-lab-7',
        number: 'Experiment 7',
        title: 'Doubly Linked List with Bidirectional Traversal',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Design a doubly linked list in C. Implement forward traversal, backward traversal, and node deletion by value.',
        concept: 'Each node has prev, data, and next pointers. Enables bidirectional traversal and O(1) node deletion when the node pointer is known.',
        algorithm: [
          'Create struct Node with prev, data, next pointers.',
          'Insert at end linking new node prev to current tail.',
          'Traverse forward using temp->next until NULL.',
          'Traverse backward starting from tail using temp->prev until NULL.'
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *prev;
    struct Node *next;
};

struct Node* insertEnd(struct Node *head, int data) {
    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    if (!head) {
        newNode->prev = NULL;
        return newNode;
    }
    struct Node *temp = head;
    while (temp->next) temp = temp->next;
    temp->next = newNode;
    newNode->prev = temp;
    return head;
}

void printForward(struct Node *head) {
    printf("Forward: ");
    while (head) {
        printf("%d ", head->data);
        head = head->next;
    }
    printf("\\n");
}

int main() {
    struct Node *head = NULL;
    head = insertEnd(head, 100);
    head = insertEnd(head, 200);
    head = insertEnd(head, 300);
    printForward(head);
    return 0;
}`,
        sampleInput: 'Insert 100, 200, 300',
        sampleOutput: 'Forward: 100 200 300',
        complexity: { time: 'O(1) insertion at head/tail with pointers, O(N) traversal', space: 'O(N) memory' },
        sourceFileName: '24CS36L-DS-Lab/DS Record.pdf'
      },
      {
        id: 'ds-lab-8',
        number: 'Experiment 8',
        title: 'Binary Search Tree (BST) Creation & Traversals',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Construct a Binary Search Tree (BST) from given keys and perform recursive Inorder, Preorder, and Postorder traversals.',
        concept: 'BST property: left subtree keys < node key < right subtree keys. Inorder traversal yields sorted ascending order.',
        algorithm: [
          'Recursive Insert: if root is NULL return new node; if key < root->data insert in left; else insert in right.',
          'Inorder: Inorder(left), print node, Inorder(right).',
          'Preorder: print node, Preorder(left), Preorder(right).',
          'Postorder: Postorder(left), Postorder(right), print node.'
        ],
        code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node* insert(struct Node *node, int key) {
    if (!node) {
        struct Node *temp = (struct Node *)malloc(sizeof(struct Node));
        temp->data = key;
        temp->left = temp->right = NULL;
        return temp;
    }
    if (key < node->data) node->left = insert(node->left, key);
    else if (key > node->data) node->right = insert(node->right, key);
    return node;
}

void inorder(struct Node *root) {
    if (root) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node *root = NULL;
    int keys[] = {50, 30, 20, 40, 70, 60, 80};
    for (int i = 0; i < 7; i++) root = insert(root, keys[i]);
    printf("Inorder traversal: ");
    inorder(root);
    printf("\\n");
    return 0;
}`,
        sampleInput: 'Keys: 50, 30, 20, 40, 70, 60, 80',
        sampleOutput: 'Inorder traversal: 20 30 40 50 60 70 80',
        complexity: { time: 'O(log N) average search/insert, O(N) worst case', space: 'O(H) recursion stack' },
        sourceFileName: '24CS36L-DS-Lab/DS Record.pdf'
      },
      {
        id: 'ds-lab-9',
        number: 'Experiment 9',
        title: 'Priority Queue using Max-Heap',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Implement a priority queue using a binary max-heap in C. Demonstrate Insert and Extract-Max operations.',
        concept: 'In a max-heap, every parent is >= its children. Root always contains maximum priority element. Insert uses bottom-up heapify; extract-max replaces root with last element and runs top-down heapify.',
        algorithm: [
          'Insert: Place at heap[size], bubble up while parent < child.',
          'Extract-Max: Save root, copy heap[size-1] to root, decrease size, heapify down.',
          'Heapify: compare root with left and right children; swap with largest and recurse.'
        ],
        code: `#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

int extractMax(int arr[], int *n) {
    if (*n <= 0) return -1;
    int root = arr[0];
    arr[0] = arr[*n - 1];
    (*n)--;
    heapify(arr, *n, 0);
    return root;
}

int main() {
    int heap[10] = {100, 80, 60, 50, 70};
    int n = 5;
    printf("Max element extracted: %d\\n", extractMax(heap, &n));
    printf("New root: %d\\n", heap[0]);
    return 0;
}`,
        sampleInput: 'Heap: [100, 80, 60, 50, 70]',
        sampleOutput: 'Max element extracted: 100\nNew root: 80',
        complexity: { time: 'O(log N) for insert and extract-max', space: 'O(1) auxiliary array' },
        sourceFileName: '24CS36L-DS-Lab/DS Record.pdf'
      },
      {
        id: 'ds-lab-10',
        number: 'Experiment 10',
        title: 'Graph Traversals: Breadth First Search (BFS) & Depth First Search (DFS)',
        subjectCode: '24CS36L',
        subjectName: 'Data Structures Lab',
        language: 'c',
        question: 'Represent an undirected graph using an adjacency matrix and implement BFS using a queue and DFS using recursion/stack to test connectivity.',
        concept: 'BFS visits vertices level by level using FIFO queue. DFS explores as deep as possible along each branch before backtracking. Both maintain a visited array.',
        algorithm: [
          'Input adjacency matrix adj[N][N] and starting vertex.',
          'BFS: Mark start visited, enqueue start. While queue not empty, dequeue u, visit all unvisited neighbors v, mark visited, enqueue v.',
          'DFS: Mark start visited, print start. For every unvisited neighbor v, recursively call DFS(v).'
        ],
        code: `#include <stdio.h>
#define MAX 10

int adj[MAX][MAX], visited[MAX], n;

void bfs(int start) {
    int queue[MAX], front = 0, rear = 0;
    for (int i = 0; i < n; i++) visited[i] = 0;
    visited[start] = 1;
    queue[rear++] = start;

    printf("BFS Order: ");
    while (front < rear) {
        int u = queue[front++];
        printf("%d ", u);
        for (int v = 0; v < n; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                queue[rear++] = v;
            }
        }
    }
    printf("\\n");
}

int main() {
    n = 4;
    int edges[4][4] = {
        {0, 1, 1, 0},
        {1, 0, 0, 1},
        {1, 0, 0, 1},
        {0, 1, 1, 0}
    };
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            adj[i][j] = edges[i][j];

    bfs(0);
    return 0;
}`,
        sampleInput: '4 vertices with edges (0-1), (0-2), (1-3), (2-3)',
        sampleOutput: 'BFS Order: 0 1 2 3',
        complexity: { time: 'O(V^2) with adjacency matrix, O(V + E) with adjacency list', space: 'O(V) visited array' },
        sourceFileName: '24CS36L-DS-Lab/DS Record.pdf'
      }
    ],
    supportingDocuments: [
      {
        id: 'ds-sup-1',
        title: 'Program 1 Pointer Notes',
        filename: 'Pgm 1.pdf',
        relPath: '24CS36L-DS-Lab/Pgm 1.pdf',
        url: '/raw-pdf/24CS36L-DS-Lab/Pgm%201.pdf',
        sizeFormatted: '75.6 KB',
        format: 'pdf',
        description: 'Original assignment handout for pointer indirection and array traversal via pointers.',
        relatedExperimentNumber: 'Experiment 1'
      },
      {
        id: 'ds-sup-2',
        title: 'Program 2 Dynamic Structures Specification',
        filename: 'Pgm 2_New.docx',
        relPath: '24CS36L-DS-Lab/Pgm 2_New.docx',
        url: '/raw-pdf/24CS36L-DS-Lab/Pgm%202_New.docx',
        sizeFormatted: '17 KB',
        format: 'docx',
        description: 'Student structure definition, dynamic array allocation, and best-of-2 marks calculation specification.',
        relatedExperimentNumber: 'Experiment 2'
      },
      {
        id: 'ds-sup-3',
        title: 'Program 3 Stack Specification',
        filename: 'Program 3.pdf',
        relPath: '24CS36L-DS-Lab/Program 3.pdf',
        url: '/raw-pdf/24CS36L-DS-Lab/Program%203.pdf',
        sizeFormatted: '39.2 KB',
        format: 'pdf',
        description: 'Stack array operations specification and overflow/underflow handling.',
        relatedExperimentNumber: 'Experiment 3'
      },
      {
        id: 'ds-sup-4',
        title: 'Program 4 Infix to Postfix Specification',
        filename: 'Program 4.pdf',
        relPath: '24CS36L-DS-Lab/Program 4.pdf',
        url: '/raw-pdf/24CS36L-DS-Lab/Program%204.pdf',
        sizeFormatted: '51.5 KB',
        format: 'pdf',
        description: 'Expression conversion and evaluation using operator stack.',
        relatedExperimentNumber: 'Experiment 4'
      },
      {
        id: 'ds-sup-5',
        title: 'Program 5 Singly Linked List Implementation',
        filename: 'Program 5.docx',
        relPath: '24CS36L-DS-Lab/Program 5.docx',
        url: '/raw-pdf/24CS36L-DS-Lab/Program%205.docx',
        sizeFormatted: '19.8 KB',
        format: 'docx',
        description: 'Full C code and node functions for singly linked list operations.',
        relatedExperimentNumber: 'Experiment 5'
      },
      {
        id: 'ds-sup-6',
        title: 'DS Lab Test 1 Question Paper (2024)',
        filename: '24CS36L - Data Strctures Lab Test 1.pdf',
        relPath: 'PYQ-24/24CS36L - Data Strctures Lab Test 1.pdf',
        url: '/raw-pdf/PYQ-24/24CS36L%20-%20Data%20Strctures%20Lab%20Test%201.pdf',
        sizeFormatted: '317 KB',
        format: 'pdf',
        description: 'Official continuous internal evaluation (CIE) test question paper for DS Lab.'
      }
    ]
  },
  {
    id: 'dsd',
    code: '24CS320',
    title: 'Digital System Design Laboratory',
    shortName: 'DSD Lab',
    type: 'Integrated Practical Course',
    credits: 'Integrated Practical Component (L:3, T:0, P:2)',
    cieMarks: 40,
    seeMarks: 60,
    totalMarks: 100,
    contactHours: '30 Practical Hours',
    description: 'Hardware realization and simulation of combinational and sequential digital logic circuits using 74xx TTL ICs, digital trainer kits, and breadboard wiring.',
    prerequisites: 'Basic Electrical Sciences, Boolean Algebra, Binary Number Systems',
    courseOutcomes: [
      { co: 'CO1', text: 'Realize and verify truth tables of fundamental logic gates and universal gates (NAND, NOR).', level: 'L3' },
      { co: 'CO2', text: 'Design and test combinational circuits: Adders, Subtractors, Code Converters, Multiplexers, and Priority Encoders.', level: 'L4' },
      { co: 'CO3', text: 'Implement and analyze sequential circuits: Flip-Flops, Counters, and Shift Registers using IC 74xx.', level: 'L4' }
    ],
    recordsAndManuals: [
      {
        id: 'dsd-record-pdf',
        title: 'DSD Master Laboratory Record',
        description: 'Complete student laboratory record (20.5 MB) containing handwritten IC pinouts, Karnaugh map derivations, circuit wiring schematics, and verified observation tables.',
        filename: 'DSD record.pdf',
        relPath: '24CS320-DSD/DSD-LAB/DSD record.pdf',
        url: '/raw-pdf/24CS320-DSD/DSD-LAB/DSD%20record.pdf',
        sizeFormatted: '20.49 MB',
        pages: 'Complete Practical Record',
        badge: 'Official Master Record',
        format: 'pdf'
      },
      {
        id: 'dsd-manual-pdf',
        title: 'DSD Official Laboratory Manual',
        description: 'Official departmental 30-page laboratory manual detailing IC pin assignments for 7408, 7432, 7404, 7400, 7402, 7486, 7483, 74148, 74153, 7474, and 7495.',
        filename: 'lab-manual.pdf',
        relPath: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        url: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        sizeFormatted: '2.58 MB',
        pages: '30 Pages • JSS STU CSE',
        badge: 'Official Manual',
        format: 'pdf'
      }
    ],
    experiments: [
      {
        id: 'dsd-exp-1',
        number: 'Experiment 1',
        title: 'Study & Verification of Logic Gates and Universal Realization',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'a) Study and verify the truth table of logic gates using IC 7408 (AND), IC 7432 (OR), IC 7404 (NOT), IC 7400 (NAND), IC 7402 (NOR), IC 7486 (XOR). b) Realize basic gates using Universal Gates (NAND / NOR). c) Simplify given expressions and realize with gates.',
        concept: 'TTL logic family uses standard 5V VCC and Ground pin 7/14. NAND and NOR gates are universal because any Boolean function can be realized using only NAND or only NOR gates.',
        hardwareDetails: [
          'IC 7408: Quad 2-Input AND Gate',
          'IC 7432: Quad 2-Input OR Gate',
          'IC 7404: Hex Inverter (NOT)',
          'IC 7400: Quad 2-Input NAND Gate',
          'IC 7402: Quad 2-Input NOR Gate',
          'IC 7486: Quad 2-Input XOR Gate',
          'Digital Logic Trainer Kit, DC Power Supply (+5V), Patch Cords'
        ],
        algorithm: [
          'Insert the IC into the trainer kit socket with notch facing left.',
          'Connect Pin 14 to +5V VCC and Pin 7 to Ground (GND).',
          'Connect logic input switches to gate inputs (Pins 1 & 2).',
          'Connect gate output (Pin 3) to logic indicator LED.',
          'Apply all input combinations (00, 01, 10, 11) and record LED state (ON=1, OFF=0).'
        ],
        sampleInput: 'A=0, B=0; A=0, B=1; A=1, B=0; A=1, B=1',
        sampleOutput: 'AND: 0, 0, 0, 1 | OR: 0, 1, 1, 1 | NAND: 1, 1, 1, 0 | NOR: 1, 0, 0, 0 | XOR: 0, 1, 1, 0',
        keyPoints: [
          'Always turn off power before plugging or unplugging ICs.',
          'Verify Pin 14 VCC (+5V) and Pin 7 GND before applying inputs.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 1)'
      },
      {
        id: 'dsd-exp-2',
        number: 'Experiment 2',
        title: 'Simplification and Realization of Boolean Expressions',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Simplify the given 3-variable and 4-variable Boolean expressions using Karnaugh Map (K-Map) and realize using minimum number of logic gates.',
        concept: 'K-Map grouping groups adjacent 1s into pairs, quads, and octets to eliminate redundant literals, producing minimal Sum-of-Products (SOP) or Product-of-Sums (POS).',
        hardwareDetails: ['IC 7408 (AND), IC 7432 (OR), IC 7404 (NOT), Trainer Kit'],
        algorithm: [
          'Plot the minterms on a 3-variable or 4-variable K-Map grid.',
          'Form prime implicant groups: octets (8), quads (4), pairs (2).',
          'Write minimized SOP expression.',
          'Wire the circuit on breadboard and verify against the original truth table.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 3)'
      },
      {
        id: 'dsd-exp-3',
        number: 'Experiment 3',
        title: 'Design & Verification of Half Adder and Full Adder',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Design and verify the truth table of: a) Half Adder using basic gates and universal NAND gates. b) Full Adder using two half adders and an OR gate, and using basic gates.',
        concept: 'Half Adder adds 2 bits: Sum = A XOR B, Carry = A AND B. Full Adder adds 3 bits (A, B, Cin): Sum = A XOR B XOR Cin, Cout = AB + Cin(A XOR B).',
        hardwareDetails: [
          'IC 7486 (XOR), IC 7408 (AND), IC 7432 (OR)',
          'Alternative: IC 7400 (NAND) for universal realization'
        ],
        algorithm: [
          'Connect inputs A and B to XOR gate for Half Adder Sum, and to AND gate for Carry.',
          'For Full Adder, cascade two Half Adders: HA1 Sum and Cin go to HA2 XOR to produce final Sum.',
          'OR HA1 Carry and HA2 Carry to produce final Cout.',
          'Verify all 8 combinations of A, B, Cin.'
        ],
        sampleInput: 'A=1, B=1, Cin=1',
        sampleOutput: 'Sum = 1, Carry = 1',
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 8)'
      },
      {
        id: 'dsd-exp-4',
        number: 'Experiment 4',
        title: 'Design & Verification of Half Subtractor and Full Subtractor',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Design and verify the operation of Half Subtractor and Full Subtractor circuits using basic gates and universal gates.',
        concept: 'Half Subtractor: Difference = A XOR B, Borrow = A\' B. Full Subtractor: Difference = A XOR B XOR Bin, Borrow = A\'B + Bin(A XOR B)\'.',
        hardwareDetails: ['IC 7486 (XOR), IC 7404 (NOT), IC 7408 (AND), IC 7432 (OR)'],
        algorithm: [
          'Wire XOR gate between A and B for Difference.',
          'Invert A via NOT gate and AND with B for Half Subtractor Borrow.',
          'Verify all combinations against truth table.'
        ],
        sampleInput: 'A=0, B=1, Bin=1',
        sampleOutput: 'Difference = 0, Borrow = 1',
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 10)'
      },
      {
        id: 'dsd-exp-5',
        number: 'Experiment 5',
        title: '4-Bit Binary Parallel Adder / Subtractor using IC 7483',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Realize a 4-bit binary parallel adder/subtractor circuit using IC 7483 and XOR gates (IC 7486) controlled by an Add/Sub mode control signal M.',
        concept: 'When M=0, XOR gates pass B unchanged with Cin=0 (Addition: A + B). When M=1, XOR gates invert B (1s complement) with Cin=1 (2s complement subtraction: A + B\' + 1 = A - B).',
        hardwareDetails: ['IC 7483 (4-bit binary full adder), IC 7486 (Quad XOR)', 'Trainer Kit'],
        algorithm: [
          'Connect A3-A0 and B3-B0 inputs.',
          'Feed each Bi through an XOR gate with control line M.',
          'Connect M to Cin (Pin 13) of IC 7483.',
          'Verify addition with M=0 and 2s complement subtraction with M=1.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 14)'
      },
      {
        id: 'dsd-exp-6',
        number: 'Experiment 6',
        title: 'Code Converters: Binary to Gray & Gray to Binary',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Design and verify 4-bit Binary to Gray code converter and Gray to Binary code converter using IC 7486 XOR gates.',
        concept: 'Binary to Gray: G3=B3, G2=B3 XOR B2, G1=B2 XOR B1, G0=B1 XOR B0. Gray to Binary: B3=G3, B2=B3 XOR G2, B1=B2 XOR G1, B0=B1 XOR G0.',
        hardwareDetails: ['IC 7486 (Quad XOR gate), Trainer Kit'],
        algorithm: [
          'Wire XOR gates according to Gray code conversion equations.',
          'Input binary combinations 0000 to 1111 on switch inputs.',
          'Verify that adjacent Gray code outputs change by exactly 1 bit.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 16)'
      },
      {
        id: 'dsd-exp-7',
        number: 'Experiment 7',
        title: 'Design of 4:1 Multiplexer and 1:4 Demultiplexer',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Design and verify a 4:1 Multiplexer using basic gates and using dual 4-line to 1-line multiplexer IC 74153.',
        concept: 'Multiplexer routes one of 2^n data input channels to a single output line based on n select lines. Y = S1\'S0\'I0 + S1\'S0I1 + S1S0\'I2 + S1S0I3.',
        hardwareDetails: ['IC 74153 (Dual 4:1 Mux) or IC 7408, IC 7432, IC 7404'],
        algorithm: [
          'Connect select inputs S1, S0 and data inputs I0, I1, I2, I3.',
          'Verify that when S1S0 = 00, output mirrors I0; when 01, output mirrors I1, etc.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 17)'
      },
      {
        id: 'dsd-exp-8',
        number: 'Experiment 8',
        title: 'Priority Encoder Design & Verification (IC 74148)',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Verify the operation of 8-to-3 line Priority Encoder using IC 74148, handling simultaneous active inputs.',
        concept: 'If multiple inputs are active at the same time, priority encoder outputs the binary code corresponding to the highest-priority input line.',
        hardwareDetails: ['IC 74148 (8-Line to 3-Line Octal Priority Encoder)', 'Trainer Kit'],
        algorithm: [
          'Connect inputs 0 to 7 to logic switches (active LOW).',
          'Observe active LOW binary outputs A2, A1, A0 on LEDs.',
          'Activate multiple inputs and verify that highest index dominates.'
        ],
        sourceFileName: '24CS320-DSD/Unit 2/proirity encoder.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-unit-2-proirity-encoder',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/Unit%202/proirity%20encoder.pdf',
        relatedPdfTitle: 'proirity encoder.pdf'
      },
      {
        id: 'dsd-exp-9',
        number: 'Experiment 9',
        title: 'Verification of Flip-Flops (SR, JK, D, T Flip-Flops)',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Construct and verify truth tables of SR Flip-Flop, JK Flip-Flop, D Flip-Flop, and T Flip-Flop using IC 7476 and NAND gates.',
        concept: 'Flip-Flops are bistable multivibrator storage elements. Clock pulse triggers state transitions on active edge. JK eliminates invalid condition of SR flip-flop (J=1, K=1 toggles).',
        hardwareDetails: ['IC 7476 (Dual Master-Slave JK Flip-Flop with Preset and Clear)', 'IC 7474 (Dual D Flip-Flop)'],
        algorithm: [
          'Connect VCC and GND.',
          'Connect clock pulser to CLK pin.',
          'Verify Next State Q(t+1) for each input combination on positive/negative clock edges.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 21)'
      },
      {
        id: 'dsd-exp-10',
        number: 'Experiment 10',
        title: 'Asynchronous & Synchronous Counter Design',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Design and verify a 3-bit / 4-bit Asynchronous (Ripple) Up/Down Counter and Mod-N Synchronous Counter using JK Flip-Flops.',
        concept: 'In ripple counter, output of flip-flop n clocks flip-flop n+1. In synchronous counter, all flip-flops share a common clock with logic gate steering.',
        hardwareDetails: ['IC 7476 (Dual JK Flip-Flops), IC 7408 (AND gates)', 'Trainer Kit'],
        algorithm: [
          'Set J=1 and K=1 for toggle mode.',
          'Feed Q output of each flip-flop into clock of next stage for ripple counting.',
          'Observe binary counting sequence 000 to 111 on pulse transitions.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 23)'
      },
      {
        id: 'dsd-exp-11',
        number: 'Experiment 11',
        title: 'Shift Registers (SISO, SIPO, PISO, PIPO using IC 7495)',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Implement and test 4-bit Shift Registers in Serial-In Serial-Out (SISO), Serial-In Parallel-Out (SIPO), Parallel-In Serial-Out (PISO), and Parallel-In Parallel-Out (PIPO) modes using IC 7495.',
        concept: 'Shift registers store and move data bits laterally on clock pulses. Mode control determines serial shift vs parallel load.',
        hardwareDetails: ['IC 7495 (4-Bit Universal Shift Register)', 'Clock Generator, Trainer Kit'],
        algorithm: [
          'Configure mode control line for shift right or parallel load.',
          'Clock bits sequentially and record output states across 4 clock cycles.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfId: 'pdf-24cs320-dsd-dsd-lab-lab-manual',
        relatedPdfUrl: '/raw-pdf/24CS320-DSD/DSD-LAB/lab-manual.pdf',
        relatedPdfTitle: 'lab-manual.pdf (Page 26)'
      },
      {
        id: 'dsd-exp-12',
        number: 'Experiment 12',
        title: 'Digital Logic Virtual Simulator (Interactive Trainer Kit)',
        subjectCode: '24CS320',
        subjectName: 'Digital System Design Lab',
        question: 'Interactive digital logic simulator supporting real-time toggling of logic inputs A and B to observe AND, OR, NOT, NAND, NOR, and XOR gate outputs with live truth tables.',
        concept: 'Virtual logic simulation models gate propagation and boolean algebra interactively on web platforms without hardware breadboards.',
        hardwareDetails: ['Software Virtual Trainer Kit Engine with real-time reactive state'],
        algorithm: [
          'Toggle switch A and switch B to change logic levels between 0 (LOW) and 1 (HIGH).',
          'Observe dynamic output updates and active highlight on truth table row.'
        ],
        sourceFileName: '24CS320-DSD/DSD-LAB/lab-manual.pdf'
      }
    ],
    supportingDocuments: [
      {
        id: 'dsd-sup-1',
        title: 'Priority Encoder Technical Resource',
        filename: 'proirity encoder.pdf',
        relPath: '24CS320-DSD/Unit 2/proirity encoder.pdf',
        url: '/raw-pdf/24CS320-DSD/Unit%202/proirity%20encoder.pdf',
        sizeFormatted: '1.4 MB',
        format: 'pdf',
        description: 'Comprehensive study and design handout on priority encoder logic, truth tables, and IC 74148 configuration.',
        relatedExperimentNumber: 'Experiment 8'
      },
      {
        id: 'dsd-sup-2',
        title: 'DSD Curriculum Syllabus Specification',
        filename: 'DSD-syllabus.pdf',
        relPath: '01.Syllabus-26/DSD-syllabus.pdf',
        url: '/raw-pdf/01.Syllabus-26/DSD-syllabus.pdf',
        sizeFormatted: '1.18 MB',
        format: 'pdf',
        description: 'Official department syllabus document including practical laboratory components.'
      }
    ]
  },
  {
    id: 'oop',
    code: '24CS310',
    title: 'Object Oriented Programming Laboratory',
    shortName: 'OOP Lab',
    type: 'Integrated Practical Course',
    credits: 'Integrated Practical Component (L:3, T:0, P:2)',
    cieMarks: 40,
    seeMarks: 60,
    totalMarks: 100,
    contactHours: '30 Practical Hours',
    description: 'Practical object-oriented programming in C++. Covers classes, objects, constructors, operator overloading, inheritance, dynamic memory allocation with new/delete, and STL templates.',
    prerequisites: 'C Programming, Basic Structured Programming, Arrays and Functions',
    courseOutcomes: [
      { co: 'CO1', text: 'Develop C++ programs utilizing object-oriented principles, classes, methods, and member access.', level: 'L3' },
      { co: 'CO2', text: 'Implement constructor overloading, operator overloading, and friend functions for custom data types.', level: 'L3' },
      { co: 'CO3', text: 'Utilize dynamic memory allocation (new/delete) and solve tabular data processing problems.', level: 'L3' }
    ],
    recordsAndManuals: [
      {
        id: 'oop-cycle-1-doc',
        title: 'OOP Lab Cycle 1 Assignment Document',
        description: 'Official assignment handout for Cycle 1 covering quadratic equation root classification, natural number summation, and bubble sort in C++.',
        filename: 'lab 1 cycle.docx',
        relPath: '24CS310-OOP/OOP-Lab/lab 1 cycle.docx',
        url: '/raw-pdf/24CS310-OOP/OOP-Lab/lab%201%20cycle.docx',
        sizeFormatted: '15.6 KB',
        pages: 'Cycle 1 Assignment',
        badge: 'Official Assignment',
        format: 'docx'
      },
      {
        id: 'oop-cycle-2-doc',
        title: 'OOP Lab Cycle 2 Assignment Document',
        description: 'Official assignment handout for Cycle 2 covering 2D array temperature tabulation for 5 cities over 6 days with max/min coordinates.',
        filename: 'lab 2 cycle.docx',
        relPath: '24CS310-OOP/OOP-Lab/lab 2 cycle.docx',
        url: '/raw-pdf/24CS310-OOP/OOP-Lab/lab%202%20cycle.docx',
        sizeFormatted: '14.5 KB',
        pages: 'Cycle 2 Assignment',
        badge: 'Official Assignment',
        format: 'docx'
      },
      {
        id: 'oop-test1-doc',
        title: 'OOP Internal Practical Assessment (Test 1)',
        description: 'Internal assessment laboratory evaluation paper and marking scheme for 22CS310 / 24CS310.',
        filename: 'TEST1 22CS310.docx',
        relPath: '24CS310-OOP/TEST1 22CS310.docx',
        url: '/raw-pdf/24CS310-OOP/TEST1%2022CS310.docx',
        sizeFormatted: '14 KB',
        pages: 'Internal Assessment',
        badge: 'CIE Paper',
        format: 'docx'
      }
    ],
    experiments: [
      {
        id: 'cpp-lab-1a',
        number: 'Program 1a',
        title: 'Quadratic Equation Roots Solver in C++',
        subjectCode: '24CS310',
        subjectName: 'Object Oriented Programming using C++',
        language: 'cpp',
        question: 'Write a C++ program to find and output all the roots of a quadratic equation ax^2 + bx + c = 0, handling real and distinct, real and equal, and complex conjugate roots.',
        concept: 'Uses discriminant Delta = b^2 - 4ac. Delta > 0 gives two real distinct roots; Delta == 0 gives real identical roots (-b/2a); Delta < 0 gives complex conjugate roots (real +- i*imag). Demonstrates standard I/O (cin, cout) and cmath.',
        algorithm: [
          'Input coefficients a, b, c. Verify a != 0.',
          'Calculate discriminant = b * b - 4 * a * c.',
          'If discriminant > 0: root1 = (-b + sqrt(d))/(2a), root2 = (-b - sqrt(d))/(2a).',
          'If discriminant == 0: root1 = -b / (2a); roots are real and identical.',
          'If discriminant < 0: realPart = -b/(2a), imagPart = sqrt(-d)/(2a); display realPart +- imagPart i.'
        ],
        code: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a, b, c, discriminant, root1, root2, realPart, imagPart;

    cout << "Enter coefficients a, b and c: ";
    if (!(cin >> a >> b >> c)) return 1;

    if (a == 0) {
        cout << "Invalid input: 'a' cannot be 0 for a quadratic equation." << endl;
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
}`,
        sampleInput: 'Enter coefficients a, b and c: 1 -5 6',
        sampleOutput: 'Roots are real and different.\nRoot 1 = 3\nRoot 2 = 2',
        complexity: { time: 'O(1) constant arithmetic', space: 'O(1) scalar variables' },
        keyPoints: [
          'Prevent division by zero by verifying a != 0.',
          'Use sqrt(-discriminant) to calculate magnitude of imaginary component.'
        ],
        sourceFileName: '24CS310-OOP/OOP-Lab/lab 1 cycle.docx'
      },
      {
        id: 'cpp-lab-1b',
        number: 'Program 1b',
        title: 'Sum of Natural Numbers from 1 to N',
        subjectCode: '24CS310',
        subjectName: 'Object Oriented Programming using C++',
        language: 'cpp',
        question: 'Write a C++ program to find the sum of all natural numbers from 1 to n using standard loops.',
        concept: 'Demonstrates for loop iteration and accumulator variable pattern in C++.',
        algorithm: [
          'Read positive integer n.',
          'Initialize sum = 0.',
          'Loop i from 1 to n: sum += i.',
          'Display final sum.'
        ],
        code: `#include <iostream>
using namespace std;

int main() {
    int n, sum = 0;
    cout << "Enter a positive integer: ";
    if (!(cin >> n) || n < 1) {
        cout << "Please enter a valid positive integer." << endl;
        return 1;
    }

    for (int i = 1; i <= n; ++i) {
        sum += i;
    }

    cout << "Sum of natural numbers from 1 to " << n << " is " << sum << endl;
    return 0;
}`,
        sampleInput: 'Enter a positive integer: 10',
        sampleOutput: 'Sum of natural numbers from 1 to 10 is 55',
        complexity: { time: 'O(N) loop iterations', space: 'O(1) scalar memory' },
        sourceFileName: '24CS310-OOP/OOP-Lab/lab 1 cycle.docx'
      },
      {
        id: 'cpp-lab-1c',
        number: 'Program 1c',
        title: 'Array Sorting in Ascending & Descending Order (Bubble Sort)',
        subjectCode: '24CS310',
        subjectName: 'Object Oriented Programming using C++',
        language: 'cpp',
        question: 'Write a C++ program to sort an array of N elements in ascending and descending order using Bubble Sort.',
        concept: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Pass k bubbles the k-th largest element to its correct position.',
        algorithm: [
          'Read array size N and N integers.',
          'Outer loop pass from 0 to N-2.',
          'Inner loop j from 0 to N-2-pass.',
          'If arr[j] > arr[j+1], swap them.',
          'Print sorted arrays.'
        ],
        code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number of elements: ";
    if (!(cin >> n) || n <= 0) return 1;

    int arr[100];
    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++) cin >> arr[i];

    // Ascending Bubble Sort
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    cout << "Ascending order : ";
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    cout << endl;

    cout << "Descending order: ";
    for (int i = n - 1; i >= 0; i--) cout << arr[i] << " ";
    cout << endl;

    return 0;
}`,
        sampleInput: 'Enter 5 elements: 64 25 12 22 11',
        sampleOutput: 'Ascending order : 11 12 22 25 64\nDescending order: 64 25 22 12 11',
        complexity: { time: 'O(N^2) time complexity', space: 'O(1) in-place swaps' },
        sourceFileName: '24CS310-OOP/OOP-Lab/lab 1 cycle.docx'
      },
      {
        id: 'cpp-lab-2',
        number: 'Program 2',
        title: 'Temperature Tabulation Matrix for 5 Cities across 6 Days',
        subjectCode: '24CS310',
        subjectName: 'Object Oriented Programming using C++',
        language: 'cpp',
        question: 'The daily maximum temperatures recorded for 5 cities during the first 6 days of January month have to be tabulated. Write a C++ program to read the data and find the city and day corresponding to highest temperature and lowest temperature.',
        concept: 'Demonstrates 2D array representation float temp[5][6] and matrix traversal. Tracks simultaneous global maximum and minimum values along with row (city) and column (day) coordinates.',
        algorithm: [
          'Declare float temp[5][6] for 5 cities and 6 days.',
          'Read 30 temperature values.',
          'Initialize highest = lowest = temp[0][0], tracking city and day indices.',
          'Traverse all rows and columns to find maximum and minimum entries.',
          'Display formatted table and report coordinates.'
        ],
        code: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    const int cities = 5;
    const int days = 6;
    float temp[cities][days];
    float highest, lowest;
    int highCity = 0, lowCity = 0, highDay = 0, lowDay = 0;

    cout << "Enter maximum temperatures for 5 cities across 6 days:" << endl;
    for (int i = 0; i < cities; i++) {
        for (int j = 0; j < days; j++) {
            cout << "City " << i + 1 << ", Day " << j + 1 << ": ";
            cin >> temp[i][j];
        }
    }

    highest = lowest = temp[0][0];

    for (int i = 0; i < cities; i++) {
        for (int j = 0; j < days; j++) {
            if (temp[i][j] > highest) {
                highest = temp[i][j];
                highCity = i;
                highDay = j;
            }
            if (temp[i][j] < lowest) {
                lowest = temp[i][j];
                lowCity = i;
                lowDay = j;
            }
        }
    }

    cout << "\\n--- Temperature Analysis ---" << endl;
    cout << "Highest temperature: " << highest << " C (City " << highCity + 1 << ", Day " << highDay + 1 << ")" << endl;
    cout << "Lowest temperature : " << lowest << " C (City " << lowCity + 1 << ", Day " << lowDay + 1 << ")" << endl;

    return 0;
}`,
        sampleInput: '30 temperatures for 5 cities x 6 days',
        sampleOutput: 'Highest temperature: 38.5 C (City 2, Day 4)\nLowest temperature : 14.2 C (City 4, Day 1)',
        complexity: { time: 'O(C * D) = O(30) = O(1) bounded traversal', space: 'O(30) 2D array matrix' },
        sourceFileName: '24CS310-OOP/OOP-Lab/lab 2 cycle.docx'
      },
      {
        id: 'cpp-lab-3',
        number: 'Program 3',
        title: 'Dynamic Memory Allocation (DMA) with new & delete',
        subjectCode: '24CS310',
        subjectName: 'Object Oriented Programming using C++',
        language: 'cpp',
        question: 'Demonstrate Dynamic Memory Allocation in C++ using operators new, new[] and delete, delete[] to allocate memory at runtime for arrays and objects.',
        concept: 'In C++, operator new dynamically allocates heap memory and calls class constructors; operator delete deallocates memory and calls destructors.',
        algorithm: [
          'Allocate single variable: int *p = new int(100).',
          'Allocate array: int *arr = new int[n].',
          'Manipulate dynamically allocated memory.',
          'Deallocate using delete and delete[] to prevent memory leaks.'
        ],
        code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter size of dynamic array: ";
    if (!(cin >> n) || n <= 0) return 1;

    // Dynamic allocation using new[]
    int *arr = new int[n];

    cout << "Enter " << n << " integers: ";
    for (int i = 0; i < n; i++) cin >> arr[i];

    int sum = 0;
    for (int i = 0; i < n; i++) sum += arr[i];

    cout << "Sum of dynamic array elements: " << sum << endl;

    // Clean up heap memory using delete[]
    delete[] arr;
    arr = nullptr;

    return 0;
}`,
        sampleInput: 'Size: 3, Elements: 10 20 30',
        sampleOutput: 'Sum of dynamic array elements: 60',
        complexity: { time: 'O(N)', space: 'O(N) heap memory' },
        sourceFileName: '24CS310-OOP/Unit-2/DMA.docx'
      }
    ],
    supportingDocuments: [
      {
        id: 'oop-sup-1',
        title: 'OOP Lab Cycle 1 Handout',
        filename: 'lab 1 cycle.docx',
        relPath: '24CS310-OOP/OOP-Lab/lab 1 cycle.docx',
        url: '/raw-pdf/24CS310-OOP/OOP-Lab/lab%201%20cycle.docx',
        sizeFormatted: '15.6 KB',
        format: 'docx',
        description: 'Original Cycle 1 assignment document.',
        relatedExperimentNumber: 'Program 1'
      },
      {
        id: 'oop-sup-2',
        title: 'OOP Lab Cycle 2 Handout',
        filename: 'lab 2 cycle.docx',
        relPath: '24CS310-OOP/OOP-Lab/lab 2 cycle.docx',
        url: '/raw-pdf/24CS310-OOP/OOP-Lab/lab%202%20cycle.docx',
        sizeFormatted: '14.5 KB',
        format: 'docx',
        description: 'Original Cycle 2 assignment document.',
        relatedExperimentNumber: 'Program 2'
      },
      {
        id: 'oop-sup-3',
        title: 'OOP Course Syllabus & Textbook Reference',
        filename: '24CS310.pdf',
        relPath: '24CS310-OOP/24CS310.pdf',
        url: '/raw-pdf/24CS310-OOP/24CS310.pdf',
        sizeFormatted: '1.42 MB',
        format: 'pdf',
        description: 'Official course book and syllabus specification for 24CS310.'
      }
    ]
  }
];

export function getLaboratoryById(id: string): LaboratoryCourse | undefined {
  return LABORATORY_COURSES.find(lab => lab.id.toLowerCase() === id.toLowerCase());
}

export function getLaboratoryByCode(code: string): LaboratoryCourse | undefined {
  return LABORATORY_COURSES.find(lab => lab.code.toLowerCase() === code.toLowerCase());
}
