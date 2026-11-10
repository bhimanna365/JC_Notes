import { Note } from '../types';

export const NOTES: Note[] = [
  {
    "id": "note-dma-cpp",
    "title": "Dynamic Memory Allocation in C++ (new and delete)",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "unitNumber": 2,
    "readTime": "12 min read",
    "tags": [
      "C++",
      "Memory Management",
      "Pointers",
      "OOP"
    ],
    "lastUpdated": "2026-10-10",
    "tableOfContents": [
      {
        "id": "what-is-dma",
        "title": "1. What is Dynamic Memory Allocation?",
        "level": 2
      },
      {
        "id": "new-operator",
        "title": "2. The new Operator",
        "level": 2
      },
      {
        "id": "delete-operator",
        "title": "3. The delete Operator",
        "level": 2
      },
      {
        "id": "dynamic-arrays",
        "title": "4. Allocating Dynamic Arrays",
        "level": 2
      },
      {
        "id": "dynamic-objects",
        "title": "5. Dynamic Objects & Constructors",
        "level": 2
      },
      {
        "id": "memory-leaks",
        "title": "6. Memory Leaks & Dangling Pointers",
        "level": 2
      },
      {
        "id": "new-vs-malloc",
        "title": "7. Comparison: new/delete vs malloc/free",
        "level": 2
      }
    ],
    "content": "# Dynamic Memory Allocation in C++\n\n## 1. What is Dynamic Memory Allocation?\n\nIn C++, memory can be allocated in two primary ways:\n\n1. **Static / Compile-Time Allocation:** Memory is allocated at compile time on the Stack or Data Segment (e.g., standard local variables, global variables, and fixed-size arrays). The size must be known before execution.\n2. **Dynamic / Run-Time Allocation:** Memory is allocated during program execution from the **Free Store (Heap)**. The size can be determined dynamically based on user input or runtime requirements.\n\nDynamic allocation is essential when:\n- The exact size of data structures cannot be predicted before execution.\n- We need objects whose lifetime extends beyond the scope of the function that created them.\n- Large blocks of data must be allocated without risking stack overflow.\n\n---\n\n## 2. The `new` Operator\n\nThe `new` operator allocates memory for an object or primitive type from the heap and returns a typed pointer to the allocated memory.\n\n### Syntax for Single Variables:\n```cpp\npointer_variable = new data_type;\npointer_variable = new data_type(initial_value); // with initialization\n```\n\n### Example:\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Allocate an integer on the heap\n    int *p = new int;\n    *p = 45;\n    cout << \"Value of *p: \" << *p << \" at address: \" << p << endl;\n\n    // Allocate and initialize an integer in one statement\n    int *q = new int(100);\n    cout << \"Value of *q: \" << *q << endl;\n\n    delete p;\n    delete q;\n    return 0;\n}\n```\n\n> [!NOTE]\n> If the heap has insufficient memory, `new` automatically throws a `std::bad_alloc` exception (or returns `nullptr` if `new(nothrow)` is specified).\n\n---\n\n## 3. The `delete` Operator\n\nWhen dynamically allocated memory is no longer needed, it must be explicitly deallocated using the `delete` operator to return it to the free store.\n\n### Syntax:\n```cpp\ndelete pointer_variable;         // For single variables\ndelete[] array_pointer_variable; // For dynamically allocated arrays\n```\n\n---\n\n## 4. Allocating Dynamic Arrays\n\nYou can allocate a contiguous sequence of elements whose size is determined at runtime:\n\n### Syntax:\n```cpp\nint *arr = new int[size];\n```\n\n### Example:\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cout << \"Enter array size: \";\n    cin >> n;\n\n    // Allocate dynamic array\n    int *arr = new int[n];\n\n    cout << \"Enter \" << n << \" elements:\" << endl;\n    for (int i = 0; i < n; i++) {\n        cin >> arr[i];\n    }\n\n    cout << \"Array elements: \";\n    for (int i = 0; i < n; i++) {\n        cout << *(arr + i) << \" \";\n    }\n    cout << endl;\n\n    // Crucial: use delete[] with square brackets for arrays!\n    delete[] arr;\n    arr = nullptr; // Reset pointer to avoid dangling reference\n\n    return 0;\n}\n```\n\n> [!CAUTION]\n> Using `delete arr` instead of `delete[] arr` on an array causes undefined behavior. In particular, it only calls the destructor for the first element!\n\n---\n\n## 5. Dynamic Objects & Constructors\n\nOne of the greatest advantages of `new` over C's `malloc()` is that `new` automatically invokes the class **constructor**, and `delete` automatically invokes the class **destructor**.\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nclass Student {\nprivate:\n    string name;\n    int rollNo;\npublic:\n    Student(string n, int r) : name(n), rollNo(r) {\n        cout << \"[Constructor] Student created: \" << name << endl;\n    }\n    ~Student() {\n        cout << \"[Destructor] Student destroyed: \" << name << endl;\n    }\n    void display() {\n        cout << \"Name: \" << name << \", Roll No: \" << rollNo << endl;\n    }\n};\n\nint main() {\n    // Dynamic object allocation invokes constructor\n    Student *s = new Student(\"Ananya\", 101);\n    s->display();\n\n    // delete invokes destructor and frees heap memory\n    delete s;\n    return 0;\n}\n```\n\n---\n\n## 6. Memory Leaks & Dangling Pointers\n\n### Memory Leak:\nOccurs when heap memory is allocated using `new`, but never released using `delete`, and all pointers referencing that block are lost.\n```cpp\nvoid badFunction() {\n    int *ptr = new int[1000];\n    // Function exits without calling delete[] ptr\n    // 4000 bytes leaked on the heap!\n}\n```\n\n### Dangling Pointer:\nOccurs when memory is deallocated using `delete`, but the pointer still holds the old address and is subsequently accessed.\n```cpp\nint *p = new int(50);\ndelete p;\n// p is now dangling!\n// *p = 20; // DANGEROUS: Undefined behavior\np = nullptr; // SAFE: Always nullify pointers after deletion\n```\n\n---\n\n## 7. Comparison: `new/delete` vs `malloc/free`\n\n| Feature | `new` and `delete` | `malloc()` and `free()` |\n| :--- | :--- | :--- |\n| **Language** | Native C++ operators | C standard library functions (`<cstdlib>`) |\n| **Constructors / Destructors** | Automatically invoked | Neither is invoked (pure byte allocation) |\n| **Return Type** | Returns exact typed pointer (e.g. `int*`) | Returns `void*` (requires explicit casting) |\n| **Size Computation** | Automatic: `new int[10]` computes `10 * sizeof(int)` | Manual: `malloc(10 * sizeof(int))` |\n| **Failure Handling** | Throws `std::bad_alloc` exception | Returns `NULL` pointer |\n| **Overloadable** | Can be overloaded for custom classes | Cannot be overloaded |\n"
  },
  {
    "id": "note-friend-cpp",
    "title": "Friend Functions and Friend Classes in C++",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "unitNumber": 2,
    "readTime": "10 min read",
    "tags": [
      "C++",
      "Encapsulation",
      "Friend Function",
      "OOP"
    ],
    "lastUpdated": "2026-10-11",
    "tableOfContents": [
      {
        "id": "what-is-friend",
        "title": "1. Concept of Friendship in C++",
        "level": 2
      },
      {
        "id": "syntax-rules",
        "title": "2. Declaration Syntax & Rules",
        "level": 2
      },
      {
        "id": "bridging-classes",
        "title": "3. Bridging Two Classes with a Friend Function",
        "level": 2
      },
      {
        "id": "member-as-friend",
        "title": "4. Member Function of Another Class as Friend",
        "level": 2
      },
      {
        "id": "friend-classes",
        "title": "5. Friend Classes",
        "level": 2
      },
      {
        "id": "pros-and-cons",
        "title": "6. Advantages & Potential Pitfalls",
        "level": 2
      }
    ],
    "content": "# Friend Functions and Friend Classes in C++\n\n## 1. Concept of Friendship in C++\n\nIn C++, encapsulation normally restricts access to `private` and `protected` data members exclusively to member functions of the declaring class.\n\nHowever, situations arise where an external non-member function or another class needs direct, high-performance access to private members of two or more independent classes (such as mathematical vector operations, matrix multiplication, or stream insertion operators).\n\nTo solve this cleanly, C++ provides the **`friend`** keyword. A friend function is **not a member** of the class, but is granted full access permissions to private and protected members.\n\n---\n\n## 2. Declaration Syntax & Rules\n\n### Declaration:\nInside the class body (in `private`, `protected`, or `public` section):\n```cpp\nclass Box {\nprivate:\n    double width;\npublic:\n    Box(double w) : width(w) {}\n    // Friend function declaration\n    friend void printWidth(Box b);\n};\n```\n\n### Definition:\nOutside the class body, without the `friend` keyword and without the scope resolution operator `::`:\n```cpp\nvoid printWidth(Box b) {\n    // Directly accesses private member 'width'\n    cout << \"Width: \" << b.width << endl;\n}\n```\n\n### Essential Rules for Friend Functions:\n1. **Not in Class Scope:** It is not a member of the class, so it cannot be called using the dot (`.`) or arrow (`->`) operator on an object.\n2. **Invoked like Normal Functions:** It is called like a regular global function: `printWidth(boxObj)`.\n3. **Takes Objects as Arguments:** Because it has no implicit `this` pointer, it must accept the target class object as a parameter (by value, pointer, or reference).\n4. **Placement is Arbitrary:** Declaration can be placed inside `private`, `protected`, or `public` sections with identical permissions.\n5. **Friendship is Granted, Not Taken:** Class A must explicitly declare that Function F or Class B is its friend. Class B cannot declare itself a friend of Class A.\n6. **Friendship is Neither Symmetric Nor Transitive:** If Class A is friend of Class B, Class B is NOT automatically friend of Class A. If A is friend of B and B is friend of C, A is NOT friend of C.\n7. **Friendship is Not Inherited:** Derived classes do not inherit friend status.\n\n---\n\n## 3. Bridging Two Classes with a Friend Function\n\nA prime use case is operating simultaneously on private fields of two distinct classes:\n\n```cpp\n#include <iostream>\nusing namespace std;\n\n// Forward declaration of Class B\nclass ClassB;\n\nclass ClassA {\nprivate:\n    int numA;\npublic:\n    ClassA(int val) : numA(val) {}\n    // Declare friend function accepting both classes\n    friend int add(ClassA a, ClassB b);\n};\n\nclass ClassB {\nprivate:\n    int numB;\npublic:\n    ClassB(int val) : numB(val) {}\n    // Declare identical friend function\n    friend int add(ClassA a, ClassB b);\n};\n\n// Friend function definition\nint add(ClassA a, ClassB b) {\n    return a.numA + b.numB;\n}\n\nint main() {\n    ClassA objA(40);\n    ClassB objB(60);\n    cout << \"Sum of private members from two classes: \" << add(objA, objB) << endl;\n    return 0;\n}\n```\n\n---\n\n## 4. Member Function of Another Class as Friend\n\nYou can grant friend privileges to a specific member function of an existing class:\n\n```cpp\nclass Sample; // Forward declaration\n\nclass Manager {\npublic:\n    void audit(Sample s);\n};\n\nclass Sample {\nprivate:\n    int secretCode;\npublic:\n    Sample(int code) : secretCode(code) {}\n    // Only Manager::audit has friend access\n    friend void Manager::audit(Sample s);\n};\n```\n\n---\n\n## 5. Friend Classes\n\nWhen an entire class needs access to all private members of another class, you declare the entire class as a `friend class`:\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nclass BankAccount {\nprivate:\n    double balance;\n    string accountNumber;\npublic:\n    BankAccount(string acc, double bal) : accountNumber(acc), balance(bal) {}\n    // Authorize BankTeller as a friend class\n    friend class BankTeller;\n};\n\nclass BankTeller {\npublic:\n    void printStatement(const BankAccount &acc) {\n        // Direct access to private balance and accountNumber\n        cout << \"Account: \" << acc.accountNumber << \" | Balance: $\" << acc.balance << endl;\n    }\n    void deposit(BankAccount &acc, double amount) {\n        acc.balance += amount;\n        cout << \"Deposited $\" << amount << \". New balance: $\" << acc.balance << endl;\n    }\n};\n\nint main() {\n    BankAccount myAccount(\"SB-100293\", 5000.0);\n    BankTeller teller;\n    teller.printStatement(myAccount);\n    teller.deposit(myAccount, 1200.0);\n    return 0;\n}\n```\n\n---\n\n## 6. Advantages & Potential Pitfalls\n\n### Advantages:\n- Facilitates operator overloading for stream operators `<<` and `>>`.\n- Allows clean mathematical operations across multiple heterogeneous classes.\n- Avoids exposing public getter/setter methods that might compromise data integrity.\n\n### Potential Pitfalls:\n- Overuse weakens data hiding and tightens coupling between classes.\n- If a class has too many friends, internal representation changes will require cascading updates to all friend functions.\n"
  },
  {
    "id": "note-operator-cpp",
    "title": "Operator Overloading Masterclass in C++",
    "subjectCode": "24CS310",
    "subjectName": "Object Oriented Programming using C++",
    "unitNumber": 2,
    "readTime": "15 min read",
    "tags": [
      "C++",
      "Polymorphism",
      "Operator Overloading",
      "OOP"
    ],
    "lastUpdated": "2026-10-11",
    "tableOfContents": [
      {
        "id": "what-is-op-overloading",
        "title": "1. What is Operator Overloading?",
        "level": 2
      },
      {
        "id": "rules-and-restrictions",
        "title": "2. Rules & Non-Overloadable Operators",
        "level": 2
      },
      {
        "id": "unary-operator",
        "title": "3. Overloading Unary Operators",
        "level": 2
      },
      {
        "id": "binary-operator",
        "title": "4. Overloading Binary Operators",
        "level": 2
      },
      {
        "id": "friend-operators",
        "title": "5. Operator Overloading using Friend Functions",
        "level": 2
      },
      {
        "id": "stream-operators",
        "title": "6. Overloading Stream Operators (<< and >>)",
        "level": 2
      }
    ],
    "content": "# Operator Overloading Masterclass in C++\n\n## 1. What is Operator Overloading?\n\nIn C++, **Operator Overloading** is a form of **Compile-Time (Static) Polymorphism** that allows developers to redefine the behavior of existing C++ operators (such as `+`, `-`, `*`, `==`, `<<`) when applied to user-defined types (classes and structs).\n\nWithout operator overloading, adding two complex numbers requires awkward function calls:\n```cpp\nComplex c3 = c1.add(c2); // Verbose\n```\nWith operator overloading, the syntax matches natural mathematical conventions:\n```cpp\nComplex c3 = c1 + c2;    // Clean, readable, and intuitive\n```\n\n---\n\n## 2. Rules & Non-Overloadable Operators\n\n### Strict Rules:\n1. **No New Operators:** You cannot invent new operator symbols (such as `**` for exponentiation or `@@`).\n2. **Precedence and Associativity are Immutable:** The operator's precedence level and associativity rules remain unchanged.\n3. **Arity is Fixed:** A unary operator cannot be overloaded as binary, and a binary operator cannot be overloaded as unary.\n4. **At Least One User-Defined Operand:** You cannot alter the behavior of operators on built-in types (e.g. you cannot redefine `int + int`).\n\n### Operators That CANNOT Be Overloaded in C++:\n- Scope Resolution Operator (`::`)\n- Member Access Operator (`.`)\n- Pointer-to-Member Operator (`.*`)\n- Ternary Conditional Operator (`?:`)\n- `sizeof` Operator\n- `typeid` Operator\n\n---\n\n## 3. Overloading Unary Operators\n\nA unary operator acts on a single operand. When overloaded as a member function, it takes **no arguments** because the calling object (`this`) is the implicit operand.\n\n### Overloading Unary Minus (`-`):\n```cpp\n#include <iostream>\nusing namespace std;\n\nclass Space {\nprivate:\n    int x, y, z;\npublic:\n    Space(int a = 0, int b = 0, int c = 0) : x(a), y(b), z(c) {}\n\n    // Overload unary minus\n    void operator-() {\n        x = -x;\n        y = -y;\n        z = -z;\n    }\n\n    void display() const {\n        cout << \"(\" << x << \", \" << y << \", \" << z << \")\" << endl;\n    }\n};\n\nint main() {\n    Space s(10, -20, 30);\n    cout << \"Original coordinates: \";\n    s.display();\n\n    -s; // Invokes s.operator-()\n\n    cout << \"After negation (-s):  \";\n    s.display();\n    return 0;\n}\n```\n\n---\n\n## 4. Overloading Binary Operators\n\nA binary operator operates on two operands. When overloaded as a member function:\n- The left-hand operand is the calling object (`*this`).\n- The right-hand operand is passed as an explicit parameter.\n\n### Overloading Binary Plus (`+`) for Complex Numbers:\n```cpp\n#include <iostream>\nusing namespace std;\n\nclass Complex {\nprivate:\n    double real;\n    double imag;\npublic:\n    Complex(double r = 0, double i = 0) : real(r), imag(i) {}\n\n    // Overloading binary + as a member function\n    Complex operator+(const Complex &other) const {\n        return Complex(real + other.real, imag + other.imag);\n    }\n\n    // Overloading equality operator ==\n    bool operator==(const Complex &other) const {\n        return (real == other.real && imag == other.imag);\n    }\n\n    void display() const {\n        cout << real << \" + \" << imag << \"i\" << endl;\n    }\n};\n\nint main() {\n    Complex c1(3.5, 2.5);\n    Complex c2(1.5, 4.5);\n\n    // c1 + c2 translates to c1.operator+(c2)\n    Complex c3 = c1 + c2;\n\n    cout << \"c1: \"; c1.display();\n    cout << \"c2: \"; c2.display();\n    cout << \"c3 (c1 + c2): \"; c3.display();\n\n    if (c1 == c2) cout << \"c1 equals c2\" << endl;\n    else cout << \"c1 does not equal c2\" << endl;\n\n    return 0;\n}\n```\n\n---\n\n## 5. Operator Overloading using Friend Functions\n\nWhen an operator is overloaded as a **friend function**:\n- Unary operators take **1 parameter**.\n- Binary operators take **2 parameters**.\n\n### Why Use Friend Functions for Binary Operators?\nWhen an operator is overloaded as a member function, the left operand must be an object of that class.\nFor example, `c1 + 5` works because `c1` is a `Complex` object.\nHowever, `5 + c1` fails because the integer `5` cannot invoke a `Complex::operator+()`.\n\nA friend function resolves this asymmetry:\n```cpp\nclass Complex {\n    double real, imag;\npublic:\n    Complex(double r = 0, double i = 0) : real(r), imag(i) {}\n\n    // Friend function allows double + Complex as well as Complex + Complex\n    friend Complex operator+(double lhs, const Complex &rhs) {\n        return Complex(lhs + rhs.real, rhs.imag);\n    }\n    friend Complex operator+(const Complex &lhs, double rhs) {\n        return Complex(lhs.real + rhs, lhs.imag);\n    }\n};\n```\n\n---\n\n## 6. Overloading Stream Operators (`<<` and `>>`)\n\nStream insertion (`<<`) and stream extraction (`>>`) operators **must be overloaded as friend functions** because their left operand is an `ostream` (e.g., `cout`) or `istream` (e.g., `cin`), not our custom class.\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nclass Vector2D {\nprivate:\n    double x, y;\npublic:\n    Vector2D(double xVal = 0, double yVal = 0) : x(xVal), y(yVal) {}\n\n    // Overload stream insertion operator <<\n    friend ostream& operator<<(ostream &out, const Vector2D &v) {\n        out << \"<\" << v.x << \", \" << v.y << \">\";\n        return out; // Enables chaining: cout << v1 << v2;\n    }\n\n    // Overload stream extraction operator >>\n    friend istream& operator>>(istream &in, Vector2D &v) {\n        cout << \"Enter X: \";\n        in >> v.x;\n        cout << \"Enter Y: \";\n        in >> v.y;\n        return in;\n    }\n};\n\nint main() {\n    Vector2D v1;\n    cout << \"Reading vector...\" << endl;\n    cin >> v1;\n    cout << \"Vector value: \" << v1 << endl;\n    return 0;\n}\n```\n"
  },
  {
    "id": "note-ds-stacks",
    "title": "Stack Data Structure, Infix to Postfix & Evaluation Algorithms",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 2,
    "readTime": "15 min read",
    "tags": [
      "Data Structures",
      "Stack",
      "Algorithms",
      "C"
    ],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      {
        "id": "stack-adt",
        "title": "1. The Stack Abstract Data Type (ADT)",
        "level": 2
      },
      {
        "id": "array-vs-linked",
        "title": "2. Array vs Linked List Representation",
        "level": 2
      },
      {
        "id": "expression-notations",
        "title": "3. Infix, Postfix, and Prefix Notations",
        "level": 2
      },
      {
        "id": "infix-to-postfix-algo",
        "title": "4. Infix to Postfix Conversion Algorithm",
        "level": 2
      },
      {
        "id": "postfix-eval-algo",
        "title": "5. Postfix Expression Evaluation Algorithm",
        "level": 2
      },
      {
        "id": "applications",
        "title": "6. Industrial & System Applications",
        "level": 2
      }
    ],
    "content": "# Stack Data Structure, Infix to Postfix & Evaluation Algorithms\n\n## 1. The Stack Abstract Data Type (ADT)\n\nA **Stack** is a linear data structure that adheres to the **LIFO (Last-In, First-Out)** principle: the element inserted most recently is the first one removed.\n\nAll insertions and deletions are restricted to a single endpoint called the **Top** of the stack.\n\n### Core Operations:\n- `push(item)`: Inserts an element onto the top of the stack. (Error condition: **Stack Overflow** if capacity reached).\n- `pop()`: Removes and returns the element at the top. (Error condition: **Stack Underflow** if stack is empty).\n- `peek()` / `top()`: Returns top element without removing it.\n- `isEmpty()`: Returns boolean true if `top == -1`.\n- `isFull()`: Returns boolean true if `top == MAX - 1`.\n\n---\n\n## 2. Array vs Linked List Representation\n\n### 1. Fixed Array Representation:\n```c\n#define MAX 100\ntypedef struct {\n    int items[MAX];\n    int top;\n} Stack;\n\nvoid init(Stack *s) { s->top = -1; }\nint isFull(Stack *s) { return s->top == MAX - 1; }\nint isEmpty(Stack *s) { return s->top == -1; }\n\nvoid push(Stack *s, int val) {\n    if (isFull(s)) {\n        printf(\"Stack Overflow!\\n\");\n        return;\n    }\n    s->items[++(s->top)] = val;\n}\n\nint pop(Stack *s) {\n    if (isEmpty(s)) {\n        printf(\"Stack Underflow!\\n\");\n        return -1;\n    }\n    return s->items[(s->top)--];\n}\n```\n\n### 2. Dynamic Linked List Representation:\nA linked list represents a stack where `head` is the `top`.\n- `push()` inserts a node at the front: `O(1)`.\n- `pop()` deletes the node from the front: `O(1)`.\n- Eliminates fixed capacity constraints; only bounded by system heap memory.\n\n---\n\n## 3. Infix, Postfix, and Prefix Notations\n\n| Notation | Format | Example | Parsing Mechanism |\n| :--- | :--- | :--- | :--- |\n| **Infix** | `operand1 operator operand2` | `(A + B) * C` | Requires parenthesis and precedence rules |\n| **Postfix (RPN)** | `operand1 operand2 operator` | `A B + C *` | Evaluated strictly left-to-right using a stack |\n| **Prefix (Polish)** | `operator operand1 operand2` | `* + A B C` | Evaluated right-to-left using a stack |\n\n### Operator Precedence & Associativity Table:\n| Operator | Symbol | Precedence | Associativity |\n| :--- | :--- | :--- | :--- |\n| Exponentiation | `^` | 3 (Highest) | Right to Left |\n| Multiplication / Division | `*`, `/`, `%` | 2 | Left to Right |\n| Addition / Subtraction | `+`, `-` | 1 | Left to Right |\n| Parentheses | `(`, `)` | Lowest inside stack | N/A |\n\n---\n\n## 4. Infix to Postfix Conversion Algorithm\n\n```\nAlgorithm InfixToPostfix(infixExpression):\n1. Initialize an empty character stack for operators.\n2. Initialize an empty postfix string.\n3. For each symbol in infixExpression:\n     a. If symbol is an operand (letter/digit):\n          Append symbol to postfix string.\n     b. Else if symbol is '(':\n          Push '(' onto stack.\n     c. Else if symbol is ')':\n          While stack top is not '(':\n              Pop stack and append to postfix string.\n          Pop and discard '('.\n     d. Else if symbol is an operator (+, -, *, /, ^):\n          While stack is not empty AND \n                precedence(stack[top]) >= precedence(symbol):\n              If symbol is '^' and stack[top] is '^':\n                  Break (exponentiation is right-associative)\n              Pop stack and append to postfix string.\n          Push symbol onto stack.\n4. While stack is not empty:\n     Pop stack and append to postfix string.\n5. Return postfix string.\n```\n\n### Complete Trace: `((A + B) * C - (D - E)) ^ (F + G)`\n- Postfix Output: `AB+C*DE--FG+^`\n\n---\n\n## 5. Postfix Expression Evaluation Algorithm\n\n```\nAlgorithm EvaluatePostfix(postfixExpression):\n1. Initialize an empty integer stack.\n2. For each token in postfixExpression:\n     a. If token is an operand (number):\n          Push integer value onto stack.\n     b. Else if token is an operator (op):\n          op2 = pop()  // Top element is second operand!\n          op1 = pop()  // Next element is first operand!\n          result = op1 <op> op2\n          Push result onto stack.\n3. Final result = pop().\n4. Return final result.\n```\n\n> [!WARNING]\n> Notice that `op2` is popped before `op1`! For non-commutative operations like subtraction (`-`) and division (`/`), computing `op1 - op2` is correct, whereas `op2 - op1` produces catastrophic errors.\n\n---\n\n## 6. Industrial & System Applications\n\n1. **Compiler Syntax Checking:** Validating matching braces `{}`, parentheses `()`, and square brackets `[]`.\n2. **Call Stack & Recursion:** Managing function activation records, local variables, and return instruction addresses.\n3. **Undo / Redo Buffers:** Text editors and graphic design software maintain action stacks.\n4. **Browser History:** Forward and Back button navigation.\n5. **Backtracking Algorithms:** Maze solving, N-Queens problem, and depth-first search (DFS).\n"
  },
  {
    "id": "note-ds-linkedlists",
    "title": "Linked Lists: Singly, Doubly & Circular with Header Nodes",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 3,
    "readTime": "14 min read",
    "tags": [
      "Data Structures",
      "Linked List",
      "C",
      "Pointers"
    ],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      {
        "id": "why-linked-lists",
        "title": "1. Why Linked Lists over Arrays?",
        "level": 2
      },
      {
        "id": "singly-linked-list",
        "title": "2. Singly Linked List (SLL)",
        "level": 2
      },
      {
        "id": "circular-sll",
        "title": "3. Circular Singly Linked List (CSLL)",
        "level": 2
      },
      {
        "id": "doubly-linked-list",
        "title": "4. Doubly Linked List (DLL)",
        "level": 2
      },
      {
        "id": "circular-dll-header",
        "title": "5. Circular DLL with Header Node",
        "level": 2
      },
      {
        "id": "polynomial-addition",
        "title": "6. Application: Polynomial Addition",
        "level": 2
      }
    ],
    "content": "# Linked Lists: Singly, Doubly & Circular with Header Nodes\n\n## 1. Why Linked Lists over Arrays?\n\n| Metric | Contiguous Array | Linked List |\n| :--- | :--- | :--- |\n| **Memory Allocation** | Contiguous chunk allocated at once | Scattered dynamic nodes connected by pointers |\n| **Insertion at Beginning** | `O(N)` (requires right-shifting all elements) | `O(1)` (rewires two pointer addresses) |\n| **Deletion at Beginning** | `O(N)` (requires left-shifting all elements) | `O(1)` (rewires head and frees node) |\n| **Random Access** | `O(1)` direct indexing: `arr[i]` | `O(N)` sequential traversal from head |\n| **Memory Overhead** | Zero pointer overhead per element | Extra 4/8 bytes per node for `next`/`prev` pointers |\n| **Cache Locality** | Outstanding (CPU hardware prefetching) | Poor (nodes scattered across heap) |\n\n---\n\n## 2. Singly Linked List (SLL)\n\nEach node contains data and a single pointer `next` pointing to the succeeding node. The last node points to `NULL`.\n\n```c\nstruct Node {\n    int data;\n    struct Node *next;\n};\n```\n\n### Essential Pointer Rewiring Diagrams:\n\n#### 1. Insert at Front:\n```c\nnewNode->next = head;\nhead = newNode;\n```\n\n#### 2. Insert at Rear:\n```c\nif (head == NULL) { head = newNode; return; }\nstruct Node *temp = head;\nwhile (temp->next != NULL) temp = temp->next;\ntemp->next = newNode;\n```\n\n#### 3. Delete at Front:\n```c\nif (head == NULL) return;\nstruct Node *temp = head;\nhead = head->next;\nfree(temp);\n```\n\n---\n\n## 3. Circular Singly Linked List (CSLL)\n\nIn a circular singly linked list, `last->next` loops back to `head` instead of pointing to `NULL`.\n\n> [!TIP]\n> If you maintain a pointer to the **`last` node** rather than the first node:\n> - **Front node** is accessible in `O(1)` via `last->next`.\n> - **Rear node** is accessible in `O(1)` as `last`.\n> - Both Insert Front and Insert Rear execute in `O(1)` time!\n\n---\n\n## 4. Doubly Linked List (DLL)\n\nA Doubly Linked List node has two pointers: `prev` pointing to the preceding node and `next` pointing to the successor.\n\n```c\nstruct Node {\n    int data;\n    struct Node *prev;\n    struct Node *next;\n};\n```\n\n### Two-Way Pointer Splicing:\n```c\n// Inserting newNode between temp and temp->next\nnewNode->next = temp->next;\nnewNode->prev = temp;\nif (temp->next != NULL)\n    temp->next->prev = newNode;\ntemp->next = newNode;\n```\n\n---\n\n## 5. Circular DLL with Header Node\n\nA **Header Node (Sentinel Node)** is a dummy node permanently situated at the start of the list. It holds no client data, but standardizes edge cases:\n\n1. **Empty list state:** `head->next = head; head->prev = head;`\n2. Eliminates checks for `head == NULL`.\n3. Eliminates special-case logic for inserting before the first node or deleting the last node.\n4. The list is completely symmetric and circular in both directions.\n\n---\n\n## 6. Application: Polynomial Representation & Addition\n\nA polynomial $P(x) = 4x^3 + 3x^2 - 5x + 7$ can be cleanly modeled as a linked list where each node contains:\n```c\nstruct PolyNode {\n    int coeff;\n    int exp;\n    struct PolyNode *next;\n};\n```\n\n### Polynomial Addition Algorithm:\n1. Traverse both polynomials simultaneously using pointers `p1` and `p2`.\n2. If `p1->exp == p2->exp`: Add coefficients. If sum != 0, append new node `(p1->coeff + p2->coeff, p1->exp)`. Advance both `p1` and `p2`.\n3. If `p1->exp > p2->exp`: Append copy of `p1` node to result. Advance `p1`.\n4. If `p2->exp > p1->exp`: Append copy of `p2` node to result. Advance `p2`.\n5. Append any remaining nodes from the non-empty polynomial.\n"
  },
  {
    "id": "note-ds-trees",
    "title": "Binary Search Trees (BST) & Non-Linear Hierarchies",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 4,
    "readTime": "16 min read",
    "tags": [
      "Data Structures",
      "Trees",
      "BST",
      "Algorithms"
    ],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      {
        "id": "tree-terminologies",
        "title": "1. Tree Terminologies & Properties",
        "level": 2
      },
      {
        "id": "binary-trees",
        "title": "2. Types of Binary Trees",
        "level": 2
      },
      {
        "id": "traversals",
        "title": "3. Tree Traversals (DFS & BFS)",
        "level": 2
      },
      {
        "id": "bst-definition",
        "title": "4. The BST Invariant Property",
        "level": 2
      },
      {
        "id": "bst-insertion",
        "title": "5. BST Insertion & Search",
        "level": 2
      },
      {
        "id": "bst-deletion",
        "title": "6. BST Deletion: All 3 Child Cases",
        "level": 2
      },
      {
        "id": "avl-intro",
        "title": "7. Introduction to Self-Balancing Trees",
        "level": 2
      }
    ],
    "content": "# Binary Search Trees (BST) & Non-Linear Hierarchies\n\n## 1. Tree Terminologies & Properties\n\nA **Tree** is a non-linear, hierarchical data structure composed of nodes connected by directed or undirected edges. A tree with $N$ vertices always contains exactly $N - 1$ edges and contains no cycles.\n\n### Key Terms:\n- **Root:** The topmost node with no parent.\n- **Leaf (Terminal) Node:** A node with no children (degree = 0).\n- **Internal (Non-terminal) Node:** A node with at least one child.\n- **Height of a Node:** The length of the longest path from the node to a leaf.\n- **Depth of a Node:** The length of the path from the root to that node.\n- **Degree of a Node:** The number of subtrees / children attached to that node.\n\n---\n\n## 2. Types of Binary Trees\n\nA **Binary Tree** is a tree where every node has **at most 2 children** (referred to as `left` and `right`).\n\n1. **Full (Strict) Binary Tree:** Every node has either 0 or 2 children.\n2. **Complete Binary Tree:** All levels are completely filled except possibly the last, which is filled from left to right without gaps.\n3. **Perfect Binary Tree:** All internal nodes have 2 children and all leaf nodes reside at the exact same depth. Total nodes $N = 2^{h+1} - 1$.\n4. **Degenerate (Skewed) Tree:** Every internal node has only one child. Structurally degrades into a linear linked list ($O(N)$ operations).\n\n---\n\n## 3. Tree Traversals (DFS & BFS)\n\n```c\nstruct Node {\n    int data;\n    struct Node *left;\n    struct Node *right;\n};\n```\n\n### 1. Depth-First Traversals (Recursive):\n- **Inorder (L - Root - R):**\n  Traverse left subtree, visit root, traverse right subtree.\n  *Note:* Inorder traversal of a BST produces strictly **ascending sorted order**!\n- **Preorder (Root - L - R):**\n  Visit root first, then left subtree, then right subtree.\n  *Use Case:* Creating a clone/copy of the tree or prefix expressions.\n- **Postorder (L - R - Root):**\n  Traverse left subtree, traverse right subtree, visit root last.\n  *Use Case:* Deleting a tree safely from leaves up, or postfix expressions.\n\n### 2. Breadth-First Traversal (Level-Order):\nVisits nodes level-by-level from top to bottom, left to right. Implemented using an auxiliary FIFO Queue.\n\n---\n\n## 4. The BST Invariant Property\n\nA **Binary Search Tree (BST)** enforces the following invariant for every node $X$:\n1. All keys in the **left subtree** of $X$ are strictly less than $X.key$:\n   $$\forall Y \\in \text{LeftSubtree}(X): Y.key < X.key$$\n2. All keys in the **right subtree** of $X$ are strictly greater than $X.key$:\n   $$\forall Z \\in \text{RightSubtree}(X): Z.key > X.key$$\n3. Both left and right subtrees must themselves be Binary Search Trees.\n\n---\n\n## 5. BST Insertion & Search\n\nSearching and insertion in a balanced BST takes $O(\\log_2 N)$ comparisons:\n\n```c\nstruct Node* search(struct Node* root, int key) {\n    if (root == NULL || root->data == key)\n        return root;\n    if (key < root->data)\n        return search(root->left, key);\n    return search(root->right, key);\n}\n\nstruct Node* insert(struct Node* root, int key) {\n    if (root == NULL) {\n        struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));\n        newNode->data = key;\n        newNode->left = newNode->right = NULL;\n        return newNode;\n    }\n    if (key < root->data)\n        root->left = insert(root->left, key);\n    else if (key > root->data)\n        root->right = insert(root->right, key);\n    return root;\n}\n```\n\n---\n\n## 6. BST Deletion: All 3 Child Cases\n\nDeleting a node while preserving the BST property requires handling 3 distinct scenarios:\n\n### Case 1: Node to be deleted is a Leaf (0 Children)\nSimply free the node and return `NULL` to its parent.\n\n### Case 2: Node to be deleted has One Child\nBypass the node by connecting its parent directly to its sole child, then free the node.\n\n### Case 3: Node to be deleted has Two Children\nYou cannot simply remove the node because it connects two separate branches.\n1. Find the node's **Inorder Successor** (the smallest value in its right subtree: go right once, then left all the way down).\n2. Overwrite the target node's data with the Inorder Successor's data.\n3. Recursively delete the Inorder Successor from the right subtree (which is guaranteed to fall under Case 1 or Case 2).\n\n```c\nstruct Node* minValueNode(struct Node* node) {\n    struct Node* current = node;\n    while (current && current->left != NULL)\n        current = current->left;\n    return current;\n}\n\nstruct Node* deleteNode(struct Node* root, int key) {\n    if (root == NULL) return root;\n\n    if (key < root->data)\n        root->left = deleteNode(root->left, key);\n    else if (key > root->data)\n        root->right = deleteNode(root->right, key);\n    else {\n        // Node with only one child or no child\n        if (root->left == NULL) {\n            struct Node* temp = root->right;\n            free(root);\n            return temp;\n        } else if (root->right == NULL) {\n            struct Node* temp = root->left;\n            free(root);\n            return temp;\n        }\n\n        // Node with two children: Get inorder successor\n        struct Node* temp = minValueNode(root->right);\n        root->data = temp->data;\n        // Delete the successor\n        root->right = deleteNode(root->right, temp->data);\n    }\n    return root;\n}\n```\n\n---\n\n## 7. Introduction to Self-Balancing Trees (AVL)\n\nIf keys are inserted in sorted order (e.g., 10, 20, 30, 40, 50), the BST degrades into a linear chain with height $H = N$ and search time $O(N)$.\n\nTo guarantee $O(\\log N)$ performance, **AVL Trees** enforce a strict balance factor:\n$$\text{Balance Factor} = \text{Height}(\text{LeftSubtree}) - \text{Height}(\text{RightSubtree}) \\in \\{-1, 0, +1\\}$$\nWhenever an insertion or deletion causes the balance factor to exceed $\\pm 1$, tree rotations (LL, RR, LR, RL rotations) restore balance in $O(1)$ time.\n"
  },
  {
    "id": "note-dsd-kmaps",
    "title": "Boolean Minimization: Karnaugh Maps & Quine-McCluskey Method",
    "subjectCode": "24CS320",
    "subjectName": "Digital System Design",
    "unitNumber": 1,
    "readTime": "14 min read",
    "tags": [
      "Digital Electronics",
      "K-Map",
      "Boolean Algebra",
      "Quine-McCluskey"
    ],
    "lastUpdated": "2026-10-12",
    "tableOfContents": [
      {
        "id": "boolean-canonical",
        "title": "1. Canonical Forms (SOP and POS)",
        "level": 2
      },
      {
        "id": "kmap-basics",
        "title": "2. Karnaugh Map Structure & Gray Code",
        "level": 2
      },
      {
        "id": "grouping-rules",
        "title": "3. K-Map Grouping Rules",
        "level": 2
      },
      {
        "id": "dont-care",
        "title": "4. Minimization with Don't Care Conditions",
        "level": 2
      },
      {
        "id": "five-var-kmap",
        "title": "5. 5-Variable K-Maps",
        "level": 2
      },
      {
        "id": "quine-mccluskey",
        "title": "6. Quine-McCluskey Tabular Reduction Method",
        "level": 2
      }
    ],
    "content": "# Boolean Minimization: Karnaugh Maps & Quine-McCluskey Method\n\n## 1. Canonical Forms (SOP and POS)\n\nIn digital design, Boolean logic functions are expressed in two standard formats:\n\n1. **Sum of Products (SOP):** Formed by summing (ORing) fundamental product terms (**minterms** $m_i$) where the function evaluates to 1.\n   $$F(A,B,C) = \\sum m(1, 3, 5, 7)$$\n2. **Product of Sums (POS):** Formed by multiplying (ANDing) fundamental sum terms (**maxterms** $M_i$) where the function evaluates to 0.\n   $$F(A,B,C) = \\prod M(0, 2, 4, 6)$$\n\n---\n\n## 2. Karnaugh Map Structure & Gray Code\n\nA **K-Map** is a graphical diagram of $2^n$ cells, where each cell represents a distinct minterm. Adjacent cells differ by exactly **one bit** (using **Gray Code** sequence: `00, 01, 11, 10`).\n\nThis adjacency leverages the Boolean adjacency rule:\n$$A B + A \\overline{B} = A(B + \\overline{B}) = A$$\n\n### 4-Variable K-Map Layout:\n```\n      CD   00    01    11    10\n  AB   +-----+-----+-----+-----+\n  00   | m0  | m1  | m3  | m2  |\n       +-----+-----+-----+-----+\n  01   | m4  | m5  | m7  | m6  |\n       +-----+-----+-----+-----+\n  11   | m12 | m13 | m15 | m14 |\n       +-----+-----+-----+-----+\n  10   | m8  | m9  | m11 | m10 |\n       +-----+-----+-----+-----+\n```\n*Notice:* The 3rd and 4th rows/columns are flipped (`11` precedes `10`) to maintain single-bit distance.\n\n---\n\n## 3. K-Map Grouping Rules\n\nTo achieve the minimal Sum of Products:\n1. Groups must contain $2^k$ adjacent cells ($1, 2, 4, 8, 16$).\n2. Larger groups eliminate more literals:\n   - Group of 2 (Pair) eliminates 1 variable.\n   - Group of 4 (Quad) eliminates 2 variables.\n   - Group of 8 (Octet) eliminates 3 variables.\n3. Groups can wrap around the edges (corners $m0, m2, m8, m10$ form a valid quad).\n4. Every '1' cell must be included in at least one group.\n5. Identify **Essential Prime Implicants (EPI)**: Groups containing at least one '1' that cannot be covered by any other group.\n\n---\n\n## 4. Minimization with Don't Care Conditions\n\nA **Don't Care** condition ($d$ or $X$) represents input combinations that never occur in practice (e.g. invalid BCD codes 1010 through 1111) or whose output has no operational significance.\n\n### Optimization Strategy:\n- Treat Don't Care cells as '1' **only if** doing so enables a larger group size.\n- Otherwise, ignore them (treat as '0') to avoid redundant circuitry.\n\n---\n\n## 5. 5-Variable K-Maps\n\nA 5-variable function $F(A,B,C,D,E)$ requires $2^5 = 32$ cells, drawn as two 4-variable (16-cell) layers side by side:\n- **Layer 1:** $A = 0$ (minterms 0 to 15)\n- **Layer 2:** $A = 1$ (minterms 16 to 31)\n\nAdjacency exists both within a layer and **superimposed across the two layers** (e.g., cell 5 in Layer 1 is adjacent to cell 21 in Layer 2).\n\n---\n\n## 6. Quine-McCluskey Tabular Reduction Method\n\nFor functions with 5 or more variables, K-Maps become unwieldy. The **Quine-McCluskey (QM)** algorithm provides a systematic, computer-implementable tabular method:\n\n1. **Group by Weight:** Categorize minterms based on the number of '1's in their binary representation.\n2. **Successive Matching:** Compare terms between adjacent groups that differ by exactly 1 bit. Combine them and replace the differing bit with a hyphen (`-`). Mark used terms with checkmarks.\n3. **Repeat:** Continue combining 2-variable terms into 4-variable terms until no further combinations are possible. Unchecked terms are **Prime Implicants (PI)**.\n4. **Prime Implicant Table:** Construct a matrix of Prime Implicants vs original minterms. Columns with a single 'X' indicate **Essential Prime Implicants (EPI)**. Cover all remaining minterms with minimum cost.\n"
  },
  {
    "id": "note-co-memory",
    "title": "Computer Memory Hierarchy, Cache Mapping & Virtual Memory",
    "subjectCode": "24CS340",
    "subjectName": "Computer Organization",
    "unitNumber": 3,
    "readTime": "16 min read",
    "tags": [
      "Computer Organization",
      "Cache Memory",
      "Virtual Memory",
      "Hardware"
    ],
    "lastUpdated": "2026-10-13",
    "tableOfContents": [
      {
        "id": "memory-hierarchy",
        "title": "1. The Memory Hierarchy Pyramid",
        "level": 2
      },
      {
        "id": "locality-of-ref",
        "title": "2. Principle of Locality of Reference",
        "level": 2
      },
      {
        "id": "cache-mapping",
        "title": "3. Cache Mapping Techniques",
        "level": 2
      },
      {
        "id": "write-policies",
        "title": "4. Cache Write Policies",
        "level": 2
      },
      {
        "id": "virtual-memory",
        "title": "5. Virtual Memory & Paging",
        "level": 2
      },
      {
        "id": "tlb-translation",
        "title": "6. Translation Lookaside Buffer (TLB)",
        "level": 2
      }
    ],
    "content": "# Computer Memory Hierarchy, Cache Mapping & Virtual Memory\n\n## 1. The Memory Hierarchy Pyramid\n\nModern computer systems resolve the tradeoff between speed, capacity, and cost through a multi-level hierarchy:\n\n```\n      /\\      Registers (Fastest, Smallest ~KB, CPU Clock Speed)\n     /  \\     L1 / L2 / L3 SRAM Cache (Slightly slower, ~MB)\n    /    \\    Main Memory DRAM (Moderate speed, ~GB)\n   /      \\   Solid State Drive (NAND Flash) / HDD (~TB)\n  /________\\  Archive / Cloud Storage (Slowest, Infinite capacity)\n```\n\nAverage memory access time:\n$$T_{\text{avg}} = h \\cdot C + (1 - h) \\cdot M$$\nWhere $h$ is Cache Hit Ratio, $C$ is Cache access time, and $M$ is Main Memory Miss Penalty.\n\n---\n\n## 2. Principle of Locality of Reference\n\nCache works effectively due to the behavioral characteristics of software programs:\n\n1. **Temporal Locality:** If a memory location is referenced, it will tend to be referenced again soon (e.g. loop control variables, instructions inside loops).\n2. **Spatial Locality:** If a memory location is referenced, nearby memory locations will tend to be referenced soon (e.g. sequential code execution, array element traversals).\n\n---\n\n## 3. Cache Mapping Techniques\n\nMain memory is partitioned into blocks (lines) of size $B$ bytes. The CPU generates a physical address that must be mapped to cache slots.\n\n### 1. Direct Mapping:\nEach main memory block maps to exactly one specific cache line:\n$$i = j \\pmod m$$\nWhere $i$ is cache line index, $j$ is main memory block number, and $m$ is total cache lines.\n- **Address Breakdown:** `[ Tag | Line Index | Word Offset ]`\n- **Advantage:** Simplest hardware; fast tag comparison.\n- **Disadvantage:** High conflict misses if two active blocks map to the same line index.\n\n### 2. Fully Associative Mapping:\nA main memory block can be loaded into **any** free cache line.\n- **Address Breakdown:** `[ Tag | Word Offset ]`\n- **Advantage:** Zero conflict misses; flexible.\n- **Disadvantage:** Expensive hardware; requires parallel associative comparison against all cache line tags simultaneously.\n\n### 3. Set-Associative Mapping (Best Compromise):\nCache lines are grouped into $S$ sets, each containing $K$ lines ($K$-way set associative). A block maps to a specific set, but can reside in any line within that set:\n$$\text{Set} = j \\pmod S$$\n- **Address Breakdown:** `[ Tag | Set Index | Word Offset ]`\n\n---\n\n## 4. Cache Write Policies\n\nWhen the CPU executes a store/write operation to memory:\n\n1. **Write-Through:**\n   - Both cache and main memory are updated simultaneously.\n   - Ensures memory is always up-to-date; simple but incurs memory bus write traffic.\n2. **Write-Back (Copy-Back):**\n   - Updates are made **only in cache**.\n   - A **Dirty Bit** is set on the modified cache block.\n   - The block is written to main memory only when it is evicted/replaced.\n   - Minimizes bus traffic; higher performance.\n\n---\n\n## 5. Virtual Memory & Paging\n\nVirtual Memory decouples programmer-visible address space from physical RAM capacity, allowing execution of processes larger than physical memory.\n\n- **Virtual Address Space:** Divided into fixed-size units called **Pages** (typically 4 KB).\n- **Physical Memory:** Divided into matching units called **Page Frames**.\n- **Page Table:** Maintained by the Operating System in main memory to translate Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).\n- **Page Fault:** Triggered when the CPU attempts to access a page marked invalid (not currently resident in physical RAM). The OS fetches the required page from secondary storage.\n\n---\n\n## 6. Translation Lookaside Buffer (TLB)\n\nBecause the Page Table resides in RAM, every memory reference would theoretically require two memory accesses (one for page translation, one for the data).\n\nTo eliminate this bottleneck, modern processors use a **Translation Lookaside Buffer (TLB)**:\n- A high-speed associative hardware cache inside the Memory Management Unit (MMU).\n- Stores the most recent Virtual Page Number to Physical Frame Number translations.\n- If **TLB Hit**, address translation completes in a single clock cycle with zero RAM overhead.\n"
  },
  {
    "id": "note-dms-logic",
    "title": "Discrete Mathematics: Formal Logic & Equivalences Solutions",
    "subjectCode": "24CS350",
    "subjectName": "Discrete Mathematical Structures",
    "unitNumber": 1,
    "readTime": "15 min read",
    "tags": [
      "Discrete Math",
      "Logic",
      "Equivalences",
      "Proofs"
    ],
    "lastUpdated": "2026-10-13",
    "tableOfContents": [
      {
        "id": "laws-of-logic",
        "title": "1. Fundamental Laws of Logic",
        "level": 2
      },
      {
        "id": "proof-techniques",
        "title": "2. Proof Rules without Truth Tables",
        "level": 2
      },
      {
        "id": "solved-problems",
        "title": "3. Step-by-Step Solved Proofs (Problems 1 to 9)",
        "level": 2
      },
      {
        "id": "inference-rules",
        "title": "4. Rules of Inference in Valid Arguments",
        "level": 2
      }
    ],
    "content": "# Discrete Mathematics: Formal Logic & Equivalences Solutions\n\n## 1. Fundamental Laws of Logic\n\nWhen proving propositional equivalences without constructing truth tables, cite these algebraic laws:\n\n1. **Identity Laws:**\n   - $p \\wedge T_0 \\equiv p$\n   - $p \u000bee F_0 \\equiv p$\n2. **Domination (Null) Laws:**\n   - $p \u000bee T_0 \\equiv T_0$\n   - $p \\wedge F_0 \\equiv F_0$\n3. **Idempotent Laws:**\n   - $p \u000bee p \\equiv p$\n   - $p \\wedge p \\equiv p$\n4. **Double Negation Law:**\n   - $\neg(\neg p) \\equiv p$\n5. **Commutative Laws:**\n   - $p \u000bee q \\equiv q \u000bee p$\n   - $p \\wedge q \\equiv q \\wedge p$\n6. **Associative Laws:**\n   - $(p \u000bee q) \u000bee r \\equiv p \u000bee (q \u000bee r)$\n   - $(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$\n7. **Distributive Laws:**\n   - $p \u000bee (q \\wedge r) \\equiv (p \u000bee q) \\wedge (p \u000bee r)$\n   - $p \\wedge (q \u000bee r) \\equiv (p \\wedge q) \u000bee (p \\wedge r)$\n8. **De Morgan's Laws:**\n   - $\neg(p \\wedge q) \\equiv \neg p \u000bee \neg q$\n   - $\neg(p \u000bee q) \\equiv \neg p \\wedge \neg q$\n9. **Absorption Laws:**\n   - $p \u000bee (p \\wedge q) \\equiv p$\n   - $p \\wedge (p \u000bee q) \\equiv p$\n10. **Inverse (Complement) Laws:**\n    - $p \u000bee \neg p \\equiv T_0$ (Tautology)\n    - $p \\wedge \neg p \\equiv F_0$ (Contradiction)\n11. **Conditional Equivalences:**\n    - $p \to q \\equiv \neg p \u000bee q$\n    - $\neg(p \to q) \\equiv p \\wedge \neg q$\n    - $p \to q \\equiv \neg q \to \neg p$ (Contrapositive)\n\n---\n\n## 2. Step-by-Step Solved Proofs (Problems 1 to 9)\n\n### Problem 1: Prove $\neg(p \u000bee (\neg p \\wedge q)) \\equiv \neg p \\wedge \neg q$\n- **LHS:** $\neg(p \u000bee (\neg p \\wedge q))$\n- By Distributive Law on inner expression: $p \u000bee (\neg p \\wedge q) \\equiv (p \u000bee \neg p) \\wedge (p \u000bee q)$\n- By Inverse Law: $p \u000bee \neg p \\equiv T_0$\n- Expression becomes: $T_0 \\wedge (p \u000bee q) \\equiv p \u000bee q$ (Identity Law)\n- Applying outer negation: $\neg(p \u000bee q)$\n- By De Morgan's Law: $\\equiv \neg p \\wedge \neg q$\n- **Q.E.D. (LHS = RHS)**\n\n### Problem 2: Prove $(p \to q) \\wedge [\neg q \\wedge (r \u000bee \neg q)] \\equiv \neg(q \u000bee p)$\n- Consider the bracket: $[\neg q \\wedge (r \u000bee \neg q)]$\n- By Absorption Law: $\neg q \\wedge (\neg q \u000bee r) \\equiv \neg q$\n- Substitute back: $(p \to q) \\wedge \neg q$\n- Replace conditional: $(\neg p \u000bee q) \\wedge \neg q$\n- By Distributive Law: $(\neg p \\wedge \neg q) \u000bee (q \\wedge \neg q)$\n- By Inverse Law: $q \\wedge \neg q \\equiv F_0$\n- By Identity Law: $(\neg p \\wedge \neg q) \u000bee F_0 \\equiv \neg p \\wedge \neg q$\n- By De Morgan's Law: $\neg p \\wedge \neg q \\equiv \neg(p \u000bee q) \\equiv \neg(q \u000bee p)$\n- **Q.E.D.**\n\n### Problem 3: Prove $p \to (q \to r) \\equiv (p \\wedge q) \to r$ (Exportation Law)\n- **LHS:** $p \to (q \to r)$\n- Replace conditionals: $\neg p \u000bee (\neg q \u000bee r)$\n- By Associative Law: $(\neg p \u000bee \neg q) \u000bee r$\n- By De Morgan's Law: $\neg(p \\wedge q) \u000bee r$\n- Replace with conditional: $(p \\wedge q) \to r$\n- **Q.E.D.**\n\n---\n\n## 3. Rules of Inference in Valid Arguments\n\nWhen validating argument forms:\n- **Modus Ponens:** Given $p \to q$ and $p$, conclude $q$.\n- **Modus Tollens:** Given $p \to q$ and $\neg q$, conclude $\neg p$.\n- **Hypothetical Syllogism:** Given $p \to q$ and $q \to r$, conclude $p \to r$.\n- **Disjunctive Syllogism:** Given $p \u000bee q$ and $\neg p$, conclude $q$.\n- **Resolution:** Given $p \u000bee q$ and $\neg p \u000bee r$, conclude $q \u000bee r$.\n"
  },
  {
    "id": "note-m3-curve",
    "title": "Method of Least Squares & Correlation-Regression Analysis",
    "subjectCode": "24MA313",
    "subjectName": "Engineering Mathematics - III",
    "unitNumber": 1,
    "readTime": "14 min read",
    "tags": [
      "Mathematics",
      "Statistics",
      "Curve Fitting",
      "Regression"
    ],
    "lastUpdated": "2026-10-13",
    "tableOfContents": [
      {
        "id": "least-squares-principle",
        "title": "1. The Principle of Least Squares",
        "level": 2
      },
      {
        "id": "straight-line-fitting",
        "title": "2. Fitting a Straight Line (y = a + bx)",
        "level": 2
      },
      {
        "id": "parabola-fitting",
        "title": "3. Fitting a Second Degree Parabola",
        "level": 2
      },
      {
        "id": "exponential-curves",
        "title": "4. Fitting Exponential Curves",
        "level": 2
      },
      {
        "id": "karl-pearson-r",
        "title": "5. Karl Pearson's Coefficient of Correlation",
        "level": 2
      },
      {
        "id": "regression-lines",
        "title": "6. Lines of Regression & Properties",
        "level": 2
      }
    ],
    "content": "# Method of Least Squares & Correlation-Regression Analysis\n\n## 1. The Principle of Least Squares\n\nCurve fitting establishes a functional relationship between two variables from observed experimental data points $(x_i, y_i)$.\n\nThe **Principle of Least Squares** minimizes the sum of squares of the vertical residuals (errors):\n$$S = \\sum_{i=1}^N e_i^2 = \\sum_{i=1}^N [y_i - f(x_i)]^2$$\nTo minimize $S$, we differentiate with respect to each parameter ($a, b, c$) and equate to zero:\n$$\\frac{\\partial S}{\\partial a} = 0, \\quad \\frac{\\partial S}{\\partial b} = 0$$\n\n---\n\n## 2. Fitting a Straight Line ($y = a + bx$)\n\nThe two **Normal Equations** for a straight line are:\n$$\n\\begin{aligned}\n\\sum y &= N a + b \\sum x \\\\\n\\sum x y &= a \\sum x + b \\sum x^2\n\\end{aligned}\n$$\nSolving this linear system yields parameters $a$ (Y-intercept) and $b$ (slope).\n\n---\n\n## 3. Fitting a Second Degree Parabola ($y = a + bx + cx^2$)\n\nThe three **Normal Equations** are:\n$$\n\\begin{aligned}\n\\sum y &= N a + b \\sum x + c \\sum x^2 \\\\\n\\sum x y &= a \\sum x + b \\sum x^2 + c \\sum x^3 \\\\\n\\sum x^2 y &= a \\sum x^2 + b \\sum x^3 + c \\sum x^4\n\\end{aligned}\n$$\n\n---\n\n## 4. Fitting Exponential Curves\n\n### Case 1: $y = a e^{bx}$\nTaking natural logarithm on both sides:\n$$\\ln y = \\ln a + b x \\implies Y = A + b x$$\nWhere $Y = \\ln y$ and $A = \\ln a$. Fit as a linear equation and transform back: $a = e^A$.\n\n### Case 2: $y = a b^x$\nTaking base-10 logarithm:\n$$\\log_{10} y = \\log_{10} a + x \\log_{10} b \\implies Y = A + B x$$\nWhere $Y = \\log y, A = \\log a, B = \\log b$. Transform back: $a = 10^A, b = 10^B$.\n\n---\n\n## 5. Karl Pearson's Coefficient of Correlation ($r$)\n\nMeasures the degree of linear association between two variables:\n$$r = \\frac{N \\sum xy - (\\sum x)(\\sum y)}{\\sqrt{[N \\sum x^2 - (\\sum x)^2][N \\sum y^2 - (\\sum y)^2]}}$$\n\n### Fundamental Properties:\n1. Bounds: $-1 \\le r \\le +1$.\n2. $r = +1$: Perfect positive linear correlation.\n3. $r = -1$: Perfect negative linear correlation.\n4. $r = 0$: No linear correlation (variables are uncorrelated).\n5. $r$ is independent of change of origin and scale.\n\n---\n\n## 6. Lines of Regression\n\n1. **Regression Line of $Y$ on $X$:**\n   $$y - \\bar{y} = b_{yx}(x - \\bar{x})$$\n   Where regression coefficient $b_{yx} = r \\frac{\\sigma_y}{\\sigma_x}$.\n\n2. **Regression Line of $X$ on $Y$:**\n   $$x - \\bar{x} = b_{xy}(y - \\bar{y})$$\n   Where regression coefficient $b_{xy} = r \\frac{\\sigma_x}{\\sigma_y}$.\n\n### Essential Properties:\n- The two regression lines always intersect at the mean point $(\\bar{x}, \\bar{y})$.\n- $r = \\pm \\sqrt{b_{yx} \\cdot b_{xy}}$ (geometric mean of regression coefficients).\n- Both $b_{yx}$ and $b_{xy}$ must have the same algebraic sign as $r$.\n"
  },
  {
    "id": "note-uhv-harmony",
    "title": "Universal Human Values: Self-Exploration & Holistic Harmony",
    "subjectCode": "24HU311",
    "subjectName": "Universal Human Values - II",
    "unitNumber": 1,
    "readTime": "11 min read",
    "tags": [
      "Human Values",
      "Ethics",
      "Philosophy",
      "Harmony"
    ],
    "lastUpdated": "2026-10-14",
    "tableOfContents": [
      {
        "id": "need-for-uhv",
        "title": "1. Need for Value Education in Engineering",
        "level": 2
      },
      {
        "id": "self-exploration",
        "title": "2. Process of Self-Exploration",
        "level": 2
      },
      {
        "id": "sukha-suvidha",
        "title": "3. Continuous Happiness (Sukha) vs Physical Facilities (Suvidha)",
        "level": 2
      },
      {
        "id": "self-and-body",
        "title": "4. Harmony between Self ('I') and Body",
        "level": 2
      },
      {
        "id": "trust-and-respect",
        "title": "5. Values in Human Relationships: Trust and Respect",
        "level": 2
      },
      {
        "id": "four-orders",
        "title": "6. The Four Orders of Nature & Mutual Fulfillment",
        "level": 2
      }
    ],
    "content": "# Universal Human Values: Self-Exploration & Holistic Harmony\n\n## 1. Need for Value Education in Engineering\n\nTechnical education provides engineering proficiency\u2014how to design, construct, optimize, and compute (**Skill Domain**).\n\nHowever, skill alone without clear ethical purpose leads to environmental degradation, resource exploitation, stress, and societal fragmentation.\n\nValue Education provides clarity on **what to do** (**Value Domain**)\u2014ensuring that technical competence is deployed in service of human welfare, ecological sustainability, and societal harmony.\n\n---\n\n## 2. Process of Self-Exploration\n\nSelf-exploration is the experiential process of observing one's inner aspirations and validating them against **Natural Acceptance**:\n\n- **Natural Acceptance (Sahaj Svikriti):** An innate, invariant human faculty that recognizes what is universally right, healthy, and mutually fulfilling (e.g. unconditional respect, trust, and non-violence).\n- It is independent of peer pressure, conditioning, religious dogma, or temporal trends.\n- **Proposal -> Verification:** Every concept in this course is presented as a proposal to be tested through experiential validation in daily life.\n\n---\n\n## 3. Continuous Happiness (Sukha) vs Physical Facilities (Suvidha)\n\nHuman needs fall into two fundamental categories:\n\n| Dimension | Continuous Happiness (Sukha) | Physical Facilities (Suvidha) |\n| :--- | :--- | :--- |\n| **Need Domain** | Need of the Self ('I') | Need of the Body |\n| **Character** | Qualitative (e.g. Trust, Respect, Love) | Quantitative (e.g. Food, Clothing, Shelter) |\n| **Duration** | Continuous (we desire happiness 100% of the time) | Temporary (required only when needed) |\n| **Fulfillment** | Right Understanding and Right Feelings | Physical Production and Consumption |\n\n> [!IMPORTANT]\n> Physical facilities are necessary for bodily sustenance, but cannot substitute for right understanding. A wealthy individual lacking trust and respect remains profoundly unhappy.\n\n---\n\n## 4. Harmony between Self ('I') and Body\n\nThe human being is an integrated co-existence of **Self ('I')** (conscious, perceiving entity) and **Body** (material, physicochemical instrument).\n\n- **Sanyama (Self-Regulation):** The feeling of responsibility in the Self for nurturing, protecting, and rightly utilizing the body.\n- **Swasthya (Health):** The natural state where every bodily organ functions in harmonious coordination without illness.\n\n---\n\n## 5. Values in Human Relationships: Trust and Respect\n\n### 1. Trust (Vishwas) - The Foundational Value:\nTrust is the assurance that the other person genuinely intends my well-being.\n- **Intention (What one naturally wants):** Every human naturally wants continuous happiness and prosperity.\n- **Competence (Ability to fulfill intention):** Often lacking due to lack of right understanding.\n- Confusion arises when we judge ourselves by our **intentions**, but judge others by their **competence**!\n\n### 2. Respect (Samman):\nRespect means 'Right Evaluation'.\n- Evaluating someone for who they are without differentiation based on body (gender, race, age), physical facilities (wealth, position), or beliefs (religion, ideology).\n\n---\n\n## 6. The Four Orders of Nature & Mutual Fulfillment\n\nNature consists of four interconnected orders:\n1. **Material Order (Padartha Avastha):** Soil, water, minerals, atmosphere (Composing / Decomposing).\n2. **Plant / Bio Order (Prana Avastha):** Flora, trees, agriculture (Growth / Respiration).\n3. **Animal Order (Jiva Avastha):** Animals, birds (Co-existence of body and animal will to live).\n4. **Human Order (Jnana Avastha):** Human beings (Potential for Right Understanding and Knowledge).\n\nThe first three orders naturally exist in mutual fulfillment and cyclical recyclability. Only the human order currently lives in disharmony due to delusion. Achieving right understanding enables humanity to participate responsibly in universal ecological harmony.\n"
  },
  {
    "id": "note-ds-queues",
    "title": "Queue Data Structures: Linear, Circular & Priority Queues in C",
    "subjectCode": "24CS330",
    "subjectName": "Data Structures",
    "unitNumber": 2,
    "readTime": "14 min read",
    "tags": ["Data Structures", "Queues", "Circular Queue", "Algorithms", "C"],
    "lastUpdated": "2026-10-14",
    "tableOfContents": [
      { "id": "queue-adt", "title": "1. The Queue Abstract Data Type (FIFO)", "level": 2 },
      { "id": "linear-queue-limitations", "title": "2. Limitations of Linear Array Queues", "level": 2 },
      { "id": "circular-queue", "title": "3. Circular Queue & Modulo Arithmetic", "level": 2 },
      { "id": "priority-queue", "title": "4. Priority Queue Principles", "level": 2 },
      { "id": "dequeue", "title": "5. Double-Ended Queue (Deque)", "level": 2 },
      { "id": "applications", "title": "6. Real-World Systems Applications", "level": 2 }
    ],
    "content": "# Queue Data Structures: Linear, Circular & Priority Queues in C\\n\\n## 1. The Queue Abstract Data Type (FIFO)\\n\\nA **Queue** is a linear data structure that operates under the **FIFO (First-In, First-Out)** principle: elements are inserted at one end called the **Rear** and deleted from the opposite end called the **Front**.\\n\\n### Core Operations:\\n- `enqueue(item)`: Inserts element at the Rear.\\n- `dequeue()`: Removes element from the Front.\\n- `peek()` / `front()`: Returns the element at the Front without removing it.\\n- `isEmpty()`: Returns true if no elements reside in the queue.\\n- `isFull()`: Returns true if capacity is reached.\\n\\n---\\n\\n## 2. Limitations of Linear Array Queues\\n\\nIn a standard linear queue stored in an array of size `MAX`:\\n- After a sequence of `enqueue` and `dequeue` operations, `rear` eventually reaches `MAX - 1`.\\n- Even if earlier positions (`0, 1, ...`) are completely empty due to dequeues, new elements **cannot be inserted**.\\n- This false error is known as **Queue Drift** or **False Overflow**.\\n- Shifting all remaining elements forward on every dequeue costs $O(N)$ time per deletion.\\n\\n---\\n\\n## 3. Circular Queue & Modulo Arithmetic\\n\\nA **Circular Queue** solves false overflow by treating the array as a logical ring where index `0` follows index `MAX - 1` using modulo arithmetic.\\n\\n```c\\n#define MAX 5\\ntypedef struct {\\n    int items[MAX];\\n    int front, rear;\\n} CircularQueue;\\n\\nvoid init(CircularQueue *q) {\\n    q->front = -1;\\n    q->rear = -1;\\n}\\n\\nint isFull(CircularQueue *q) {\\n    return ((q->rear + 1) % MAX == q->front);\\n}\\n\\nint isEmpty(CircularQueue *q) {\\n    return (q->front == -1);\\n}\\n\\nvoid enqueue(CircularQueue *q, int value) {\\n    if (isFull(q)) {\\n        printf(\\\"Circular Queue Overflow!\\\\n\\\");\\n        return;\\n    }\\n    if (q->front == -1) {\\n        q->front = 0;\\n    }\\n    q->rear = (q->rear + 1) % MAX;\\n    q->items[q->rear] = value;\\n    printf(\\\"Enqueued: %d (rear=%d)\\\\n\\\", value, q->rear);\\n}\\n\\nint dequeue(CircularQueue *q) {\\n    if (isEmpty(q)) {\\n        printf(\\\"Circular Queue Underflow!\\\\n\\\");\\n        return -1;\\n    }\\n    int value = q->items[q->front];\\n    if (q->front == q->rear) {\\n        q->front = -1;\\n        q->rear = -1;\\n    } else {\\n        q->front = (q->front + 1) % MAX;\\n    }\\n    return value;\\n}\\n```\\n\\n> [!TIP]\\n> **Full Condition**: `(rear + 1) % MAX == front`  \\n> **Empty Condition**: `front == -1`\\n\\n---\\n\\n## 4. Priority Queue Principles\\n\\nA **Priority Queue** is a collection where each element has an associated numerical priority. Deletion does not occur strictly FIFO; rather, the element with highest (or lowest) priority is dequeued first.\\n\\n- **Ascending Priority Queue**: Dequeues the minimum numerical value first.\\n- **Descending Priority Queue**: Dequeues the maximum numerical value first.\\n- **Implementation Options**:\\n  - Unordered Array: Insert $O(1)$, Delete $O(N)$.\\n  - Ordered Array: Insert $O(N)$, Delete $O(1)$.\\n  - Binary Heap: Insert $O(\\\\log N)$, Delete $O(\\\\log N)$ (Standard production approach).\\n\\n---\\n\\n## 5. Double-Ended Queue (Deque)\\n\\nA **Deque** (pronounced 'deck') allows insertions and deletions at **both** ends:\\n1. **Input-Restricted Deque**: Insertion allowed only at rear, but deletion allowed at both front and rear.\\n2. **Output-Restricted Deque**: Deletion allowed only at front, but insertion allowed at both front and rear.\\n\\n---\\n\\n## 6. Real-World Systems Applications\\n\\n1. **Operating System Schedulers**: Ready queue for round-robin CPU scheduling.\\n2. **Hardware I/O Buffering**: Keyboard keystroke buffers and printer spoolers.\\n3. **Network Packet Queues**: Routers and switches buffer incoming packets.\\n4. **Graph Algorithms**: Breadth-First Search (BFS) uses a queue to traverse level-by-level.\\n"
  },
  {
    "id": "note-dsd-flipflops",
    "title": "Sequential Logic: Latches, Flip-Flops & Conversion Methodology",
    "subjectCode": "24CS320",
    "subjectName": "Digital System Design",
    "unitNumber": 3,
    "readTime": "15 min read",
    "tags": ["Digital Electronics", "Flip-Flops", "Sequential Circuits", "Clocking"],
    "lastUpdated": "2026-10-14",
    "tableOfContents": [
      { "id": "combinational-vs-sequential", "title": "1. Combinational vs Sequential Circuits", "level": 2 },
      { "id": "latches-vs-flipflops", "title": "2. Latches vs Flip-Flops", "level": 2 },
      { "id": "sr-flipflop", "title": "3. SR Flip-Flop & Race Condition", "level": 2 },
      { "id": "jk-and-master-slave", "title": "4. JK Flip-Flop & Master-Slave Isolation", "level": 2 },
      { "id": "d-and-t-flipflops", "title": "5. D (Data) & T (Toggle) Flip-Flops", "level": 2 },
      { "id": "excitation-tables", "title": "6. Excitation Tables & Flip-Flop Conversion", "level": 2 }
    ],
    "content": "# Sequential Logic: Latches, Flip-Flops & Conversion Methodology\\n\\n## 1. Combinational vs Sequential Circuits\\n\\n| Property | Combinational Circuit | Sequential Circuit |\\n| :--- | :--- | :--- |\\n| **Output Dependency** | Depends exclusively on present inputs | Depends on present inputs AND past history (stored state) |\\n| **Memory Element** | No memory capability | Contains memory elements (flip-flops/latches) |\\n| **Feedback Path** | No feedback loop | Contains feedback from output back to input |\\n| **Clock Signal** | Asynchronous (no clock required) | Typically synchronized by an external periodic clock |\\n| **Examples** | Adders, Multiplexers, Encoders | Counters, Shift Registers, Memory Units |\\n\\n---\\n\\n## 2. Latches vs Flip-Flops\\n\\n- **Latch**: A **level-triggered** storage device. As long as the enable signal is HIGH, the output tracks inputs transparently.\\n- **Flip-Flop**: An **edge-triggered** storage device. Changes state only at a precise clock transition (positive rising edge $\\\\uparrow$ or negative falling edge $\\\\downarrow$).\\n\\n---\\n\\n## 3. SR Flip-Flop & Race Condition\\n\\nAn SR (Set-Reset) flip-flop has inputs $S$ (Set) and $R$ (Reset):\\n\\n### Characteristic Table:\\n| S | R | $Q_n$ | $Q_{n+1}$ | Description |\\n| :-: | :-: | :-: | :-: | :--- |\\n| 0 | 0 | 0 | 0 | No Change (Hold) |\\n| 0 | 0 | 1 | 1 | No Change (Hold) |\\n| 0 | 1 | X | 0 | Reset state ($Q=0$) |\\n| 1 | 0 | X | 1 | Set state ($Q=1$) |\\n| 1 | 1 | X | ? | **Invalid / Forbidden** ($Q = \\\\overline{Q} = 0$) |\\n\\n> [!CAUTION]\\n> When $S = 1$ and $R = 1$ simultaneously, both outputs are forced LOW. When clock transitions back to 0, unpredictable propagation delays determine which output becomes 1, causing a **Race Condition**.\\n\\n---\\n\\n## 4. JK Flip-Flop & Master-Slave Isolation\\n\\nThe **JK Flip-Flop** eliminates the invalid state of the SR flip-flop by routing feedback from $Q$ and $\\\\overline{Q}$ back to the input gates:\\n- When $J = 1$ and $K = 1$, the output **toggles**: $Q_{n+1} = \\\\overline{Q}_n$.\\n\\n### The Race-Around Condition:\\nIn a level-triggered JK flip-flop, if clock pulse width $t_p$ is greater than the propagation delay of the flip-flop $t_{pd}$ ($t_p > t_{pd}$), the output will toggle repeatedly within a single clock pulse, producing an indeterminate final state.\\n\\n### Solution: Master-Slave JK Flip-Flop:\\n- Consists of two flip-flops: a **Master** (clocked by CLK) and a **Slave** (clocked by inverted $\\\\overline{\\\\text{CLK}}$).\\n- During CLK = 1: Master is active, reads inputs $J$ and $K$; Slave is disabled.\\n- During CLK = 0: Master is disabled; Slave copies Master's output to final outputs $Q$ and $\\\\overline{Q}$.\\n- This two-phase handshake completely isolates inputs from outputs, preventing race-around.\\n\\n---\\n\\n## 5. D (Data) & T (Toggle) Flip-Flops\\n\\n### 1. D Flip-Flop (Delay):\\n- Formed by setting $R = \\\\overline{S}$ via an inverter. Has a single input $D$.\\n- **Characteristic Equation**: $Q_{n+1} = D$\\n- Crucial for data storage, registers, and pipeline delay stages.\\n\\n### 2. T Flip-Flop (Toggle):\\n- Formed by tying $J$ and $K$ together: $J = K = T$.\\n- When $T = 0$: $Q_{n+1} = Q_n$ (Hold).\\n- When $T = 1$: $Q_{n+1} = \\\\overline{Q}_n$ (Toggle).\\n- **Characteristic Equation**: $Q_{n+1} = T \\\\oplus Q_n$\\n- Primary building block of binary ripple counters and frequency dividers.\\n\\n---\\n\\n## 6. Excitation Tables & Flip-Flop Conversion\\n\\nAn **Excitation Table** specifies what inputs are required to transition from present state $Q_n$ to next state $Q_{n+1}$:\\n\\n| $Q_n$ | $Q_{n+1}$ | S | R | J | K | D | T |\\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\\n| 0 | 0 | 0 | X | 0 | X | 0 | 0 |\\n| 0 | 1 | 1 | 0 | 1 | X | 1 | 1 |\\n| 1 | 0 | 0 | 1 | X | 1 | 0 | 1 |\\n| 1 | 1 | X | 0 | X | 0 | 1 | 0 |\\n\\n### Procedure to Convert Flip-Flop A to Flip-Flop B:\\n1. Construct the truth table of the **desired flip-flop**.\\n2. Add columns for the inputs of the **available flip-flop** using its excitation table.\\n3. Minimize the input expressions using Karnaugh Maps.\\n4. Draw the combinational logic network interfacing the two.\\n"
  },
  {
    "id": "note-m3-probability",
    "title": "Probability Distributions: Binomial, Poisson & Normal Models",
    "subjectCode": "24MA313",
    "subjectName": "Engineering Mathematics - III",
    "unitNumber": 2,
    "readTime": "15 min read",
    "tags": ["Mathematics", "Probability", "Distributions", "Statistics"],
    "lastUpdated": "2026-10-14",
    "tableOfContents": [
      { "id": "random-variables", "title": "1. Random Variables & Expectation", "level": 2 },
      { "id": "binomial-distribution", "title": "2. Binomial Distribution Model", "level": 2 },
      { "id": "poisson-distribution", "title": "3. Poisson Distribution (Law of Rare Events)", "level": 2 },
      { "id": "normal-distribution", "title": "4. Normal (Gaussian) Continuous Distribution", "level": 2 },
      { "id": "standard-normal-z", "title": "5. Standard Normal Transformation & Area Tables", "level": 2 },
      { "id": "solved-problems", "title": "6. Classical Engineering Exam Problems", "level": 2 }
    ],
    "content": "# Probability Distributions: Binomial, Poisson & Normal Models\\n\\n## 1. Random Variables & Expectation\\n\\nA **Random Variable (RV)** is a real-valued function defined over sample space $S$.\\n\\n- **Discrete RV**: Takes isolated numerical values ($0, 1, 2, ...$) characterized by Probability Mass Function (PMF) $P(X = x)$ satisfying $\\\\sum P(x) = 1$.\\n- **Continuous RV**: Takes any value in an interval, characterized by Probability Density Function (PDF) $f(x)$ satisfying $\\\\int_{-\\\\infty}^\\\\infty f(x) dx = 1$.\\n\\n### Mean & Variance:\\n- **Mean (Expectation)**: $E[X] = \\\\mu = \\\\sum x P(x)$ or $\\\\int_{-\\\\infty}^\\\\infty x f(x) dx$\\n- **Variance**: $\\\\text{Var}(X) = \\\\sigma^2 = E[X^2] - (E[X])^2$\\n\\n---\\n\\n## 2. Binomial Distribution Model\\n\\nApplies to experiments consisting of $n$ independent identical trials, each having only two mutually exclusive outcomes: **Success** ($p$) and **Failure** ($q = 1 - p$).\\n\\n$$P(X = r) = \\\\binom{n}{r} p^r q^{n-r}, \\\\quad r = 0, 1, 2, ..., n$$\\n\\n### Key Metrics:\\n- **Mean**: $\\\\mu = n p$\\n- **Variance**: $\\\\sigma^2 = n p q$\\n- **Standard Deviation**: $\\\\sigma = \\\\sqrt{n p q}$\\n- Note: $\\\\text{Mean} > \\\\text{Variance}$ always holds for Binomial.\\n\\n---\\n\\n## 3. Poisson Distribution (Law of Rare Events)\\n\\nThe Poisson distribution is the limiting case of the Binomial distribution when:\\n1. Number of trials $n \\\\to \\\\infty$\\n2. Probability of success $p \\\\to 0$\\n3. Product $n p = \\\\lambda$ (finite constant average rate)\\n\\n$$P(X = r) = \\\\frac{e^{-\\\\lambda} \\\\lambda^r}{r!}, \\\\quad r = 0, 1, 2, ...$$\\n\\n### Key Metrics:\\n- **Mean**: $\\\\mu = \\\\lambda$\\n- **Variance**: $\\\\sigma^2 = \\\\lambda$\\n- Uniquely, **Mean = Variance** in a Poisson process.\\n\\n---\\n\\n## 4. Normal (Gaussian) Continuous Distribution\\n\\nThe most important distribution in engineering and natural sciences due to the **Central Limit Theorem**.\\n\\n$$f(x) = \\\\frac{1}{\\\\sigma \\\\sqrt{2\\\\pi}} e^{-\\\\frac{1}{2}\\\\left(\\\\frac{x - \\\\mu}{\\\\sigma}\\\\right)^2}, \\\\quad -\\\\infty < x < \\\\infty$$\\n\\n### Bell-Shaped Curve Properties:\\n1. Symmetrical about mean $x = \\\\mu$.\\n2. Maximum ordinate occurs at $x = \\\\mu$ with value $\\\\frac{1}{\\\\sigma \\\\sqrt{2\\\\pi}}$.\\n3. Total area under the probability density curve equals exactly $1$.\\n4. **Empirical Rule**:\\n   - $\\\\mu \\\\pm \\\\sigma$ encompasses **68.26%** of observations.\\n   - $\\\\mu \\\\pm 2\\\\sigma$ encompasses **95.44%** of observations.\\n   - $\\\\mu \\\\pm 3\\\\sigma$ encompasses **99.73%** of observations.\\n\\n---\\n\\n## 5. Standard Normal Transformation & Area Tables\\n\\nTo compute probabilities for arbitrary $(\\\\mu, \\\\sigma)$, map $X$ to the **Standard Normal Variate $Z$**:\\n$$Z = \\\\frac{X - \\\\mu}{\\\\sigma}$$\\nWhere $Z \\\\sim N(0, 1)$ has mean $\\\\mu = 0$ and variance $\\\\sigma^2 = 1$.\\n\\nProbabilities are evaluated using standard cumulative area tables:\\n$$\\\\Phi(z) = P(0 < Z < z) = \\\\frac{1}{\\\\sqrt{2\\\\pi}} \\\\int_0^z e^{-t^2/2} dt$$\\n\\n---\\n\\n## 6. Classical Engineering Exam Problems\\n\\n### Problem 1 (Poisson):\\n*If 2% of electric bulbs manufactured by a company are defective, find the probability that in a sample of 200 bulbs, exactly 3 bulbs are defective.*\\n- $n = 200, p = 0.02 \\\\implies \\\\lambda = n p = 200 \\\\times 0.02 = 4$.\\n- $P(X = 3) = \\\\frac{e^{-4} \\\\cdot 4^3}{3!} = \\\\frac{0.0183 \\\\times 64}{6} = 0.1953$.\\n\\n### Problem 2 (Normal):\\n*In a test on 2000 electric bulbs, the life is normally distributed with mean 2040 hours and standard deviation 60 hours. Estimate the number of bulbs likely to burn for more than 2150 hours.*\\n- $X = 2150, \\\\mu = 2040, \\\\sigma = 60$.\\n- $Z = \\\\frac{2150 - 2040}{60} = \\\\frac{110}{60} = 1.83$.\\n- $P(X > 2150) = P(Z > 1.83) = 0.5 - \\\\Phi(1.83) = 0.5 - 0.4664 = 0.0336$.\\n- Expected number of bulbs = $2000 \\\\times 0.0336 \\\\approx 67$ bulbs.\\n"
  }
];

