# Testing the Student Lesson Page

## Quick Start Guide

### 1. Start the Backend Server

```bash
cd /Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend
python manage.py runserver
```

The backend will run on `http://localhost:8000`

### 2. Start the Frontend Development Server

```bash
cd /Users/alvinsetyapranata/Documents/TaneyanLanjengApps/frontend
npm run dev
# or
bun run dev
```

The frontend will run on `http://localhost:5173`

### 3. Create Test Data (If Needed)

#### Create a Module with Lessons

You can use Django shell or the teacher interface:

```bash
cd /Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend
python manage.py shell
```

```python
from modules.models import Module, Lesson
from users.models import User

# Get or create a teacher user
teacher = User.objects.filter(role='teacher').first()

# Create a test module
module = Module.objects.create(
    title="Test Module - Introduction to Programming",
    description="Learn the basics of programming",
    deadline="2025-12-31",
    author_id=teacher,
    is_published=True
)

# Create test lessons
lessons_data = [
    {
        "title": "What is Programming?",
        "content": """# What is Programming?

Programming is the process of creating instructions that tell a computer what to do.

## Key Concepts

- **Variables**: Store data
- **Functions**: Reusable blocks of code
- **Loops**: Repeat actions
- **Conditionals**: Make decisions

## Example Code

```python
def greet(name):
    print(f"Hello, {name}!")

greet("World")
```

This is a simple function that greets someone by name.
""",
        "order": 1,
        "duration_minutes": 15
    },
    {
        "title": "Variables and Data Types",
        "content": """# Variables and Data Types

Variables are containers for storing data values.

## Common Data Types

1. **Strings**: Text data
2. **Numbers**: Integers and floats
3. **Booleans**: True or False
4. **Lists**: Ordered collections

## Examples

```python
name = "Alice"          # String
age = 25                # Integer
height = 5.7            # Float
is_student = True       # Boolean
hobbies = ["reading", "coding"]  # List
```
""",
        "order": 2,
        "duration_minutes": 20
    },
    {
        "title": "Control Flow",
        "content": """# Control Flow

Control flow determines the order in which code executes.

## If Statements

```python
age = 18

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
```

## Loops

### For Loop
```python
for i in range(5):
    print(i)
```

### While Loop
```python
count = 0
while count < 5:
    print(count)
    count += 1
```
""",
        "order": 3,
        "duration_minutes": 25
    },
    {
        "title": "Functions",
        "content": """# Functions

Functions are reusable blocks of code that perform specific tasks.

## Defining Functions

```python
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(result)  # Output: 8
```

## Function with Default Parameters

```python
def greet(name="Guest"):
    print(f"Hello, {name}!")

greet()           # Hello, Guest!
greet("Alice")    # Hello, Alice!
```
""",
        "order": 4,
        "duration_minutes": 30
    },
    {
        "title": "Final Exam",
        "content": """# Programming Basics - Final Exam

## Instructions

This exam will test your understanding of:
- Variables and data types
- Control flow (if statements, loops)
- Functions

**Time Limit**: 60 minutes

**Total Points**: 100

## Good Luck! 🍀
""",
        "lesson_type": "exam",
        "order": 5,
        "duration_minutes": 60
    }
]

# Create the lessons
for lesson_data in lessons_data:
    Lesson.objects.create(
        module_id=module,
        is_published=True,
        **lesson_data
    )

print(f"Created module '{module.title}' with {module.lessons.count()} lessons")
print(f"Module ID: {module.id}")
```

### 4. Test the Lesson Page

1. **Login as a Student**
   - Navigate to `http://localhost:5173/login`
   - Login with student credentials

2. **Navigate to a Module**
   - Go to `http://localhost:5173/student/modules`
   - Click on a module

3. **Open a Lesson**
   - Click on any lesson from the module corridor
   - Or directly navigate to: `http://localhost:5173/student/modules/1/lesson/1`
     (Replace 1 with actual module_id and lesson_id)

### 5. Test Features

#### Sidebar Features:
- [ ] Toggle sidebar open/close
- [ ] See all lessons listed
- [ ] Click on different lessons to navigate
- [ ] See current lesson highlighted
- [ ] View progress bar
- [ ] See lesson numbers and durations
- [ ] See exam badges for exam-type lessons

