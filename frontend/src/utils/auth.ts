// Authentication utility functions

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  institution: string;
  semester: number;
  profile_photo?: string | null;
  role: number | null;
}

// Get access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

// Get user data from localStorage
export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Set auth data
export const setAuthData = (accessToken: string, refreshToken: string, user: User): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
};

// Refresh access token using refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      // The JWT library might return 'access' instead of 'access_token'
      const accessToken = data.access || data.access_token;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        return accessToken;
      }
    } else {
      // If refresh token is invalid or expired, clear all auth data
      logout();
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    // If there's an error, clear all auth data
    logout();
    return null;
  }

  return null;
};

// Create fetch with JWT authentication
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If token is expired, try to refresh
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry the request with the new token
      const retryHeaders = {
        ...headers,
        'Authorization': `Bearer ${newToken}`,
      };
      
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: 'include',
      });
      
      // If retry still fails, logout and redirect
      if (response.status === 401) {
        logout();
        window.location.href = '/login';
      }
    } else {
      // If refresh failed, logout and redirect
      logout();
      window.location.href = '/login';
    }
  }

  return response;
};