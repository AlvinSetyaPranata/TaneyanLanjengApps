# Registration Security & Role Management

This document describes the security measures and role management implementation for user registration.

## Overview

The registration system has been enhanced with the following security measures:

1. **Admin users cannot be registered via the registration form**
2. **Semester field is optional for Teacher role**
3. **Dynamic role loading from backend**
4. **Role-based field requirements**

## Security Features

### 1. Admin Registration Restriction

**Backend Protection** ([`users/views.py`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend/users/views.py))

Admin users cannot be created through the public registration API:

```python
# Check if trying to register as Admin (prevent admin registration via API)
role_id = request.data.get('role')
if role_id:
    try:
        role = Role.objects.get(id=role_id)
        if role.name == 'Admin':
            return Response(
                {"message": "Admin tidak dapat didaftarkan melalui formulir pendaftaran. Hubungi administrator sistem."},
                status=HTTP_400_BAD_REQUEST
            )
    except Role.DoesNotExist:
        return Response(
            {"message": "Peran yang dipilih tidak valid"},
            status=HTTP_400_BAD_REQUEST
        )
```

**Frontend Protection** ([`pages/Register.tsx`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/frontend/src/pages/Register.tsx))

The registration form automatically filters out the Admin role:

```typescript
const filteredRoles = roles
  .filter((role: any) => role.name !== 'Admin')
  .map((role: any) => ({
    value: role.id.toString(),
    label: role.name === 'Teacher' ? 'Pengajar' : role.name === 'Student' ? 'Siswa' : role.name
  }));
```

### 2. Creating Admin Users

Admin users can only be created via terminal using the dedicated management command:

```bash
cd backend/backend
python manage.py create_admin \
  --username admin_username \
  --email admin@example.com \
  --password securepassword123 \
  --full_name "Administrator Name" \
  --institution "Institution Name" \
  --profile_photo "https://example.com/photo.jpg"  # Optional
```

**Command Features:**
- ✅ Validates username uniqueness
- ✅ Validates email uniqueness
- ✅ Automatically assigns Admin role
- ✅ Grants staff access (`is_staff=True`)
- ✅ Sets semester to 0 for admins
- ✅ Optional profile photo URL

**Example Usage:**

```bash
# Create admin user
python manage.py create_admin \
  --username superadmin \
  --email admin@taneyanlanjeng.edu \
  --password Admin@123456 \
  --full_name "Super Administrator" \
  --institution "Taneyan Lanjeng University"
```

**Output:**
```
Successfully created admin user: superadmin
  Email: admin@taneyanlanjeng.edu
  Full Name: Super Administrator
  Institution: Taneyan Lanjeng University

Admin user can now login with the provided credentials.
```

## Role-Based Field Requirements

### Semester Field Behavior

The semester field behaves differently based on the selected role:

| Role | Semester Field | Behavior |
|------|---------------|----------|
| **Student** | Required | Must select semester 1-12 |
| **Teacher** | Hidden | Automatically set to 0 |
| **Admin** | N/A | Created via terminal with semester 0 |

### Frontend Implementation

**Dynamic Field Display:**

```typescript
// Check if selected role is Teacher
const isTeacherRole = () => {
  if (!formData.role) return false;
  const selectedRole = roleOptions.find(r => r.value === formData.role);
  return selectedRole?.label === 'Pengajar';
};

// Conditionally render semester field
{!isTeacherRole() && (
  <Select
    label="Semester"
    name="semester"
    value={formData.semester}
    onChange={handleChange}
    error={errors.semester}
    options={semesterOptions}
    required={!isTeacherRole()}
  />
)}
```

### Backend Validation

**Serializer Validation** ([`users/serializers.py`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend/users/serializers.py))

```python
def validate(self, data):
    # Check if role is Teacher, if so, set semester to 0
    role_id = data.get('role')
    if role_id:
        try:
            role = Role.objects.get(id=role_id.id if hasattr(role_id, 'id') else role_id)
            if role.name == 'Teacher':
                # Set semester to 0 for teachers
                data['semester'] = 0
        except Role.DoesNotExist:
            pass
    
    # Ensure semester is provided for non-teacher roles
    if 'semester' not in data or data['semester'] is None:
        if role_id:
            try:
                role = Role.objects.get(id=role_id.id if hasattr(role_id, 'id') else role_id)
                if role.name != 'Teacher':
                    raise ValidationError({'semester': 'Semester wajib diisi untuk peran ini'})
            except Role.DoesNotExist:
                pass
    
    return data
```

## Dynamic Role Loading

### Issue Fixed: Hardcoded Role IDs

**Problem:**
The frontend was using hardcoded role IDs (1, 2, 3) which didn't match the actual database IDs (13, 14, 15).

**Solution:**
Roles are now fetched dynamically from the backend API:

```typescript
useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/roles', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const roles = await response.json();
        // Filter out Admin role
        const filteredRoles = roles
          .filter((role: any) => role.name !== 'Admin')
          .map((role: any) => ({
            value: role.id.toString(),
            label: role.name === 'Teacher' ? 'Pengajar' : role.name === 'Student' ? 'Siswa' : role.name
          }));
        setRoleOptions(filteredRoles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  fetchRoles();
}, []);
```

**Benefits:**
- ✅ No hardcoded IDs
- ✅ Works regardless of database state
- ✅ Automatically updates if roles change
- ✅ Fallback values in case of API failure

