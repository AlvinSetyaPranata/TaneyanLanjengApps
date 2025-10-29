# Student Lesson Page - Quick Reference

## 📁 Files Changed/Created

### Backend
| File | Type | Description |
|------|------|-------------|
| `backend/modules/views.py` | Modified | Added `lesson_detail()` endpoint |
| `backend/backend/urls.py` | Modified | Added lesson detail route |

### Frontend
| File | Type | Description |
|------|------|-------------|
| `frontend/src/types/modules.ts` | Modified | Enhanced type definitions |
| `frontend/src/services/moduleService.ts` | Created | New service for module/lesson data |
| `frontend/src/pages/modules/lesson.tsx` | Modified | Complete rewrite with backend integration |

### Documentation
| File | Description |
|------|-------------|
| `STUDENT_LESSON_PAGE.md` | Complete implementation guide |
| `STUDENT_LESSON_ARCHITECTURE.md` | Architecture diagrams |
| `TESTING_STUDENT_LESSON.md` | Testing guide |
| `STUDENT_LESSON_QUICK_REF.md` | This file |

## 🚀 Quick Commands

### Start Backend
```bash
cd backend/backend
python manage.py runserver
```

### Start Frontend  
```bash
cd frontend
npm run dev
```

### Create Test Data
```bash
cd backend/backend
python manage.py shell
# Then paste the test data script from TESTING_STUDENT_LESSON.md
```

## 🔗 API Endpoints

### Get Lesson Detail
```
GET /api/modules/<module_id>/lessons/<lesson_id>
Headers: Authorization: Bearer <token>
```

**Response**:
```typescript
{
  success: boolean;
  lesson: Lesson;
  module: { id, title, description, cover_image };
  navigation: { 
    prev: { id, title } | null;
    next: { id, title } | null;
  };
  all_lessons: Lesson[];
}
```

## 📊 Component Props & State

### LessonPage State
```typescript
sidebarStatus: boolean          // Sidebar open/closed
loading: boolean                // Data loading state
error: string | null            // Error message
lessonData: LessonDetailResponse | null  // Fetched data
```

### URL Parameters
```typescript
module_id: string    // From useParams()
lesson_id: string    // From useParams()
```

## 🎨 Key Features

### 1. Dynamic Content
- ✅ Fetches lesson from backend
- ✅ Renders markdown with full formatting
- ✅ Shows lesson metadata (duration, date, type)

### 2. Navigation
- ✅ Prev/Next buttons with lesson titles
- ✅ Disabled states when no prev/next
- ✅ Click any lesson in sidebar to jump

### 3. Sidebar
- ✅ Shows all lessons in module
- ✅ Highlights current lesson
- ✅ Displays progress bar
- ✅ Toggle open/close
- ✅ Floating button when closed

### 4. Progress Tracking
- ✅ Calculates based on lesson position
- ✅ Updates dynamically
- ✅ Shows percentage complete

### 5. Loading & Error States
- ✅ Loading spinner
- ✅ Error messages
- ✅ 404 handling

## 🔧 Functions Reference

### Service Functions
```typescript
// From moduleService.ts
getLessonDetail(moduleId: number, lessonId: number): Promise<LessonDetailResponse>
getAllModules(): Promise<ModulesOverviewResponse>
getModuleDetail(moduleId: number): Promise<ModuleDetailResponse>
```

### Navigation Functions
```typescript
handlePrevious()  // Navigate to previous lesson
handleNext()      // Navigate to next lesson  
handleLessonClick(lessonId: number)  // Jump to specific lesson
```

### Utility Functions
```typescript
calculateProgress()  // Returns progress percentage
```

## 🎯 URL Patterns

### Student Routes
```
/student/modules                           → Module list
/student/modules/:module_id/corridor       → Module detail
/student/modules/:module_id/lesson/:lesson_id → Lesson page
```

