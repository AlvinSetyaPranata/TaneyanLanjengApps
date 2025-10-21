# Frontend Modules Integration

This document describes the frontend implementation for fetching and displaying modules with their lessons.

## Files Created/Modified

### 1. Type Definitions
**File:** `/frontend/src/types/modules.ts`

Defines TypeScript interfaces for type-safe API interactions:
- `Lesson` - Individual lesson structure
- `Module` - Module with nested lessons
- `ModulesOverviewResponse` - API response for all modules
- `ModuleDetailResponse` - API response for single module

### 2. API Service
**File:** `/frontend/src/utils/api.ts`

Provides centralized API functions:
- `fetchModulesOverview()` - Get all modules with lessons
- `fetchModuleDetail(moduleId)` - Get specific module with lessons

Features:
- Uses `authFetch()` for JWT authentication
- Proper error handling
- TypeScript return types
- Configurable API base URL

### 3. Modules List Page
**File:** `/frontend/src/pages/modules/index.tsx`

Enhanced to display real data from backend:

**Features:**
- ✅ Fetches all modules on component mount
- ✅ Loading state with spinner
- ✅ Error state with retry button
- ✅ Empty state when no modules
- ✅ Displays module count
- ✅ Shows lesson count per module
- ✅ Formatted deadline dates (Indonesian locale)
- ✅ Hover effects and transitions
- ✅ Links to module detail pages

**States:**
- `modules` - Array of module data
- `isLoading` - Loading indicator
- `error` - Error message

### 4. Home/Dashboard Page
**File:** `/frontend/src/pages/Home.tsx`

Updated to show real module count:

**Features:**
- ✅ Fetches module count on mount
- ✅ Displays loading state ("...")
- ✅ Shows actual count from backend

## Usage

### Fetching All Modules
```typescript
import { fetchModulesOverview } from '../utils/api';

// In component
useEffect(() => {
  async function loadModules() {
    try {
      const data = await fetchModulesOverview();
      console.log(`Found ${data.count} modules`);
      console.log('Modules:', data.modules);
    } catch (err) {
      console.error('Error:', err);
    }
  }
  
  loadModules();
}, []);
```

### Fetching Single Module
```typescript
import { fetchModuleDetail } from '../utils/api';

const moduleId = 1;
const data = await fetchModuleDetail(moduleId);
console.log('Module:', data.module);
console.log('Lessons:', data.module.lessons);
```

## Data Structure

### Module Object
```typescript
{
  id: 1,
  title: "Introduction to Programming",
  deadline: "2025-11-20T23:59:59Z",
  author_id: 2,
  date_created: "2025-10-21T10:00:00Z",
  date_updated: "2025-10-21T10:00:00Z",
  lessons: [
    {
      id: 1,
      content: "Lesson content here...",
      module_id: 1
    },
    // ... more lessons
  ]
}
```

## UI States

### Loading State
- Shows spinner icon
- Message: "Memuat modul..."

### Error State
- Shows error icon
- Error message
- "Coba Lagi" button to reload

### Empty State
- Shows book icon
- Message: "Belum ada modul tersedia."

### Success State
- Header with module count
- List of modules with:
  - Module title
  - Lesson count
  - Formatted deadline
  - "Detail Kelas" button (appears on hover)

## Date Formatting

Uses Indonesian locale for dates:
```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Example output: "20 November 2025"
```

## Styling

**Color Scheme:**
- Background: `bg-gray-50`
- Cards: `bg-white`
- Primary action: `bg-black` → `hover:bg-gray-800`
- Text: `text-gray-700`, `text-gray-500`

**Interactive Elements:**
- Hover effects on module cards
- Checkbox indicators
- Smooth transitions

## Testing

### Prerequisites
1. Backend server running on `http://localhost:8000`
2. Database seeded with modules and lessons
3. User authenticated (JWT token in localStorage)

### Test Steps

1. **Login**
   - Navigate to `/login`
   - Login with credentials (e.g., `admin` / `admin123`)

2. **View Dashboard**
   - Navigate to `/` (Home)
   - Should see real module count

3. **View Modules List**
   - Navigate to `/modules`
   - Should see all modules with lesson counts
   - Check loading state (briefly visible)
   - Verify formatted dates

4. **Click Module Detail**
   - Click "Detail Kelas" on any module
   - Should navigate to `/modules/{id}/corridor`

### Error Testing

1. **Backend Offline**
   - Stop backend server
   - Reload modules page
   - Should show error state with retry button

2. **Authentication Error**
   - Clear localStorage
   - Reload page
   - Should redirect to login

## Performance

### Optimizations
- Single API call for all modules (no N+1)
- Data cached in component state
- Efficient re-renders with proper key props
- Lazy loading ready (can add pagination)

### Loading Time
- Initial load: ~100-300ms (depends on data size)
- Subsequent visits: Cached (until refresh)

## Future Enhancements

Potential improvements:
1. **Pagination** - For large module lists
2. **Search/Filter** - Find modules by name
3. **Sort** - By date, title, lesson count
4. **Progress Tracking** - Show user progress per module
5. **Skeleton Loading** - Better loading UX
6. **Caching** - React Query or SWR
7. **Infinite Scroll** - For better UX
8. **Module Categories** - Group by semester/topic

## Troubleshooting

### Modules not loading
1. Check browser console for errors
2. Verify backend is running (`http://localhost:8000`)
3. Check JWT token in localStorage
4. Verify CORS settings in Django

### Empty modules list
1. Run seed data: `python manage.py seed_data`
2. Check database for module records
3. Verify API endpoint: `http://localhost:8000/api/modules/overview`

### Type errors
1. Ensure all imports are correct
2. Check TypeScript version compatibility
3. Run `bun install` to update dependencies

## API Integration Summary

| Feature | Endpoint | Method | Auth |
|---------|----------|--------|------|
| Get all modules | `/api/modules/overview` | GET | Required |
| Get module detail | `/api/modules/{id}/detail` | GET | Required |

Both endpoints return modules with nested lessons for efficient data loading.
