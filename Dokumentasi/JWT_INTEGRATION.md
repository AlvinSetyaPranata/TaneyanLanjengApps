# JWT Authentication Integration

## Login Endpoint

- **URL:** `POST http://localhost:8000/api/login`
- **Purpose:** Authenticate users and return JWT tokens
- **Required Fields:**
  - `username` (string)
  - `password` (string)

### Example Request

```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "password": "securepassword123"
  }'
```

### Example Response

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student1@example.com",
    "full_name": "Student One",
    "role": 3,
    "institution": "University of Learning",
    "semester": 2
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Register Endpoint

- **URL:** `POST http://localhost:8000/api/register`
- **Purpose:** Create new user accounts
- **Required Fields:**
  - `username` (string)
  - `email` (string)
  - `password` (string)
  - `full_name` (string)
  - `institution` (string)
  - `semester` (integer)
  - `role` (integer: 1=Admin, 2=Teacher, 3=Student)

### Example Request

```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newstudent",
    "email": "newstudent@example.com",
    "password": "securepassword123",
    "full_name": "New Student",
    "institution": "University of Learning",
    "semester": 1,
    "role": 3
  }'
```

### Example Response

```json
{
  "message": "Registration successful",
  "user": {
    "id": 2,
    "username": "newstudent",
    "email": "newstudent@example.com",
    "full_name": "New Student",
    "role": 3,
    "institution": "University of Learning",
    "semester": 1
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Frontend Integration

### Login Implementation

```javascript
const login = async (credentials) => {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important for cookies
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store tokens in localStorage or secure storage
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
};
```

### Register Implementation

```javascript
const register = async (userData) => {
  const response = await fetch('http://localhost:8000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle validation errors
    const error = new Error(data.message || 'Registration failed');
    error.errors = data.errors;
    throw error;
  }

  // Store tokens in localStorage or secure storage
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
};
```

## Token Refresh

JWT tokens have a limited lifetime. The frontend should automatically refresh tokens when they expire:

```javascript
const refreshAccessToken = async (refreshToken) => {
  const response = await fetch('http://localhost:8000/api/token/refresh/', {
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
};
```

## Protected Route Implementation

```javascript
// Example of protecting routes with JWT
const authFetch = async (url, options = {}) => {
  const accessToken = localStorage.getItem('access_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // Handle token expiration
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
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
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
  }

  return response;
};
```

## Security Considerations

1. **Token Storage**: Store tokens securely (avoid localStorage for production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Implement proper token refresh mechanisms
4. **CORS**: Configure CORS properly in Django settings
5. **CSRF Protection**: Use CSRF tokens for sensitive operations