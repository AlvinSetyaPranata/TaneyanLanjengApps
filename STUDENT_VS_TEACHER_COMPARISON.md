# Student vs Teacher Experience - Side-by-Side Comparison

## Quick Reference Guide

---

## 🏠 Dashboard (/)

### Teacher Dashboard
**Role ID**: 2

#### Shows:
- **Total Modules Created**: Number count
- **Last Module Created**: With lesson count
  - Click → Navigate to `/modules/:id`
- **Monthly Statistics**:
  - Modules created per month
  - Lessons created per month
  - Dual bar charts (blue/green)

#### API:
- Endpoint: `GET /api/teacher/stats`

---

### Student Dashboard
**Role ID**: 3

#### Shows:
- **Active Modules**: Modules with progress < 100%
- **Completed Modules**: Modules with progress = 100%
- **Last Module Learned**: With progress percentage
  - Click → Navigate to `/student/modules/:id/corridor`
- **Monthly Statistics**:
  - Average progress per month
  - Number of active modules
  - Gradient progress bars
  - Summary: Lessons completed / Total lessons

#### API:
- Endpoint: `GET /api/student/stats`

---

## 📚 Modules Page

### Teacher: /modules
**Purpose**: Manage and create modules

#### Features:
- All modules displayed
- Create new module button
- Edit module button
- View module details
- See students enrolled

#### Actions:
- Create module → `/modules/create`
- Edit module → `/modules/:id/edit`
- View lessons → `/modules/:id`
- Add lesson → `/modules/:id/lessons/create`

---

### Student: /student/modules
**Purpose**: View and access learning modules

#### Features:
- **2 Tabs**:
  1. **Belum Selesai** (Unfinished): progress < 100%
  2. **Sudah Selesai** (Finished): progress = 100%
- No create/edit buttons
- View-only mode

#### Display:
- Module title
- Lessons count
- Deadline
- Progress (for unfinished)
- Completion badge (for finished)

#### Actions:
- View detail → `/student/modules/:id/corridor`

---

## 📖 Module Detail/Corridor

### Teacher: /modules/:id
**Purpose**: Manage module content

#### Features:
- Edit module button
- Add lesson button
- Lessons list with:
  - Edit button
  - Delete button
  - Reorder capability
- Publish/unpublish toggle

---

### Student: /student/modules/:id/corridor
**Purpose**: View module and start learning

#### Features:
- **Progress Section**:
  - Progress percentage
  - Visual progress bar
  - Lessons completed count
  - Deadline date
  - "Lanjut Belajar" button
  
- **Learning Tips Section**:
  - Study recommendations
  
- **Lessons List**:
  - All lessons numbered
  - Duration display
  - Exam badges
  - Click to view lesson/take exam

---

## 📄 Lesson Page

### Teacher: /teacher/lessons/:id/edit
**Purpose**: Create/Edit lesson content

#### Features:
- Markdown editor with live preview
- Title input
- Lesson type selector (Lesson/Exam)
- Duration input
- Order input
- Save button
- Delete button

---

### Student: /student/modules/:module_id/lesson/:lesson_id
**Purpose**: Read lesson content

#### Features:
- **Content Display**:
  - Rendered markdown
  - Syntax highlighting
  - Rich typography
  
- **Navigation**:
  - Previous button (with title preview)
  - Next button (with title preview)
  - Disabled states at boundaries
  
- **Sidebar**:
  - Progress bar
  - All lessons list
  - Current lesson highlighted
  - Click to navigate
  - Collapsible

#### Special Behavior:
- If lesson type is "exam" → Auto-redirect to exam page

---

## 📝 Exam

### Teacher: Create Exam
**Location**: Same as lesson editor

#### Process:
1. Create lesson
2. Select type: "Exam"
3. Set duration (in minutes)
4. Write exam questions in markdown
5. Publish

---

### Student: Take Exam
**Location**: `/student/modules/:module_id/exam/:lesson_id`

#### Flow:

**1. Pre-Exam Screen**:
- Exam title
- Module name
- Duration display
- Instructions
- Buttons: "Kembali" | "Mulai Ujian"

**2. During Exam**:
- Fixed header with:
  - Exam title
  - Live countdown timer (color-coded)
  - Exit button (with warning)
  - Submit button (with confirmation)
- Exam content (markdown rendered)
- Modals:
  - Exit warning
  - Submit confirmation

**3. Post-Submission**:
- Success message
- Time taken display
- "Kembali ke Modul" button

---

## 📊 Statistics & Progress

### Teacher
**Focus**: Creation Activity

- Modules created over time
- Lessons created over time
- Students enrolled count
- Monthly creation trends

---

### Student
**Focus**: Learning Progress

- Active modules count
- Completed modules count
- Progress per module (0-100%)
- Lessons completed count
- Monthly learning activity
- Average progress trends

---

## 🎯 URL Structure Comparison

### Teacher Routes:
```
/                              → Teacher Dashboard
/modules                       → All Modules (manage)
/modules/create                → Create Module
/modules/:id                   → Module Detail (edit)
/modules/:id/edit              → Edit Module
/modules/:id/lessons/create    → Create Lesson
/teacher/lessons/:id/edit      → Edit Lesson
/teacher/dashboard             → Dashboard (alternative)
```