export function getNoteById(id: string | null | undefined): Note | undefined {
  if (!id) return undefined;
  const rawLower = id.toLowerCase().trim();
  const direct = NOTES.find(n => n.id.toLowerCase() === rawLower);
  if (direct) return direct;

  // Fallback aliases for curriculum course unit notes
  const ALIASES: Record<string, string> = {
    'note-ds-arrays': 'note-ds-stacks',
    'note-ds-graphs': 'note-ds-trees',
    'note-classes-cpp': 'note-dma-cpp',
    'note-co-basic': 'note-co-memory',
    'note-co-arithmetic': 'note-co-memory',
    'note-co-io': 'note-co-memory',
    'note-dsd-combinational': 'note-dsd-kmaps',
    'note-dsd-registers': 'note-dsd-flipflops',
    'note-dms-relations': 'note-dms-logic',
    'note-dms-trees': 'note-dms-logic',
    'note-m3-comb': 'note-m3-curve',
    'note-m3-prob': 'note-m3-probability',
    'note-m3-dist': 'note-m3-probability',
  };

  if (ALIASES[rawLower]) {
    const aliased = NOTES.find(n => n.id.toLowerCase() === ALIASES[rawLower]);
    if (aliased) return aliased;
  }

  // Subject prefix fallbacks
  if (rawLower.includes('ds-')) return NOTES.find(n => n.subjectCode === '24CS330');
  if (rawLower.includes('dsd-')) return NOTES.find(n => n.subjectCode === '24CS320');
  if (rawLower.includes('cpp')) return NOTES.find(n => n.subjectCode === '24CS310');
  if (rawLower.includes('co-')) return NOTES.find(n => n.subjectCode === '24CS340');
  if (rawLower.includes('dms-')) return NOTES.find(n => n.subjectCode === '24CS350');
  if (rawLower.includes('m3-') || rawLower.includes('math')) return NOTES.find(n => n.subjectCode === '24MA313');
  if (rawLower.includes('uhv')) return NOTES.find(n => n.subjectCode === '24HU311');

  return undefined;
}

export function getNotesBySubject(subjectCode: string): Note[] {
  return NOTES.filter(n => n.subjectCode.toLowerCase() === subjectCode.toLowerCase());
}
