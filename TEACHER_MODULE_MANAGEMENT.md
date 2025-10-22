# Teacher Module and Lesson Management System

## Overview
This document describes the complete teacher interface for managing modules and lessons with markdown editor integration.

## Architecture

### Page Flow for Teachers
```
/teacher/modules (List all modules)
    ├── /teacher/modules/create (Create new module)
    ├── /teacher/modules/:id (Module detail with lessons list)
    │   ├── /teacher/modules/:id/edit (Edit module)
    │   └── /teacher/modules/:id/lessons/create (Create lesson in module)
    └── /teacher/lessons/:id/edit (Edit specific lesson)
```

### Page Flow for Students
```
/modules (List all available modules)
    └── /modules/:id/corridor (Module detail)
        └── /modules/:module_id/lesson/:lesson_id (View lesson content)
```

## Pages Created

### 1. Teacher Modules List (`/teacher/modules`)
**File**: `/frontend/src/pages/teacher/Modules.tsx`

**Features**:
- Displays all modules created by the logged-in teacher
- Three tabs: All Modules, Published, Drafts
- Grid layout with module cards showing:
  - Cover image or gradient placeholder
  - Title and description
  - Published/Draft status badge
  - Lesson count
  - Deadline
- Actions per module:
  - **Manage**: Opens module detail page
  - **Edit**: Opens module editor
  - **Delete**: Deletes module with confirmation
- Loading, error, and empty states
- "Create New Module" button

### 2. Teacher Module Detail (`/teacher/modules/:module_id`)
**File**: `/frontend/src/pages/teacher/ModuleDetail.tsx`

**Features**:
- Displays module information:
  - Title with published/draft badge
  - Description
  - Lesson count, deadline, creation date
- Actions:
  - Edit Module button
  - Add Lesson button
  - Back to Modules link
- Lessons list showing:
  - Order number
  - Lesson title
  - Lesson type (regular lesson or exam) badge
  - Published/Draft status
  - Duration and last updated time
  - Edit and Delete buttons per lesson
- Empty state when no lessons exist
- Integrated with backend API

### 3. Module Editor (`/teacher/modules/create` and `/teacher/modules/:id/edit`)
**File**: `/frontend/src/pages/teacher/ModuleEditor.tsx`

**Features**:
- Form fields:
  - **Title**: Required text input
  - **Description**: Textarea for module overview
  - **Deadline**: DateTime picker
  - **Cover Image URL**: Optional URL field with preview
  - **Published Status**: Checkbox
- Image preview shows when valid URL entered
- Two save options:
  - Save as Draft (unchecks publish checkbox)
  - Create/Update Module
- Cancel button with confirmation
- Help section with module creation tips
- Validation before save
- Integrates with `POST /api/modules/` and `PUT /api/modules/:id/`

### 4. Lesson Editor (`/teacher/lessons/create` and `/teacher/lessons/:id/edit`)
**File**: `/frontend/src/pages/teacher/LessonEditor.tsx`

**Features**:
- Form fields:
  - Title, Module selection, Lesson Type (Lesson/Exam)
  - Order, Duration (minutes), Published status
- **Markdown Editor** with:
  - Full markdown support using `@uiw/react-md-editor`
  - Syntax highlighting
  - Live preview toggle
- **Toolbar**:
  - Insert Image (URL prompt)
  - Insert Table (pre-formatted)
  - Insert Code Block
  - Preview Toggle button
- Two modes:
  - **Edit Mode**: Full markdown editor
  - **Preview Mode**: Rendered markdown with `.markdown-content` styling
- Save options: Draft or Publish
- Help section with markdown syntax guide
- Integrates with `POST /api/lessons/` and `PUT /api/lessons/:id/`

### 5. Teacher Dashboard (`/teacher/dashboard`)
**File**: `/frontend/src/pages/teacher/Dashboard.tsx`

**Features**:
- Statistics cards:
  - Total modules created
  - Total lessons created
  - Students enrolled count
- Recently created module display
- Monthly activity chart (last 6 months)
- Quick action buttons for creating modules/lessons

## Backend Integration

### API Endpoints Used

#### Modules
```
GET    /api/modules/                    # List all modules
POST   /api/modules/                    # Create module
GET    /api/modules/:id/                # Get module
PUT    /api/modules/:id/                # Update module
DELETE /api/modules/:id/                # Delete module
GET    /api/modules/:id/detail          # Get module with lessons
GET    /api/modules/overview            # Get all modules with progress
```