### Example URLs
```
http://localhost:5173/student/modules/1/lesson/1
http://localhost:5173/student/modules/1/lesson/2
http://localhost:5173/student/modules/2/lesson/5
```

## 🎨 CSS Classes

### Markdown Content
```css
.markdown-content          /* Main container */
.markdown-content h1       /* Headings */
.markdown-content p        /* Paragraphs */
.markdown-content code     /* Inline code */
.markdown-content pre      /* Code blocks */
```

### Custom Styling
```typescript
// Active lesson in sidebar
className="bg-blue-50 border-l-4 border-blue-600"

// Disabled button
className="bg-gray-50 text-gray-400 cursor-not-allowed"

// Progress bar
style={{ width: `${progress}%` }}
```

## 🐛 Debugging Tips

### Check API Response
```javascript
// In browser console
console.log(lessonData)
```

### Check URL Parameters
```javascript
console.log({ module_id, lesson_id })
```

### Check Navigation Data
```javascript
console.log(lessonData?.navigation)
```

### Network Tab
- Check if API call succeeds (Status 200)
- Verify response structure
- Check authorization header

## ⚡ Performance Tips

1. **Prefetch**: Could prefetch next lesson while reading current
2. **Cache**: Consider caching lessons client-side
3. **Lazy Load**: Images and heavy content
4. **Debounce**: Navigation clicks to prevent rapid requests

## 🔐 Authentication

All requests require JWT token:
```typescript
// Handled automatically by authFetch()
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
< 640px: Single column, full-width sidebar

/* Tablet */  
640px - 1024px: Adjust padding, smaller sidebar

/* Desktop */
> 1024px: Full layout with 300px sidebar
```

## ✅ Testing Checklist

Quick test list:
- [ ] Login works
- [ ] Lesson loads
- [ ] Markdown renders
- [ ] Prev/Next work
- [ ] Sidebar toggles
- [ ] Progress updates
- [ ] Click lesson navigates
- [ ] Error states work
- [ ] Loading state works

## 🚨 Common Errors

### "Lesson not found"
→ Check lesson exists and is_published=True

### "Module not found"
→ Verify module_id is correct

### 401 Unauthorized
→ Login again, check token

### Blank page
→ Check console for errors

### Markdown not rendering
→ Verify react-markdown installed

## 📚 Type Definitions

```typescript
interface Lesson {
  id: number;
  title: string;
  content: string;
  lesson_type: 'lesson' | 'exam';
  order: number;
  duration_minutes: number;
  is_published: boolean;
  module_id: number;
  date_created: string;
  date_updated: string;
}

interface LessonDetailResponse {
  success: boolean;
  lesson: Lesson;
  module: {
    id: number;
    title: string;
    description?: string;
    cover_image?: string;
  };
  navigation: {
    prev: { id: number; title: string } | null;
    next: { id: number; title: string } | null;
  };
  all_lessons: Lesson[];
}
```

## 🎓 Best Practices

1. **Always check loading/error states**
2. **Validate URL parameters**
3. **Handle null navigation gracefully**
4. **Use semantic HTML**
5. **Maintain accessibility**
6. **Test on multiple devices**
7. **Keep markdown content clean**
8. **Monitor performance**

## 📞 Integration Points

### With Backend
- JWT authentication
- REST API calls
- Error handling

### With Frontend Router
- useParams for URL data
- useNavigate for navigation
- Protected routes

### With Components
- DetailLayout wrapper
- ReactMarkdown renderer
- Iconify icons

## 🔮 Future Enhancements

Potential additions:
- Lesson completion tracking
- Bookmarks
- Notes/annotations
- Search within content
- Keyboard shortcuts
- Print/download
- Quiz integration
- Time tracking
- Offline mode

## 📖 Related Documentation

- Backend: `backend/MODULES_API.md`
- Frontend: `frontend/MODULES_INTEGRATION.md`
- Teacher: `TEACHER_LESSON_EDITOR.md`
- Auth: `JWT_INTEGRATION.md`

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
