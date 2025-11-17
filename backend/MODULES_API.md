# Modules API Documentation

## Overview

This document describes the API endpoints for managing modules and lessons in the educational platform.

## Base URL

All endpoints are relative to: `http://localhost:8000/api`

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Get Modules Overview

- **URL:** `GET /modules/overview`
- **Purpose:** Get all modules with their lessons nested inside
- **Authentication:** Not required (public endpoint)

#### Example Request

```bash
curl -X GET http://localhost:8000/api/modules/overview
```

#### Example Response

```json
{
  "success": true,
  "count": 2,
  "modules": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "description": "Learn the basics of programming with Python",
      "deadline": "2024-12-31T23:59:59Z",
      "author": 2,
      "author_name": "John Doe",
      "cover_image": "https://example.com/image1.jpg",
      "is_published": true,
      "date_created": "2024-01-15T10:30:00Z",
      "date_updated": "2024-01-20T14:45:00Z",
      "lessons": [
        {
          "id": 1,
          "title": "Variables and Data Types",
          "content": "# Variables\n\nVariables are used to store data...",
          "lesson_type": "lesson",
          "order": 1,
          "duration_minutes": 30,
          "is_published": true,
          "module_id": 1,
          "date_created": "2024-01-15T11:00:00Z",
          "date_updated": "2024-01-15T11:00:00Z"
        },
        {
          "id": 2,
          "title": "Final Exam",
          "content": "[{\"id\":\"1\",\"question\":\"What is a variable?\",\"options\":[{\"id\":\"A\",\"text\":\"A storage location\",\"isCorrect\":true},{\"id\":\"B\",\"text\":\"A function\",\"isCorrect\":false}]}]",
          "lesson_type": "exam",
          "order": 2,
          "duration_minutes": 60,
          "is_published": true,
          "module_id": 1,
          "date_created": "2024-01-16T09:00:00Z",
          "date_updated": "2024-01-16T09:00:00Z"
        }
      ]
    }
  ]
}
```

### Get Module Detail

- **URL:** `GET /modules/{id}/detail`
- **Purpose:** Get a specific module with all its lessons
- **Authentication:** Required

#### Example Request

```bash
curl -X GET http://localhost:8000/api/modules/1/detail \
  -H "Authorization: Bearer <access_token>"
```

#### Example Response

```json
{
  "success": true,
  "module": {
    "id": 1,
    "title": "Introduction to Programming",
    "description": "Learn the basics of programming with Python",
    "deadline": "2024-12-31T23:59:59Z",
    "author": 2,
    "author_name": "John Doe",
    "cover_image": "https://example.com/image1.jpg",
    "is_published": true,
    "date_created": "2024-01-15T10:30:00Z",
    "date_updated": "2024-01-20T14:45:00Z",
    "lessons": [
      {
        "id": 1,
        "title": "Variables and Data Types",
        "content": "# Variables\n\nVariables are used to store data...",
        "lesson_type": "lesson",
        "order": 1,
        "duration_minutes": 30,
        "is_published": true,
        "module_id": 1,
        "date_created": "2024-01-15T11:00:00Z",
        "date_updated": "2024-01-15T11:00:00Z"
      }
    ]
  }
}
```

### Get Lesson Detail

- **URL:** `GET /modules/{module_id}/lessons/{lesson_id}`
- **Purpose:** Get a specific lesson with navigation context
- **Authentication:** Required

#### Example Request

```bash
curl -X GET http://localhost:8000/api/modules/1/lessons/1 \
  -H "Authorization: Bearer <access_token>"
```

#### Example Response

```json
{
  "success": true,
  "lesson": {
    "id": 1,
    "title": "Variables and Data Types",
    "content": "# Variables\n\nVariables are used to store data...",
    "lesson_type": "lesson",
    "order": 1,
    "duration_minutes": 30,
    "is_published": true,
    "module_id": 1,
    "date_created": "2024-01-15T11:00:00Z",
    "date_updated": "2024-01-15T11:00:00Z"
  },
  "module": {
    "id": 1,
    "title": "Introduction to Programming",
    "description": "Learn the basics of programming with Python",
    "cover_image": "https://example.com/image1.jpg"
  },
  "navigation": {
    "prev": null,
    "next": {
      "id": 2,
      "title": "Control Structures"
    }
  },
  "all_lessons": [
    {
      "id": 1,
      "title": "Variables and Data Types",
      "lesson_type": "lesson",
      "order": 1,
      "is_published": true
    },
    {
      "id": 2,
      "title": "Control Structures",
      "lesson_type": "lesson",
      "order": 2,
      "is_published": true
    }
  ]
}
```

## Frontend Integration Examples

### Fetch Modules Overview

```javascript
const fetchModules = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}(`${API_BASE_URL}/modules/overview`));`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch modules');
    }
    
    const data = await response.json();
    return data.modules;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};
```

### Fetch Module Detail

```javascript
const fetchModuleDetail = async (moduleId) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8000/api/modules/${moduleId}/detail`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Module not found');
      }
      throw new Error('Failed to fetch module detail');
    }
    
    const data = await response.json();
    return data.module;
  } catch (error) {
    console.error('Error fetching module detail:', error);
    throw error;
  }
};
```

### Fetch Lesson Detail

```javascript
const fetchLessonDetail = async (moduleId, lessonId) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8000/api/modules/${moduleId}/lessons/${lessonId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Lesson not found');
      }
      throw new Error('Failed to fetch lesson detail');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lesson detail:', error);
    throw error;
  }
};
```

## Error Handling

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": { /* ... */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Exceeding the limit will result in a 429 (Too Many Requests) response.

## Versioning

The API is currently at version 1. Breaking changes will be introduced with new version numbers.