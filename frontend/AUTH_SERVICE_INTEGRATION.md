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