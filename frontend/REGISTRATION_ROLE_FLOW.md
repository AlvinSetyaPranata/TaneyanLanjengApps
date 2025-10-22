# Registration Role Flow & Conditional Fields

## Overview

The registration page dynamically loads roles from the backend and conditionally shows/hides the semester field based on the selected role.

## Role Selection Behavior

### Available Roles in Dropdown

| Role | Displayed As | Available in Form | Created Via |
|------|-------------|-------------------|-------------|
| **Admin** | ❌ Hidden | ❌ No | Terminal only (`create_admin` command) |
| **Teacher** | "Pengajar" | ✅ Yes | Registration form |
| **Student** | "Siswa" | ✅ Yes | Registration form |

### Dynamic Role Loading

Roles are fetched from the backend API on component mount:

```typescript
useEffect(() => {
  const fetchRoles = async () => {
    const response = await fetch('http://localhost:8000/api/roles');
    const roles = await response.json();
    
    // Filter out Admin role
    const filteredRoles = roles
      .filter((role: any) => role.name !== 'Admin')
      .map((role: any) => ({
        value: role.id.toString(),
        label: role.name === 'Teacher' ? 'Pengajar' : 'Student' ? 'Siswa' : role.name
      }));
    
    setRoleOptions(filteredRoles);
  };

  fetchRoles();
}, []);
```

**Benefits:**
- ✅ No hardcoded role IDs
- ✅ Automatically adapts to database changes
- ✅ Admin role automatically excluded
- ✅ Works with any database state

## Conditional Semester Field

### Field Visibility Logic

```typescript
// Check if selected role is Teacher
const isTeacherRole = () => {
  if (!formData.role) return false;
  const selectedRole = roleOptions.find(r => r.value === formData.role);
  return selectedRole?.label === 'Pengajar';
};
```

### Rendering Logic

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  {/* Semester field - only shown for non-teachers */}
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

  {/* Role field - always shown */}
  <Select
    label="Peran"
    name="role"
    value={formData.role}
    onChange={handleChange}
    error={errors.role}
    options={roleOptions}
    required
    disabled={isLoadingRoles}
  />
</div>
```

## User Experience Flow

### Student Registration

1. **User opens registration page**
   - Roles are loading (spinner/message shown)
   - Form fields are ready

2. **Roles load from backend**
   - "Pengajar" and "Siswa" appear in dropdown
   - Loading state disappears

3. **User selects "Siswa" role**
   - Semester field **appears**
   - Semester dropdown shows options 1-12
   - Semester is **required**

4. **User selects semester and submits**
   - Form validates semester is selected
   - Sends `semester: 3` (example) to backend
   - User registered successfully

### Teacher Registration

1. **User opens registration page**
   - Roles are loading
   - Form fields are ready

2. **Roles load from backend**
   - "Pengajar" and "Siswa" appear in dropdown

3. **User selects "Pengajar" role**
   - Semester field **disappears** immediately
   - No semester selection needed

4. **User submits form**
   - Form validation skips semester
   - Backend automatically sets `semester: 0`
   - User registered successfully

### Admin Creation (Terminal Only)

Admins cannot use the registration form:

```bash
cd backend/backend
python manage.py create_admin \
  --username admin_user \
  --email admin@example.com \
  --password SecurePass123 \
  --full_name "Admin Name"
```

## Loading States

### Initial Load

```
┌─────────────────────────┐
│ Peran                   │
│ ┌─────────────────────┐ │
│ │ (Loading...)        │ │ ← Disabled while loading
│ └─────────────────────┘ │
│ Memuat peran...         │ ← Loading message
└─────────────────────────┘
```

### Roles Loaded (Student Selected)

```
┌─────────────────────────┐  ┌─────────────────────────┐
│ Semester           *    │  │ Peran              *    │
│ ┌─────────────────────┐ │  │ ┌─────────────────────┐ │
│ │ Semester 3        ▼ │ │  │ │ Siswa             ▼ │ │
│ └─────────────────────┘ │  │ └─────────────────────┘ │
└─────────────────────────┘  └─────────────────────────┘
```

### Roles Loaded (Teacher Selected)

```
                             ┌─────────────────────────┐
                             │ Peran              *    │
                             │ ┌─────────────────────┐ │
                             │ │ Pengajar          ▼ │ │
                             │ └─────────────────────┘ │
                             └─────────────────────────┘
    (Semester field hidden)
