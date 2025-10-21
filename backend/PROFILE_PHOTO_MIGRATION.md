# Profile Photo Migration Guide

This guide explains how to add the `profile_photo` field to the User model.

## Changes Made

### 1. User Model (`users/models.py`)
Added a new field to store profile photo URL:
```python
profile_photo = models.URLField(max_length=500, null=True, blank=True)
```

### 2. Serializers (`users/serializers.py`)
Updated `UserSerializer` and `RegisterSerializer` to include `profile_photo` field.

### 3. Seeder (`users/management/commands/seed_data.py`)
Added profile photos from Unsplash for all test users:

- **Admin**: Professional business photo
- **Teacher John**: Professional male photo
- **Teacher Jane**: Professional female photo
- **Student Alice**: Female student photo
- **Student Bob**: Male student photo
- **Student Charlie**: Male student photo
- **Student Diana**: Female student photo
- **Student Ethan**: Male student photo

## Migration Steps

### Step 1: Create Migration

Run this command to create the migration file:

```bash
cd backend/backend
python manage.py makemigrations users
```

This will create a new migration file in `users/migrations/` with the profile_photo field.

### Step 2: Apply Migration

Apply the migration to the database:

```bash
python manage.py migrate users
```

### Step 3: Re-seed the Database (Optional)

If you want to populate the database with profile photos for existing users:

```bash
python manage.py seed_data
```

**Note**: This will clear all existing data and create fresh data with profile photos.

## Alternative: Update Existing Users

If you don't want to re-seed and prefer to keep existing data, you can manually update users through Django admin or shell:

```bash
python manage.py shell
```

Then run:

```python
from users.models import User

# Update admin
admin = User.objects.get(username='admin')
admin.profile_photo = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
admin.save()

# Update teachers
teacher1 = User.objects.get(username='teacher_john')
teacher1.profile_photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
teacher1.save()

teacher2 = User.objects.get(username='teacher_jane')
teacher2.profile_photo = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
teacher2.save()

# Update students
alice = User.objects.get(username='student_alice')
alice.profile_photo = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
alice.save()

bob = User.objects.get(username='student_bob')
bob.profile_photo = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
bob.save()

charlie = User.objects.get(username='student_charlie')
charlie.profile_photo = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
charlie.save()

diana = User.objects.get(username='student_diana')
diana.profile_photo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
diana.save()

ethan = User.objects.get(username='student_ethan')
ethan.profile_photo = 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400'
ethan.save()

print("All users updated with profile photos!")
```

## Frontend Integration

The frontend Settings page now:

1. **Displays profile photo** - Shows the user's profile photo or a fallback avatar
2. **Allows updating photo URL** - Users can paste a URL to change their profile photo
3. **Error handling** - Falls back to avatar if the image URL fails to load
4. **Real-time preview** - Photo updates immediately when URL is changed

## Testing

1. Start the backend server:
   ```bash
   python manage.py runserver
   ```

2. Start the frontend:
   ```bash
   cd ../../frontend
   bun run dev
   ```

3. Login with any test user (e.g., `student_alice` / `student123`)

4. Navigate to Settings page

5. You should see the profile photo displayed

6. Try changing the profile photo URL to test the update functionality

## Sample Profile Photo URLs

Here are some free profile photo URLs from Unsplash you can use for testing:

- `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400`
- `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400`
- `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400`
- `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400`
- `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400`
- `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400`
- `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400`
- `https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400`

## Notes

- The `profile_photo` field is optional (`null=True, blank=True`)
- If no photo is provided, the frontend will display a generated avatar based on the user's name
- URLs can be up to 500 characters long
- The field accepts any valid URL, but using image hosting services like Unsplash, Imgur, or Cloudinary is recommended