#### Lessons
```
GET    /api/lessons/                    # List all lessons
POST   /api/lessons/                    # Create lesson
GET    /api/lessons/:id/                # Get lesson
PUT    /api/lessons/:id/                # Update lesson
DELETE /api/lessons/:id/                # Delete lesson
```

#### Teacher Stats
```
GET    /api/teacher/stats               # Get teacher dashboard statistics
```

### Serializers

**ModuleSerializer**: Returns module with `lessons_count`
```json
{
  "id": 1,
  "title": "Introduction to Python",
  "description": "Learn Python basics",
  "deadline": "2025-12-31T23:59:59Z",
  "author_id": 2,
  "author_name": "John Doe",
  "cover_image": "https://...",
  "is_published": true,
  "lessons_count": 8,
  "date_created": "2025-10-01T...",
  "date_updated": "2025-10-15T..."
}
```

**ModuleWithLessonsSerializer**: Returns module with nested lessons
```json
{
  "id": 1,
  "title": "Introduction to Python",
  "lessons": [
    {
      "id": 1,
      "title": "Python Basics",
      "content": "# Python Basics\n\n...",
      "lesson_type": "lesson",
      "order": 1,
      "duration_minutes": 45,
      "is_published": true,
      "module_id": 1
    }
  ]
}
```

**LessonSerializer**: Returns lesson details
```json
{
  "id": 1,
  "title": "Python Basics",
  "content": "# Python Basics\n\nMarkdown content...",
  "lesson_type": "lesson",
  "order": 1,
  "duration_minutes": 45,
  "is_published": true,
  "module_id": 1,
  "date_created": "2025-10-01T...",
  "date_updated": "2025-10-15T..."
}
```

## Routes Configuration

### Frontend Routes (App.tsx)
```typescript
// Student Routes
/                                         # Home
/modules                                  # Student modules list
/modules/:module_id/corridor             # Student module detail
/modules/:module_id/lesson/:lesson_id    # View lesson

// Teacher Routes
/teacher/dashboard                        # Teacher dashboard
/teacher/modules                          # Teacher modules list
/teacher/modules/create                   # Create module
/teacher/modules/:module_id               # Module detail with lessons
/teacher/modules/:module_id/edit         # Edit module
/teacher/modules/:module_id/lessons/create # Create lesson in module
/teacher/lessons/create                   # Create lesson (select module)
/teacher/lessons/:lesson_id/edit         # Edit lesson

// Auth & Settings
/login
/register
/settings
```

### Backend URLs (urls.py)
```python
# Module endpoints
api/modules/overview                      # GET modules with progress
api/modules/<int:module_id>/detail       # GET module with lessons
api/modules/                              # GET list, POST create
api/modules/<int:id>/                     # GET, PUT, DELETE

# Lesson endpoints
api/lessons/                              # GET list, POST create
api/lessons/<int:id>/                     # GET, PUT, DELETE

# Teacher endpoints
api/teacher/stats                         # GET teacher statistics
```

## User Flow Examples

### Creating a Complete Module

1. **Teacher goes to** `/teacher/modules`
2. **Clicks** "Create New Module"
3. **Fills in** module details:
   - Title: "Advanced Python Programming"
   - Description: "Deep dive into advanced Python concepts"
   - Deadline: "2025-12-31 23:59"
   - Cover Image: URL
   - Check "Publish immediately"
4. **Clicks** "Create Module"
5. **Redirected to** `/teacher/modules/:id` (module detail)
6. **Clicks** "Add Lesson"
7. **Fills in** lesson details:
   - Title: "Decorators and Generators"
   - Content: Write markdown in editor
   - Type: Lesson
   - Order: 1
   - Duration: 60 minutes
8. **Toggles** to Preview Mode to check formatting
9. **Clicks** "Create Lesson"
10. **Lesson appears** in module detail page
11. **Repeat steps 6-10** for more lessons

### Editing Existing Content

#### Edit Module:
1. From modules list, click **Edit** icon
2. Modify details
3. Click **Update Module**

#### Edit Lesson:
1. From module detail, click **Edit** on any lesson
2. Modify content in markdown editor
3. Toggle preview to check
4. Click **Update Lesson**

#### Delete Content:
1. Click **Delete** button (module or lesson)
2. Confirm deletion
3. Item removed from list

## Markdown Editor Features

### Supported Markdown Syntax

**Headings**: `# H1`, `## H2`, `### H3`
**Bold**: `**bold text**`
**Italic**: `*italic text*`
**Links**: `[text](url)`
**Images**: `![alt](url)`
**Lists**: `- item` or `1. item`
**Code**: `` `inline` `` or ` ```language ... ``` `
**Tables**: Pipe-separated tables
**Blockquotes**: `> quote`

### Quick Insert Tools

