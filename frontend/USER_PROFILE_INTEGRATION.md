# User Profile Integration

This document describes the integration between the frontend Settings page and the backend user profile services.

## Overview

The Settings page now fetches user data from the backend and allows users to update their profile information and change their password.

## Backend Implementation

### New API Endpoints

Three new endpoints have been added to the backend:

1. **GET `/api/user/profile`** - Fetch current user's profile
   - Requires authentication (JWT token)
   - Returns user profile data

2. **PUT/PATCH `/api/user/profile/update`** - Update user profile
   - Requires authentication (JWT token)
   - Accepts: `full_name`, `email`, `institution`, `semester`
   - Returns updated user data

3. **POST `/api/user/password/change`** - Change password
   - Requires authentication (JWT token)
   - Accepts: `current_password`, `new_password`
   - Validates current password before updating

### Files Modified

- `/backend/backend/users/views.py` - Added three new view functions
- `/backend/backend/backend/urls.py` - Added URL routes for new endpoints

## Frontend Implementation

### New Service Layer

Created a dedicated user service at `/frontend/src/services/userService.ts` with the following functions:

- `getUserProfile()` - Fetches current user's profile from backend
- `updateUserProfile(profileData)` - Updates user profile
- `changePassword(passwordData)` - Changes user password

### Settings Page Updates

The Settings page (`/frontend/src/pages/Settings.tsx`) now:

1. **Loads user data on mount** - Fetches profile data from backend when component mounts
2. **Displays real user data** - Shows actual user information from the database
3. **Updates profile** - Saves changes to the backend and updates localStorage
4. **Changes password** - Validates and updates password with proper error handling
5. **Error handling** - Shows error messages for failed operations
6. **Success feedback** - Displays success messages after successful updates
7. **Loading states** - Disables form inputs during API calls

### Features

#### Profile Tab
- Displays and edits:
  - Full Name
  - Email
  - Institution
  - Semester (1-14)
- Profile picture with avatar based on user's name
- Form validation
- Cancel button to reset form

#### Account & Security Tab
- Change password functionality
- Password validation (minimum 8 characters)
- Confirm password matching
- Security tips display
- Placeholder for 2FA and session management

### Files Modified/Created

- **Created**: `/frontend/src/services/userService.ts`
- **Modified**: `/frontend/src/pages/Settings.tsx`
- **Modified**: `/frontend/src/utils/api.ts`

## User Data from Seeder

The backend seeder creates the following test users:

### Admin
- Username: `admin`
- Password: `admin123`
- Email: `admin@taneyanlanjeng.edu`
- Full Name: Administrator
- Institution: Taneyan Lanjeng University

### Teachers
1. **teacher_john**
   - Password: `teacher123`
   - Email: `john.doe@taneyanlanjeng.edu`
   - Full Name: John Doe

2. **teacher_jane**
   - Password: `teacher123`
   - Email: `jane.smith@taneyanlanjeng.edu`
   - Full Name: Jane Smith

### Students
1. **student_alice**
   - Password: `student123`
   - Email: `alice@student.edu`
   - Full Name: Alice Johnson
   - Institution: Taneyan Lanjeng University
   - Semester: 3

2. **student_bob**
   - Password: `student123`
   - Email: `bob@student.edu`
   - Full Name: Bob Wilson
   - Institution: Taneyan Lanjeng University
   - Semester: 2

3. **student_charlie**
   - Password: `student123`
   - Email: `charlie@student.edu`
   - Full Name: Charlie Brown
   - Institution: Taneyan Lanjeng University
   - Semester: 4

4. **student_diana**
   - Password: `student123`
   - Email: `diana@student.edu`
   - Full Name: Diana Prince
   - Institution: State University
   - Semester: 5

5. **student_ethan**
   - Password: `student123`
   - Email: `ethan@student.edu`
   - Full Name: Ethan Hunt
   - Institution: State University
   - Semester: 1

## Testing the Integration

### 1. Start the Backend Server

```bash
cd backend/backend
python manage.py runserver
```

### 2. Seed the Database (if not already done)

```bash
python manage.py seed_data
```

### 3. Start the Frontend Server

```bash
cd frontend
bun run dev
```

### 4. Test the Flow

1. Navigate to `http://localhost:5173/login`
2. Login with any test user (e.g., `student_alice` / `student123`)
3. Navigate to Settings page
4. Verify that your profile data loads correctly
5. Try updating your profile information
6. Try changing your password

## Error Handling

The integration includes comprehensive error handling:

- Network errors are caught and displayed to the user
- Invalid data submissions show appropriate error messages
- Password validation errors are shown inline
- Failed API calls fall back to localStorage data when possible
- Loading states prevent multiple simultaneous submissions

## Security Considerations

- All endpoints require JWT authentication
- Passwords are validated on both frontend and backend
- Current password must be verified before changing
- Sensitive data (password) is write-only in serializers
- CORS is properly configured for the frontend origin

## Future Enhancements

Potential improvements for the Settings page:

1. Profile picture upload functionality
2. Two-factor authentication implementation
3. Active session management
4. Email verification for email changes
5. Password strength meter
6. Account deletion option
7. Notification preferences
8. Theme/language preferences
