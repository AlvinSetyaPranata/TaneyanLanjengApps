from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from users.models import User, Role
from modules.models import Module, Lesson
from activities.models import Activity, UserOverview, TestHistory


class Command(BaseCommand):
    help = 'Seed the database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # Clear existing data (optional)
        self.stdout.write('Clearing existing data...')
        TestHistory.objects.all().delete()
        UserOverview.objects.all().delete()
        Activity.objects.all().delete()
        Lesson.objects.all().delete()
        Module.objects.all().delete()
        User.objects.all().delete()
        Role.objects.all().delete()

        # Create Roles
        self.stdout.write('Creating roles...')
        role_admin = Role.objects.create(name='Admin')
        role_teacher = Role.objects.create(name='Teacher')
        role_student = Role.objects.create(name='Student')
        self.stdout.write(self.style.SUCCESS(f'Created {Role.objects.count()} roles'))

        # Create Users
        self.stdout.write('Creating users...')
        
        # Admin user
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@taneyanlanjeng.edu',
            password='admin123',
            full_name='Administrator',
            institution='Taneyan Lanjeng University',
            semester=0,
            profile_photo='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
        )
        admin_user.role = role_admin
        admin_user.save()

        # Teacher users
        teacher1 = User.objects.create_user(
            username='teacher_john',
            email='john.doe@taneyanlanjeng.edu',
            password='teacher123',
            full_name='John Doe',
            institution='Taneyan Lanjeng University',
            semester=0,
            profile_photo='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
        )
        teacher1.role = role_teacher
        teacher1.save()

        teacher2 = User.objects.create_user(
            username='teacher_jane',
            email='jane.smith@taneyanlanjeng.edu',
            password='teacher_jane',
            full_name='Jane Smith',
            institution='Taneyan Lanjeng University',
            semester=0,
            profile_photo='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
        )
        teacher2.role = role_teacher
        teacher2.save()

        # Student users
        students = []
        student_data = [
            ('student_alice', 'alice@student.edu', 'Alice Johnson', 'Taneyan Lanjeng University', 3, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'),
            ('student_bob', 'bob@student.edu', 'Bob Wilson', 'Taneyan Lanjeng University', 2, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'),
            ('student_charlie', 'charlie@student.edu', 'Charlie Brown', 'Taneyan Lanjeng University', 4, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'),
            ('student_diana', 'diana@student.edu', 'Diana Prince', 'State University', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),
            ('student_ethan', 'ethan@student.edu', 'Ethan Hunt', 'State University', 1, 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400'),
        ]

        for username, email, full_name, institution, semester, profile_photo in student_data:
            student = User.objects.create_user(
                username=username,
                email=email,
                password='student123',
                full_name=full_name,
                institution=institution,
                semester=semester,
                profile_photo=profile_photo
            )
            student.role = role_student
            student.save()
            students.append(student)

        self.stdout.write(self.style.SUCCESS(f'Created {User.objects.count()} users'))

        # Create Modules
        self.stdout.write('Creating modules...')
        modules_data = [
            ('Introduction to Programming', teacher1, 30, 'Learn the fundamentals of programming', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'),
            ('Data Structures and Algorithms', teacher1, 45, 'Master data structures and algorithmic thinking', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'),
            ('Web Development Fundamentals', teacher2, 60, 'Build modern web applications', 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400'),
            ('Database Management Systems', teacher2, 40, 'Design and manage databases', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400'),
            ('Object-Oriented Programming', teacher1, 35, 'Advanced OOP concepts and design patterns', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400'),
        ]

        modules = []
        for title, author, days_until_deadline, description, cover_image in modules_data:
            module = Module.objects.create(
                title=title,
                description=description,
                deadline=timezone.now() + timedelta(days=days_until_deadline),
                author=author,
                cover_image=cover_image,
                is_published=True
            )
            modules.append(module)

        self.stdout.write(self.style.SUCCESS(f'Created {Module.objects.count()} modules'))

        # Create Lessons for each module
        self.stdout.write('Creating lessons...')
        lessons_data = {
            'Introduction to Programming': [
                ('Welcome to Programming', 'lesson', '''# Welcome to Programming!

In this lesson, we will cover the basics of programming concepts.

![Programming Concept](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800)

## What is Programming?

Programming is the process of creating instructions for computers to follow.

### Watch This Introduction Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/zOjov-2OZ0E" frameborder="0" allowfullscreen></iframe>

### Key Concepts
- Variables: Storage containers for data
- Data Types: Different kinds of information
- Control Flow: Decision making in code

**Important:** Practice makes perfect! Try coding every day.''', 45),
                
                ('Variables and Data Types', 'lesson', '''# Variables and Data Types

Learn how to store and manipulate data in your programs.

![Data Types](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)

## Variables

Variables are like labeled boxes that store information.

```python
name = "John"
age = 25
salary = 50000.50
is_student = False
```

## Common Data Types

| Type | Example | Description |
|------|---------|-------------|
| String | "Hello" | Text data |
| Integer | 42 | Whole numbers |
| Float | 3.14 | Decimal numbers |
| Boolean | True/False | Logical values |

### Tutorial Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/OH86oLzVzzw" frameborder="0" allowfullscreen></iframe>

> **Pro Tip:** Always use meaningful variable names!''', 60),
                
                ('Control Structures', 'lesson', '''# Control Structures

Understanding if-else statements and loops.

![Control Flow](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800)

## Conditional Statements

```python
age = 20

if age >= 18:
    print("Adult")
else:
    print("Minor")
```

## Loops

### For Loop
```python
for i in range(5):
    print(f"Count: {i}")
```

### While Loop
```python
count = 0
while count < 5:
    print(count)
    count += 1
```

### Video Tutorial

<iframe width="560" height="315" src="https://www.youtube.com/embed/6iF8Xb7Z3wQ" frameborder="0" allowfullscreen></iframe>''', 50),
                
                ('Functions', 'lesson', '''# Functions

How to organize your code into reusable blocks.

![Functions](https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800)

## What are Functions?

Functions are reusable blocks of code that perform specific tasks.

```python
def greet(name):
    return f"Hello, {name}!"

# Calling the function
message = greet("Alice")
print(message)  # Output: Hello, Alice!
```

## Function with Multiple Parameters

```python
def calculate_area(length, width):
    area = length * width
    return area

result = calculate_area(5, 3)
print(f"Area: {result}")  # Output: Area: 15
```

### Advanced Functions Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/9Os0o3wzS_I" frameborder="0" allowfullscreen></iframe>''', 55),
                
                ('Final Exam - Programming Fundamentals', 'exam', '''# Programming Fundamentals Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Exam Instructions

**Duration:** 120 minutes  
**Total Points:** 100  
**Passing Score:** 70

---

## Part 1: Multiple Choice (30 points)

### Question 1 (5 points)
Which of the following is NOT a valid data type in Python?
- A) Integer
- B) String
- C) Character
- D) Boolean

**Answer:** C

### Question 2 (5 points)
What will be the output of the following code?
```python
x = 10
y = 20
print(x + y)
```
- A) 1020
- B) 30
- C) Error
- D) None

**Answer:** B

### Question 3 (5 points)
Which loop is guaranteed to execute at least once?
- A) for loop
- B) while loop
- C) do-while loop
- D) None of the above

**Answer:** C

### Question 4 (5 points)
What keyword is used to define a function in Python?
- A) function
- B) def
- C) func
- D) define

**Answer:** B

### Question 5 (5 points)
What is the correct way to create a comment in Python?
- A) // This is a comment
- B) /* This is a comment */
- C) # This is a comment
- D) -- This is a comment

**Answer:** C

### Question 6 (5 points)
Which symbol is used for string concatenation in Python?
- A) &
- B) +
- C) *
- D) ^

**Answer:** B

---

## Part 2: Short Answer (30 points)

### Question 7 (10 points)
Explain the difference between a variable and a constant. Give examples.

**Sample Answer:**
- A variable is a storage location that can change its value during program execution
- A constant is a storage location whose value cannot be changed once assigned
- Example variable: `age = 25`, which can later be changed to `age = 26`
- Example constant: `PI = 3.14159`, which should never change

### Question 8 (10 points)
What is the purpose of indentation in Python? Why is it important?

**Sample Answer:**
- Indentation defines code blocks and scope in Python
- It's important because Python uses indentation instead of braces {} to define code structure
- Incorrect indentation leads to IndentationError
- Maintains code readability and enforces proper structure

### Question 9 (10 points)
Describe three types of errors in programming and give an example of each.

**Sample Answer:**
1. **Syntax Error:** Code violates language rules (e.g., `print("Hello"`  missing closing parenthesis)
2. **Runtime Error:** Code runs but crashes (e.g., division by zero: `10/0`)
3. **Logic Error:** Code runs but produces wrong results (e.g., using `+` instead of `*` for multiplication)

---

## Part 3: Coding Problems (40 points)

### Question 10 (15 points)
Write a Python function called `calculate_factorial()` that takes a positive integer as input and returns its factorial.

**Sample Solution:**
```python
def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    factorial = 1
    for i in range(2, n + 1):
        factorial *= i
    return factorial

# Test
print(calculate_factorial(5))  # Output: 120
```

### Question 11 (15 points)
Write a program that checks if a given number is prime. Create a function `is_prime(number)` that returns True if the number is prime, False otherwise.

**Sample Solution:**
```python
def is_prime(number):
    if number < 2:
        return False
    for i in range(2, int(number ** 0.5) + 1):
        if number % i == 0:
            return False
    return True

# Test
print(is_prime(17))  # Output: True
print(is_prime(10))  # Output: False
```

### Question 12 (10 points)
Write a function that reverses a string without using built-in reverse functions.

**Sample Solution:**
```python
def reverse_string(text):
    reversed_text = ""
    for char in text:
        reversed_text = char + reversed_text
    return reversed_text

# Test
print(reverse_string("Hello"))  # Output: olleH
```

---

## Grading Rubric

- **90-100:** Excellent - All questions answered correctly with detailed explanations
- **80-89:** Very Good - Most questions correct with good understanding
- **70-79:** Good - Passing grade with adequate knowledge
- **60-69:** Fair - Needs improvement
- **Below 60:** Fail - Significant gaps in understanding

---

**Good Luck!** 🍀''', 120),
            ],
            'Data Structures and Algorithms': [
                ('Introduction to Arrays', 'lesson', '''# Introduction to Arrays and Lists

The fundamental data structures for storing collections of data.

![Arrays Visualization](https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800)

## What are Arrays?

Arrays are contiguous memory locations that store elements of the same type.

```python
numbers = [1, 2, 3, 4, 5]
print(numbers[0])  # Output: 1
print(numbers[-1])  # Output: 5
```

### Tutorial Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/QJNwK2uJyGs" 
  frameborder="0" allowfullscreen>
</iframe>

## List Operations

| Operation | Syntax | Example |
|-----------|--------|---------|  
| Access | list[index] | numbers[0] |
| Append | list.append() | numbers.append(6) |
| Insert | list.insert() | numbers.insert(0, 0) |
| Remove | list.remove() | numbers.remove(3) |

> **Important:** Array indexing starts at 0!''', 45),
                
                ('Stacks and Queues', 'lesson', '''# Stacks and Queues

LIFO and FIFO data structures explained.

![Stack and Queue](https://images.unsplash.com/photo-1453847668862-487637052f8a?w=800)

## Stack (LIFO - Last In First Out)

```python
stack = []
stack.append(1)  # Push
stack.append(2)
stack.append(3)
print(stack.pop())  # Pop: 3
```

### Stack Video Tutorial

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/FNZ5o9S9prU" 
  frameborder="0" allowfullscreen>
</iframe>

## Queue (FIFO - First In First Out)

```python
from collections import deque
queue = deque()
queue.append(1)  # Enqueue
queue.append(2)
print(queue.popleft())  # Dequeue: 1
```

### Real-World Applications
- **Stack:** Browser history, undo functionality
- **Queue:** Print spooler, task scheduling''', 60),
                
                ('Trees and Graphs', 'lesson', '''# Trees and Graphs

Hierarchical and network data structures.

![Tree Structure](https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800)

## Binary Trees

A tree where each node has at most two children.

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

### Tree Traversal Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/9RHO6jU--GU" 
  frameborder="0" allowfullscreen>
</iframe>

## Graph Representation

```python
# Adjacency List
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}
```

![Graph Example](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800)''', 75),
                
                ('Sorting Algorithms', 'lesson', '''# Sorting and Searching Algorithms

Efficient ways to organize and find data.

![Sorting Visualization](https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800)

## Bubble Sort

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
```

### Sorting Algorithms Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/kPRA0W1kECg" 
  frameborder="0" allowfullscreen>
</iframe>

## Binary Search

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

| Algorithm | Time Complexity | Best Use |
|-----------|----------------|----------|
| Bubble Sort | O(n²) | Small datasets |
| Quick Sort | O(n log n) | General purpose |
| Binary Search | O(log n) | Sorted arrays |''', 90),

                ('Final Exam - Data Structures', 'exam', '''# Data Structures and Algorithms Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Instructions
- Duration: 90 minutes
- Total Points: 100
- Passing Score: 70

## Question 1 (20 points)
Explain the difference between Stack and Queue with examples.

## Question 2 (30 points)
Implement a binary search tree insertion function.

## Question 3 (25 points)
Write a function to detect cycles in a linked list.

## Question 4 (25 points)
Implement merge sort algorithm.''', 90),
            ],
            'Web Development Fundamentals': [
                ('HTML Basics', 'lesson', '''# HTML Basics

Structure of web pages.

![HTML Structure](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800)

## What is HTML?

HTML (HyperText Markup Language) is the standard markup language for web pages.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is my first webpage!</p>
</body>
</html>
```

### HTML Tutorial Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/UB1O30fR-EE" 
  frameborder="0" allowfullscreen>
</iframe>

## Common HTML Tags

| Tag | Purpose | Example |
|-----|---------|---------|  
| `<h1>` - `<h6>` | Headings | `<h1>Title</h1>` |
| `<p>` | Paragraph | `<p>Text</p>` |
| `<a>` | Link | `<a href="url">Link</a>` |
| `<img>` | Image | `<img src="image.jpg">` |''', 40),
                
                ('CSS Styling', 'lesson', '''# CSS Styling

Making your web pages beautiful.

![CSS Design](https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800)

## What is CSS?

CSS (Cascading Style Sheets) controls the visual presentation of HTML.

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}
```

### CSS Tutorial Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/1PnVor36_40" 
  frameborder="0" allowfullscreen>
</iframe>

## CSS Box Model

![Box Model](https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800)

- **Content:** The actual content
- **Padding:** Space around content
- **Border:** Border around padding
- **Margin:** Space outside border''', 50),
                
                ('JavaScript Introduction', 'lesson', '''# JavaScript Introduction

Adding interactivity to websites.

![JavaScript Code](https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800)

## What is JavaScript?

JavaScript makes websites interactive and dynamic.

```javascript
// Variables
let name = "Alice";
const age = 25;

// Function
function greet(name) {
    return `Hello, ${name}!`;
}

// DOM Manipulation
document.getElementById("demo").innerHTML = "New text";
```

### JavaScript Basics Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/W6NZfCO5SIk" 
  frameborder="0" allowfullscreen>
</iframe>

## Event Handling

```javascript
document.getElementById("btn").addEventListener("click", function() {
    alert("Button clicked!");
});
```''', 60),
                
                ('Responsive Design', 'lesson', '''# Responsive Design

Creating websites that work on all devices.

![Responsive Devices](https://images.unsplash.com/photo-1547658719-da2b51169166?w=800)

## Media Queries

```css
/* Mobile First */
.container {
    width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* Desktop */
@media (min-width: 1200px) {
    .container {
        width: 1170px;
    }
}
```

### Responsive Design Tutorial

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/srvUrASNj0s" 
  frameborder="0" allowfullscreen>
</iframe>

## Flexbox Layout

```css
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

![Flexbox](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800)''', 45),

                ('Final Exam - Web Development', 'exam', '''# Web Development Fundamentals Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Instructions
- Duration: 90 minutes
- Total Points: 100

## Question 1 (25 points)
Create a complete HTML page with header, nav, main, and footer sections.

## Question 2 (25 points)
Style a navigation menu using CSS with hover effects.

## Question 3 (25 points)
Write JavaScript to validate a form.

## Question 4 (25 points)
Implement responsive layout using media queries.''', 90),
            ],
            'Database Management Systems': [
                ('Introduction to Databases', 'lesson', '''# Introduction to Databases

What are databases and why use them?

![Database Concept](https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800)

## What is a Database?

A structured collection of data that can be easily accessed, managed, and updated.

### Types of Databases
- **Relational (SQL):** MySQL, PostgreSQL, Oracle
- **NoSQL:** MongoDB, Redis, Cassandra

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/FR4QIeZaPeM" 
  frameborder="0" allowfullscreen>
</iframe>

## Why Use Databases?

1. **Data Organization:** Structured storage
2. **Data Integrity:** Ensure data accuracy
3. **Concurrent Access:** Multiple users
4. **Security:** Access control''', 30),
                
                ('SQL Basics', 'lesson', '''# SQL Basics

Creating and querying databases.

![SQL Query](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)

## Basic SQL Commands

```sql
-- Create Table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    age INT
);

-- Insert Data
INSERT INTO users (id, name, email, age)
VALUES (1, 'John Doe', 'john@example.com', 30);

-- Select Data
SELECT * FROM users;
SELECT name, email FROM users WHERE age > 25;
```

### SQL Tutorial Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/HXV3zeQKqGY" 
  frameborder="0" allowfullscreen>
</iframe>

## CRUD Operations

| Operation | SQL Command |
|-----------|-------------|
| Create | INSERT INTO |
| Read | SELECT |
| Update | UPDATE |
| Delete | DELETE FROM |''', 60),
                
                ('Database Design', 'lesson', '''# Database Design

Normalization and relationships.

![Database Design](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800)

## Database Normalization

Process of organizing data to reduce redundancy.

### Normal Forms
1. **1NF:** Atomic values, no repeating groups
2. **2NF:** 1NF + No partial dependencies
3. **3NF:** 2NF + No transitive dependencies

## Relationships

```sql
-- One-to-Many
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/UrYLYV7WSHM" 
  frameborder="0" allowfullscreen>
</iframe>''', 75),
                
                ('Advanced SQL', 'lesson', '''# Advanced SQL

Joins, subqueries, and optimization.

![Advanced SQL](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800)

## SQL Joins

```sql
-- INNER JOIN
SELECT users.name, orders.order_id
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN
SELECT users.name, orders.order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

### Advanced SQL Tutorial

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/7Vtl2WggqOg" 
  frameborder="0" allowfullscreen>
</iframe>

## Subqueries

```sql
SELECT name FROM users
WHERE id IN (
    SELECT user_id FROM orders
    WHERE total > 1000
);
```

## Performance Optimization
- Use indexes on frequently queried columns
- Avoid SELECT *
- Use LIMIT for large datasets''', 90),

                ('Final Exam - Databases', 'exam', '''# Database Management Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Instructions
- Duration: 90 minutes
- Total Points: 100

## Question 1 (25 points)
Design a normalized database schema for an e-commerce system.

## Question 2 (25 points)
Write SQL queries to retrieve specific data using joins.

## Question 3 (25 points)
Explain database indexing and when to use it.

## Question 4 (25 points)
Optimize a given slow SQL query.''', 90),
            ],
            'Object-Oriented Programming': [
                ('Classes and Objects', 'lesson', '''# Classes and Objects

The foundation of OOP.

![OOP Concept](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800)

## What are Classes?

Classes are blueprints for creating objects.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name}"

# Creating objects
person1 = Person("Alice", 30)
person2 = Person("Bob", 25)

print(person1.greet())  # Hello, I'm Alice
```

### OOP Basics Video

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/JeznW_7DlB0" 
  frameborder="0" allowfullscreen>
</iframe>''', 50),
                
                ('Inheritance', 'lesson', '''# Inheritance and Polymorphism

Code reuse and flexibility.

![Inheritance](https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=800)

## Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

dog = Dog("Buddy")
print(dog.speak())  # Buddy says Woof!
```

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/Ej_02ICOIgs" 
  frameborder="0" allowfullscreen>
</iframe>''', 60),
                
                ('Encapsulation', 'lesson', '''# Encapsulation

Protecting your data.

![Security](https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800)

## Private Attributes

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance  # Private
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
    
    def get_balance(self):
        return self.__balance

account = BankAccount(1000)
account.deposit(500)
print(account.get_balance())  # 1500
```

### Encapsulation Tutorial

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/RvBsCy-2Z3Y" 
  frameborder="0" allowfullscreen>
</iframe>''', 45),
                
                ('Design Patterns', 'lesson', '''# Design Patterns

Common solutions to recurring problems.

![Design Patterns](https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800)

## Singleton Pattern

```python
class Singleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

## Factory Pattern

```python
class ShapeFactory:
    @staticmethod
    def create_shape(shape_type):
        if shape_type == "circle":
            return Circle()
        elif shape_type == "square":
            return Square()
```

<iframe width="560" height="315" 
  src="https://www.youtube.com/embed/tv-_1er1mWI" 
  frameborder="0" allowfullscreen>
</iframe>

| Pattern | Use Case |
|---------|----------|
| Singleton | One instance only |
| Factory | Object creation |
| Observer | Event handling |''', 70),

                ('Final Exam - OOP', 'exam', '''# Object-Oriented Programming Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Instructions
- Duration: 90 minutes
- Total Points: 100

## Question 1 (25 points)
Implement a class hierarchy for a vehicle system.

## Question 2 (25 points)
Demonstrate polymorphism with method overriding.

## Question 3 (25 points)
Create a class with proper encapsulation.

## Question 4 (25 points)
Implement the Observer design pattern.''', 90),
            ],
        }

        lesson_count = 0
        for module in modules:
            if module.title in lessons_data:
                for order, (title, lesson_type, content, duration) in enumerate(lessons_data[module.title], start=1):
                    Lesson.objects.create(
                        module_id=module,
                        title=title,
                        content=content,
                        lesson_type=lesson_type,
                        order=order,
                        duration_minutes=duration,
                        is_published=True
                    )
                    lesson_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {lesson_count} lessons'))

        # Create Activities for students
        self.stdout.write('Creating activities...')
        activities = []
        for student in students:
            for i, module in enumerate(modules):
                # Vary progress for different students and modules
                progress = (i + 1) * 20 if i < len(students) else 100
                progress = min(progress, 100)
                
                activity = Activity.objects.create(
                    student_id=student,
                    modules_id=module,
                    progress=progress
                )
                activities.append(activity)

        self.stdout.write(self.style.SUCCESS(f'Created {Activity.objects.count()} activities'))

        # Create UserOverview for each student
        self.stdout.write('Creating user overviews...')
        for i, student in enumerate(students):
            # Get activities for this student
            student_activities = Activity.objects.filter(student_id=student)
            
            # Pick a last module learned (the one with highest progress)
            last_module = student_activities.order_by('-progress').first().modules_id
            
            overview = UserOverview.objects.create(
                user_id=student,
                last_module_learned_id=last_module
            )
            
            # Add activities to the many-to-many relationship
            overview.user_activities.set(student_activities)

        self.stdout.write(self.style.SUCCESS(f'Created {UserOverview.objects.count()} user overviews'))

        # Create TestHistory
        self.stdout.write('Creating test history...')
        test_count = 0
        for student in students[:3]:  # Only first 3 students have test history
            # Get exam lessons for the first 2 modules
            exam_lessons = Lesson.objects.filter(module_id__in=modules[:2], lesson_type='exam')
            for lesson in exam_lessons:
                # Create test history with proper data
                TestHistory.objects.create(
                    student=student,
                    lesson=lesson,
                    score=85.0,  # Sample score
                    max_score=100.0,
                    answers={"1": "Option A", "2": "Option B"},  # Sample answers
                    correct_answers={"1": "Option A", "2": "Option C"}  # Sample correct answers
                )
                test_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {test_count} test history records'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Seeding Complete ==='))
        self.stdout.write(f'Roles: {Role.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Modules: {Module.objects.count()}')
        self.stdout.write(f'Lessons: {Lesson.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'User Overviews: {UserOverview.objects.count()}')
        self.stdout.write(f'Test History: {TestHistory.objects.count()}')
        
        self.stdout.write(self.style.SUCCESS('\n=== Login Credentials ==='))
        self.stdout.write('Admin: username=admin, password=admin123')
        self.stdout.write('Teachers: username=teacher_john/teacher_jane, password=teacher123')
        self.stdout.write('Students: username=student_alice/bob/charlie/dian qa/ethan, password=student123')