**Insert Image**:
- Prompts for URL
- Inserts `![Image](url)` at cursor

**Insert Table**:
- Adds pre-formatted 3-column table template

**Insert Code Block**:
- Adds JavaScript code block template

### Preview Mode

Toggle between:
- **Edit Mode**: Markdown editor with syntax highlighting
- **Preview Mode**: Fully rendered HTML with `.markdown-content` CSS styling

## Styling

### Markdown Content Styling
All lesson content uses the `.markdown-content` CSS class defined in `/frontend/src/index.css` for consistent rendering.

### UI Components
- **Button**: Reusable button component with variants (primary, secondary)
- **Input**: Styled form inputs
- **Select**: Dropdown selects with options array
- **DashboardCard**: Stat cards for dashboard

## Security & Permissions

### Teacher-Only Access
All `/teacher/*` routes should be protected to ensure only users with teacher role can access.

**TODO**: Add role-based protection in `ProtectedRoute` component:
```typescript
// Check if user.role === TEACHER_ROLE_ID
const user = getUser()
if (user?.role !== 2) { // Assuming 2 is teacher role
  return <Navigate to="/" />
}
```

### Ownership Validation
**Backend**: Ensure teachers can only edit/delete their own modules/lessons
**Frontend**: Filter modules by `author_id === user.id`

## Testing Guide

### Manual Testing Steps

1. **Start backend**: `cd backend/backend && python manage.py runserver`
2. **Start frontend**: `cd frontend && bun run dev`
3. **Login as teacher**
4. **Navigate to** `/teacher/modules`
5. **Create a module**
6. **Add lessons** to the module
7. **Edit lesson** content with markdown
8. **Toggle preview** to verify rendering
9. **Publish module**
10. **Login as student** and verify module appears in `/modules`
11. **View lesson** as student at `/modules/:id/lesson/:lesson_id`

### API Testing

```bash
# Create module
curl -X POST http://localhost:8000/api/modules/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Module",
    "description": "Test description",
    "deadline": "2025-12-31T23:59:59Z",
    "is_published": true,
    "author_id": 2
  }'

# Create lesson
curl -X POST http://localhost:8000/api/lessons/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Lesson",
    "content": "# Test\n\nContent here",
    "lesson_type": "lesson",
    "order": 1,
    "duration_minutes": 30,
    "is_published": true,
    "module_id": 1
  }'
```

## Files Summary

### Frontend Files Created
- ✅ `/frontend/src/pages/teacher/Modules.tsx` - Teacher modules list
- ✅ `/frontend/src/pages/teacher/ModuleDetail.tsx` - Module detail with lessons
- ✅ `/frontend/src/pages/teacher/ModuleEditor.tsx` - Module create/edit form
- ✅ `/frontend/src/pages/teacher/LessonEditor.tsx` - Lesson editor with markdown
- ✅ `/frontend/src/pages/teacher/Dashboard.tsx` - Teacher statistics dashboard

### Frontend Files Modified
- ✅ `/frontend/src/pages/App.tsx` - Added teacher routes

### Backend Files Modified
- ✅ `/backend/backend/modules/views.py` - Fixed `prefetch_related('lessons')`
- ✅ `/backend/backend/backend/urls.py` - Added teacher stats endpoint

### Backend Files (Already Exist)
- ✅ `/backend/backend/modules/models.py` - Module & Lesson models
- ✅ `/backend/backend/modules/serializers.py` - All serializers
- ✅ `/backend/backend/modules/views.py` - ViewSets and endpoints

## Next Steps

1. **Add Role-Based Protection**: Ensure only teachers can access teacher routes
2. **Add Student Lesson View**: Update student lesson page to fetch real data from backend
3. **Add Bulk Operations**: Select multiple lessons/modules for batch actions
4. **Add Search & Filter**: Search modules/lessons by title, filter by date/status
5. **Add Rich Media Upload**: Direct file upload for images instead of URL-only
6. **Add Lesson Reordering**: Drag-and-drop to reorder lessons
7. **Add Module Duplication**: Clone existing modules
8. **Add Analytics**: Track student engagement and performance per module/lesson

## Known Issues

1. **Node.js Version**: Frontend requires Node.js 20.19+ (current: 20.16.0)
2. **Role Validation**: Teacher routes not yet protected by role check
3. **Ownership Check**: Backend should validate teacher owns module before edit/delete

## Dependencies

### Frontend
- `@uiw/react-md-editor` - Markdown editor
- `react-markdown` - Markdown renderer
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-raw` - HTML in markdown

### Backend
- Django REST Framework
- djangorestframework-simplejwt