#### Content Features:
- [ ] Markdown renders correctly
- [ ] Headers, lists, code blocks display properly
- [ ] Links work
- [ ] Images load (if any in content)
- [ ] Metadata shows: module name, duration, date

#### Navigation Features:
- [ ] Previous button works (disabled on first lesson)
- [ ] Next button works (disabled on last lesson)
- [ ] Previous/Next show lesson titles
- [ ] Navigation updates progress bar

#### Responsive Features:
- [ ] Sidebar collapses and expands smoothly
- [ ] Floating toggle button appears when collapsed
- [ ] Content adjusts to available space
- [ ] Works on different screen sizes

#### Loading States:
- [ ] Loading spinner shows while fetching
- [ ] Error message displays if lesson not found
- [ ] Back button works in error state

### 6. API Testing

You can test the API directly:

```bash
# Get access token first
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}'

# Use the access token
TOKEN="your_access_token_here"

# Test lesson detail endpoint
curl http://localhost:8000/api/modules/1/lessons/1 \
  -H "Authorization: Bearer $TOKEN"
```

Expected response:
```json
{
  "success": true,
  "lesson": {
    "id": 1,
    "title": "What is Programming?",
    "content": "# What is Programming?...",
    "lesson_type": "lesson",
    "order": 1,
    "duration_minutes": 15,
    "is_published": true,
    "module_id": 1,
    "date_created": "2025-10-22T...",
    "date_updated": "2025-10-22T..."
  },
  "module": {
    "id": 1,
    "title": "Test Module - Introduction to Programming",
    "description": "Learn the basics of programming",
    "cover_image": null
  },
  "navigation": {
    "prev": null,
    "next": {
      "id": 2,
      "title": "Variables and Data Types"
    }
  },
  "all_lessons": [
    { /* lesson 1 */ },
    { /* lesson 2 */ },
    // ... more lessons
  ]
}
```

### 7. Check Browser Console

Open browser DevTools (F12) and check:
- No errors in Console
- Network tab shows successful API calls
- State updates properly in React DevTools (if installed)

### 8. Test Edge Cases

- [ ] Access non-existent module: `/student/modules/999/lesson/1`
- [ ] Access non-existent lesson: `/student/modules/1/lesson/999`
- [ ] Access without authentication (should redirect to login)
- [ ] Navigate directly via URL
- [ ] Refresh page while on a lesson
- [ ] Browser back/forward buttons

### 9. Performance Testing

- [ ] Lesson loads quickly (< 1 second)
- [ ] Navigation is instant
- [ ] Sidebar toggles smoothly
- [ ] No lag when clicking through lessons
- [ ] Markdown renders efficiently

### 10. Mobile Testing

If possible, test on mobile device or use browser DevTools:
- [ ] Responsive on phone (320px - 480px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Touch gestures work
- [ ] Sidebar usable on small screens

## Common Issues and Solutions

### Issue: "Lesson not found"
**Solution**: 
- Check that lesson exists and is published
- Verify lesson belongs to the specified module
- Check authentication token is valid

### Issue: Markdown not rendering
**Solution**:
- Verify `react-markdown` and `remark-gfm` are installed
- Check markdown content is valid
- Verify CSS classes are applied

### Issue: Navigation buttons not working
**Solution**:
- Check navigation data in response
- Verify lesson order is correct
- Check for console errors

### Issue: Progress bar not updating
**Solution**:
- Verify lesson order is sequential
- Check calculation logic
- Ensure all_lessons array is populated

### Issue: 401 Unauthorized
**Solution**:
- Login again
- Check token expiration
- Verify authFetch is working

## Success Criteria

✅ All lessons display correctly with markdown formatting
✅ Navigation prev/next works seamlessly  
✅ Sidebar shows all lessons with proper highlighting
✅ Progress bar updates as you navigate
✅ Loading and error states work properly
✅ Responsive design works on all screen sizes
✅ No console errors
✅ Fast and smooth performance

## Next Steps

After successful testing:
1. Add more content to lessons
2. Implement lesson completion tracking
3. Add quiz functionality for exams
4. Enhance with animations
5. Add keyboard shortcuts
6. Implement bookmarking
7. Add note-taking feature

## Support

If you encounter issues:
1. Check this testing guide
2. Review implementation docs: `STUDENT_LESSON_PAGE.md`
3. Check architecture: `STUDENT_LESSON_ARCHITECTURE.md`
4. Review backend logs
5. Check frontend console errors
