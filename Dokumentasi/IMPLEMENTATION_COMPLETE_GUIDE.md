# Teacher Dashboard Implementation - Complete Guide

## ✅ Phase 1: Backend Setup (COMPLETED)

### Database
- ✅ Models updated with markdown support
- ✅ Migration created and applied
- ✅ Database reset and seeded with new structure
- ✅ Serializers updated

### What's Working
- Modules now have: description, cover_image, is_published
- Lessons now have: title, lesson_type, order, duration_minutes, is_published
- Content is stored as markdown
- Seeder creates proper markdown content with code blocks

## 📋 Phase 2: Backend APIs (NEXT)

### Required Endpoints

#### 1. Teacher Statistics
```python
# GET /api/teacher/stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_stats(request):
    """Get teacher dashboard statistics"""
```

#### 2. Module CRUD
```python
# POST /api/modules/create
# PUT /api/modules/{id}/update  
# DELETE /api/modules/{id}/delete
# POST /api/modules/{id}/publish
```

#### 3. Lesson CRUD
```python
# POST /api/lessons/create
# PUT /api/lessons/{id}/update
# DELETE /api/lessons/{id}/delete
```

### Implementation Files
- `/backend/backend/modules/views.py` - Add new views
- `/backend/backend/backend/urls.py` - Add new routes

## 📦 Phase 3: Frontend Packages

### Install Required Packages
```bash
cd frontend
bun add react-markdown remark-gfm react-syntax-highlighter @uiw/react-md-editor
bun add -D @types/react-syntax-highlighter
```

### Packages Purpose
- `react-markdown` - Render markdown content
- `remark-gfm` - GitHub Flavored Markdown support
- `react-syntax-highlighter` - Code syntax highlighting
- `@uiw/react-md-editor` - Markdown editor component

## 🎨 Phase 4: Frontend Components

### 1. Teacher Dashboard (Home.tsx)
```typescript
// Role-based dashboard
const user = getUser();
const isTeacher = user?.role === TEACHER_ROLE_ID;

if (isTeacher) {
  return <TeacherDashboard />;
} else {
  return <StudentDashboard />;
}
```

### 2. Markdown Editor
```typescript
// components/organisms/MarkdownEditor.tsx
import MDEditor from '@uiw/react-md-editor';

<MDEditor
  value={content}
  onChange={setContent}
  preview="live"
  height={500}
/>
```

### 3. Markdown Renderer
```typescript
// components/organisms/MarkdownRenderer.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter language={match[1]}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }}
>
  {content}
</ReactMarkdown>
```

### 4. Module Creator Page
- Form with title, description, cover image, deadline
- Lesson list
- Add/edit/delete lessons
- Publish/unpublish toggle

### 5. Lesson Editor Page
- Markdown editor
- Title input
- Lesson type selector (lesson/exam)
- Duration input
- Order input
- Preview pane

## 🎯 Quick Start Steps

### Step 1: Complete Backend APIs
```bash
# Add views in modules/views.py
# Add routes in backend/urls.py
# Test with curl or Postman
```

### Step 2: Install Frontend Packages
```bash
cd frontend
bun add react-markdown remark-gfm react-syntax-highlighter @uiw/react-md-editor @types/react-syntax-highlighter
```

### Step 3: Add Markdown Styles
```css
/* In frontend/src/index.css */
.markdown-content {
  /* Add markdown styling */
}
```

### Step 4: Create Components
1. TeacherDashboard.tsx
2. MarkdownEditor.tsx
3. MarkdownRenderer.tsx
4. ModuleCreator.tsx
5. LessonEditor.tsx

### Step 5: Update Existing Pages
1. Home.tsx - Add role-based routing
2. modules/lesson.tsx - Add markdown renderer

## 🔑 Key Features

### Teacher Dashboard Shows:
1. **Total Modules** - Count of modules created
2. **Last Module** - Most recent module details
3. **Activity Chart** - Modules/lessons created per month
4. **Quick Actions** - Create module, view all modules

### Module/Lesson Creation:
1. **Rich Editor** - Full markdown support
2. **Image Insertion** - Via URL
3. **Code Blocks** - Syntax highlighting
4. **Tables** - GFM tables
5. **Preview** - Live preview while editing

### Markdown Rendering:
1. **Styled Content** - Proper typography
2. **Code Highlighting** - Language-specific
3. **Images** - Responsive images
4. **Links** - Clickable links
5. **Lists** - Ordered and unordered

## 📝 Sample Markdown Content

```markdown
# Lesson Title

## Introduction
This is the introduction paragraph.

### Key Points
- Point 1
- Point 2
- Point 3

## Code Example
​```python
def hello_world():
    print("Hello, World!")
​```

## Image
![Description](https://example.com/image.jpg)

## Table
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

## 🚀 Next Implementation Priority

1. **Teacher Stats API** (30 min)
2. **Module CRUD API** (1 hour)
3. **Install Frontend Packages** (5 min)
4. **Markdown Renderer Component** (30 min)
5. **Update Lesson Page** (30 min)
6. **Teacher Dashboard** (2 hours)
7. **Module/Lesson Creator** (3 hours)

**Total Estimated Time**: 7-8 hours

## Would You Like Me To:
A) Continue with backend APIs implementation
B) Jump to frontend packages and components
C) Focus on specific feature first

Let me know and I'll proceed!