## Registration Flow

### Student Registration

1. User fills out form
2. Selects "Siswa" role
3. Must select semester (1-12)
4. Submits form
5. Backend validates all fields
6. User created with selected semester

### Teacher Registration

1. User fills out form
2. Selects "Pengajar" role
3. Semester field is hidden
4. Submits form
5. Backend automatically sets semester to 0
6. User created as teacher

### Admin Creation

1. System administrator runs terminal command
2. Provides username, email, password, full name
3. Optionally provides institution and profile photo
4. Command validates uniqueness
5. Admin user created with staff privileges

## Error Handling

### Registration Errors

| Error | Message | Cause |
|-------|---------|-------|
| Admin Registration | "Admin tidak dapat didaftarkan melalui formulir pendaftaran. Hubungi administrator sistem." | Attempting to register as Admin via form |
| Invalid Role | "Peran yang dipilih tidak valid" | Role ID doesn't exist in database |
| Missing Semester | "Semester wajib diisi untuk peran ini" | Student didn't select semester |
| Duplicate Username | Backend validation error | Username already exists |
| Duplicate Email | Backend validation error | Email already registered |

### Admin Creation Errors

| Error | Message | Cause |
|-------|---------|-------|
| No Admin Role | "Admin role does not exist. Please run seed_data command first." | Roles not seeded |
| Duplicate Username | "User with username 'xxx' already exists." | Username taken |
| Duplicate Email | "User with email 'xxx' already exists." | Email taken |

## API Endpoints

### Registration Endpoint

**POST** `/api/register`

**Request Body (Student):**
```json
{
  "username": "student_john",
  "email": "john@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "institution": "University Name",
  "semester": 3,
  "role": 15,
  "profile_photo": "https://example.com/photo.jpg"  // Optional
}
```

**Request Body (Teacher):**
```json
{
  "username": "teacher_jane",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "full_name": "Jane Smith",
  "institution": "University Name",
  "semester": 0,  // Automatically set by backend
  "role": 14,
  "profile_photo": "https://example.com/photo.jpg"  // Optional
}
```

**Response (Success):**
```json
{
  "message": "Pendaftaran berhasil",
  "user": {
    "id": 123,
    "username": "student_john",
    "email": "john@example.com",
    "full_name": "John Doe",
    "institution": "University Name",
    "semester": 3,
    "profile_photo": "https://example.com/photo.jpg",
    "role": 15
  },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

### Roles Endpoint

**GET** `/api/roles`

**Response:**
```json
[
  { "id": 13, "name": "Admin" },
  { "id": 14, "name": "Teacher" },
  { "id": 15, "name": "Student" }
]
```

## Database Schema

### User Model

```python
class User(AbstractBaseUser):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    full_name = models.CharField(max_length=255)
    institution = models.CharField(max_length=100)
    semester = models.IntegerField()  # 0 for teachers/admins, 1-12 for students
    profile_photo = models.URLField(max_length=500, null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # True for admins
```

### Role Model

```python
class Role(models.Model):
    name = models.CharField(max_length=255, unique=True)
```

## Testing

### Test Student Registration

```bash
# Frontend form
1. Navigate to /register
2. Fill in all fields
3. Select "Siswa" role
4. Select semester 3
5. Submit form
6. Should register successfully
```

### Test Teacher Registration

```bash
# Frontend form
1. Navigate to /register
2. Fill in all fields
3. Select "Pengajar" role
4. Notice semester field is hidden
5. Submit form
6. Should register successfully with semester=0
```

### Test Admin Creation

```bash
# Terminal command
cd backend/backend
python manage.py create_admin \
  --username testadmin \
  --email test@admin.com \
  --password TestAdmin123 \
  --full_name "Test Administrator"

# Verify
python manage.py shell -c "from users.models import User; admin = User.objects.get(username='testadmin'); print(f'Role: {admin.role.name}, Staff: {admin.is_staff}, Semester: {admin.semester}')"
```

### Test Admin Registration Prevention

```bash
# Try to register as admin via API (should fail)
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "badactor",
    "email": "bad@example.com",
    "password": "password123",
    "full_name": "Bad Actor",
    "institution": "Test",
    "semester": 0,
    "role": 13
  }'

# Expected response:
# {
#   "message": "Admin tidak dapat didaftarkan melalui formulir pendaftaran. Hubungi administrator sistem."
# }
```

## Summary

### Security Measures Implemented

✅ **Admin registration blocked** via public API  
✅ **Admin creation command** for secure admin user creation  
✅ **Dynamic role loading** prevents hardcoded ID issues  
✅ **Role-based validation** ensures correct field requirements  
✅ **Semester field** automatically handled for teachers  
✅ **Staff privileges** automatically granted to admins  

### Files Created/Modified

**Created:**
- `/backend/backend/users/management/commands/create_admin.py` - Admin creation command
- `/REGISTRATION_SECURITY.md` - This documentation

**Modified:**
- `/backend/backend/users/views.py` - Admin registration prevention
- `/backend/backend/users/serializers.py` - Semester validation logic
- `/frontend/src/pages/Register.tsx` - Dynamic roles & conditional fields

**Ready for Use:** ✅ Yes

All security measures are in place and tested. The system now properly handles role-based registration with appropriate security controls.
