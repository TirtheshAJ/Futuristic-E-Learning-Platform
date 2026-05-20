// Quiz Data with MCQ and Coding Challenges

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  example: string;
  expectedOutput: string;
  hints?: string[];
  testCases?: { input: string; output: string }[];
}

export interface Quiz {
  id: number;
  title: string;
  course: string;
  courseId: string;
  icon: string;
  totalQuestions: number;
  duration: number;
  passingScore: number;
  coinReward: number;
  xpReward: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  bestScore: number | null;
  attempts: number;
  mcqQuestions: MCQQuestion[];
  codingQuestions: CodingQuestion[];
}

export const quizzesData: Quiz[] = [
  {
    id: 1,
    title: "C Programming Basics",
    course: "C Programming",
    courseId: "c-programming",
    icon: "©️",
    totalQuestions: 8,
    duration: 20,
    passingScore: 70,
    coinReward: 150,
    xpReward: 300,
    difficulty: "Beginner",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "What is the size of int data type in C (on a 32-bit system)?",
        options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"],
        correctAnswer: 1,
        explanation: "On most 32-bit systems, int is 4 bytes (32 bits).",
      },
      {
        id: 2,
        question: "Which operator is used for pointer dereferencing in C?",
        options: ["&", "*", "->", "."],
        correctAnswer: 1,
        explanation: "The * operator is used to dereference a pointer and access the value it points to.",
      },
      {
        id: 3,
        question: "What is the output of printf(\"%d\", sizeof(char))?",
        options: ["0", "1", "2", "4"],
        correctAnswer: 1,
        explanation: "sizeof(char) is always 1 byte by definition in C.",
      },
      {
        id: 4,
        question: "Which function is used to allocate memory dynamically in C?",
        options: ["alloc()", "malloc()", "new()", "create()"],
        correctAnswer: 1,
        explanation: "malloc() is used for dynamic memory allocation in C.",
      },
      {
        id: 5,
        question: "What does 'NULL' represent in C?",
        options: ["Zero", "Empty string", "Null pointer", "Undefined"],
        correctAnswer: 2,
        explanation: "NULL is a macro that represents a null pointer constant.",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "Print Hello World",
        description: "Write a C program to print 'Hello World' to the console.",
        example: `#include <stdio.h>

int main() {
    // Your code here
    return 0;
}`,
        expectedOutput: "Hello World",
        hints: ["Use printf() function", "Don't forget to include stdio.h"],
      },
      {
        id: 2,
        title: "Sum of Two Numbers",
        description: "Write a C program to find the sum of two integers and print the result.",
        example: `#include <stdio.h>

int main() {
    int a = 5, b = 10;
    // Calculate sum and print
    return 0;
}`,
        expectedOutput: "Sum = 15",
        hints: ["Declare a variable to store sum", "Use printf() to display result"],
      },
      {
        id: 3,
        title: "Check Even or Odd",
        description: "Write a C program to check if a number is even or odd using if-else.",
        example: `#include <stdio.h>

int main() {
    int num = 7;
    // Check if even or odd
    return 0;
}`,
        expectedOutput: "7 is Odd",
        hints: ["Use modulo operator %", "If num % 2 == 0, it's even"],
      },
    ],
  },
  {
    id: 2,
    title: "C++ Object-Oriented Programming",
    course: "C++",
    courseId: "cpp",
    icon: "➕",
    totalQuestions: 8,
    duration: 25,
    passingScore: 70,
    coinReward: 200,
    xpReward: 400,
    difficulty: "Intermediate",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "Which of the following is NOT a pillar of OOP?",
        options: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
        correctAnswer: 2,
        explanation: "The four pillars of OOP are: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
      },
      {
        id: 2,
        question: "What is the correct syntax to create a class in C++?",
        options: ["class MyClass {}", "MyClass class {}", "create class MyClass", "new class MyClass"],
        correctAnswer: 0,
        explanation: "Classes are created using: class ClassName { };",
      },
      {
        id: 3,
        question: "Which access specifier makes members accessible only within the class?",
        options: ["public", "private", "protected", "internal"],
        correctAnswer: 1,
        explanation: "private members can only be accessed within the class itself.",
      },
      {
        id: 4,
        question: "What is a constructor in C++?",
        options: [
          "A function that destroys objects",
          "A special function called when object is created",
          "A function that returns values",
          "A static function"
        ],
        correctAnswer: 1,
        explanation: "Constructor is a special member function called automatically when an object is created.",
      },
      {
        id: 5,
        question: "Can we have multiple constructors in a C++ class?",
        options: ["No", "Yes, through constructor overloading", "Only in derived classes", "Only with virtual keyword"],
        correctAnswer: 1,
        explanation: "Yes, we can have multiple constructors with different parameters (constructor overloading).",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "Create a Simple Class",
        description: "Create a class called 'Student' with name and age as data members, and a function to display them.",
        example: `#include <iostream>
using namespace std;

// Create Student class here

int main() {
    // Create object and call display
    return 0;
}`,
        expectedOutput: "Name: John, Age: 20",
        hints: ["Use public access specifier for members", "Create a display() function"],
      },
      {
        id: 2,
        title: "Constructor Implementation",
        description: "Create a class 'Rectangle' with length and width. Initialize them using a constructor.",
        example: `#include <iostream>
using namespace std;

class Rectangle {
    // Your code here
};

int main() {
    Rectangle rect(10, 5);
    return 0;
}`,
        expectedOutput: "Length: 10, Width: 5",
        hints: ["Constructor has same name as class", "No return type for constructors"],
      },
      {
        id: 3,
        title: "Calculate Area",
        description: "Add a member function to Rectangle class that calculates and returns the area.",
        example: `#include <iostream>
using namespace std;

class Rectangle {
    int length, width;
public:
    Rectangle(int l, int w) : length(l), width(w) {}
    // Add area() function here
};

int main() {
    Rectangle rect(10, 5);
    cout << "Area: " << rect.area();
    return 0;
}`,
        expectedOutput: "Area: 50",
        hints: ["Area = length * width", "Return the calculated value"],
      },
    ],
  },
  {
    id: 3,
    title: "Java Fundamentals",
    course: "Java",
    courseId: "java",
    icon: "☕",
    totalQuestions: 8,
    duration: 25,
    passingScore: 75,
    coinReward: 250,
    xpReward: 500,
    difficulty: "Intermediate",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "Which of these is a valid Java identifier?",
        options: ["2variable", "_variable", "variable-name", "class"],
        correctAnswer: 1,
        explanation: "Identifiers can start with letter, _, or $. Keywords cannot be used as identifiers.",
      },
      {
        id: 2,
        question: "What is the default value of a boolean variable in Java?",
        options: ["true", "false", "0", "null"],
        correctAnswer: 1,
        explanation: "The default value of boolean is false.",
      },
      {
        id: 3,
        question: "Which keyword is used to inherit a class in Java?",
        options: ["inherits", "extends", "implements", "super"],
        correctAnswer: 1,
        explanation: "The 'extends' keyword is used for inheritance in Java.",
      },
      {
        id: 4,
        question: "What is the parent class of all classes in Java?",
        options: ["System", "Object", "Class", "Main"],
        correctAnswer: 1,
        explanation: "Object class is the parent of all classes in Java.",
      },
      {
        id: 5,
        question: "Which collection class allows duplicate elements?",
        options: ["Set", "HashSet", "ArrayList", "TreeSet"],
        correctAnswer: 2,
        explanation: "ArrayList allows duplicate elements, while Set implementations do not.",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "Hello World in Java",
        description: "Write a Java program to print 'Hello, Java!' to the console.",
        example: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        expectedOutput: "Hello, Java!",
        hints: ["Use System.out.println()", "String should be in double quotes"],
      },
      {
        id: 2,
        title: "Fibonacci Series",
        description: "Write a Java program to print the first 5 Fibonacci numbers.",
        example: `public class Fibonacci {
    public static void main(String[] args) {
        int n = 5, first = 0, second = 1;
        // Print Fibonacci series
    }
}`,
        expectedOutput: "0 1 1 2 3",
        hints: ["Use a loop", "Next number = first + second"],
      },
      {
        id: 3,
        title: "Palindrome Check",
        description: "Write a Java program to check if a string is a palindrome.",
        example: `public class Palindrome {
    public static void main(String[] args) {
        String str = "madam";
        // Check if palindrome
    }
}`,
        expectedOutput: "madam is a Palindrome",
        hints: ["Compare string with its reverse", "Use StringBuilder for reversing"],
      },
    ],
  },
  {
    id: 4,
    title: "Python Essentials",
    course: "Python",
    courseId: "python",
    icon: "🐍",
    totalQuestions: 8,
    duration: 20,
    passingScore: 70,
    coinReward: 180,
    xpReward: 350,
    difficulty: "Beginner",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "Which of the following is used to define a function in Python?",
        options: ["function", "def", "define", "func"],
        correctAnswer: 1,
        explanation: "The 'def' keyword is used to define functions in Python.",
      },
      {
        id: 2,
        question: "What is the output of: print(type([]))?",
        options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
        correctAnswer: 1,
        explanation: "[] creates an empty list, so type([]) returns <class 'list'>.",
      },
      {
        id: 3,
        question: "Which of these is mutable in Python?",
        options: ["String", "Tuple", "List", "Integer"],
        correctAnswer: 2,
        explanation: "Lists are mutable (can be modified), while strings, tuples, and integers are immutable.",
      },
      {
        id: 4,
        question: "How do you start a single-line comment in Python?",
        options: ["//", "#", "/*", "--"],
        correctAnswer: 1,
        explanation: "Single-line comments in Python start with #.",
      },
      {
        id: 5,
        question: "What is the correct way to create a dictionary in Python?",
        options: ["dict = []", "dict = {}", "dict = ()", "dict = <>"],
        correctAnswer: 1,
        explanation: "Dictionaries are created using curly braces: {}.",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "Print Pattern",
        description: "Write a Python program to print a simple pattern using loops.",
        example: `# Print this pattern:
# *
# **
# ***
# ****

for i in range(1, 5):
    # Your code here
    pass`,
        expectedOutput: "*\n**\n***\n****",
        hints: ["Use nested loops or string multiplication", "Print '*' * i for each row"],
      },
      {
        id: 2,
        title: "List Comprehension",
        description: "Create a list of squares of numbers from 1 to 5 using list comprehension.",
        example: `# Create list [1, 4, 9, 16, 25]
squares = # Your code here
print(squares)`,
        expectedOutput: "[1, 4, 9, 16, 25]",
        hints: ["Use: [expression for item in range()]", "Expression should be i*i or i**2"],
      },
      {
        id: 3,
        title: "Count Vowels",
        description: "Write a Python function to count the number of vowels in a string.",
        example: `def count_vowels(s):
    # Your code here
    pass

print(count_vowels("hello"))  # Should print 2`,
        expectedOutput: "2",
        hints: ["Vowels are: a, e, i, o, u", "Use a loop and if condition"],
      },
    ],
  },
  {
    id: 5,
    title: "HTML Fundamentals",
    course: "HTML",
    courseId: "html",
    icon: "🌐",
    totalQuestions: 8,
    duration: 15,
    passingScore: 70,
    coinReward: 120,
    xpReward: 250,
    difficulty: "Beginner",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language"
        ],
        correctAnswer: 0,
        explanation: "HTML stands for Hyper Text Markup Language.",
      },
      {
        id: 2,
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        correctAnswer: 2,
        explanation: "<h1> is used for the largest heading. Headings go from <h1> (largest) to <h6> (smallest).",
      },
      {
        id: 3,
        question: "Which attribute specifies an alternative text for an image?",
        options: ["title", "alt", "src", "text"],
        correctAnswer: 1,
        explanation: "The 'alt' attribute provides alternative text for images.",
      },
      {
        id: 4,
        question: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: 1,
        explanation: "The <a> (anchor) tag is used to create hyperlinks.",
      },
      {
        id: 5,
        question: "What is the correct HTML for creating a checkbox?",
        options: [
          '<input type="checkbox">',
          '<checkbox>',
          '<input type="check">',
          '<check>'
        ],
        correctAnswer: 0,
        explanation: "Checkboxes are created using <input type=\"checkbox\">.",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "Basic HTML Structure",
        description: "Create a basic HTML page with a title and a heading.",
        example: `<!DOCTYPE html>
<html>
<head>
    <!-- Add title here -->
</head>
<body>
    <!-- Add h1 heading: "Welcome to HTML" -->
</body>
</html>`,
        expectedOutput: "HTML page with title 'My Page' and heading 'Welcome to HTML'",
        hints: ["Use <title> inside <head>", "Use <h1> inside <body>"],
      },
      {
        id: 2,
        title: "Create a List",
        description: "Create an unordered list with three items: HTML, CSS, JavaScript.",
        example: `<!DOCTYPE html>
<html>
<body>
    <h2>Web Technologies</h2>
    <!-- Create unordered list here -->
</body>
</html>`,
        expectedOutput: "Unordered list with three items",
        hints: ["Use <ul> for unordered list", "Each item uses <li> tag"],
      },
      {
        id: 3,
        title: "Create a Form",
        description: "Create a simple form with name input and a submit button.",
        example: `<!DOCTYPE html>
<html>
<body>
    <form>
        <!-- Add name input and submit button -->
    </form>
</body>
</html>`,
        expectedOutput: "Form with text input and submit button",
        hints: ["Use <input type=\"text\">", "Use <input type=\"submit\">"],
      },
    ],
  },
  {
    id: 6,
    title: "Operating System Concepts",
    course: "Operating System",
    courseId: "os",
    icon: "💻",
    totalQuestions: 8,
    duration: 30,
    passingScore: 75,
    coinReward: 300,
    xpReward: 600,
    difficulty: "Advanced",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "What is the main purpose of an Operating System?",
        options: [
          "To compile programs",
          "To manage computer hardware and software resources",
          "To browse the internet",
          "To create documents"
        ],
        correctAnswer: 1,
        explanation: "The OS manages hardware and software resources and provides services for programs.",
      },
      {
        id: 2,
        question: "Which scheduling algorithm is non-preemptive?",
        options: ["Round Robin", "FCFS", "Priority with preemption", "SRTF"],
        correctAnswer: 1,
        explanation: "FCFS (First Come First Serve) is a non-preemptive scheduling algorithm.",
      },
      {
        id: 3,
        question: "What are the necessary conditions for deadlock?",
        options: [
          "Only mutual exclusion",
          "Mutual exclusion, hold and wait, no preemption, circular wait",
          "Only circular wait",
          "Preemption and mutual exclusion"
        ],
        correctAnswer: 1,
        explanation: "All four conditions must hold simultaneously for deadlock to occur.",
      },
      {
        id: 4,
        question: "What is thrashing in OS?",
        options: [
          "High CPU utilization",
          "Excessive paging activity",
          "Fast disk access",
          "Efficient memory usage"
        ],
        correctAnswer: 1,
        explanation: "Thrashing occurs when a system spends more time paging than executing.",
      },
      {
        id: 5,
        question: "Which page replacement algorithm suffers from Belady's anomaly?",
        options: ["LRU", "Optimal", "FIFO", "LFU"],
        correctAnswer: 2,
        explanation: "FIFO page replacement can suffer from Belady's anomaly where more frames lead to more page faults.",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "FCFS Scheduling",
        description: "Calculate average waiting time for FCFS scheduling given arrival and burst times.",
        example: `# Processes: P1, P2, P3
# Burst times: 24, 3, 3
# Calculate average waiting time

burst_time = [24, 3, 3]
# Your code here`,
        expectedOutput: "Average Waiting Time: 17",
        hints: ["Waiting time = sum of previous burst times", "Average = total / number of processes"],
      },
      {
        id: 2,
        title: "Check Deadlock",
        description: "Given resource allocation, check if system is in safe state using Banker's algorithm logic.",
        example: `# Available resources: [3, 3, 2]
# Allocated: [[0,1,0], [2,0,0], [3,0,2]]
# Maximum: [[7,5,3], [3,2,2], [9,0,2]]

def is_safe_state(available, allocated, maximum):
    # Your code here
    pass`,
        expectedOutput: "Safe State",
        hints: ["Calculate need matrix", "Find process that can complete with available resources"],
      },
      {
        id: 3,
        title: "Page Faults - FIFO",
        description: "Calculate number of page faults using FIFO page replacement for given reference string.",
        example: `# Reference string: [7, 0, 1, 2, 0, 3, 0, 4]
# Number of frames: 3

def fifo_page_faults(pages, frames):
    # Your code here
    pass

print(fifo_page_faults([7, 0, 1, 2, 0, 3, 0, 4], 3))`,
        expectedOutput: "6",
        hints: ["Use queue for FIFO", "Page fault when page not in frames"],
      },
    ],
  },
  {
    id: 7,
    title: "Microprocessor Basics",
    course: "Microprocessor",
    courseId: "microprocessor",
    icon: "🔧",
    totalQuestions: 8,
    duration: 30,
    passingScore: 75,
    coinReward: 280,
    xpReward: 550,
    difficulty: "Advanced",
    bestScore: null,
    attempts: 0,
    mcqQuestions: [
      {
        id: 1,
        question: "How many address lines does 8085 microprocessor have?",
        options: ["8", "16", "20", "32"],
        correctAnswer: 1,
        explanation: "8085 has 16 address lines (A0-A15), providing 64KB addressable memory.",
      },
      {
        id: 2,
        question: "What is the size of the accumulator in 8085?",
        options: ["4 bits", "8 bits", "16 bits", "32 bits"],
        correctAnswer: 1,
        explanation: "The accumulator in 8085 is 8-bit register.",
      },
      {
        id: 3,
        question: "Which instruction is used to load immediate data into accumulator?",
        options: ["MOV A, data", "MVI A, data", "LDA address", "LDAX"],
        correctAnswer: 1,
        explanation: "MVI A, data loads immediate 8-bit data into accumulator.",
      },
      {
        id: 4,
        question: "How many flags are there in 8085?",
        options: ["3", "5", "7", "8"],
        correctAnswer: 1,
        explanation: "8085 has 5 flags: Sign, Zero, Auxiliary Carry, Parity, and Carry.",
      },
      {
        id: 5,
        question: "What is the clock frequency of 8085 microprocessor?",
        options: ["1 MHz", "3 MHz", "5 MHz", "8 MHz"],
        correctAnswer: 1,
        explanation: "8085 operates at 3 MHz clock frequency.",
      },
    ],
    codingQuestions: [
      {
        id: 1,
        title: "8085 Addition Program",
        description: "Write 8085 assembly program to add two 8-bit numbers.",
        example: `; Add two numbers stored at 2050H and 2051H
; Store result at 2052H

MVI A, 00H    ; Clear accumulator
LDA 2050H     ; Load first number
MOV B, A      ; Move to B
; Complete the program`,
        expectedOutput: "Sum stored at 2052H",
        hints: ["Use LDA to load from memory", "Use ADD instruction", "Store using STA"],
      },
      {
        id: 2,
        title: "Find Largest Number",
        description: "Write 8085 assembly to find the largest among two numbers.",
        example: `; Numbers at 2050H and 2051H
; Store larger at 2052H

LDA 2050H
MOV B, A
LDA 2051H
; Complete comparison`,
        expectedOutput: "Largest number stored at 2052H",
        hints: ["Use CMP instruction", "Check carry flag", "Use conditional jump"],
      },
      {
        id: 3,
        title: "Count 1s in a Number",
        description: "Write 8085 program to count number of 1s in an 8-bit number.",
        example: `; Number at 2050H
; Store count at 2051H

LDA 2050H
MVI C, 08H    ; Counter for 8 bits
MVI D, 00H    ; Count of 1s
; Complete the program`,
        expectedOutput: "Count of 1s stored",
        hints: ["Rotate accumulator", "Check carry flag", "Increment counter if carry is set"],
      },
    ],
  },
];

export const getQuizById = (id: number) => {
  return quizzesData.find((quiz) => quiz.id === id);
};

export const getQuizzesByCourseId = (courseId: string) => {
  return quizzesData.filter((quiz) => quiz.courseId === courseId);
};

export const getAllQuizzes = () => {
  return quizzesData;
};
