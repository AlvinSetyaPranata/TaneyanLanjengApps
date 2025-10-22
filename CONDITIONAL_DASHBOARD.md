# Conditional Dashboard - Implementation Guide

## Overview
The homepage/dashboard (`/`) uses conditional rendering to display role-specific content for Teachers, Students, and Admins. Each role sees a completely different dashboard tailored to their needs.

---

## 🎯 Three Different Dashboards, One Route

### URL
- `/` (homepage) - Serves all roles

### Role Detection
```typescript
const user = getUser()
const isTeacher = user?.role === 2  // Teacher
const isStudent = user?.role === 3  // Student
const isAdmin = user?.role === 1    // Admin
```

---

## 👨‍🏫 Teacher Dashboard

### Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ 📰 News Headline                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌──────────────────┐  ┌──────────────────────────┐  │
│ │ 📚 Modul Anda    │  │ 📖 Modul Terakhir Dibuat │  │
│ │      5           │  │   Web Development    →   │  │
│ └──────────────────┘  │   8 materi               │  │
│                       └──────────────────────────┘  │
│                                                      │
│ Statistik                                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Oktober 2025              3 modul, 12 materi     │ │
│ │ ████████░░░░░░░░  ██████████░░░░                │ │
│ │   3 modul            12 materi                   │ │
│ │                                                  │ │
│ │ September 2025            2 modul, 8 materi      │ │
│ │ █████░░░░░░░░░░░  ███████░░░░░░                │ │
│ │   2 modul             8 materi                   │ │
│ │                                                  │ │
│ │ Legend: 🟦 Modul Dibuat  🟩 Materi Dibuat       │ │
│ └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Dashboard Cards (2)
1. **Modul Anda**
   - Icon: Module icon
   - Content: Total modules created
   - Shows: Number count

2. **Modul Terakhir Dibuat**
   - Shows: Last created module title
   - Text: Number of lessons in module
   - Action: Click arrow → Navigate to `/teacher/modules/:id`

### Statistics Section
**Title**: "Statistik"

**Shows**: Last 6 months of activity
- Month name (e.g., "Oktober 2025")
- Modules created that month
- Lessons created that month
- Dual progress bars:
  - Blue bar: Modules created (relative to max)
  - Green bar: Lessons created (relative to max)

**Legend**:
- 🟦 Modul Dibuat
- 🟩 Materi Dibuat

### API Endpoint
- **URL**: `GET /api/teacher/stats`
- **Returns**: TeacherStats interface

---

## 👨‍🎓 Student Dashboard

### Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ 📰 News Headline                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌────────────┐ ┌────────────┐ ┌──────────────────┐ │
│ │📖 Modul    │ │✅ Modul    │ │📚 Modul Terakhir │ │
│ │   Aktif    │ │   Selesai  │ │  Python Basic → │ │
│ │     5      │ │     2      │ │  75% selesai     │ │
│ │ Sedang...  │ │ Telah...   │ └──────────────────┘ │
│ └────────────┘ └────────────┘                      │
│                                                      │
│ Statistik Aktivitas Belajar                          │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Oktober 2025         5 modul • 67% rata-rata     │ │
│ │ ████████████████████████████░░░░░░░░  67%       │ │
│ │                                                  │ │
│ │ September 2025       4 modul • 55% rata-rata     │ │
│ │ ████████████████████░░░░░░░░░░░░░░░  55%       │ │
│ │                                                  │ │
│ │ ┌──────────────┐  ┌──────────────┐              │ │
│ │ │      23      │  │      45      │              │ │
│ │ │Materi Selesai│  │Total Materi  │              │ │
│ │ └──────────────┘  └──────────────┘              │ │
│ └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Dashboard Cards (3)
1. **Modul Aktif**
   - Icon: Book open icon
   - Content: Count of active modules (progress < 100%)
   - Text: "Sedang dipelajari"

2. **Modul Selesai**
   - Icon: Checkmark circle icon
   - Content: Count of completed modules (progress = 100%)
   - Text: "Telah diselesaikan"

3. **Modul Terakhir**
   - Shows: Last accessed module title
   - Text: Progress percentage
   - Action: Click arrow → Navigate to `/student/modules/:id/corridor`

### Statistics Section
**Title**: "Statistik Aktivitas Belajar"

**Monthly Activity** (Last 6 months):
- Month name
- Number of active modules
- Average progress percentage
- Single gradient progress bar (blue to green)

**Summary Cards** (2 columns):
1. **Materi Selesai**
   - Background: Blue 50
   - Number: Large, blue 600
   - Count of completed lessons

2. **Total Materi**
   - Background: Green 50
   - Number: Large, green 600
   - Total lessons across all modules

### API Endpoint
- **URL**: `GET /api/student/stats`
- **Returns**: StudentStats interface

---

## 👨‍💼 Admin Dashboard

### Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ 📰 News Headline                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│                     🛡️                               │
│                                                      │
│         Selamat Datang, Administrator                │
│                                                      │
│  Anda login sebagai administrator. Gunakan panel    │
│  admin Django untuk mengelola sistem.                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Content
- Shield icon (large)
- Welcome message
- Instructions to use Django admin panel
- No statistics or cards

### Purpose
Simple welcome screen since admins use Django admin panel for management.

---

## 🔄 Rendering Flow

```typescript
// 1. Check if user exists and loading
if (!user || (isLoading && !teacherStats && !studentStats)) {
  return <LoadingScreen />
}

// 2. Check if admin
if (isAdmin) {
  return <AdminWelcome />
}

// 3. Check if teacher
if (isTeacher) {
  return <TeacherDashboard />
}

// 4. Default: Student dashboard
return <StudentDashboard />
```

