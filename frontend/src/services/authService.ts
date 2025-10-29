// Authentication service for login and registration

import type { User } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8000/api';

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
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
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
    credentials: 'include',
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return await response.json();
}