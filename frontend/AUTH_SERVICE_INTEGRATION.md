# Authentication Service Integration

This document describes the authentication service layer implementation for login and registration functionality.

## Overview

A dedicated authentication service has been created to centralize all auth-related API calls, providing a clean separation of concerns and making the codebase more maintainable.

## Service Architecture

### File Structure

```
frontend/src/
├── services/
│   ├── authService.ts      # Authentication (login, register, token refresh)
│   └── userService.ts      # User profile management
├── pages/
│   ├── Login.tsx           # Uses authService.login()
│   └── Register.tsx        # Uses authService.register()
└── utils/
    ├── auth.ts             # Auth utilities (token storage, user data)
    └── api.ts              # Re-exports all services for convenience
```

## Authentication Service (`authService.ts`)

### Functions

#### 1. `login(credentials: LoginRequest): Promise<AuthResponse>`

Authenticates a user with username and password.

**Request:**
```typescript
{
  username: string;
  password: string;
}
```

**Response:**
```typescript
{
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}
```

**Usage:**
```typescript
import { login } from '../services/authService';

const data = await login({
  username: 'student_alice',
  password: 'student123'
});

setAuthData(data.access_token, data.refresh_token, data.user);
```

#### 2. `register(userData: RegisterRequest): Promise<AuthResponse>`

Registers a new user account.

**Request:**
```typescript
{
  username: string;
  email: string;
  password: string;
  full_name: string;
  institution: string;
  semester: number;
  role: number;
  profile_photo?: string;  // Optional
}
```

**Response:**
```typescript
{
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}
```

**Error Handling:**
The register function throws an error with a special `errors` property containing validation errors from the backend:

```typescript
try {
  await register(userData);
} catch (error: any) {
  if (error.errors) {
    // Backend validation errors
    // error.errors = { username: ['Username already exists'], ... }
  } else {
    // Generic error message
    // error.message = 'Registration failed'
  }
}
```

**Usage:**
```typescript
import { register } from '../services/authService';

const data = await register({
  username: 'newuser',
  email: 'user@example.com',
  password: 'securepassword',
  full_name: 'John Doe',
  institution: 'University Name',
  semester: 3,
  role: 3,  // Student
  profile_photo: 'https://example.com/photo.jpg'  // Optional
});

setAuthData(data.access_token, data.refresh_token, data.user);
```

#### 3. `refreshAccessToken(refreshToken: string): Promise<{ access_token: string }>`

Refreshes the access token using a refresh token.

**Request:**
```typescript
{
  refresh: string;
}
```

**Response:**
```typescript
{
  access_token: string;
}
```

**Usage:**
```typescript
import { refreshAccessToken, getRefreshToken } from '../services/authService';

const refreshToken = getRefreshToken();
if (refreshToken) {
  const { access_token } = await refreshAccessToken(refreshToken);
  // Update stored access token
}
```

## Integration in Pages

### Login Page (`Login.tsx`)

**Before (Direct Fetch):**
```typescript
const response = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(formData),
});

const data = await response.json();

if (response.ok) {
  setAuthData(data.access_token, data.refresh_token, data.user);
  navigate('/');
}
```

**After (Using Service):**
```typescript
import { login } from '../services/authService';

try {
  const data = await login(formData);
  setAuthData(data.access_token, data.refresh_token, data.user);
  navigate('/');
} catch (error: any) {
  setErrors({ username: error.message });
}
```

### Register Page (`Register.tsx`)

**Before (Direct Fetch):**
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

const data = await response.json();

if (response.ok) {
  setAuthData(data.access_token, data.refresh_token, data.user);
  navigate('/');
} else {
  // Handle errors...
}
```

**After (Using Service):**
```typescript
import { register } from '../services/authService';

