# Testing Student Lesson Page

## Overview

This document provides instructions for testing the student lesson page implementation.

## Prerequisites

1. Backend server running on `http://localhost:8004`
2. Frontend development server running on `http://localhost:5173`
3. Test user accounts (student, teacher, admin)
4. Sample modules and lessons created

## Setup Instructions

### 1. Start Backend Server

```bash
cd backend
python manage.py runserver 8004
```

### 2. Start Frontend Development Server

```bash
cd frontend
bun run dev
```

### 3. Create Test Data

Use the Django admin interface or API endpoints to create:
- Test users (student, teacher, admin)
- Sample modules
- Sample lessons
- Sample exams

## Testing Scenarios

### 1. Student Access to Lessons

1. Log in as a student user
2. Navigate to the modules page
3. Select a module
4. Click on a lesson to view it
5. Verify:
   - Lesson content is displayed correctly
   - Navigation buttons work (prev/next)
   - Sidebar shows all lessons in the module
   - Progress tracking works

### 2. Student Access to Exams

1. Log in as a student user
2. Navigate to a module with an exam
3. Click on the exam lesson
4. Verify:
   - Exam instructions are displayed
   - Timer starts when exam begins
   - Questions are displayed correctly
   - Answer selection works
   - Timer automatically submits when time expires
   - Manual submission works

### 3. Teacher Access to Lesson Editor

1. Log in as a teacher user
2. Navigate to the teacher dashboard
3. Create or edit a lesson
4. Verify:
   - Markdown editor works
   - Preview mode displays content correctly
   - Save functionality works
   - Exam editor works for exam lessons

### 4. Admin Access

1. Log in as an admin user
2. Navigate to the admin dashboard
3. Verify:
   - User management works
   - Module management works
   - All system features are accessible

## API Testing

### Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "password123"
  }'
```

### Get Module Overview

```bash
curl http://localhost:8000/api/modules/overview
```

### Get Lesson Detail

```bash
curl http://localhost:8000/api/modules/1/lessons/1 \
  -H "Authorization: Bearer <access_token>"
```

## Manual Testing Checklist

### Student Lesson Page

- [ ] Lesson content renders correctly
- [ ] Previous/Next navigation works
- [ ] Sidebar navigation shows all lessons
- [ ] Progress tracking updates
- [ ] Responsive design works on different screen sizes
- [ ] Dark mode toggle works
- [ ] All interactive elements are accessible

### Student Exam Page

- [ ] Exam instructions display correctly
- [ ] Timer starts when exam begins
- [ ] Timer counts down correctly
- [ ] Timer automatically submits when time expires
- [ ] Manual submission works
- [ ] Answers are saved correctly
- [ ] Exit confirmation works
- [ ] Results page displays after submission

### Teacher Lesson Editor

- [ ] Markdown editor loads
- [ ] Content can be edited
- [ ] Preview mode works
- [ ] Exam editor loads for exam lessons
- [ ] Questions can be added/removed
- [ ] Correct answers can be selected
- [ ] Save functionality works
- [ ] Publish functionality works

## Common Issues and Solutions

### 1. CORS Errors

**Problem:** Frontend cannot connect to backend
**Solution:** 
- Verify CORS settings in Django settings.py
- Ensure frontend URL is in CORS_ALLOWED_ORIGINS
- Check that backend is running on the correct port

### 2. Authentication Issues

**Problem:** User cannot log in or access protected routes
**Solution:**
- Verify JWT settings in Django settings.py
- Check that tokens are being stored correctly
- Ensure Authorization header is included in requests

### 3. Content Not Loading

**Problem:** Lesson content or modules not displaying
**Solution:**
- Check API endpoints are returning data
- Verify database contains test data
- Check browser console for errors

## Performance Testing

### Page Load Times

- Student lesson page: < 2 seconds
- Student exam page: < 2 seconds
- Teacher editor: < 3 seconds

### Memory Usage

- Monitor browser memory usage during extended use
- Check for memory leaks when navigating between pages

## Accessibility Testing

### Keyboard Navigation

- All interactive elements should be accessible via keyboard
- Focus indicators should be visible
- Tab order should be logical

### Screen Reader Compatibility

- All content should be readable by screen readers
- Proper heading structure should be used
- Alt text should be provided for images

## Browser Compatibility

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Testing

### Responsive Design

- Layout should adapt to different screen sizes
- Touch targets should be appropriately sized
- Navigation should be intuitive on mobile devices

## Security Testing

### Authentication

- Tokens should be stored securely
- Sessions should expire appropriately
- Passwords should be properly hashed

### Data Validation

- Input should be validated on both frontend and backend
- SQL injection should be prevented
- XSS attacks should be mitigated

## Reporting Issues

When reporting issues, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/console errors
5. Screenshots if applicable
6. Test data used