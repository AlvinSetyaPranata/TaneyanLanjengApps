# JWT Authentication Integration Guide

## Overview
This document describes the complete JWT authentication integration between the Django backend and React frontend.

## 🔧 Backend Implementation

### 1. **API Endpoints**

#### Login Endpoint
- **URL:** `POST http://localhost:8000/api/login`
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "username": "student_alice",
  "password": "student123"
}
```
- **Success Response (200):**
```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "username": "student_alice",
    "email": "alice@student.edu",
    "full_name": "Alice Johnson",
    "institution": "Taneyan Lanjeng University",
    "semester": 3,
    "role": 3
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```
- **Error Response (401):**
```json
{
  "message": "Nama pengguna atau kata sandi salah"
}
```

#### Register Endpoint
- **URL:** `POST http://localhost:8000/api/register`
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "full_name": "New User",
  "institution": "Some University",
  "semester": 1,
  "role": 3
}
```
- **Success Response (201):**
```json
{
  "message": "Pendaftaran berhasil",
  "user": {
    "id": 9,
    "username": "newuser",
    "email": "newuser@example.com",
    "full_name": "New User",
    "institution": "Some University",
    "semester": 1,
    "role": 3
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```
- **Error Response (400):**
```json
{
  "message": "Pendaftaran gagal",
  "errors": {
    "username": ["A user with that username already exists."],
    "email": ["Enter a valid email address."]
  }
}
```

### 2. **Django Settings Configuration**

**CORS Settings:**
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

CORS_ALLOW_CREDENTIALS = True
```

**JWT Settings:**
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

**Installed Apps:**
- `rest_framework`
- `rest_framework_simplejwt`
- `corsheaders`

### 3. **Models & Serializers**

**User Model:**
- Custom user model extending `AbstractBaseUser`
- Fields: username, email, password, full_name, institution, semester, role

**Serializers:**
- `UserSerializer` - For user data
- `LoginSerializer` - For login validation
- `RegisterSerializer` - For registration with password hashing

### 4. **Views**

**LoginView:**
- Validates credentials using Django's `authenticate()`
- Generates JWT tokens using `RefreshToken.for_user()`
- Sets refresh token in httponly cookie
- Returns user data and tokens

**RegisterView:**
- Validates registration data
- Hashes password using `set_password()`
- Creates new user
- Generates JWT tokens
- Returns user data and tokens

## 🎨 Frontend Implementation

### 1. **Authentication Utilities** (`/src/utils/auth.ts`)

**Functions:**
- `getAccessToken()` - Get access token from localStorage
- `getRefreshToken()` - Get refresh token from localStorage
- `getUser()` - Get user data from localStorage
- `isAuthenticated()` - Check if user is logged in
- `logout()` - Clear auth data and logout
- `setAuthData()` - Save auth data to localStorage
- `authFetch()` - Fetch with JWT authentication headers

### 2. **Protected Routes** (`/src/components/ProtectedRoute.tsx`)

Wrapper component that:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Renders children if authenticated

### 3. **Login Page** (`/src/pages/Login.tsx`)

**Features:**
- Zod validation
- Sends credentials to backend
- Stores tokens and user data in localStorage
- Redirects to home page on success
- Indonesian error messages

**Integration:**
```typescript
const response = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(formData),
});

const data = await response.json();

if (response.ok) {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  navigate('/');
}
```

### 4. **Register Page** (`/src/pages/Register.tsx`)

**Features:**
- Zod validation with password confirmation
- Sends registration data to backend
- Stores tokens and user data on success
- Handles backend validation errors
- Indonesian error messages

**Integration:**
```typescript
const response = await fetch('http://localhost:8000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    ...registerData,
    semester: parseInt(registerData.semester),
    role: parseInt(registerData.role),
  }),
});
```

### 5. **Protected Routes Configuration** (`/src/pages/App.tsx`)

```typescript
<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
<Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
```

## 🔐 Authentication Flow

### Login Flow:
1. User enters username and password
2. Frontend validates using Zod
3. Frontend sends POST to `/api/login`
4. Backend authenticates with Django's `authenticate()`
5. Backend generates JWT tokens
6. Backend returns user data + tokens
7. Frontend stores in localStorage
8. Frontend redirects to home page

### Register Flow:
1. User fills registration form
2. Frontend validates using Zod (including password match)
3. Frontend sends POST to `/api/register`
4. Backend validates data
5. Backend creates user with hashed password
6. Backend generates JWT tokens
7. Backend returns user data + tokens
8. Frontend stores in localStorage
9. Frontend redirects to home page

### Protected Route Flow:
1. User navigates to protected route
2. ProtectedRoute checks `isAuthenticated()`
3. If authenticated → render page
4. If not authenticated → redirect to `/login`

### API Request Flow (with JWT):
1. Get access token from localStorage
2. Add `Authorization: Bearer <token>` header
3. Send request with credentials
4. If 401 → logout and redirect to login
5. If success → return response

## 🚀 Testing

### Test Login:
1. Start backend: `cd backend/backend && python manage.py runserver`
2. Start frontend: `cd frontend && bun run dev`
3. Navigate to `http://localhost:5173/login`
4. Use credentials: `student_alice` / `student123`
5. Should redirect to home page

### Test Register:
1. Navigate to `http://localhost:5173/register`
2. Fill in all fields
3. Submit form
4. Should create account and redirect to home

### Test Protected Routes:
1. Clear localStorage
2. Try to access `http://localhost:5173/modules`
3. Should redirect to login page
4. Login first
5. Should access protected page

## 📦 Stored Data

**localStorage:**
- `access_token` - JWT access token (60 min expiry)
- `refresh_token` - JWT refresh token (7 days expiry)
- `user` - JSON stringified user object

**Cookies (httponly):**
- `refresh_token` - Refresh token for security

## 🔒 Security Features

1. ✅ Password hashing (Django's `set_password()`)
2. ✅ JWT tokens with expiration
3. ✅ HttpOnly cookies for refresh tokens
4. ✅ CORS configuration
5. ✅ Credentials included in requests
6. ✅ Bearer token authentication
7. ✅ Protected routes
8. ✅ Automatic logout on 401

## 📝 Next Steps

1. **Token Refresh** - Implement automatic token refresh
2. **Logout Endpoint** - Create backend logout endpoint
3. **User Profile** - Display logged-in user info
4. **Role-based Access** - Restrict routes by role
5. **Remember Me** - Extend token lifetime
6. **Password Reset** - Implement forgot password flow
7. **Email Verification** - Verify email on registration

## 🐛 Common Issues

**CORS Errors:**
- Check backend CORS settings
- Ensure frontend origin is allowed
- Check credentials: 'include'

**401 Unauthorized:**
- Check if token is in localStorage
- Check if token is expired
- Check Authorization header format

**Token Not Working:**
- Clear localStorage and login again
- Check token format in request
- Verify backend JWT settings

## 📚 Files Modified/Created

**Backend:**
- `users/views.py` - LoginView, RegisterView
- `users/serializers.py` - RegisterSerializer, LoginSerializer
- `backend/urls.py` - Login/Register routes
- `backend/settings.py` - CORS, JWT config

**Frontend:**
- `src/pages/Login.tsx` - Login page with JWT
- `src/pages/Register.tsx` - Register page with JWT
- `src/pages/App.tsx` - Protected routes
- `src/utils/auth.ts` - Auth utilities (NEW)
- `src/components/ProtectedRoute.tsx` - Route guard (NEW)
