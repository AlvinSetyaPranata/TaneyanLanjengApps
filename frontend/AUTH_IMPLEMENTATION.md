# Authentication Implementation Guide

## Overview
This document describes the login and register pages implementation for the Taneyan Lanjeng application.

## Components Created

### 1. **Reusable Form Components**
Located in `/src/components/atoms/`:

#### Input Component (`Input.tsx`)
- Reusable text input with label and error handling
- Props: `label`, `error`, `className`, and all standard HTML input attributes
- Supports required field indicator with red asterisk

#### Button Component (`Button.tsx`)
- Reusable button with three variants: `primary`, `secondary`, `outline`
- Props: `variant`, `fullWidth`, `className`, and all standard HTML button attributes
- Includes loading state support

#### Select Component (`Select.tsx`)
- Reusable dropdown select with label and error handling
- Props: `label`, `error`, `options`, `className`, and all standard HTML select attributes
- Options format: `{ value: string | number; label: string }[]`

### 2. **Authentication Pages**

#### Login Page (`/src/pages/Login.tsx`)
**Route:** `/login`

**Features:**
- Username and password fields
- Form validation (client-side)
- Remember me checkbox
- Forgot password link (placeholder)
- Loading state during authentication
- Error handling and display
- Link to register page
- **No layout wrapper** (standalone page)

**Form Fields:**
- Username (required)
- Password (required, min 6 characters)

**API Integration:**
- Endpoint: `POST http://localhost:8000/api/login`
- Stores JWT token in localStorage upon success
- Redirects to home page after successful login

#### Register Page (`/src/pages/Register.tsx`)
**Route:** `/register`

**Features:**
- Complete user registration form based on User model
- Comprehensive form validation
- Two-column responsive layout
- Loading state during registration
- Error handling and display
- Link to login page
- **No layout wrapper** (standalone page)

**Form Fields (matching User model):**
- Username (required, min 3 characters)
- Email (required, valid email format)
- Password (required, min 8 characters)
- Confirm Password (must match password)
- Full Name (required)
- Institution (required)
- Semester (required, dropdown 1-12)
- Role (required, dropdown: Admin/Teacher/Student)

**API Integration:**
- Endpoint: `POST http://localhost:8000/api/register`
- Redirects to login page after successful registration

## Routes

Updated routes in `/src/pages/App.tsx`:
```
/ → Home
/login → Login (no layout)
/register → Register (no layout)
/modules → Modules
/modules/:module_id/corridor → Module Detail
/modules/:module_id/lesson/:lesson_id → Lesson
```

## Styling

Both pages use:
- Gradient background (`bg-gradient-to-br from-blue-50 to-indigo-100`)
- Centered card layout
- Responsive design (mobile-first)
- Tailwind CSS utility classes
- Consistent color scheme with the existing app

## Backend Integration Requirements

To connect these pages with your Django backend, you need to create API endpoints:

### 1. Login Endpoint
```python
# POST /api/login/
{
  "username": "string",
  "password": "string"
}

# Response (200 OK)
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "full_name": "string",
    "role": "Student"
  }
}
```

### 2. Register Endpoint
```python
# POST /api/register/
{
  "username": "string",
  "email": "string",
  "password": "string",
  "full_name": "string",
  "institution": "string",
  "semester": 3,
  "role": "3"  // Role ID
}

# Response (201 Created)
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "string"
  }
}
```

## User Credentials (from seed data)

**Admin:**
- Username: `admin`
- Password: `admin123`

**Teachers:**
- Username: `teacher_john` / Password: `teacher123`
- Username: `teacher_jane` / Password: `teacher123`

**Students:**
- Username: `student_alice` / Password: `student123`
- Username: `student_bob` / Password: `student123`
- Username: `student_charlie` / Password: `student123`
- Username: `student_diana` / Password: `student123`
- Username: `student_ethan` / Password: `student123`

## Next Steps

1. **Create Django API endpoints** for login and register
2. **Implement JWT authentication** using `djangorestframework-simplejwt`
3. **Add protected routes** that require authentication
4. **Create auth context** for managing user state globally
5. **Add logout functionality**
6. **Implement password reset** feature
7. **Add social authentication** (optional)

## Testing

To test the pages:

1. Start the frontend development server:
   ```bash
   cd /Users/alvinsetyapranata/Documents/TaneyanLanjengApps/frontend
   bun run dev
   ```

2. Navigate to:
   - Login: `http://localhost:5173/login`
   - Register: `http://localhost:5173/register`

3. Try form validation by submitting empty or invalid data

4. Once backend endpoints are ready, test the full authentication flow

## File Structure

```
frontend/src/
├── components/
│   └── atoms/
│       ├── Button.tsx       (NEW)
│       ├── Input.tsx        (NEW)
│       └── Select.tsx       (NEW)
└── pages/
    ├── App.tsx              (UPDATED)
    ├── Login.tsx            (NEW)
    └── Register.tsx         (NEW)
```