try {
  const data = await register({
    ...registerData,
    semester: parseInt(registerData.semester),
    role: parseInt(registerData.role),
  });
  
  setAuthData(data.access_token, data.refresh_token, data.user);
  navigate('/');
} catch (error: any) {
  if (error.errors) {
    // Handle backend validation errors
    const backendErrors = {};
    Object.keys(error.errors).forEach((key) => {
      backendErrors[key] = error.errors[key][0];
    });
    setErrors(backendErrors);
  } else {
    setErrors({ username: error.message });
  }
}
```

## Benefits of Service Layer

### 1. **Separation of Concerns**
- API logic is separated from UI components
- Components focus on user interaction and display
- Services handle HTTP communication

### 2. **Code Reusability**
- Auth functions can be used across multiple components
- No duplicate fetch logic
- Consistent error handling

### 3. **Easier Testing**
- Services can be mocked in tests
- Components can be tested independently
- API calls are centralized

### 4. **Type Safety**
- TypeScript interfaces ensure correct data types
- Compile-time error checking
- Better IDE autocomplete

### 5. **Maintainability**
- API endpoint changes only need updates in one place
- Easier to add new auth methods
- Clear contracts between frontend and backend

## TypeScript Types

### Core Types

```typescript
// User type (from utils/auth.ts)
interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  institution: string;
  semester: number;
  profile_photo?: string | null;
  role: number | null;
}

// Login request
interface LoginRequest {
  username: string;
  password: string;
}

// Register request
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  institution: string;
  semester: number;
  role: number;
  profile_photo?: string;
}

// Authentication response
interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

// Error response
interface AuthErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
```

## API Endpoints

All authentication endpoints are defined in the backend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/login` | POST | User login |
| `/api/register` | POST | User registration |
| `/api/token/refresh` | POST | Refresh access token |

## Error Handling

### Login Errors

```typescript
try {
  await login(credentials);
} catch (error: any) {
  // error.message contains the error message
  // Examples:
  // - "Nama pengguna atau kata sandi salah"
  // - "Login failed"
}
```

### Registration Errors

```typescript
try {
  await register(userData);
} catch (error: any) {
  if (error.errors) {
    // Field-specific validation errors
    // error.errors = {
    //   username: ['Username already exists'],
    //   email: ['Email is already registered'],
    //   password: ['Password too weak']
    // }
  } else {
    // Generic error
    // error.message = 'Registration failed'
  }
}
```

## Future Enhancements

Potential improvements to the auth service:

1. **Token Auto-Refresh**
   - Automatically refresh tokens before expiration
   - Interceptor for 401 responses

2. **OAuth Integration**
   - Google Sign-In
   - GitHub Authentication
   - Social media login

3. **Password Reset**
   - Forgot password flow
   - Email verification

4. **Email Verification**
   - Send verification email on registration
   - Verify email before account activation

5. **Two-Factor Authentication**
   - TOTP support
   - SMS verification

6. **Session Management**
   - Track active sessions
   - Force logout from all devices

## Testing

### Example Test for Login Service

```typescript
import { login } from '../services/authService';

describe('authService', () => {
  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        username: 'testuser',
        password: 'testpass'
      };
      
      const response = await login(credentials);
      
      expect(response).toHaveProperty('access_token');
      expect(response).toHaveProperty('refresh_token');
      expect(response).toHaveProperty('user');
      expect(response.user.username).toBe('testuser');
    });
    
    it('should throw error with invalid credentials', async () => {
      const credentials = {
        username: 'invalid',
        password: 'wrong'
      };
      
      await expect(login(credentials)).rejects.toThrow();
    });
  });
});
```

## Summary

The authentication service layer provides:

✅ Centralized authentication logic  
✅ Clean separation of concerns  
✅ Type-safe API calls  
✅ Consistent error handling  
✅ Reusable across components  
✅ Easy to test and maintain  

**Files Created:**
- `/frontend/src/services/authService.ts` - Auth service implementation

**Files Modified:**
- `/frontend/src/pages/Login.tsx` - Uses `login()` service
- `/frontend/src/pages/Register.tsx` - Uses `register()` service
- `/frontend/src/utils/api.ts` - Re-exports auth services

**Ready for Use:** ✅ Yes