```

### Error State

```
┌─────────────────────────┐
│ Peran              *    │
│ ┌─────────────────────┐ │
│ │                     │ │ ← Empty, disabled
│ └─────────────────────┘ │
│ Gagal memuat peran.     │ ← Error message
│ Silakan refresh halaman│
└─────────────────────────┘
```

## Validation Rules

### Field Requirements by Role

| Field | Student | Teacher | Admin |
|-------|---------|---------|-------|
| Username | ✅ Required | ✅ Required | ✅ Required |
| Email | ✅ Required | ✅ Required | ✅ Required |
| Password | ✅ Required | ✅ Required | ✅ Required |
| Full Name | ✅ Required | ✅ Required | ✅ Required |
| Institution | ✅ Required | ✅ Required | ✅ Required |
| **Semester** | **✅ Required** | **❌ Hidden (auto 0)** | **❌ N/A (auto 0)** |
| Role | ✅ Required | ✅ Required | ❌ N/A |

### Frontend Validation

```typescript
const validate = (): boolean => {
  // For teachers, semester is optional
  const dataToValidate = { ...formData };
  if (isTeacherRole() && !dataToValidate.semester) {
    dataToValidate.semester = '0';  // Set default for validation
  }
  
  registerSchema.parse(dataToValidate);
  
  // Additional validation: semester required for non-teacher roles
  if (!isTeacherRole() && !formData.semester) {
    setErrors({ semester: 'Semester wajib dipilih' });
    return false;
  }
  
  return true;
};
```

### Backend Validation

The backend automatically handles semester based on role:

```python
def validate(self, data):
    role_id = data.get('role')
    if role_id:
        role = Role.objects.get(id=role_id)
        if role.name == 'Teacher':
            data['semester'] = 0  # Auto-set for teachers
    
    # Ensure semester provided for students
    if 'semester' not in data or data['semester'] is None:
        if role.name != 'Teacher':
            raise ValidationError({'semester': 'Semester wajib diisi'})
    
    return data
```

## API Integration

### Backend Endpoint

**GET** `/api/roles`

**Response:**
```json
[
  { "id": 13, "name": "Admin" },
  { "id": 14, "name": "Teacher" },
  { "id": 15, "name": "Student" }
]
```

**Frontend Filtering:**
```typescript
// Filters out Admin, translates to Indonesian
const filteredRoles = roles
  .filter((role) => role.name !== 'Admin')
  .map((role) => ({
    value: role.id.toString(),
    label: role.name === 'Teacher' ? 'Pengajar' : 'Siswa'
  }));

// Result:
// [
//   { value: "14", label: "Pengajar" },
//   { value: "15", label: "Siswa" }
// ]
```

## Error Handling

### API Errors

| Scenario | Handling |
|----------|----------|
| Backend not running | Show error message: "Gagal memuat peran" |
| Network error | Show error message and empty dropdown |
| Invalid response | Console error, empty dropdown |
| No roles found | Empty dropdown with error message |

### User Errors

| Error | When | Message |
|-------|------|---------|
| No role selected | Submit without selecting role | "Peran wajib dipilih" |
| No semester (Student) | Student submits without semester | "Semester wajib dipilih" |
| Trying to select Admin | Not possible | Admin filtered out from options |

## Code Files

### Frontend

- **Page:** [`/frontend/src/pages/Register.tsx`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/frontend/src/pages/Register.tsx)
- **Service:** [`/frontend/src/services/authService.ts`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/frontend/src/services/authService.ts)

### Backend

- **Views:** [`/backend/backend/users/views.py`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend/users/views.py)
- **Serializers:** [`/backend/backend/users/serializers.py`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend/users/serializers.py)
- **Models:** [`/backend/backend/users/models.py`](file:///Users/alvinsetyapranata/Documents/TaneyanLanjengApps/backend/backend/users/models.py)

## Testing

### Manual Testing Checklist

**Roles Loading:**
- [ ] Navigate to `/register`
- [ ] Verify "Memuat peran..." message appears briefly
- [ ] Verify roles dropdown populates with "Pengajar" and "Siswa"
- [ ] Verify Admin is NOT in the dropdown

**Student Flow:**
- [ ] Select "Siswa" role
- [ ] Verify semester field appears
- [ ] Verify semester is marked as required (*)
- [ ] Select semester 3
- [ ] Submit form
- [ ] Verify registration succeeds with semester=3

**Teacher Flow:**
- [ ] Select "Pengajar" role
- [ ] Verify semester field disappears
- [ ] Submit form without selecting semester
- [ ] Verify registration succeeds with semester=0

**Error Handling:**
- [ ] Stop backend server
- [ ] Refresh registration page
- [ ] Verify error message appears: "Gagal memuat peran"
- [ ] Verify dropdown is empty or disabled

## Summary

✅ **Roles dynamically loaded** from backend API  
✅ **Admin role excluded** from registration form  
✅ **Semester field conditional** - shown for students, hidden for teachers  
✅ **Loading states** - clear feedback during role fetch  
✅ **Error handling** - graceful degradation on API failure  
✅ **Validation** - ensures correct data based on role  
✅ **Backend integration** - automatic semester handling  

The registration flow is now complete with proper role selection and conditional field display based on the selected role!