### Student Routes:
```
/                                         → Student Dashboard
/student/modules                          → Modules (Finished/Unfinished tabs)
/student/modules/:id/corridor             → Module Overview
/student/modules/:module_id/lesson/:id    → Lesson Page
/student/modules/:module_id/exam/:id      → Exam Page
```

---

## 🎨 Visual Differences

### Colors

**Teacher**:
- Primary: Blue (#3B82F6)
- Secondary: Green (#10B981)
- Accent: Gray

**Student**:
- Progress: Blue to Green Gradient
- Completed: Green (#10B981)
- Exam: Red (#DC2626)
- Active: Blue (#3B82F6)

---

### Icons

**Teacher**:
- 📊 Module creation stats
- ✏️ Edit icons everywhere
- ➕ Add buttons
- 🗑️ Delete options

**Student**:
- 📚 Book/learning icons
- ✅ Completion checkmarks
- 📈 Progress indicators
- ⏱️ Timer (for exams)
- 🔒 Lock icons (exam warnings)

---

## 🔑 Key Differentiators

| Aspect | Teacher | Student |
|--------|---------|---------|
| **Purpose** | Create & Manage | Learn & Progress |
| **Dashboard** | Creation stats | Learning stats |
| **Modules View** | All modules | Filtered by completion |
| **Module Detail** | Edit interface | Progress view |
| **Lesson Access** | Editor mode | Reader mode |
| **Exam** | Create questions | Take exam with timer |
| **Navigation** | CRUD operations | Read-only navigation |
| **Progress** | N/A | Tracked everywhere |
| **Buttons** | Edit, Delete, Create | View, Continue Learning |

---

## 🔄 Shared Components

### Both Use:
1. **DetailLayout**: Header with navigation
2. **RootLayout**: Main app layout
3. **Breadcrumps**: Navigation trail
4. **DashboardCard**: Stat display
5. **ReactMarkdown**: Content rendering
6. **Icon (Iconify)**: Icon library

---

## 💾 Backend Data Model

### Teacher Queries:
```python
# Get modules created by teacher
Module.objects.filter(author_id=teacher_user)

# Get lessons for a module
Lesson.objects.filter(module_id=module)
```

### Student Queries:
```python
# Get student's activities
Activity.objects.filter(student_id=student_user)

# Get modules with progress
modules = Module.objects.all()
# Progress from Activity model

# Get last module learned
Activity.objects.filter(student_id=user).order_by('-date_updated').first()
```

---

## 🚀 Quick Test Scenarios

### Test as Teacher:
```
1. Login: teacher_john / teacher123
2. View dashboard → See modules created
3. Go to /modules → See all modules
4. Create new module
5. Add lessons to module
6. Create exam (type: exam)
```

### Test as Student:
```
1. Login: student_alice / student123
2. View dashboard → See active modules, progress
3. Go to /student/modules → See tabs
4. Click module → View progress and lessons
5. Click lesson → Read content, navigate
6. Click exam → Take exam with timer
```

---

## 📋 Feature Checklist

### ✅ Implemented:

**Teacher**:
- [x] Dashboard with creation stats
- [x] Module CRUD
- [x] Lesson CRUD
- [x] Exam creation
- [x] Monthly activity charts

**Student**:
- [x] Dashboard with learning stats
- [x] Finished/Unfinished module tabs
- [x] Module overview with progress
- [x] Lesson reading with navigation
- [x] Sidebar navigation
- [x] Exam page with timer
- [x] Auto-redirect for exams
- [x] Warning modals
- [x] Auto-submit on time expiry

---

## 🎓 Role Detection

```typescript
// In frontend
const user = getUser(); // from localStorage
const isTeacher = user?.role === 2; // Role ID 2
const isStudent = user?.role === 3; // Role ID 3

// Conditional rendering
if (isTeacher) {
  return <TeacherDashboard />;
} else {
  return <StudentDashboard />;
}
```

---

## 📱 Responsive Behavior

### Both Experiences:
- Desktop: Full layout with sidebars
- Tablet: Adjusted spacing
- Mobile: Stacked, collapsible elements

### Student-Specific:
- Exam timer: Always visible (sticky)
- Lesson sidebar: Collapsible toggle
- Progress bars: Responsive width

---

## 🔒 Access Control

### Teacher Only:
- Create/Edit/Delete modules
- Create/Edit/Delete lessons
- View teacher stats
- Access `/modules` routes (without `/student` prefix)

### Student Only:
- View progress
- Take exams with timer
- View learning stats
- Access `/student/modules` routes

---

## 🎯 Summary

**Teacher Experience**: 
- Content creation and management
- Performance tracking (what they've created)
- Full CRUD capabilities

**Student Experience**:
- Content consumption and learning
- Progress tracking (what they've learned)
- Read-only with interactive exams

**Completely Different** yet **Seamlessly Integrated** through shared backend and components!

---

**Last Updated**: October 22, 2025
**Status**: ✅ Production Ready
**Maintainability**: High - Clear separation of concerns
