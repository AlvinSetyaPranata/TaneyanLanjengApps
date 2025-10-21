# Modules API Documentation

## Overview
This document describes the API endpoints for fetching modules with their nested lessons.

## Endpoints

### 1. Get All Modules with Lessons (Overview)

**Endpoint:** `GET /api/modules/overview`

**Authentication:** Required (JWT Token)

**Description:** Retrieves all modules with their lessons nested inside. This is perfect for displaying an overview/dashboard of all available modules.

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "modules": [
    {
      "id": 1,
      "title": "Introduction to Javanese Culture",
      "deadline": "2025-12-31T23:59:59Z",
      "author_id": 1,
      "date_created": "2025-10-01T10:00:00Z",
      "date_updated": "2025-10-01T10:00:00Z",
      "lessons": [
        {
          "id": 1,
          "content": "Lesson 1 content here...",
          "module_id": 1
        },
        {
          "id": 2,
          "content": "Lesson 2 content here...",
          "module_id": 1
        }
      ]
    },
    {
      "id": 2,
      "title": "Advanced Javanese Traditions",
      "deadline": "2025-12-31T23:59:59Z",
      "author_id": 1,
      "date_created": "2025-10-15T10:00:00Z",
      "date_updated": "2025-10-15T10:00:00Z",
      "lessons": [
        {
          "id": 3,
          "content": "Lesson 3 content here...",
          "module_id": 2
        }
      ]
    }
  ]
}
```

**Features:**
- Returns modules ordered by creation date (newest first)
- Uses `prefetch_related` for optimized database queries
- Includes complete lesson data within each module
- Returns total count of modules

---

### 2. Get Single Module with Lessons

**Endpoint:** `GET /api/modules/{module_id}/detail`

**Authentication:** Required (JWT Token)

**Description:** Retrieves a specific module with all its lessons. Useful for module detail pages.

**URL Parameters:**
- `module_id` (integer): The ID of the module to retrieve

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "module": {
    "id": 1,
    "title": "Introduction to Javanese Culture",
    "deadline": "2025-12-31T23:59:59Z",
    "author_id": 1,
    "date_created": "2025-10-01T10:00:00Z",
    "date_updated": "2025-10-01T10:00:00Z",
    "lessons": [
      {
        "id": 1,
        "content": "Lesson 1 content here...",
        "module_id": 1
      },
      {
        "id": 2,
        "content": "Lesson 2 content here...",
        "module_id": 1
      }
    ]
  }
}
```

**Response (404 NOT FOUND):**
```json
{
  "success": false,
  "error": "Module not found"
}
```

**Features:**
- Returns a single module with nested lessons
- Optimized with `prefetch_related`
- Handles non-existent modules gracefully

---

## Usage Examples

### Frontend (React/TypeScript)

#### Fetch All Modules with Lessons
```typescript
import { authFetch } from '../utils/auth';

interface Lesson {
  id: number;
  content: string;
  module_id: number;
}

interface Module {
  id: number;
  title: string;
  deadline: string;
  author_id: number;
  date_created: string;
  date_updated: string;
  lessons: Lesson[];
}

interface ModulesOverviewResponse {
  success: boolean;
  count: number;
  modules: Module[];
}

async function fetchModulesOverview(): Promise<ModulesOverviewResponse> {
  const response = await authFetch('http://localhost:8000/api/modules/overview');
  
  if (!response.ok) {
    throw new Error('Failed to fetch modules');
  }
  
  return await response.json();
}

// Usage in component
const data = await fetchModulesOverview();
console.log(`Found ${data.count} modules`);
data.modules.forEach(module => {
  console.log(`${module.title} has ${module.lessons.length} lessons`);
});
```

#### Fetch Single Module with Lessons
```typescript
async function fetchModuleDetail(moduleId: number) {
  const response = await authFetch(
    `http://localhost:8000/api/modules/${moduleId}/detail`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch module');
  }
  
  const data = await response.json();
  return data.module;
}

// Usage in component
const module = await fetchModuleDetail(1);
console.log(`Module: ${module.title}`);
console.log(`Lessons: ${module.lessons.length}`);
```

---

## Performance Optimizations

Both endpoints use Django's `prefetch_related()` to optimize database queries:
- **Without optimization:** 1 query for modules + N queries for lessons (N+1 problem)
- **With prefetch_related:** 2 queries total (1 for modules + 1 for all lessons)

This makes the API very efficient even with many modules and lessons.

---

## Existing Endpoints (Still Available)

These new endpoints complement the existing CRUD endpoints:

- `GET /api/modules` - List all modules (without lessons)
- `GET /api/modules/{id}` - Get single module (without lessons)
- `POST /api/modules` - Create new module
- `PUT /api/modules/{id}` - Update module
- `DELETE /api/modules/{id}` - Delete module

- `GET /api/lessons` - List all lessons
- `GET /api/lessons/{id}` - Get single lesson
- `POST /api/lessons` - Create new lesson
- `PUT /api/lessons/{id}` - Update lesson
- `DELETE /api/lessons/{id}` - Delete lesson

---

## Notes

1. All endpoints require JWT authentication
2. The `lessons` field is read-only in the nested serializer
3. To create/update lessons, use the dedicated `/api/lessons` endpoints
4. Modules are ordered by creation date (newest first) in the overview endpoint
5. The serializer uses Django's `lesson_set` reverse relation to fetch lessons
