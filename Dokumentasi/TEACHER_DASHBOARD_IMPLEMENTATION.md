# Teacher Dashboard & Module Creation System

## Overview

This document outlines the implementation of a comprehensive teacher dashboard and module/lesson creation system with markdown support.

## Features

### 1. Teacher Dashboard (Home Page)
- **Total Modules Created** - Count of modules created by the teacher
- **Last Module Created** - Most recent module with details
- **Activity Statistics** - Charts and metrics tracking teacher activity
- **Quick Actions** - Create new module, view analytics

### 2. Module & Lesson Management
- **Markdown Editor** - Rich markdown editor for creating content
- **Image Upload** - Support for inserting and positioning images
- **Lesson Types** - Regular lessons and exams
- **Content Organization** - Order lessons, set duration
- **Publishing Control** - Draft and publish workflow

### 3. Markdown Reader
- **Render Markdown** - Display formatted markdown content
- **Image Support** - Render embedded images
- **Syntax Highlighting** - Code blocks with syntax highlighting
- **Responsive** - Mobile-friendly rendering

## Database Schema Changes

### Module Model (Updated)

```python
class Module(models.Model):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)  # NEW
    deadline = models.DateTimeField()
    author_id = models.ForeignKey(User, related_name='modules')  # UPDATED
    cover_image = models.URLField(max_length=500, blank=True, null=True)  # NEW
    is_published = models.BooleanField(default=False)  # NEW
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)  # UPDATED
```

**New Fields:**
- `description` - Module description/overview
- `cover_image` - URL to module cover image
- `is_published` - Publishing status (draft/published)

### Lesson Model (Updated)

```python
class Lesson(models.Model):
    LESSON_TYPE_CHOICES = [
        ('lesson', 'Lesson'),
        ('exam', 'Exam'),
    ]
    
    module_id = models.ForeignKey(Module, related_name='lessons')  # UPDATED
    title = models.CharField(max_length=255)  # NEW
    content = models.TextField()  # Markdown content
    lesson_type = models.CharField(max_length=10, default='lesson')  # NEW
    order = models.IntegerField(default=0)  # NEW
    duration_minutes = models.IntegerField(default=30)  # NEW
    is_published = models.BooleanField(default=False)  # NEW
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)  # UPDATED
```

**New Fields:**
- `title` - Lesson title
- `lesson_type` - Type: lesson or exam
- `order` - Lesson order within module
- `duration_minutes` - Estimated completion time
- `is_published` - Publishing status

## API Endpoints

### Teacher Statistics

**GET** `/api/teacher/stats`
- Returns teacher dashboard statistics
- Requires authentication (Teacher role)

**Response:**
```json
{
  "total_modules": 15,
  "total_lessons": 45,
  "total_students_enrolled": 120,
  "last_module": {
    "id": 5,
    "title": "Advanced Python",
    "date_created": "2025-10-15T10:30:00Z",
    "lessons_count": 8
  },
  "monthly_activity": [
    {"month": "2025-09", "modules_created": 3, "lessons_created": 12},
    {"month": "2025-10", "modules_created": 2, "lessons_created": 8}
  ]
}
```

### Module CRUD

**POST** `/api/modules/create`
- Create new module
- Requires authentication (Teacher role)

**PUT** `/api/modules/{id}/update`
- Update existing module
- Only module author can update

**DELETE** `/api/modules/{id}/delete`
- Delete module
- Only module author can delete

**POST** `/api/modules/{id}/publish`
- Publish/unpublish module

### Lesson CRUD

**POST** `/api/lessons/create`
- Create new lesson with markdown content

**PUT** `/api/lessons/{id}/update`
- Update lesson content

**DELETE** `/api/lessons/{id}/delete`
- Delete lesson

**GET** `/api/lessons/{id}`
- Get lesson with markdown content

## Frontend Implementation

### Required NPM Packages

```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "react-syntax-highlighter": "^15.5.0",
    "@uiw/react-md-editor": "^4.0.0"
  }
}
```

### Component Structure

```
src/
├── pages/
│   ├── Home.tsx (Updated - Role-based dashboard)
│   ├── teacher/
│   │   ├── Dashboard.tsx (Teacher-specific home)
│   │   ├── ModuleCreate.tsx (Create/edit module)
│   │   ├── LessonEditor.tsx (Markdown editor)
│   │   └── Statistics.tsx (Activity charts)
│   └── modules/
│       └── lesson.tsx (Updated - Markdown renderer)
├── components/
│   ├── organisms/
│   │   ├── MarkdownEditor.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── TeacherStats.tsx
│   └── molecules/
│       ├── ModuleCard.tsx
│       └── LessonList.tsx
└── services/
    ├── teacherService.ts
    └── moduleService.ts
```

