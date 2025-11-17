# Authentication Implementation

## Overview

This document describes the authentication implementation for the frontend application using JWT tokens.

## API Endpoints

### Login

- **Endpoint:** `POST http://localhost:8000/api/login`
- **Purpose:** Authenticate users and return JWT tokens
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "username": "string",
      "email": "string",
      "full_name": "string",
      "role": 1,
      "institution": "string",
      "semester": 1
    },
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### Register

- **Endpoint:** `POST http://localhost:8000/api/register`
- **Purpose:** Create new user accounts
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "full_name": "string",
    "institution": "string",
    "semester": 1,
    "role": 1
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": 1,
      "username": "string",
      "email": "string",
      "full_name": "string",
      "role": 1,
      "institution": "string",
      "semester": 1
    },
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

## Frontend Implementation

### Auth Service

The authentication service is implemented in `src/services/authService.ts`:

```typescript
// Authentication service for login and registration

import type { User } from '../utils/auth';

const API_BASE_URL = import.meta.env(`${API_BASE_URL}`);

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  institution: string;
  semester: number;
  role: number;
  profile_photo?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface AuthErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Login user with username and password
 * @param credentials - Username and password
 * @returns Promise with auth response
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This is important for cookies
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Check if the response has the expected structure
  if (!data.access_token || !data.refresh_token || !data.user) {
    throw new Error('Invalid response from server');
  }

  return data;
}

/**
 * Register a new user
 * @param userData - User registration data
 * @returns Promise with auth response
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Create a custom error with validation details
    const error = new Error(data.message || 'Registration failed') as Error & { 
      errors?: Record<string, string[]> 
    };
    error.errors = data.errors;
    throw error;
  }

  return data;
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - The refresh token
 * @returns Promise with new access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string }> {
  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // This is important for cookies
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return await response.json();
}
```

### Auth Utility Functions

Utility functions for authentication are implemented in `src/utils/auth.ts`:

```typescript
// Utility functions for authentication

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: number;
  institution: string;
  semester: number;
  profile_photo?: string;
}

/**
 * Check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('access_token');
}

/**
 * Get current user from localStorage
 * @returns User object or null if not authenticated
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Store authentication data
 * @param user - User object
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 */
export function setAuthData(user: User, accessToken: string, refreshToken: string): void {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

/**
 * Clear authentication data
 */
export function clearAuthData(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Get access token
 * @returns Access token or null
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Get refresh token
 * @returns Refresh token or null
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

/**
 * Authenticated fetch wrapper
 * @param url - URL to fetch
 * @param options - Fetch options
 * @returns Promise with fetch response
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = getAccessToken();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // Handle token expiration
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);
        localStorage.setItem('access_token', newTokens.access_token);
        
        // Retry the original request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newTokens.access_token}`,
          },
        });
      } catch (error) {
        // Refresh failed, clear auth data and redirect to login
        clearAuthData();
        window.location.href = '/login';
      }
    }
  }

  return response;
}
```

## Protected Routes

Protected routes are implemented using a ProtectedRoute component:

```tsx
// ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Check role if required
    if (requiredRole) {
      const user = getCurrentUser();
      if (user && user.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        switch (user.role) {
          case 1: // Admin
            navigate('/admin/dashboard');
            break;
          case 2: // Teacher
            navigate('/teacher/dashboard');
            break;
          case 3: // Student
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
        return;
      }
    }
  }, [requiredRole, navigate]);
  
  if (!isAuthenticated()) {
    return null;
  }
  
  return <>{children}</>;
}
```

## Login Page Implementation

```tsx
// Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, type LoginRequest } from '../services/authService';
import { setAuthData } from '../utils/auth';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const credentials: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };
      
      const response = await login(credentials);
      
      // Store auth data
      setAuthData(response.user, response.access_token, response.refresh_token);
      
      // Redirect based on role
      switch (response.user.role) {
        case 1: // Admin
          navigate('/admin/dashboard');
          break;
        case 2: // Teacher
          navigate('/teacher/dashboard');
          break;
        case 3: // Student
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-black hover:text-gray-800">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Register Page Implementation

```tsx
// Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, type RegisterRequest } from '../services/authService';
import { setAuthData } from '../utils/auth';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Select from '../components/atoms/Select';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    institution: '',
    semester: 1,
    role: 3, // Default to student
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const userData: RegisterRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        institution: formData.institution,
        semester: formData.semester,
        role: formData.role,
      };
      
      const response = await register(userData);
      
      // Store auth data
      setAuthData(response.user, response.access_token, response.refresh_token);
      
      // Redirect based on role
      switch (response.user.role) {
        case 1: // Admin
          navigate('/admin/dashboard');
          break;
        case 2: // Teacher
          navigate('/teacher/dashboard');
          break;
        case 3: // Student
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      if (err instanceof Error && 'errors' in err) {
        // Handle validation errors
        const validationErrors = err.errors as Record<string, string[]>;
        const errorMessages = Object.values(validationErrors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <Input
                id="institution"
                name="institution"
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Semester
              </label>
              <Select
                id="semester"
                name="semester"
                value={formData.semester.toString()}
                onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                options={[
                  { value: '1', label: 'Semester 1' },
                  { value: '2', label: 'Semester 2' },
                  { value: '3', label: 'Semester 3' },
                  { value: '4', label: 'Semester 4' },
                  { value: '5', label: 'Semester 5' },
                  { value: '6', label: 'Semester 6' },
                  { value: '7', label: 'Semester 7' },
                  { value: '8', label: 'Semester 8' },
                ]}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <Select
                id="role"
                name="role"
                value={formData.role.toString()}
                onChange={(e) => setFormData({...formData, role: parseInt(e.target.value)})}
                options={[
                  { value: '3', label: 'Student' },
                  { value: '2', label: 'Teacher' },
                  { value: '1', label: 'Admin' },
                ]}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-black hover:text-gray-800">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

## Security Considerations

1. **Token Storage**: Store tokens in localStorage (for development) or secure HTTP-only cookies (for production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Implement proper token refresh mechanisms
4. **Input Validation**: Validate all user inputs on both frontend and backend
5. **Rate Limiting**: Implement rate limiting on authentication endpoints
6. **Password Security**: Never log or store passwords in plain text