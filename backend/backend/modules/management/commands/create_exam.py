from django.core.management.base import BaseCommand
from django.db.models import Max
from modules.models import Module, Lesson


class Command(BaseCommand):
    help = 'Create ABC option exams for all modules that don\'t have exams'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating ABC option exams for modules...')
        
        # Get all modules
        modules = Module.objects.all()
        
        exam_content_templates = {
            'Introduction to Programming': '''# Programming Fundamentals Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Exam Instructions

**Duration:** 120 minutes  
**Total Points:** 100  
**Passing Score:** 70

---

## Part 1: Multiple Choice (40 points)

### Question 1 (5 points)
What is the correct way to declare a variable in Python?
- A) var x = 5
- B) int x = 5
- C) x = 5
- D) declare x = 5

**Answer:** C

### Question 2 (5 points)
Which data type is used to store text in Python?
- A) integer
- B) boolean
- C) string
- D) float

**Answer:** C

### Question 3 (5 points)
What is the output of `print(2 + 3 * 4)`?
- A) 20
- B) 14
- C) 11
- D) 24

**Answer:** B

### Question 4 (5 points)
Which keyword is used to define a function in Python?
- A) func
- B) function
- C) def
- D) define

**Answer:** C

### Question 5 (5 points)
What is the correct way to create a comment in Python?
- A) // This is a comment
- B) <!-- This is a comment -->
- C) # This is a comment
- D) /* This is a comment */

**Answer:** C

### Question 6 (5 points)
Which loop is used to iterate over a sequence in Python?
- A) while loop
- B) for loop
- C) do-while loop
- D) repeat loop

**Answer:** B

### Question 7 (5 points)
What is the result of `len("Hello")`?
- A) 4
- B) 5
- C) 6
- D) Error

**Answer:** B

### Question 8 (5 points)
Which data structure is ordered and changeable?
- A) tuple
- B) set
- C) list
- D) dictionary

**Answer:** C

---

## Part 2: Short Answer (30 points)

### Question 9 (10 points)
Explain the difference between a list and a tuple in Python.

**Sample Answer:**
- List is mutable (can be changed after creation), defined with square brackets []
- Tuple is immutable (cannot be changed after creation), defined with parentheses ()
- Both can store different data types and maintain order

### Question 10 (10 points)
What is the purpose of indentation in Python?

**Sample Answer:**
- Defines code blocks and scope
- Replaces braces {} used in other languages
- Enforces clean, readable code structure
- Incorrect indentation leads to IndentationError

### Question 11 (10 points)
Describe the difference between `==` and `is` operators in Python.

**Sample Answer:**
- `==` compares values/contents of objects
- `is` compares identity/memory location of objects
- `==` checks if objects are equal, `is` checks if objects are the same object
- Example: `[1,2,3] == [1,2,3]` is True, but `[1,2,3] is [1,2,3]` is False

---

## Part 3: Coding Problems (30 points)

### Question 12 (15 points)
Write a Python function that takes a list of numbers and returns the sum of all even numbers.

**Sample Solution:**
```python
def sum_even_numbers(numbers):
    total = 0
    for num in numbers:
        if num % 2 == 0:
            total += num
    return total

# Test
print(sum_even_numbers([1, 2, 3, 4, 5, 6]))  # Output: 12
```

### Question 13 (15 points)
Create a simple calculator function that takes two numbers and an operator (+, -, *, /) and returns the result.

**Sample Solution:**
```python
def calculator(num1, num2, operator):
    if operator == '+':
        return num1 + num2
    elif operator == '-':
        return num1 - num2
    elif operator == '*':
        return num1 * num2
    elif operator == '/':
        if num2 != 0:
            return num1 / num2
        else:
            return "Error: Division by zero"
    else:
        return "Error: Invalid operator"

# Test
print(calculator(10, 5, '+'))  # Output: 15
print(calculator(10, 5, '/'))  # Output: 2.0
```

---

## Grading Rubric

- **90-100:** Excellent - All questions answered correctly with detailed explanations
- **80-89:** Very Good - Most questions correct with good understanding
- **70-79:** Good - Passing grade with adequate knowledge
- **60-69:** Fair - Needs improvement
- **Below 60:** Fail - Significant gaps in understanding

---

**Good Luck!** 🍀''',
            
            'Data Structures and Algorithms': '''# Data Structures and Algorithms Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Exam Instructions

**Duration:** 120 minutes  
**Total Points:** 100  
**Passing Score:** 70

---

## Part 1: Multiple Choice (40 points)

### Question 1 (5 points)
What is the time complexity of binary search?
- A) O(n)
- B) O(n²)
- C) O(log n)
- D) O(1)

**Answer:** C

### Question 2 (5 points)
Which data structure follows LIFO principle?
- A) Queue
- B) Stack
- C) Array
- D) Linked List

**Answer:** B

### Question 3 (5 points)
What is the worst-case time complexity of Quick Sort?
- A) O(n log n)
- B) O(n²)
- C) O(log n)
- D) O(n)

**Answer:** B

### Question 4 (5 points)
Which traversal method visits the root node first?
- A) In-order
- B) Post-order
- C) Pre-order
- D) Level-order

**Answer:** C

### Question 5 (5 points)
What is the space complexity of Merge Sort?
- A) O(1)
- B) O(n)
- C) O(log n)
- D) O(n log n)

**Answer:** B

### Question 6 (5 points)
Which data structure is best for implementing BFS?
- A) Stack
- B) Queue
- C) Array
- D) Linked List

**Answer:** B

### Question 7 (5 points)
What is the height of a balanced binary tree with n nodes?
- A) O(n)
- B) O(log n)
- C) O(n²)
- D) O(1)

**Answer:** B

### Question 8 (5 points)
Which sorting algorithm is stable?
- A) Quick Sort
- B) Heap Sort
- C) Merge Sort
- D) Selection Sort

**Answer:** C

---

## Part 2: Short Answer (30 points)

### Question 9 (10 points)
Explain the difference between Array and Linked List.

**Sample Answer:**
- Array: Contiguous memory allocation, fixed size, random access O(1), insertion/deletion O(n)
- Linked List: Dynamic memory allocation, variable size, sequential access O(n), insertion/deletion O(1) at head

### Question 10 (10 points)
What is the purpose of a hash function in a hash table?

**Sample Answer:**
- Maps keys to array indices
- Enables O(1) average case lookup, insertion, and deletion
- Distributes keys uniformly across the table
- Handles collisions through chaining or open addressing

### Question 11 (10 points)
Describe the difference between Depth-First Search (DFS) and Breadth-First Search (BFS).

**Sample Answer:**
- DFS: Uses stack (recursion), explores as far as possible along each branch before backtracking
- BFS: Uses queue, explores all neighbors at current depth before going to next level
- DFS: Memory efficient, BFS: Shortest path in unweighted graphs

---

## Part 3: Coding Problems (30 points)

### Question 12 (15 points)
Implement a function to reverse a linked list.

**Sample Solution:**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev

# Test would require creating a linked list
```

### Question 13 (15 points)
Write a function to check if a binary tree is balanced.

**Sample Solution:**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_balanced(root):
    def check_height(node):
        if not node:
            return 0
        
        left_height = check_height(node.left)
        if left_height == -1:
            return -1
            
        right_height = check_height(node.right)
        if right_height == -1:
            return -1
            
        if abs(left_height - right_height) > 1:
            return -1
            
        return max(left_height, right_height) + 1
    
    return check_height(root) != -1

# Test would require creating a binary tree
```

---

## Grading Rubric

- **90-100:** Excellent - All questions answered correctly with detailed explanations
- **80-89:** Very Good - Most questions correct with good understanding
- **70-79:** Good - Passing grade with adequate knowledge
- **60-69:** Fair - Needs improvement
- **Below 60:** Fail - Significant gaps in understanding

---

**Good Luck!** 🍀''',
            
            'Web Development Fundamentals': '''# Web Development Fundamentals Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Exam Instructions

**Duration:** 120 minutes  
**Total Points:** 100  
**Passing Score:** 70

---

## Part 1: Multiple Choice (40 points)

### Question 1 (5 points)
Which HTML tag is used to define the main content of a document?
- A) <section>
- B) <main>
- C) <article>
- D) <div>

**Answer:** B

### Question 2 (5 points)
What does CSS stand for?
- A) Computer Style Sheets
- B) Cascading Style Sheets
- C) Creative Style Sheets
- D) Colorful Style Sheets

**Answer:** B

### Question 3 (5 points)
Which JavaScript method is used to select an element by its ID?
- A) document.getElementByClass()
- B) document.getElementById()
- C) document.getElementByName()
- D) document.getElementByTag()

**Answer:** B

### Question 4 (5 points)
What is the correct way to declare a variable in CSS?
- A) var myVar = "value";
- B) $myVar: "value";
- C) --myVar: "value";
- D) @myVar: "value";

**Answer:** C

### Question 5 (5 points)
Which CSS property is used to change the text color?
- A) fgcolor
- B) text-color
- C) color
- D) font-color

**Answer:** C

### Question 6 (5 points)
What is the purpose of the <head> tag in HTML?
- A) To display content on the page
- B) To contain metadata and links to external resources
- C) To define the main content
- D) To create a header section

**Answer:** B

### Question 7 (5 points)
Which HTML attribute is used to define inline styles?
- A) class
- B) style
- C) css
- D) font

**Answer:** B

### Question 8 (5 points)
What is the correct syntax for referring to an external script called "app.js"?
- A) <script src="app.js">
- B) <script href="app.js">
- C) <script name="app.js">
- D) <script file="app.js">

**Answer:** A

---

## Part 2: Short Answer (30 points)

### Question 9 (10 points)
Explain the difference between class and ID selectors in CSS.

**Sample Answer:**
- ID selectors (#myId) target a single, unique element
- Class selectors (.myClass) can target multiple elements
- ID has higher specificity than class
- Each page should have only one element with a specific ID
- Multiple elements can share the same class

### Question 10 (10 points)
What is the box model in CSS and what are its components?

**Sample Answer:**
- Content: The actual content of the element
- Padding: Space between content and border
- Border: The border around the padding
- Margin: Space outside the border
- Total width = width + padding + border + margin (in standard box model)

### Question 11 (10 points)
Describe the difference between let, const, and var in JavaScript.

**Sample Answer:**
- var: Function-scoped, can be redeclared and reassigned
- let: Block-scoped, can be reassigned but not redeclared
- const: Block-scoped, cannot be reassigned or redeclared
- const requires initialization at declaration
- let and const have temporal dead zone

---

## Part 3: Coding Problems (30 points)

### Question 12 (15 points)
Create a responsive navigation menu using HTML and CSS that collapses on mobile devices.

**Sample Solution:**
```html
<nav class="navbar">
  <div class="nav-brand">Logo</div>
  <ul class="nav-menu">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <div class="hamburger">
    <span></span>
    <span></span>
    <span></span>
  </div>
</nav>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background-color: white;
    width: 100%;
    text-align: center;
    transition: 0.3s;
  }
  
  .nav-menu.active {
    left: 0;
  }
}
</style>
```

### Question 13 (15 points)
Write a JavaScript function that validates a form with email and password fields.

**Sample Solution:**
```javascript
function validateForm(email, password) {
  // Email validation regex
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  
  // Check if fields are not empty
  if (!email || !password) {
    return "All fields are required";
  }
  
  // Validate email format
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  // Validate password length
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  
  return "Form is valid";
}

// Test
console.log(validateForm("user@example.com", "password123")); // Form is valid
console.log(validateForm("invalid-email", "pass")); // Please enter a valid email address
```

---

## Grading Rubric

- **90-100:** Excellent - All questions answered correctly with detailed explanations
- **80-89:** Very Good - Most questions correct with good understanding
- **70-79:** Good - Passing grade with adequate knowledge
- **60-69:** Fair - Needs improvement
- **Below 60:** Fail - Significant gaps in understanding

---

**Good Luck!** 🍀''',
            
            'Database Management Systems': '''# Database Management Systems Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Exam Instructions

**Duration:** 120 minutes  
**Total Points:** 100  
**Passing Score:** 70

---

## Part 1: Multiple Choice (40 points)

### Question 1 (5 points)
What does SQL stand for?
- A) Structured Query Language
- B) Simple Query Language
- C) Standard Query Language
- D) System Query Language

**Answer:** A

### Question 2 (5 points)
Which SQL command is used to retrieve data from a database?
- A) GET
- B) SELECT
- C) RETRIEVE
- D) FETCH

**Answer:** B

### Question 3 (5 points)
What is the primary key in a database table?
- A) A field that can contain duplicate values
- B) A field that uniquely identifies each record
- C) A field that contains text data
- D) A field that is always numeric

**Answer:** B

### Question 4 (5 points)
Which normal form eliminates transitive dependencies?
- A) First Normal Form (1NF)
- B) Second Normal Form (2NF)
- C) Third Normal Form (3NF)
- D) Boyce-Codd Normal Form (BCNF)

**Answer:** C

### Question 5 (5 points)
What is the purpose of a foreign key?
- A) To uniquely identify records in the same table
- B) To create a relationship between two tables
- C) To store large text data
- D) To improve query performance

**Answer:** B

### Question 6 (5 points)
Which SQL clause is used to filter records?
- A) SORT BY
- B) FILTER
- C) WHERE
- D) HAVING

**Answer:** C

### Question 7 (5 points)
What is a JOIN in SQL?
- A) A way to combine rows from two or more tables
- B) A way to delete records
- C) A way to update records
- D) A way to create indexes

**Answer:** A

### Question 8 (5 points)
Which command is used to insert new data into a table?
- A) ADD
- B) INSERT
- C) CREATE
- D) UPDATE

**Answer:** B

---

## Part 2: Short Answer (30 points)

### Question 9 (10 points)
Explain the difference between INNER JOIN and LEFT JOIN.

**Sample Answer:**
- INNER JOIN: Returns only rows that have matching values in both tables
- LEFT JOIN: Returns all rows from the left table and matching rows from the right table
- If no match in right table, NULL values are returned for right table columns
- LEFT JOIN preserves all records from the left table even without matches

### Question 10 (10 points)
What is database normalization and why is it important?

**Sample Answer:**
- Process of organizing data to minimize redundancy and dependency
- Eliminates insertion, update, and deletion anomalies
- Improves data integrity and reduces storage space
- Makes database more flexible and easier to maintain
- Follows normal forms (1NF, 2NF, 3NF, etc.)

### Question 11 (10 points)
Describe the ACID properties of database transactions.

**Sample Answer:**
- Atomicity: All operations in a transaction succeed or all fail
- Consistency: Database remains in valid state before and after transaction
- Isolation: Concurrent transactions don't interfere with each other
- Durability: Committed transactions are permanently saved even after system failure

---

## Part 3: Coding Problems (30 points)

### Question 12 (15 points)
Write SQL queries to create a normalized database schema for a library system with books, authors, and borrowers.

**Sample Solution:**
```sql
-- Authors table
CREATE TABLE Authors (
    author_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    birth_date DATE
);

-- Books table
CREATE TABLE Books (
    book_id INT PRIMARY KEY,
    title VARCHAR(200),
    isbn VARCHAR(20),
    publication_date DATE,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

-- Borrowers table
CREATE TABLE Borrowers (
    borrower_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100)
);

-- Loans table
CREATE TABLE Loans (
    loan_id INT PRIMARY KEY,
    book_id INT,
    borrower_id INT,
    loan_date DATE,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id)
);
```

### Question 13 (15 points)
Write a SQL query to find all books borrowed by a specific borrower in the last 30 days.

**Sample Solution:**
```sql
SELECT b.title, a.first_name, a.last_name, l.loan_date, l.return_date
FROM Loans l
JOIN Books b ON l.book_id = b.book_id
JOIN Authors a ON b.author_id = a.author_id
JOIN Borrowers br ON l.borrower_id = br.borrower_id
WHERE br.first_name = 'John' 
  AND br.last_name = 'Doe'
  AND l.loan_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY l.loan_date DESC;
```

---

## Grading Rubric

- **90-100:** Excellent - All questions answered correctly with detailed explanations
- **80-89:** Very Good - Most questions correct with good understanding
- **70-79:** Good - Passing grade with adequate knowledge
- **60-69:** Fair - Needs improvement
- **Below 60:** Fail - Significant gaps in understanding

---

**Good Luck!** 🍀''',
            
            'Object-Oriented Programming': '''# Object-Oriented Programming Final Exam

![Exam](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800)

## Exam Instructions

**Duration:** 120 minutes  
**Total Points:** 100  
**Passing Score:** 70

---

## Part 1: Multiple Choice (40 points)

### Question 1 (5 points)
Which of the following is NOT a pillar of OOP?
- A) Encapsulation
- B) Inheritance
- C) Polymorphism
- D) Compilation

**Answer:** D

### Question 2 (5 points)
What is a class in OOP?
- A) An instance of an object
- B) A blueprint for creating objects
- C) A method that returns a value
- D) A variable that stores data

**Answer:** B

### Question 3 (5 points)
Which keyword is used to inherit from a parent class in Python?
- A) extends
- B) implements
- C) inherits
- D) No keyword needed

**Answer:** D

### Question 4 (5 points)
What does encapsulation mean in OOP?
- A) Combining multiple classes into one
- B) Hiding internal details and exposing only necessary parts
- C) Creating multiple instances of a class
- D) Copying one object to another

**Answer:** B

### Question 5 (5 points)
What is polymorphism in OOP?
- A) Having multiple constructors
- B) The ability of objects to take many forms
- C) Creating private variables
- D) Inheriting from multiple classes

**Answer:** B

### Question 6 (5 points)
Which access modifier makes a member accessible only within the same class?
- A) public
- B) protected
- C) private
- D) internal

**Answer:** C

### Question 7 (5 points)
What is method overriding?
- A) Creating multiple methods with the same name
- B) Providing a specific implementation of a method already defined in parent class
- C) Calling a method from within itself
- D) Changing the return type of a method

**Answer:** B

### Question 8 (5 points)
What is an abstract class?
- A) A class that cannot be instantiated
- B) A class with no methods
- C) A class with only private members
- D) A class that contains only static methods

**Answer:** A

---

## Part 2: Short Answer (30 points)

### Question 9 (10 points)
Explain the difference between abstract classes and interfaces.

**Sample Answer:**
- Abstract class: Can have both abstract and concrete methods, can have instance variables, single inheritance
- Interface: Contains only abstract methods (in most languages), no instance variables, multiple inheritance possible
- Abstract class: Partial implementation, Interface: Complete abstraction
- Abstract class: Can have constructors, Interface: Cannot have constructors

### Question 10 (10 points)
What is the difference between method overloading and method overriding?

**Sample Answer:**
- Overloading: Multiple methods with same name but different parameters in same class
- Overriding: Redefining parent class method in child class with same signature
- Overloading: Compile-time polymorphism, Overriding: Runtime polymorphism
- Overloading: Return type can be different, Overriding: Return type must be same or covariant

### Question 11 (10 points)
Describe the Singleton design pattern and when to use it.

**Sample Answer:**
- Ensures a class has only one instance throughout the application
- Provides global access point to that instance
- Implementation involves private constructor and static method to get instance
- Use cases: Database connections, logging, configuration settings, cache managers

---

## Part 3: Coding Problems (30 points)

### Question 12 (15 points)
Implement a BankAccount class with encapsulation, inheritance, and polymorphism.

**Sample Solution:**
```python
class BankAccount:
    def __init__(self, account_number, balance=0):
        self.__account_number = account_number
        self.__balance = balance
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return True
        return False
    
    def get_balance(self):
        return self.__balance
    
    def get_account_number(self):
        return self.__account_number

# Savings account with interest
class SavingsAccount(BankAccount):
    def __init__(self, account_number, balance=0, interest_rate=0.02):
        super().__init__(account_number, balance)
        self.__interest_rate = interest_rate
    
    def add_interest(self):
        interest = self.get_balance() * self.__interest_rate
        self.deposit(interest)
        return interest

# Test
account = SavingsAccount("12345", 1000)
account.deposit(500)
print(f"Balance: {account.get_balance()}")  # Balance: 1500
account.add_interest()
print(f"Balance after interest: {account.get_balance()}")  # Balance after interest: 1530.0
```

### Question 13 (15 points)
Implement polymorphism with a Shape hierarchy.

**Sample Solution:**
```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        return 2 * math.pi * self.radius

# Polymorphism in action
def print_shape_info(shape):
    print(f"Area: {shape.area():.2f}")
    print(f"Perimeter: {shape.perimeter():.2f}")

# Test
shapes = [Rectangle(5, 3), Circle(4)]
for shape in shapes:
    print(f"{shape.__class__.__name__}:")
    print_shape_info(shape)
```

---

## Grading Rubric

- **90-100:** Excellent - All questions answered correctly with detailed explanations
- **80-89:** Very Good - Most questions correct with good understanding
- **70-79:** Good - Passing grade with adequate knowledge
- **60-69:** Fair - Needs improvement
- **Below 60:** Fail - Significant gaps in understanding

---

**Good Luck!** 🍀'''
        }
        
        created_exams = 0
        
        for module in modules:
            # Check if module already has an exam
            if not module.has_exam():
                # Get the appropriate exam content for this module
                exam_content = exam_content_templates.get(module.title)
                
                if exam_content:
                    # Create the exam lesson
                    exam_lesson = Lesson(
                        module_id=module,
                        title=f"Final Exam - {module.title}",
                        content=exam_content,
                        lesson_type='exam',
                        order=999,  # Place at the end
                        duration_minutes=120,
                        is_published=True
                    )
                    exam_lesson.save()
                    
                    # Update the order to be the last lesson
                    max_order = Lesson.objects.filter(module_id=module).aggregate(
                        Max('order')
                    )['order__max'] or 0
                    
                    exam_lesson.order = max_order + 1
                    exam_lesson.save()
                    
                    self.stdout.write(
                        f'Created exam for module: {module.title}'
                    )
                    created_exams += 1
                else:
                    self.stdout.write(
                        f'No exam template found for module: {module.title}'
                    )
            else:
                self.stdout.write(
                    f'Module already has exam: {module.title}'
                )
        
        self.stdout.write(
            f'Successfully created {created_exams} exams'
        )