---

## 📊 Data Flow

### Teacher Stats Flow
```
1. Detect isTeacher = true
2. Fetch GET /api/teacher/stats
3. Receive TeacherStats data
4. Update teacherStats state
5. Render teacher dashboard cards
6. Render teacher activity chart
```

### Student Stats Flow
```
1. Detect isStudent = true
2. Fetch GET /api/student/stats
3. Receive StudentStats data
4. Update studentStats state
5. Render student dashboard cards
6. Render student activity chart
7. Render summary cards
```

---

## 🎨 Visual Differences

| Element | Teacher | Student | Admin |
|---------|---------|---------|-------|
| **Cards** | 2 cards | 3 cards | None |
| **Card Style** | Side by side | Grid (3 cols) | N/A |
| **Stats Title** | "Statistik" | "Statistik Aktivitas Belajar" | None |
| **Charts** | Dual bars | Single gradient bar | None |
| **Summary** | Legend only | 2 summary cards | None |
| **Colors** | Blue/Green bars | Blue→Green gradient | Blue shield |
| **Focus** | Creation activity | Learning progress | Welcome only |

---

## 🔧 TypeScript Interfaces

### TeacherStats
```typescript
interface TeacherStats {
  total_modules: number
  total_lessons: number
  total_students_enrolled: number
  last_module: {
    id: number
    title: string
    description: string
    cover_image: string
    date_created: string
    lessons_count: number
    is_published: boolean
  } | null
  monthly_activity: Array<{
    month: string
    modules_created: number
    lessons_created: number
  }>
}
```

### StudentStats
```typescript
interface StudentStats {
  active_modules: number
  completed_modules: number
  total_lessons: number
  lessons_completed: number
  last_module: {
    id: number
    title: string
    description: string
    cover_image: string
    progress: number
    lessons_count: number
  } | null
  monthly_activity: Array<{
    month: string
    average_progress: number
    modules_active: number
  }>
}
```

---

## 🚀 Navigation Actions

### Teacher Dashboard
- **Last Module Card** → `/teacher/modules/:id`

### Student Dashboard
- **Last Module Card** → `/student/modules/:id/corridor`

---

## 💡 Key Features

### Teacher Dashboard
- ✅ Shows creation metrics
- ✅ Displays recent work
- ✅ Tracks productivity over time
- ✅ Dual-bar comparison charts
- ✅ Quick access to last module

### Student Dashboard
- ✅ Shows learning progress
- ✅ Displays active/completed split
- ✅ Tracks progress over time
- ✅ Gradient progress visualization
- ✅ Summary of completed work
- ✅ Quick resume learning

### Admin Dashboard
- ✅ Simple welcome message
- ✅ Directs to Django admin
- ✅ No unnecessary stats

---

## 🔍 Loading States

### Initial Load
```
┌─────────────────────────────────────────┐
│                                         │
│            ⟳ Loading Loop               │
│         Memuat dashboard...             │
│                                         │
└─────────────────────────────────────────┘
```

### During Stats Fetch
- Cards show "..." as placeholder
- Charts don't render until data arrives

---

## 📱 Responsive Design

### Teacher Dashboard
- **Desktop**: 2 cards side by side
- **Mobile**: Cards stack vertically
- Charts always full width

### Student Dashboard
- **Desktop**: 3 cards in grid
- **Tablet**: 2 cards then 1
- **Mobile**: Cards stack vertically
- Summary cards: 2 columns on all sizes

---

## 🧪 Testing Guide

### Test Teacher Dashboard
```bash
1. Login: teacher_john / teacher123
2. Navigate to: /
3. Expected:
   - 2 cards (Modul Anda, Modul Terakhir Dibuat)
   - "Statistik" section
   - Dual-bar charts (blue/green)
   - Legend at bottom
   - Click last module → Navigate to teacher detail
```

### Test Student Dashboard
```bash
1. Login: student_alice / student123
2. Navigate to: /
3. Expected:
   - 3 cards (Aktif, Selesai, Terakhir)
   - "Statistik Aktivitas Belajar" section
   - Gradient progress bars
   - 2 summary cards (Materi Selesai, Total Materi)
   - Click last module → Navigate to student corridor
```

### Test Admin Dashboard
```bash
1. Login: admin / admin123
2. Navigate to: /
3. Expected:
   - Shield icon
   - Welcome message
   - No stats or cards
```

---

## ✅ Implementation Checklist

- [x] Role detection (isTeacher, isStudent, isAdmin)
- [x] Loading state before role detection
- [x] Teacher dashboard with creation stats
- [x] Student dashboard with learning stats
- [x] Admin welcome screen
- [x] Separate API endpoints (teacher/stats, student/stats)
- [x] Conditional rendering throughout
- [x] Different card layouts per role
- [x] Different chart visualizations
- [x] Proper navigation links
- [x] TypeScript interfaces
- [x] Error handling
- [x] Responsive design

---

## 🎯 Summary

The homepage successfully implements **conditional rendering** to serve three distinct user experiences:

1. **Teachers** see content creation metrics and productivity charts
2. **Students** see learning progress and completion tracking
3. **Admins** see a simple welcome screen

All from the same `/` route using role-based conditional logic.

---

**Status**: ✅ Complete  
**Date**: October 22, 2025  
**File**: `/frontend/src/pages/Home.tsx`  
**Quality**: Production Ready
