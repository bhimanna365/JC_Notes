import json

notes = [
  {
    "id": "note-dma-cpp",
    "title": "Dynamic Memory Allocation in C++ (new and delete)",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "unitNumber": 2,
    "readTime": "12 min read",
    "tags": ["C++", "Memory Management", "Pointers", "OOP"],
    "lastUpdated": "2026-10-10",
    "tableOfContents": [
      { "id": "what-is-dma", "title": "1. What is Dynamic Memory Allocation?", "level": 2 },
      { "id": "new-operator", "title": "2. The new Operator", "level": 2 },
      { "id": "delete-operator", "title": "3. The delete Operator", "level": 2 },
      { "id": "dynamic-arrays", "title": "4. Allocating Dynamic Arrays", "level": 2 },
      { "id": "dynamic-objects", "title": "5. Dynamic Objects & Constructors", "level": 2 },
      { "id": "memory-leaks", "title": "6. Memory Leaks & Dangling Pointers", "level": 2 },
      { "id": "new-vs-malloc", "title": "7. Comparison: new/delete vs malloc/free", "level": 2 }
    ],
    "content": """# Dynamic Memory Allocation in C++

## 1. What is Dynamic Memory Allocation?

In C++, memory can be allocated in two primary ways:

1. **Static / Compile-Time Allocation:** Memory is allocated at compile time on the Stack or Data Segment (e.g., standard local variables, global variables, and fixed-size arrays). The size must be known before execution.
2. **Dynamic / Run-Time Allocation:** Memory is allocated during program execution from the **Free Store (Heap)**. The size can be determined dynamically based on user input or runtime requirements.

Dynamic allocation is essential when:
- The exact size of data structures cannot be predicted before execution.
- We need objects whose lifetime extends beyond the scope of the function that created them.
- Large blocks of data must be allocated without risking stack overflow.

---

## 2. The `new` Operator

The `new` operator allocates memory for an object or primitive type from the heap and returns a typed pointer to the allocated memory.

### Syntax for Single Variables:
```cpp
pointer_variable = new data_type;
pointer_variable = new data_type(initial_value); // with initialization
```

### Example:
```cpp
#include <iostream>
using namespace std;

int main() {
    // Allocate an integer on the heap
    int *p = new int;
    *p = 45;
    cout << "Value of *p: " << *p << " at address: " << p << endl;

    // Allocate and initialize an integer in one statement
    int *q = new int(100);
    cout << "Value of *q: " << *q << endl;

    delete p;
    delete q;
    return 0;
}
```

> [!NOTE]
> If the heap has insufficient memory, `new` automatically throws a `std::bad_alloc` exception (or returns `nullptr` if `new(nothrow)` is specified).

---

## 3. The `delete` Operator

When dynamically allocated memory is no longer needed, it must be explicitly deallocated using the `delete` operator to return it to the free store.

### Syntax:
```cpp
delete pointer_variable;         // For single variables
delete[] array_pointer_variable; // For dynamically allocated arrays
```

---

## 4. Allocating Dynamic Arrays

You can allocate a contiguous sequence of elements whose size is determined at runtime:

### Syntax:
```cpp
int *arr = new int[size];
```

### Example:
```cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter array size: ";
    cin >> n;

    // Allocate dynamic array
    int *arr = new int[n];

    cout << "Enter " << n << " elements:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    cout << "Array elements: ";
    for (int i = 0; i < n; i++) {
        cout << *(arr + i) << " ";
    }
    cout << endl;

    // Crucial: use delete[] with square brackets for arrays!
    delete[] arr;
    arr = nullptr; // Reset pointer to avoid dangling reference

    return 0;
}
```

> [!CAUTION]
> Using `delete arr` instead of `delete[] arr` on an array causes undefined behavior. In particular, it only calls the destructor for the first element!

---

## 5. Dynamic Objects & Constructors

One of the greatest advantages of `new` over C's `malloc()` is that `new` automatically invokes the class **constructor**, and `delete` automatically invokes the class **destructor**.

```cpp
#include <iostream>
using namespace std;

class Student {
private:
    string name;
    int rollNo;
public:
    Student(string n, int r) : name(n), rollNo(r) {
        cout << "[Constructor] Student created: " << name << endl;
    }
    ~Student() {
        cout << "[Destructor] Student destroyed: " << name << endl;
    }
    void display() {
        cout << "Name: " << name << ", Roll No: " << rollNo << endl;
    }
};

int main() {
    // Dynamic object allocation invokes constructor
    Student *s = new Student("Ananya", 101);
    s->display();

    // delete invokes destructor and frees heap memory
    delete s;
    return 0;
}
```

---

## 6. Memory Leaks & Dangling Pointers

### Memory Leak:
Occurs when heap memory is allocated using `new`, but never released using `delete`, and all pointers referencing that block are lost.
```cpp
void badFunction() {
    int *ptr = new int[1000];
    // Function exits without calling delete[] ptr
    // 4000 bytes leaked on the heap!
}
```

### Dangling Pointer:
Occurs when memory is deallocated using `delete`, but the pointer still holds the old address and is subsequently accessed.
```cpp
int *p = new int(50);
delete p;
// p is now dangling!
// *p = 20; // DANGEROUS: Undefined behavior
p = nullptr; // SAFE: Always nullify pointers after deletion
```

---

## 7. Comparison: `new/delete` vs `malloc/free`

| Feature | `new` and `delete` | `malloc()` and `free()` |
| :--- | :--- | :--- |
| **Language** | Native C++ operators | C standard library functions (`<cstdlib>`) |
| **Constructors / Destructors** | Automatically invoked | Neither is invoked (pure byte allocation) |
| **Return Type** | Returns exact typed pointer (e.g. `int*`) | Returns `void*` (requires explicit casting) |
| **Size Computation** | Automatic: `new int[10]` computes `10 * sizeof(int)` | Manual: `malloc(10 * sizeof(int))` |
| **Failure Handling** | Throws `std::bad_alloc` exception | Returns `NULL` pointer |
| **Overloadable** | Can be overloaded for custom classes | Cannot be overloaded |
"""
  },
  {
    "id": "note-friend-cpp",
    "title": "Friend Functions and Friend Classes in C++",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "unitNumber": 2,
    "readTime": "10 min read",
    "tags": ["C++", "Encapsulation", "Friend Function", "OOP"],
    "lastUpdated": "2026-10-11",
    "tableOfContents": [
      { "id": "what-is-friend", "title": "1. Concept of Friendship in C++", "level": 2 },
      { "id": "syntax-rules", "title": "2. Declaration Syntax & Rules", "level": 2 },
      { "id": "bridging-classes", "title": "3. Bridging Two Classes with a Friend Function", "level": 2 },
      { "id": "member-as-friend", "title": "4. Member Function of Another Class as Friend", "level": 2 },
      { "id": "friend-classes", "title": "5. Friend Classes", "level": 2 },
      { "id": "pros-and-cons", "title": "6. Advantages & Potential Pitfalls", "level": 2 }
    ],
    "content": """# Friend Functions and Friend Classes in C++

## 1. Concept of Friendship in C++

In C++, encapsulation normally restricts access to `private` and `protected` data members exclusively to member functions of the declaring class.

However, situations arise where an external non-member function or another class needs direct, high-performance access to private members of two or more independent classes (such as mathematical vector operations, matrix multiplication, or stream insertion operators).

To solve this cleanly, C++ provides the **`friend`** keyword. A friend function is **not a member** of the class, but is granted full access permissions to private and protected members.

---

## 2. Declaration Syntax & Rules

### Declaration:
Inside the class body (in `private`, `protected`, or `public` section):
```cpp
class Box {
private:
    double width;
public:
    Box(double w) : width(w) {}
    // Friend function declaration
    friend void printWidth(Box b);
};
```

### Definition:
Outside the class body, without the `friend` keyword and without the scope resolution operator `::`:
```cpp
void printWidth(Box b) {
    // Directly accesses private member 'width'
    cout << "Width: " << b.width << endl;
}
```

### Essential Rules for Friend Functions:
1. **Not in Class Scope:** It is not a member of the class, so it cannot be called using the dot (`.`) or arrow (`->`) operator on an object.
2. **Invoked like Normal Functions:** It is called like a regular global function: `printWidth(boxObj)`.
3. **Takes Objects as Arguments:** Because it has no implicit `this` pointer, it must accept the target class object as a parameter (by value, pointer, or reference).
4. **Placement is Arbitrary:** Declaration can be placed inside `private`, `protected`, or `public` sections with identical permissions.
5. **Friendship is Granted, Not Taken:** Class A must explicitly declare that Function F or Class B is its friend. Class B cannot declare itself a friend of Class A.
6. **Friendship is Neither Symmetric Nor Transitive:** If Class A is friend of Class B, Class B is NOT automatically friend of Class A. If A is friend of B and B is friend of C, A is NOT friend of C.
7. **Friendship is Not Inherited:** Derived classes do not inherit friend status.

---

## 3. Bridging Two Classes with a Friend Function

A prime use case is operating simultaneously on private fields of two distinct classes:

```cpp
#include <iostream>
using namespace std;

// Forward declaration of Class B
class ClassB;

class ClassA {
private:
    int numA;
public:
    ClassA(int val) : numA(val) {}
    // Declare friend function accepting both classes
    friend int add(ClassA a, ClassB b);
};

class ClassB {
private:
    int numB;
public:
    ClassB(int val) : numB(val) {}
    // Declare identical friend function
    friend int add(ClassA a, ClassB b);
};

// Friend function definition
int add(ClassA a, ClassB b) {
    return a.numA + b.numB;
}

int main() {
    ClassA objA(40);
    ClassB objB(60);
    cout << "Sum of private members from two classes: " << add(objA, objB) << endl;
    return 0;
}
```

---

## 4. Member Function of Another Class as Friend

You can grant friend privileges to a specific member function of an existing class:

```cpp
class Sample; // Forward declaration

class Manager {
public:
    void audit(Sample s);
};

class Sample {
private:
    int secretCode;
public:
    Sample(int code) : secretCode(code) {}
    // Only Manager::audit has friend access
    friend void Manager::audit(Sample s);
};
```

---

## 5. Friend Classes

When an entire class needs access to all private members of another class, you declare the entire class as a `friend class`:

```cpp
#include <iostream>
using namespace std;

class BankAccount {
private:
    double balance;
    string accountNumber;
public:
    BankAccount(string acc, double bal) : accountNumber(acc), balance(bal) {}
    // Authorize BankTeller as a friend class
    friend class BankTeller;
};

class BankTeller {
public:
    void printStatement(const BankAccount &acc) {
        // Direct access to private balance and accountNumber
        cout << "Account: " << acc.accountNumber << " | Balance: $" << acc.balance << endl;
    }
    void deposit(BankAccount &acc, double amount) {
        acc.balance += amount;
        cout << "Deposited $" << amount << ". New balance: $" << acc.balance << endl;
    }
};

int main() {
    BankAccount myAccount("SB-100293", 5000.0);
    BankTeller teller;
    teller.printStatement(myAccount);
    teller.deposit(myAccount, 1200.0);
    return 0;
}
```

---

## 6. Advantages & Potential Pitfalls

### Advantages:
- Facilitates operator overloading for stream operators `<<` and `>>`.
- Allows clean mathematical operations across multiple heterogeneous classes.
- Avoids exposing public getter/setter methods that might compromise data integrity.

### Potential Pitfalls:
- Overuse weakens data hiding and tightens coupling between classes.
- If a class has too many friends, internal representation changes will require cascading updates to all friend functions.
"""
  },
  {
    "id": "note-operator-cpp",
    "title": "Operator Overloading Masterclass in C++",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "unitNumber": 2,
    "readTime": "15 min read",
    "tags": ["C++", "Polymorphism", "Operator Overloading", "OOP"],
    "lastUpdated": "2026-10-11",
    "tableOfContents": [
      { "id": "what-is-op-overloading", "title": "1. What is Operator Overloading?", "level": 2 },
      { "id": "rules-and-restrictions", "title": "2. Rules & Non-Overloadable Operators", "level": 2 },
      { "id": "unary-operator", "title": "3. Overloading Unary Operators", "level": 2 },
      { "id": "binary-operator", "title": "4. Overloading Binary Operators", "level": 2 },
      { "id": "friend-operators", "title": "5. Operator Overloading using Friend Functions", "level": 2 },
      { "id": "stream-operators", "title": "6. Overloading Stream Operators (<< and >>)", "level": 2 }
    ],
    "content": """# Operator Overloading Masterclass in C++

## 1. What is Operator Overloading?

In C++, **Operator Overloading** is a form of **Compile-Time (Static) Polymorphism** that allows developers to redefine the behavior of existing C++ operators (such as `+`, `-`, `*`, `==`, `<<`) when applied to user-defined types (classes and structs).

Without operator overloading, adding two complex numbers requires awkward function calls:
```cpp
Complex c3 = c1.add(c2); // Verbose
```
With operator overloading, the syntax matches natural mathematical conventions:
```cpp
Complex c3 = c1 + c2;    // Clean, readable, and intuitive
```

---

## 2. Rules & Non-Overloadable Operators

### Strict Rules:
1. **No New Operators:** You cannot invent new operator symbols (such as `**` for exponentiation or `@@`).
2. **Precedence and Associativity are Immutable:** The operator's precedence level and associativity rules remain unchanged.
3. **Arity is Fixed:** A unary operator cannot be overloaded as binary, and a binary operator cannot be overloaded as unary.
4. **At Least One User-Defined Operand:** You cannot alter the behavior of operators on built-in types (e.g. you cannot redefine `int + int`).

### Operators That CANNOT Be Overloaded in C++:
- Scope Resolution Operator (`::`)
- Member Access Operator (`.`)
- Pointer-to-Member Operator (`.*`)
- Ternary Conditional Operator (`?:`)
- `sizeof` Operator
- `typeid` Operator

---

## 3. Overloading Unary Operators

A unary operator acts on a single operand. When overloaded as a member function, it takes **no arguments** because the calling object (`this`) is the implicit operand.

### Overloading Unary Minus (`-`):
```cpp
#include <iostream>
using namespace std;

class Space {
private:
    int x, y, z;
public:
    Space(int a = 0, int b = 0, int c = 0) : x(a), y(b), z(c) {}

    // Overload unary minus
    void operator-() {
        x = -x;
        y = -y;
        z = -z;
    }

    void display() const {
        cout << "(" << x << ", " << y << ", " << z << ")" << endl;
    }
};

int main() {
    Space s(10, -20, 30);
    cout << "Original coordinates: ";
    s.display();

    -s; // Invokes s.operator-()

    cout << "After negation (-s):  ";
    s.display();
    return 0;
}
```

---

## 4. Overloading Binary Operators

A binary operator operates on two operands. When overloaded as a member function:
- The left-hand operand is the calling object (`*this`).
- The right-hand operand is passed as an explicit parameter.

### Overloading Binary Plus (`+`) for Complex Numbers:
```cpp
#include <iostream>
using namespace std;

class Complex {
private:
    double real;
    double imag;
public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // Overloading binary + as a member function
    Complex operator+(const Complex &other) const {
        return Complex(real + other.real, imag + other.imag);
    }

    // Overloading equality operator ==
    bool operator==(const Complex &other) const {
        return (real == other.real && imag == other.imag);
    }

    void display() const {
        cout << real << " + " << imag << "i" << endl;
    }
};

int main() {
    Complex c1(3.5, 2.5);
    Complex c2(1.5, 4.5);

    // c1 + c2 translates to c1.operator+(c2)
    Complex c3 = c1 + c2;

    cout << "c1: "; c1.display();
    cout << "c2: "; c2.display();
    cout << "c3 (c1 + c2): "; c3.display();

    if (c1 == c2) cout << "c1 equals c2" << endl;
    else cout << "c1 does not equal c2" << endl;

    return 0;
}
```

---

## 5. Operator Overloading using Friend Functions

When an operator is overloaded as a **friend function**:
- Unary operators take **1 parameter**.
- Binary operators take **2 parameters**.

### Why Use Friend Functions for Binary Operators?
When an operator is overloaded as a member function, the left operand must be an object of that class.
For example, `c1 + 5` works because `c1` is a `Complex` object.
However, `5 + c1` fails because the integer `5` cannot invoke a `Complex::operator+()`.

A friend function resolves this asymmetry:
```cpp
class Complex {
    double real, imag;
public:
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    // Friend function allows double + Complex as well as Complex + Complex
    friend Complex operator+(double lhs, const Complex &rhs) {
        return Complex(lhs + rhs.real, rhs.imag);
    }
    friend Complex operator+(const Complex &lhs, double rhs) {
        return Complex(lhs.real + rhs, lhs.imag);
    }
};
```

---

## 6. Overloading Stream Operators (`<<` and `>>`)

Stream insertion (`<<`) and stream extraction (`>>`) operators **must be overloaded as friend functions** because their left operand is an `ostream` (e.g., `cout`) or `istream` (e.g., `cin`), not our custom class.

```cpp
#include <iostream>
using namespace std;

class Vector2D {
private:
    double x, y;
public:
    Vector2D(double xVal = 0, double yVal = 0) : x(xVal), y(yVal) {}

    // Overload stream insertion operator <<
    friend ostream& operator<<(ostream &out, const Vector2D &v) {
        out << "<" << v.x << ", " << v.y << ">";
        return out; // Enables chaining: cout << v1 << v2;
    }

    // Overload stream extraction operator >>
    friend istream& operator>>(istream &in, Vector2D &v) {
        cout << "Enter X: ";
        in >> v.x;
        cout << "Enter Y: ";
        in >> v.y;
        return in;
    }
};

int main() {
    Vector2D v1;
    cout << "Reading vector..." << endl;
    cin >> v1;
    cout << "Vector value: " << v1 << endl;
    return 0;
}
```
"""
  },
  {
    "id": "note-ds-stacks",
    "title": "Stack Data Structure, Infix to Postfix & Evaluation Algorithms",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 2,
    "readTime": "15 min read",
    "tags": ["Data Structures", "Stack", "Algorithms", "C"],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      { "id": "stack-adt", "title": "1. The Stack Abstract Data Type (ADT)", "level": 2 },
      { "id": "array-vs-linked", "title": "2. Array vs Linked List Representation", "level": 2 },
      { "id": "expression-notations", "title": "3. Infix, Postfix, and Prefix Notations", "level": 2 },
      { "id": "infix-to-postfix-algo", "title": "4. Infix to Postfix Conversion Algorithm", "level": 2 },
      { "id": "postfix-eval-algo", "title": "5. Postfix Expression Evaluation Algorithm", "level": 2 },
      { "id": "applications", "title": "6. Industrial & System Applications", "level": 2 }
    ],
    "content": """# Stack Data Structure, Infix to Postfix & Evaluation Algorithms

## 1. The Stack Abstract Data Type (ADT)

A **Stack** is a linear data structure that adheres to the **LIFO (Last-In, First-Out)** principle: the element inserted most recently is the first one removed.

All insertions and deletions are restricted to a single endpoint called the **Top** of the stack.

### Core Operations:
- `push(item)`: Inserts an element onto the top of the stack. (Error condition: **Stack Overflow** if capacity reached).
- `pop()`: Removes and returns the element at the top. (Error condition: **Stack Underflow** if stack is empty).
- `peek()` / `top()`: Returns top element without removing it.
- `isEmpty()`: Returns boolean true if `top == -1`.
- `isFull()`: Returns boolean true if `top == MAX - 1`.

---

## 2. Array vs Linked List Representation

### 1. Fixed Array Representation:
```c
#define MAX 100
typedef struct {
    int items[MAX];
    int top;
} Stack;

void init(Stack *s) { s->top = -1; }
int isFull(Stack *s) { return s->top == MAX - 1; }
int isEmpty(Stack *s) { return s->top == -1; }

void push(Stack *s, int val) {
    if (isFull(s)) {
        printf("Stack Overflow!\\n");
        return;
    }
    s->items[++(s->top)] = val;
}

int pop(Stack *s) {
    if (isEmpty(s)) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return s->items[(s->top)--];
}
```

### 2. Dynamic Linked List Representation:
A linked list represents a stack where `head` is the `top`.
- `push()` inserts a node at the front: `O(1)`.
- `pop()` deletes the node from the front: `O(1)`.
- Eliminates fixed capacity constraints; only bounded by system heap memory.

---

## 3. Infix, Postfix, and Prefix Notations

| Notation | Format | Example | Parsing Mechanism |
| :--- | :--- | :--- | :--- |
| **Infix** | `operand1 operator operand2` | `(A + B) * C` | Requires parenthesis and precedence rules |
| **Postfix (RPN)** | `operand1 operand2 operator` | `A B + C *` | Evaluated strictly left-to-right using a stack |
| **Prefix (Polish)** | `operator operand1 operand2` | `* + A B C` | Evaluated right-to-left using a stack |

### Operator Precedence & Associativity Table:
| Operator | Symbol | Precedence | Associativity |
| :--- | :--- | :--- | :--- |
| Exponentiation | `^` | 3 (Highest) | Right to Left |
| Multiplication / Division | `*`, `/`, `%` | 2 | Left to Right |
| Addition / Subtraction | `+`, `-` | 1 | Left to Right |
| Parentheses | `(`, `)` | Lowest inside stack | N/A |

---

## 4. Infix to Postfix Conversion Algorithm

```
Algorithm InfixToPostfix(infixExpression):
1. Initialize an empty character stack for operators.
2. Initialize an empty postfix string.
3. For each symbol in infixExpression:
     a. If symbol is an operand (letter/digit):
          Append symbol to postfix string.
     b. Else if symbol is '(':
          Push '(' onto stack.
     c. Else if symbol is ')':
          While stack top is not '(':
              Pop stack and append to postfix string.
          Pop and discard '('.
     d. Else if symbol is an operator (+, -, *, /, ^):
          While stack is not empty AND 
                precedence(stack[top]) >= precedence(symbol):
              If symbol is '^' and stack[top] is '^':
                  Break (exponentiation is right-associative)
              Pop stack and append to postfix string.
          Push symbol onto stack.
4. While stack is not empty:
     Pop stack and append to postfix string.
5. Return postfix string.
```

### Complete Trace: `((A + B) * C - (D - E)) ^ (F + G)`
- Postfix Output: `AB+C*DE--FG+^`

---

## 5. Postfix Expression Evaluation Algorithm

```
Algorithm EvaluatePostfix(postfixExpression):
1. Initialize an empty integer stack.
2. For each token in postfixExpression:
     a. If token is an operand (number):
          Push integer value onto stack.
     b. Else if token is an operator (op):
          op2 = pop()  // Top element is second operand!
          op1 = pop()  // Next element is first operand!
          result = op1 <op> op2
          Push result onto stack.
3. Final result = pop().
4. Return final result.
```

> [!WARNING]
> Notice that `op2` is popped before `op1`! For non-commutative operations like subtraction (`-`) and division (`/`), computing `op1 - op2` is correct, whereas `op2 - op1` produces catastrophic errors.

---

## 6. Industrial & System Applications

1. **Compiler Syntax Checking:** Validating matching braces `{}`, parentheses `()`, and square brackets `[]`.
2. **Call Stack & Recursion:** Managing function activation records, local variables, and return instruction addresses.
3. **Undo / Redo Buffers:** Text editors and graphic design software maintain action stacks.
4. **Browser History:** Forward and Back button navigation.
5. **Backtracking Algorithms:** Maze solving, N-Queens problem, and depth-first search (DFS).
"""
  },
  {
    "id": "note-ds-linkedlists",
    "title": "Linked Lists: Singly, Doubly & Circular with Header Nodes",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 3,
    "readTime": "14 min read",
    "tags": ["Data Structures", "Linked List", "C", "Pointers"],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      { "id": "why-linked-lists", "title": "1. Why Linked Lists over Arrays?", "level": 2 },
      { "id": "singly-linked-list", "title": "2. Singly Linked List (SLL)", "level": 2 },
      { "id": "circular-sll", "title": "3. Circular Singly Linked List (CSLL)", "level": 2 },
      { "id": "doubly-linked-list", "title": "4. Doubly Linked List (DLL)", "level": 2 },
      { "id": "circular-dll-header", "title": "5. Circular DLL with Header Node", "level": 2 },
      { "id": "polynomial-addition", "title": "6. Application: Polynomial Addition", "level": 2 }
    ],
    "content": """# Linked Lists: Singly, Doubly & Circular with Header Nodes

## 1. Why Linked Lists over Arrays?

| Metric | Contiguous Array | Linked List |
| :--- | :--- | :--- |
| **Memory Allocation** | Contiguous chunk allocated at once | Scattered dynamic nodes connected by pointers |
| **Insertion at Beginning** | `O(N)` (requires right-shifting all elements) | `O(1)` (rewires two pointer addresses) |
| **Deletion at Beginning** | `O(N)` (requires left-shifting all elements) | `O(1)` (rewires head and frees node) |
| **Random Access** | `O(1)` direct indexing: `arr[i]` | `O(N)` sequential traversal from head |
| **Memory Overhead** | Zero pointer overhead per element | Extra 4/8 bytes per node for `next`/`prev` pointers |
| **Cache Locality** | Outstanding (CPU hardware prefetching) | Poor (nodes scattered across heap) |

---

## 2. Singly Linked List (SLL)

Each node contains data and a single pointer `next` pointing to the succeeding node. The last node points to `NULL`.

```c
struct Node {
    int data;
    struct Node *next;
};
```

### Essential Pointer Rewiring Diagrams:

#### 1. Insert at Front:
```c
newNode->next = head;
head = newNode;
```

#### 2. Insert at Rear:
```c
if (head == NULL) { head = newNode; return; }
struct Node *temp = head;
while (temp->next != NULL) temp = temp->next;
temp->next = newNode;
```

#### 3. Delete at Front:
```c
if (head == NULL) return;
struct Node *temp = head;
head = head->next;
free(temp);
```

---

## 3. Circular Singly Linked List (CSLL)

In a circular singly linked list, `last->next` loops back to `head` instead of pointing to `NULL`.

> [!TIP]
> If you maintain a pointer to the **`last` node** rather than the first node:
> - **Front node** is accessible in `O(1)` via `last->next`.
> - **Rear node** is accessible in `O(1)` as `last`.
> - Both Insert Front and Insert Rear execute in `O(1)` time!

---

## 4. Doubly Linked List (DLL)

A Doubly Linked List node has two pointers: `prev` pointing to the preceding node and `next` pointing to the successor.

```c
struct Node {
    int data;
    struct Node *prev;
    struct Node *next;
};
```

### Two-Way Pointer Splicing:
```c
// Inserting newNode between temp and temp->next
newNode->next = temp->next;
newNode->prev = temp;
if (temp->next != NULL)
    temp->next->prev = newNode;
temp->next = newNode;
```

---

## 5. Circular DLL with Header Node

A **Header Node (Sentinel Node)** is a dummy node permanently situated at the start of the list. It holds no client data, but standardizes edge cases:

1. **Empty list state:** `head->next = head; head->prev = head;`
2. Eliminates checks for `head == NULL`.
3. Eliminates special-case logic for inserting before the first node or deleting the last node.
4. The list is completely symmetric and circular in both directions.

---

## 6. Application: Polynomial Representation & Addition

A polynomial $P(x) = 4x^3 + 3x^2 - 5x + 7$ can be cleanly modeled as a linked list where each node contains:
```c
struct PolyNode {
    int coeff;
    int exp;
    struct PolyNode *next;
};
```

### Polynomial Addition Algorithm:
1. Traverse both polynomials simultaneously using pointers `p1` and `p2`.
2. If `p1->exp == p2->exp`: Add coefficients. If sum != 0, append new node `(p1->coeff + p2->coeff, p1->exp)`. Advance both `p1` and `p2`.
3. If `p1->exp > p2->exp`: Append copy of `p1` node to result. Advance `p1`.
4. If `p2->exp > p1->exp`: Append copy of `p2` node to result. Advance `p2`.
5. Append any remaining nodes from the non-empty polynomial.
"""
  },
  {
    "id": "note-ds-trees",
    "title": "Binary Search Trees (BST) & Non-Linear Hierarchies",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 4,
    "readTime": "16 min read",
    "tags": ["Data Structures", "Trees", "BST", "Algorithms"],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      { "id": "tree-terminologies", "title": "1. Tree Terminologies & Properties", "level": 2 },
      { "id": "binary-trees", "title": "2. Types of Binary Trees", "level": 2 },
      { "id": "traversals", "title": "3. Tree Traversals (DFS & BFS)", "level": 2 },
      { "id": "bst-definition", "title": "4. The BST Invariant Property", "level": 2 },
      { "id": "bst-insertion", "title": "5. BST Insertion & Search", "level": 2 },
      { "id": "bst-deletion", "title": "6. BST Deletion: All 3 Child Cases", "level": 2 },
      { "id": "avl-intro", "title": "7. Introduction to Self-Balancing Trees", "level": 2 }
    ],
    "content": """# Binary Search Trees (BST) & Non-Linear Hierarchies

## 1. Tree Terminologies & Properties

A **Tree** is a non-linear, hierarchical data structure composed of nodes connected by directed or undirected edges. A tree with $N$ vertices always contains exactly $N - 1$ edges and contains no cycles.

### Key Terms:
- **Root:** The topmost node with no parent.
- **Leaf (Terminal) Node:** A node with no children (degree = 0).
- **Internal (Non-terminal) Node:** A node with at least one child.
- **Height of a Node:** The length of the longest path from the node to a leaf.
- **Depth of a Node:** The length of the path from the root to that node.
- **Degree of a Node:** The number of subtrees / children attached to that node.

---

## 2. Types of Binary Trees

A **Binary Tree** is a tree where every node has **at most 2 children** (referred to as `left` and `right`).

1. **Full (Strict) Binary Tree:** Every node has either 0 or 2 children.
2. **Complete Binary Tree:** All levels are completely filled except possibly the last, which is filled from left to right without gaps.
3. **Perfect Binary Tree:** All internal nodes have 2 children and all leaf nodes reside at the exact same depth. Total nodes $N = 2^{h+1} - 1$.
4. **Degenerate (Skewed) Tree:** Every internal node has only one child. Structurally degrades into a linear linked list ($O(N)$ operations).

---

## 3. Tree Traversals (DFS & BFS)

```c
struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};
```

### 1. Depth-First Traversals (Recursive):
- **Inorder (L - Root - R):**
  Traverse left subtree, visit root, traverse right subtree.
  *Note:* Inorder traversal of a BST produces strictly **ascending sorted order**!
- **Preorder (Root - L - R):**
  Visit root first, then left subtree, then right subtree.
  *Use Case:* Creating a clone/copy of the tree or prefix expressions.
- **Postorder (L - R - Root):**
  Traverse left subtree, traverse right subtree, visit root last.
  *Use Case:* Deleting a tree safely from leaves up, or postfix expressions.

### 2. Breadth-First Traversal (Level-Order):
Visits nodes level-by-level from top to bottom, left to right. Implemented using an auxiliary FIFO Queue.

---

## 4. The BST Invariant Property

A **Binary Search Tree (BST)** enforces the following invariant for every node $X$:
1. All keys in the **left subtree** of $X$ are strictly less than $X.key$:
   $$\forall Y \in \text{LeftSubtree}(X): Y.key < X.key$$
2. All keys in the **right subtree** of $X$ are strictly greater than $X.key$:
   $$\forall Z \in \text{RightSubtree}(X): Z.key > X.key$$
3. Both left and right subtrees must themselves be Binary Search Trees.

---

## 5. BST Insertion & Search

Searching and insertion in a balanced BST takes $O(\log_2 N)$ comparisons:

```c
struct Node* search(struct Node* root, int key) {
    if (root == NULL || root->data == key)
        return root;
    if (key < root->data)
        return search(root->left, key);
    return search(root->right, key);
}

struct Node* insert(struct Node* root, int key) {
    if (root == NULL) {
        struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
        newNode->data = key;
        newNode->left = newNode->right = NULL;
        return newNode;
    }
    if (key < root->data)
        root->left = insert(root->left, key);
    else if (key > root->data)
        root->right = insert(root->right, key);
    return root;
}
```

---

## 6. BST Deletion: All 3 Child Cases

Deleting a node while preserving the BST property requires handling 3 distinct scenarios:

### Case 1: Node to be deleted is a Leaf (0 Children)
Simply free the node and return `NULL` to its parent.

### Case 2: Node to be deleted has One Child
Bypass the node by connecting its parent directly to its sole child, then free the node.

### Case 3: Node to be deleted has Two Children
You cannot simply remove the node because it connects two separate branches.
1. Find the node's **Inorder Successor** (the smallest value in its right subtree: go right once, then left all the way down).
2. Overwrite the target node's data with the Inorder Successor's data.
3. Recursively delete the Inorder Successor from the right subtree (which is guaranteed to fall under Case 1 or Case 2).

```c
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
        // Node with only one child or no child
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        } else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }

        // Node with two children: Get inorder successor
        struct Node* temp = minValueNode(root->right);
        root->data = temp->data;
        // Delete the successor
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}
```

---

## 7. Introduction to Self-Balancing Trees (AVL)

If keys are inserted in sorted order (e.g., 10, 20, 30, 40, 50), the BST degrades into a linear chain with height $H = N$ and search time $O(N)$.

To guarantee $O(\log N)$ performance, **AVL Trees** enforce a strict balance factor:
$$\text{Balance Factor} = \text{Height}(\text{LeftSubtree}) - \text{Height}(\text{RightSubtree}) \in \{-1, 0, +1\}$$
Whenever an insertion or deletion causes the balance factor to exceed $\pm 1$, tree rotations (LL, RR, LR, RL rotations) restore balance in $O(1)$ time.
"""
  },
  {
    "id": "note-dsd-kmaps",
    "title": "Boolean Minimization: Karnaugh Maps & Quine-McCluskey Method",
    "subjectCode": "24CS320",
    "subjectName": "Digital System Design",
    "unitNumber": 1,
    "readTime": "14 min read",
    "tags": ["Digital Electronics", "K-Map", "Boolean Algebra", "Quine-McCluskey"],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      { "id": "boolean-canonical", "title": "1. Canonical Forms (SOP and POS)", "level": 2 },
      { "id": "kmap-basics", "title": "2. Karnaugh Map Structure & Gray Code", "level": 2 },
      { "id": "grouping-rules", "title": "3. K-Map Grouping Rules", "level": 2 },
      { "id": "dont-care", "title": "4. Minimization with Don't Care Conditions", "level": 2 },
      { "id": "five-var-kmap", "title": "5. 5-Variable K-Maps", "level": 2 },
      { "id": "quine-mccluskey", "title": "6. Quine-McCluskey Tabular Reduction Method", "level": 2 }
    ],
    "content": """# Boolean Minimization: Karnaugh Maps & Quine-McCluskey Method

## 1. Canonical Forms (SOP and POS)

In digital design, Boolean logic functions are expressed in two standard formats:

1. **Sum of Products (SOP):** Formed by summing (ORing) fundamental product terms (**minterms** $m_i$) where the function evaluates to 1.
   $$F(A,B,C) = \sum m(1, 3, 5, 7)$$
2. **Product of Sums (POS):** Formed by multiplying (ANDing) fundamental sum terms (**maxterms** $M_i$) where the function evaluates to 0.
   $$F(A,B,C) = \prod M(0, 2, 4, 6)$$

---

## 2. Karnaugh Map Structure & Gray Code

A **K-Map** is a graphical diagram of $2^n$ cells, where each cell represents a distinct minterm. Adjacent cells differ by exactly **one bit** (using **Gray Code** sequence: `00, 01, 11, 10`).

This adjacency leverages the Boolean adjacency rule:
$$A B + A \overline{B} = A(B + \overline{B}) = A$$

### 4-Variable K-Map Layout:
```
      CD   00    01    11    10
  AB   +-----+-----+-----+-----+
  00   | m0  | m1  | m3  | m2  |
       +-----+-----+-----+-----+
  01   | m4  | m5  | m7  | m6  |
       +-----+-----+-----+-----+
  11   | m12 | m13 | m15 | m14 |
       +-----+-----+-----+-----+
  10   | m8  | m9  | m11 | m10 |
       +-----+-----+-----+-----+
```
*Notice:* The 3rd and 4th rows/columns are flipped (`11` precedes `10`) to maintain single-bit distance.

---

## 3. K-Map Grouping Rules

To achieve the minimal Sum of Products:
1. Groups must contain $2^k$ adjacent cells ($1, 2, 4, 8, 16$).
2. Larger groups eliminate more literals:
   - Group of 2 (Pair) eliminates 1 variable.
   - Group of 4 (Quad) eliminates 2 variables.
   - Group of 8 (Octet) eliminates 3 variables.
3. Groups can wrap around the edges (corners $m0, m2, m8, m10$ form a valid quad).
4. Every '1' cell must be included in at least one group.
5. Identify **Essential Prime Implicants (EPI)**: Groups containing at least one '1' that cannot be covered by any other group.

---

## 4. Minimization with Don't Care Conditions

A **Don't Care** condition ($d$ or $X$) represents input combinations that never occur in practice (e.g. invalid BCD codes 1010 through 1111) or whose output has no operational significance.

### Optimization Strategy:
- Treat Don't Care cells as '1' **only if** doing so enables a larger group size.
- Otherwise, ignore them (treat as '0') to avoid redundant circuitry.

---

## 5. 5-Variable K-Maps

A 5-variable function $F(A,B,C,D,E)$ requires $2^5 = 32$ cells, drawn as two 4-variable (16-cell) layers side by side:
- **Layer 1:** $A = 0$ (minterms 0 to 15)
- **Layer 2:** $A = 1$ (minterms 16 to 31)

Adjacency exists both within a layer and **superimposed across the two layers** (e.g., cell 5 in Layer 1 is adjacent to cell 21 in Layer 2).

---

## 6. Quine-McCluskey Tabular Reduction Method

For functions with 5 or more variables, K-Maps become unwieldy. The **Quine-McCluskey (QM)** algorithm provides a systematic, computer-implementable tabular method:

1. **Group by Weight:** Categorize minterms based on the number of '1's in their binary representation.
2. **Successive Matching:** Compare terms between adjacent groups that differ by exactly 1 bit. Combine them and replace the differing bit with a hyphen (`-`). Mark used terms with checkmarks.
3. **Repeat:** Continue combining 2-variable terms into 4-variable terms until no further combinations are possible. Unchecked terms are **Prime Implicants (PI)**.
4. **Prime Implicant Table:** Construct a matrix of Prime Implicants vs original minterms. Columns with a single 'X' indicate **Essential Prime Implicants (EPI)**. Cover all remaining minterms with minimum cost.
"""
  },
  {
    "id": "note-co-memory",
    "title": "Computer Memory Hierarchy, Cache Mapping & Virtual Memory",
    "subjectCode": "24CS340",
    "subjectName": "Computer Organization",
    "unitNumber": 3,
    "readTime": "16 min read",
    "tags": ["Computer Organization", "Cache Memory", "Virtual Memory", "Hardware"],
    "lastUpdated": "2026-10-13",
    "tableOfContents": [
      { "id": "memory-hierarchy", "title": "1. The Memory Hierarchy Pyramid", "level": 2 },
      { "id": "locality-of-ref", "title": "2. Principle of Locality of Reference", "level": 2 },
      { "id": "cache-mapping", "title": "3. Cache Mapping Techniques", "level": 2 },
      { "id": "write-policies", "title": "4. Cache Write Policies", "level": 2 },
      { "id": "virtual-memory", "title": "5. Virtual Memory & Paging", "level": 2 },
      { "id": "tlb-translation", "title": "6. Translation Lookaside Buffer (TLB)", "level": 2 }
    ],
    "content": """# Computer Memory Hierarchy, Cache Mapping & Virtual Memory

## 1. The Memory Hierarchy Pyramid

Modern computer systems resolve the tradeoff between speed, capacity, and cost through a multi-level hierarchy:

```
      /\\      Registers (Fastest, Smallest ~KB, CPU Clock Speed)
     /  \\     L1 / L2 / L3 SRAM Cache (Slightly slower, ~MB)
    /    \\    Main Memory DRAM (Moderate speed, ~GB)
   /      \\   Solid State Drive (NAND Flash) / HDD (~TB)
  /________\\  Archive / Cloud Storage (Slowest, Infinite capacity)
```

Average memory access time:
$$T_{\text{avg}} = h \cdot C + (1 - h) \cdot M$$
Where $h$ is Cache Hit Ratio, $C$ is Cache access time, and $M$ is Main Memory Miss Penalty.

---

## 2. Principle of Locality of Reference

Cache works effectively due to the behavioral characteristics of software programs:

1. **Temporal Locality:** If a memory location is referenced, it will tend to be referenced again soon (e.g. loop control variables, instructions inside loops).
2. **Spatial Locality:** If a memory location is referenced, nearby memory locations will tend to be referenced soon (e.g. sequential code execution, array element traversals).

---

## 3. Cache Mapping Techniques

Main memory is partitioned into blocks (lines) of size $B$ bytes. The CPU generates a physical address that must be mapped to cache slots.

### 1. Direct Mapping:
Each main memory block maps to exactly one specific cache line:
$$i = j \pmod m$$
Where $i$ is cache line index, $j$ is main memory block number, and $m$ is total cache lines.
- **Address Breakdown:** `[ Tag | Line Index | Word Offset ]`
- **Advantage:** Simplest hardware; fast tag comparison.
- **Disadvantage:** High conflict misses if two active blocks map to the same line index.

### 2. Fully Associative Mapping:
A main memory block can be loaded into **any** free cache line.
- **Address Breakdown:** `[ Tag | Word Offset ]`
- **Advantage:** Zero conflict misses; flexible.
- **Disadvantage:** Expensive hardware; requires parallel associative comparison against all cache line tags simultaneously.

### 3. Set-Associative Mapping (Best Compromise):
Cache lines are grouped into $S$ sets, each containing $K$ lines ($K$-way set associative). A block maps to a specific set, but can reside in any line within that set:
$$\text{Set} = j \pmod S$$
- **Address Breakdown:** `[ Tag | Set Index | Word Offset ]`

---

## 4. Cache Write Policies

When the CPU executes a store/write operation to memory:

1. **Write-Through:**
   - Both cache and main memory are updated simultaneously.
   - Ensures memory is always up-to-date; simple but incurs memory bus write traffic.
2. **Write-Back (Copy-Back):**
   - Updates are made **only in cache**.
   - A **Dirty Bit** is set on the modified cache block.
   - The block is written to main memory only when it is evicted/replaced.
   - Minimizes bus traffic; higher performance.

---

## 5. Virtual Memory & Paging

Virtual Memory decouples programmer-visible address space from physical RAM capacity, allowing execution of processes larger than physical memory.

- **Virtual Address Space:** Divided into fixed-size units called **Pages** (typically 4 KB).
- **Physical Memory:** Divided into matching units called **Page Frames**.
- **Page Table:** Maintained by the Operating System in main memory to translate Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).
- **Page Fault:** Triggered when the CPU attempts to access a page marked invalid (not currently resident in physical RAM). The OS fetches the required page from secondary storage.

---

## 6. Translation Lookaside Buffer (TLB)

Because the Page Table resides in RAM, every memory reference would theoretically require two memory accesses (one for page translation, one for the data).

To eliminate this bottleneck, modern processors use a **Translation Lookaside Buffer (TLB)**:
- A high-speed associative hardware cache inside the Memory Management Unit (MMU).
- Stores the most recent Virtual Page Number to Physical Frame Number translations.
- If **TLB Hit**, address translation completes in a single clock cycle with zero RAM overhead.
"""
  },
  {
    "id": "note-dms-logic",
    "title": "Discrete Mathematics: Formal Logic & Equivalences Solutions",
    "subjectCode": "24CS350",
    "subjectName": "Discrete Mathematical Structures",
    "unitNumber": 1,
    "readTime": "15 min read",
    "tags": ["Discrete Math", "Logic", "Equivalences", "Proofs"],
    "lastUpdated": "2026-10-13",
    "tableOfContents": [
      { "id": "laws-of-logic", "title": "1. Fundamental Laws of Logic", "level": 2 },
      { "id": "proof-techniques", "title": "2. Proof Rules without Truth Tables", "level": 2 },
      { "id": "solved-problems", "title": "3. Step-by-Step Solved Proofs (Problems 1 to 9)", "level": 2 },
      { "id": "inference-rules", "title": "4. Rules of Inference in Valid Arguments", "level": 2 }
    ],
    "content": """# Discrete Mathematics: Formal Logic & Equivalences Solutions

## 1. Fundamental Laws of Logic

When proving propositional equivalences without constructing truth tables, cite these algebraic laws:

1. **Identity Laws:**
   - $p \wedge T_0 \equiv p$
   - $p \vee F_0 \equiv p$
2. **Domination (Null) Laws:**
   - $p \vee T_0 \equiv T_0$
   - $p \wedge F_0 \equiv F_0$
3. **Idempotent Laws:**
   - $p \vee p \equiv p$
   - $p \wedge p \equiv p$
4. **Double Negation Law:**
   - $\neg(\neg p) \equiv p$
5. **Commutative Laws:**
   - $p \vee q \equiv q \vee p$
   - $p \wedge q \equiv q \wedge p$
6. **Associative Laws:**
   - $(p \vee q) \vee r \equiv p \vee (q \vee r)$
   - $(p \wedge q) \wedge r \equiv p \wedge (q \wedge r)$
7. **Distributive Laws:**
   - $p \vee (q \wedge r) \equiv (p \vee q) \wedge (p \vee r)$
   - $p \wedge (q \vee r) \equiv (p \wedge q) \vee (p \wedge r)$
8. **De Morgan's Laws:**
   - $\neg(p \wedge q) \equiv \neg p \vee \neg q$
   - $\neg(p \vee q) \equiv \neg p \wedge \neg q$
9. **Absorption Laws:**
   - $p \vee (p \wedge q) \equiv p$
   - $p \wedge (p \vee q) \equiv p$
10. **Inverse (Complement) Laws:**
    - $p \vee \neg p \equiv T_0$ (Tautology)
    - $p \wedge \neg p \equiv F_0$ (Contradiction)
11. **Conditional Equivalences:**
    - $p \to q \equiv \neg p \vee q$
    - $\neg(p \to q) \equiv p \wedge \neg q$
    - $p \to q \equiv \neg q \to \neg p$ (Contrapositive)

---

## 2. Step-by-Step Solved Proofs (Problems 1 to 9)

### Problem 1: Prove $\neg(p \vee (\neg p \wedge q)) \equiv \neg p \wedge \neg q$
- **LHS:** $\neg(p \vee (\neg p \wedge q))$
- By Distributive Law on inner expression: $p \vee (\neg p \wedge q) \equiv (p \vee \neg p) \wedge (p \vee q)$
- By Inverse Law: $p \vee \neg p \equiv T_0$
- Expression becomes: $T_0 \wedge (p \vee q) \equiv p \vee q$ (Identity Law)
- Applying outer negation: $\neg(p \vee q)$
- By De Morgan's Law: $\equiv \neg p \wedge \neg q$
- **Q.E.D. (LHS = RHS)**

### Problem 2: Prove $(p \to q) \wedge [\neg q \wedge (r \vee \neg q)] \equiv \neg(q \vee p)$
- Consider the bracket: $[\neg q \wedge (r \vee \neg q)]$
- By Absorption Law: $\neg q \wedge (\neg q \vee r) \equiv \neg q$
- Substitute back: $(p \to q) \wedge \neg q$
- Replace conditional: $(\neg p \vee q) \wedge \neg q$
- By Distributive Law: $(\neg p \wedge \neg q) \vee (q \wedge \neg q)$
- By Inverse Law: $q \wedge \neg q \equiv F_0$
- By Identity Law: $(\neg p \wedge \neg q) \vee F_0 \equiv \neg p \wedge \neg q$
- By De Morgan's Law: $\neg p \wedge \neg q \equiv \neg(p \vee q) \equiv \neg(q \vee p)$
- **Q.E.D.**

### Problem 3: Prove $p \to (q \to r) \equiv (p \wedge q) \to r$ (Exportation Law)
- **LHS:** $p \to (q \to r)$
- Replace conditionals: $\neg p \vee (\neg q \vee r)$
- By Associative Law: $(\neg p \vee \neg q) \vee r$
- By De Morgan's Law: $\neg(p \wedge q) \vee r$
- Replace with conditional: $(p \wedge q) \to r$
- **Q.E.D.**

---

## 3. Rules of Inference in Valid Arguments

When validating argument forms:
- **Modus Ponens:** Given $p \to q$ and $p$, conclude $q$.
- **Modus Tollens:** Given $p \to q$ and $\neg q$, conclude $\neg p$.
- **Hypothetical Syllogism:** Given $p \to q$ and $q \to r$, conclude $p \to r$.
- **Disjunctive Syllogism:** Given $p \vee q$ and $\neg p$, conclude $q$.
- **Resolution:** Given $p \vee q$ and $\neg p \vee r$, conclude $q \vee r$.
"""
  },
  {
    "id": "note-m3-curve",
    "title": "Method of Least Squares & Correlation-Regression Analysis",
    "subjectCode": "24MA313",
    "subjectName": "Engineering Mathematics - III",
    "unitNumber": 1,
    "readTime": "14 min read",
    "tags": ["Mathematics", "Statistics", "Curve Fitting", "Regression"],
    "lastUpdated": "2026-10-13",
    "tableOfContents": [
      { "id": "least-squares-principle", "title": "1. The Principle of Least Squares", "level": 2 },
      { "id": "straight-line-fitting", "title": "2. Fitting a Straight Line (y = a + bx)", "level": 2 },
      { "id": "parabola-fitting", "title": "3. Fitting a Second Degree Parabola", "level": 2 },
      { "id": "exponential-curves", "title": "4. Fitting Exponential Curves", "level": 2 },
      { "id": "karl-pearson-r", "title": "5. Karl Pearson's Coefficient of Correlation", "level": 2 },
      { "id": "regression-lines", "title": "6. Lines of Regression & Properties", "level": 2 }
    ],
    "content": """# Method of Least Squares & Correlation-Regression Analysis

## 1. The Principle of Least Squares

Curve fitting establishes a functional relationship between two variables from observed experimental data points $(x_i, y_i)$.

The **Principle of Least Squares** minimizes the sum of squares of the vertical residuals (errors):
$$S = \sum_{i=1}^N e_i^2 = \sum_{i=1}^N [y_i - f(x_i)]^2$$
To minimize $S$, we differentiate with respect to each parameter ($a, b, c$) and equate to zero:
$$\\frac{\\partial S}{\\partial a} = 0, \\quad \\frac{\\partial S}{\\partial b} = 0$$

---

## 2. Fitting a Straight Line ($y = a + bx$)

The two **Normal Equations** for a straight line are:
$$
\\begin{aligned}
\\sum y &= N a + b \\sum x \\\\
\\sum x y &= a \\sum x + b \\sum x^2
\\end{aligned}
$$
Solving this linear system yields parameters $a$ (Y-intercept) and $b$ (slope).

---

## 3. Fitting a Second Degree Parabola ($y = a + bx + cx^2$)

The three **Normal Equations** are:
$$
\\begin{aligned}
\\sum y &= N a + b \\sum x + c \\sum x^2 \\\\
\\sum x y &= a \\sum x + b \\sum x^2 + c \\sum x^3 \\\\
\\sum x^2 y &= a \\sum x^2 + b \\sum x^3 + c \\sum x^4
\\end{aligned}
$$

---

## 4. Fitting Exponential Curves

### Case 1: $y = a e^{bx}$
Taking natural logarithm on both sides:
$$\\ln y = \\ln a + b x \\implies Y = A + b x$$
Where $Y = \\ln y$ and $A = \\ln a$. Fit as a linear equation and transform back: $a = e^A$.

### Case 2: $y = a b^x$
Taking base-10 logarithm:
$$\\log_{10} y = \\log_{10} a + x \\log_{10} b \\implies Y = A + B x$$
Where $Y = \\log y, A = \\log a, B = \\log b$. Transform back: $a = 10^A, b = 10^B$.

---

## 5. Karl Pearson's Coefficient of Correlation ($r$)

Measures the degree of linear association between two variables:
$$r = \\frac{N \\sum xy - (\\sum x)(\\sum y)}{\\sqrt{[N \\sum x^2 - (\\sum x)^2][N \\sum y^2 - (\\sum y)^2]}}$$

### Fundamental Properties:
1. Bounds: $-1 \\le r \\le +1$.
2. $r = +1$: Perfect positive linear correlation.
3. $r = -1$: Perfect negative linear correlation.
4. $r = 0$: No linear correlation (variables are uncorrelated).
5. $r$ is independent of change of origin and scale.

---

## 6. Lines of Regression

1. **Regression Line of $Y$ on $X$:**
   $$y - \\bar{y} = b_{yx}(x - \\bar{x})$$
   Where regression coefficient $b_{yx} = r \\frac{\\sigma_y}{\\sigma_x}$.

2. **Regression Line of $X$ on $Y$:**
   $$x - \\bar{x} = b_{xy}(y - \\bar{y})$$
   Where regression coefficient $b_{xy} = r \\frac{\\sigma_x}{\\sigma_y}$.

### Essential Properties:
- The two regression lines always intersect at the mean point $(\\bar{x}, \\bar{y})$.
- $r = \\pm \\sqrt{b_{yx} \\cdot b_{xy}}$ (geometric mean of regression coefficients).
- Both $b_{yx}$ and $b_{xy}$ must have the same algebraic sign as $r$.
"""
  },
  {
    "id": "note-uhv-harmony",
    "title": "Universal Human Values: Self-Exploration & Holistic Harmony",
    "subjectCode": "24HU311",
    "subjectName": "Universal Human Values - II",
    "unitNumber": 1,
    "readTime": "11 min read",
    "tags": ["Human Values", "Ethics", "Philosophy", "Harmony"],
    "lastUpdated": "2026-10-14",
    "tableOfContents": [
      { "id": "need-for-uhv", "title": "1. Need for Value Education in Engineering", "level": 2 },
      { "id": "self-exploration", "title": "2. Process of Self-Exploration", "level": 2 },
      { "id": "sukha-suvidha", "title": "3. Continuous Happiness (Sukha) vs Physical Facilities (Suvidha)", "level": 2 },
      { "id": "self-and-body", "title": "4. Harmony between Self ('I') and Body", "level": 2 },
      { "id": "trust-and-respect", "title": "5. Values in Human Relationships: Trust and Respect", "level": 2 },
      { "id": "four-orders", "title": "6. The Four Orders of Nature & Mutual Fulfillment", "level": 2 }
    ],
    "content": """# Universal Human Values: Self-Exploration & Holistic Harmony

## 1. Need for Value Education in Engineering

Technical education provides engineering proficiency—how to design, construct, optimize, and compute (**Skill Domain**).

However, skill alone without clear ethical purpose leads to environmental degradation, resource exploitation, stress, and societal fragmentation.

Value Education provides clarity on **what to do** (**Value Domain**)—ensuring that technical competence is deployed in service of human welfare, ecological sustainability, and societal harmony.

---

## 2. Process of Self-Exploration

Self-exploration is the experiential process of observing one's inner aspirations and validating them against **Natural Acceptance**:

- **Natural Acceptance (Sahaj Svikriti):** An innate, invariant human faculty that recognizes what is universally right, healthy, and mutually fulfilling (e.g. unconditional respect, trust, and non-violence).
- It is independent of peer pressure, conditioning, religious dogma, or temporal trends.
- **Proposal -> Verification:** Every concept in this course is presented as a proposal to be tested through experiential validation in daily life.

---

## 3. Continuous Happiness (Sukha) vs Physical Facilities (Suvidha)

Human needs fall into two fundamental categories:

| Dimension | Continuous Happiness (Sukha) | Physical Facilities (Suvidha) |
| :--- | :--- | :--- |
| **Need Domain** | Need of the Self ('I') | Need of the Body |
| **Character** | Qualitative (e.g. Trust, Respect, Love) | Quantitative (e.g. Food, Clothing, Shelter) |
| **Duration** | Continuous (we desire happiness 100% of the time) | Temporary (required only when needed) |
| **Fulfillment** | Right Understanding and Right Feelings | Physical Production and Consumption |

> [!IMPORTANT]
> Physical facilities are necessary for bodily sustenance, but cannot substitute for right understanding. A wealthy individual lacking trust and respect remains profoundly unhappy.

---

## 4. Harmony between Self ('I') and Body

The human being is an integrated co-existence of **Self ('I')** (conscious, perceiving entity) and **Body** (material, physicochemical instrument).

- **Sanyama (Self-Regulation):** The feeling of responsibility in the Self for nurturing, protecting, and rightly utilizing the body.
- **Swasthya (Health):** The natural state where every bodily organ functions in harmonious coordination without illness.

---

## 5. Values in Human Relationships: Trust and Respect

### 1. Trust (Vishwas) - The Foundational Value:
Trust is the assurance that the other person genuinely intends my well-being.
- **Intention (What one naturally wants):** Every human naturally wants continuous happiness and prosperity.
- **Competence (Ability to fulfill intention):** Often lacking due to lack of right understanding.
- Confusion arises when we judge ourselves by our **intentions**, but judge others by their **competence**!

### 2. Respect (Samman):
Respect means 'Right Evaluation'.
- Evaluating someone for who they are without differentiation based on body (gender, race, age), physical facilities (wealth, position), or beliefs (religion, ideology).

---

## 6. The Four Orders of Nature & Mutual Fulfillment

Nature consists of four interconnected orders:
1. **Material Order (Padartha Avastha):** Soil, water, minerals, atmosphere (Composing / Decomposing).
2. **Plant / Bio Order (Prana Avastha):** Flora, trees, agriculture (Growth / Respiration).
3. **Animal Order (Jiva Avastha):** Animals, birds (Co-existence of body and animal will to live).
4. **Human Order (Jnana Avastha):** Human beings (Potential for Right Understanding and Knowledge).

The first three orders naturally exist in mutual fulfillment and cyclical recyclability. Only the human order currently lives in disharmony due to delusion. Achieving right understanding enables humanity to participate responsibly in universal ecological harmony.
"""
  }
]

code = '''import { Note } from '../types';

export const NOTES: Note[] = ''' + json.dumps(notes, indent=2) + ''';

export function getNoteById(id: string): Note | undefined {
  return NOTES.find(n => n.id.toLowerCase() === id.toLowerCase());
}

export function getNotesBySubject(subjectCode: string): Note[] {
  return NOTES.filter(n => n.subjectCode.toLowerCase() === subjectCode.toLowerCase());
}
'''

with open('src/data/notesData.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Generated src/data/notesData.ts with", len(notes), "editorial-grade study notes.")