### Teacher Dashboard (Home.tsx)

```typescript
// Check user role and show appropriate dashboard
const user = getUser();

if (user?.role === TEACHER_ROLE_ID) {
  return <TeacherDashboard />;
} else {
  return <StudentDashboard />;
}
```

### Markdown Editor

Features:
- Live preview
- Toolbar for formatting
- Image insertion via URL
- Code block support
- Table support
- Split view (edit/preview)

### Markdown Renderer

Features:
- GitHub Flavored Markdown (GFM)
- Syntax highlighting for code blocks
- Image rendering
- Table rendering
- Link handling
- Security (sanitize HTML)

## Image Handling

### Image Upload Flow

1. **Teacher uploads image to external service** (e.g., Imgur, Cloudinary)
2. **Get image URL**
3. **Insert markdown image syntax**: `![Alt text](image-url)`
4. **Save lesson with markdown content**

### Alternative: Built-in Upload

1. **Add image upload endpoint**: `POST /api/upload/image`
2. **Store images** in media folder or cloud storage
3. **Return image URL**
4. **Insert in markdown**

## Exam Creation

### Exam as Special Lesson Type

```python
# Lesson with type='exam'
exam = Lesson.objects.create(
    module_id=module,
    title="Final Exam",
    content="# Final Exam\\n\\n## Question 1\\n...",
    lesson_type='exam',
    order=999,  # Usually last
    duration_minutes=120
)
```

### Exam Markdown Format

```markdown
# Final Exam: Module Name

## Instructions
- Time limit: 120 minutes
- Answer all questions
- No external resources allowed

## Question 1 (10 points)
What is the difference between...

**Answer:**
[Student fills this in]

## Question 2 (15 points)
Explain the concept of...

## Question 3 (Code Challenge - 25 points)
```python
# Write a function that...
```
```

## Migration Steps

### 1. Create Migration

```bash
cd backend/backend
python manage.py makemigrations modules
```

### 2. Review Migration

```bash
python manage.py sqlmigrate modules 0003  # Check SQL
```

### 3. Apply Migration

```bash
python manage.py migrate modules
```

### 4. Update Existing Data

```python
# Management command to migrate existing lessons
python manage.py shell

from modules.models import Module, Lesson

# Add titles to existing lessons
lessons = Lesson.objects.all()
for i, lesson in enumerate(lessons, 1):
    lesson.title = f"Lesson {i}"
    lesson.order = i
    lesson.save()
```

## Implementation Phases

### Phase 1: Backend Setup ✅
- [x] Update models
- [ ] Create migrations
- [ ] Create serializers
- [ ] Create API views
- [ ] Add URL routes
- [ ] Create teacher stats endpoint

### Phase 2: Frontend Dashboard
- [ ] Install markdown packages
- [ ] Create teacher dashboard component
- [ ] Add statistics cards
- [ ] Create activity charts
- [ ] Implement role-based routing

### Phase 3: Module/Lesson Creator
- [ ] Create markdown editor component
- [ ] Build module creation form
- [ ] Build lesson creation form
- [ ] Add image insertion feature
- [ ] Implement draft/publish workflow

### Phase 4: Markdown Reader
- [ ] Create markdown renderer component
- [ ] Update lesson page to render markdown
- [ ] Add syntax highlighting
- [ ] Add image rendering
- [ ] Test with various markdown features

### Phase 5: Testing & Polish
- [ ] Test module creation flow
- [ ] Test lesson creation flow
- [ ] Test markdown rendering
- [ ] Test image insertion
- [ ] Test exam creation
- [ ] Add loading states
- [ ] Add error handling
- [ ] Mobile responsiveness

## Security Considerations

1. **Authorization**
   - Only teachers can create modules/lessons
   - Only module author can edit/delete
   - Students can only view published content

2. **Markdown Safety**
   - Sanitize HTML in markdown
   - Prevent XSS attacks
   - Validate image URLs

3. **Content Moderation**
   - Draft/publish workflow
   - Review before publishing
   - Ability to unpublish

## Next Steps

1. **Run migrations** to update database schema
2. **Create serializers** for new fields
3. **Build API endpoints** for teacher stats and CRUD operations
4. **Install frontend packages** for markdown support
5. **Create teacher dashboard** with statistics
6. **Build markdown editor** for lesson creation
7. **Update lesson reader** to render markdown

Would you like me to proceed with the implementation? I'll need to:
1. Create and run migrations
2. Update serializers and views
3. Create frontend components
4. Install required packages

Let me know which phase you'd like me to start with!
