// Authentication utility functions

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  institution: string;
  semester: number;
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

// Create fetch with JWT authentication
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If token is expired, try to refresh
  if (response.status === 401) {
    // TODO: Implement token refresh logic
    logout();
    window.location.href = '/login';
  }

  return response;
};
