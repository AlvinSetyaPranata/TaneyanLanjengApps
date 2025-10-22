# Mandatory Final Exam Feature

## Overview
This document describes the implementation of the **mandatory final exam requirement** for all modules. Teachers must create at least one exam lesson before they can publish a module.

---

## 🎯 Feature Requirements

### Core Requirement
- **Every module MUST have at least one final exam lesson before it can be published**
- Teachers are reminded and guided to create exams through:
  - Visual warnings and alerts
  - Auto-suggestions when creating lessons
  - Validation errors when attempting to publish without exams

---

## 🔧 Backend Implementation

### 1. Model Changes (`backend/modules/models.py`)

#### Added Methods to Module Model:
```python
def has_exam(self):
    """Check if module has at least one exam lesson"""
    return self.lessons.filter(lesson_type='exam').exists()

def get_exam_count(self):
    """Get the number of exam lessons in this module"""
    return self.lessons.filter(lesson_type='exam').count()

def clean(self):
    """Validate module before saving"""
    super().clean()
    if self.is_published and self.pk:
        if not self.has_exam():
            raise ValidationError(
                'Cannot publish module without at least one final exam.'
            )
```

**Key Points:**
- `has_exam()` - Checks if module has at least one exam
- `get_exam_count()` - Returns count of exams in module
- `clean()` - Validates module can't be published without exam

---

### 2. Serializer Updates (`backend/modules/serializers.py`)

#### ModuleSerializer Enhanced:
```python
class ModuleSerializer(ModelSerializer):
    has_exam = SerializerMethodField()
    exam_count = SerializerMethodField()
    
    def get_has_exam(self, obj):
        return obj.has_exam()
    
    def get_exam_count(self, obj):
        return obj.get_exam_count()
```

**Added Fields:**
- `has_exam` - Boolean indicating if module has exams
- `exam_count` - Integer count of exams in module

---

### 3. View Updates (`backend/modules/views.py`)

#### ModuleView Enhanced with Validation:
```python
def update(self, request, *args, **kwargs):
    """Override update to handle validation errors"""
    
    # Check if trying to publish without exam
    if serializer.validated_data.get('is_published', False):
        if not instance.has_exam():
            return Response({
                'success': False,
                'error': 'Cannot publish module without at least one final exam.',
                'exam_required': True
            }, status=status.HTTP_400_BAD_REQUEST)
```

**Features:**
- Validates exam requirement before publishing
- Returns specific error with `exam_required` flag
- Prevents module publication without exams

---

## 🎨 Frontend Implementation

### 1. Teacher Module Detail Page (`frontend/src/pages/teacher/ModuleDetail.tsx`)

#### Exam Requirement Warning (No Exam):
```tsx
{!module.has_exam && (
  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-6">
    <h3>⚠️ Ujian Akhir Wajib Dibuat</h3>
    <p>Setiap modul harus memiliki minimal 1 ujian akhir...</p>
    <button>Buat Ujian Sekarang</button>
  </div>
)}
```

#### Exam Status Display (Has Exam):
```tsx
{module.has_exam && (
  <div className="mb-6 bg-green-50 border-l-4 border-green-500">
    <p>✓ Modul ini memiliki {module.exam_count} ujian akhir</p>
  </div>
)}
```

**Features:**
- Red alert banner when module has no exam
- Green success banner when exam exists
- Direct link to create exam
- Shows exam count

---

### 2. Lesson Editor (`frontend/src/pages/teacher/LessonEditor.tsx`)

#### Auto-Suggest Exam Creation:
```tsx
// When module has no exam, default to exam type
if (selectedModule && !selectedModule.has_exam) {
  setFormData(prev => ({
    ...prev,
    lesson_type: 'exam',
    title: 'Ujian Akhir',
    duration_minutes: 60
  }))
}
```

#### Warning Banner:
```tsx
{currentModule && !currentModule.has_exam && formData.lesson_type !== 'exam' && (
  <div className="bg-yellow-50 border-l-4 border-yellow-500">
    <h3>Modul ini belum memiliki ujian akhir</h3>
    <button>Ubah ke Tipe Ujian</button>
  </div>
)}
```

**Features:**
- Automatically defaults to exam type when module has no exam
- Shows warning when creating regular lesson without exam
- One-click conversion to exam type
- Suggests creating exam first

---

### 3. Module Editor (`frontend/src/pages/teacher/ModuleEditor.tsx`)

#### Error Handling:
```tsx
if (error.exam_required) {
  if (confirm(`${error.error}\n\nApakah Anda ingin membuat ujian sekarang?`)) {
    navigate(`/teacher/modules/${moduleId}/lessons/create`)
  }
}
```

**Features:**
- Catches publish errors from backend
- Shows user-friendly error message
- Offers to redirect to lesson creation
- Prevents accidental publishing without exam

---

## 🔄 User Flow

### Creating a New Module:

1. **Teacher creates module** → Saved as draft ✓
2. **Teacher clicks "Tambah Materi"** → Redirects to lesson editor
3. **Lesson editor detects no exam** → Auto-suggests exam creation
4. **Teacher creates exam lesson** → Exam saved ✓
5. **Module detail shows green banner** → "✓ Modul ini memiliki 1 ujian akhir"
6. **Teacher can now publish module** → Validation passes ✓

### Attempting to Publish Without Exam:

1. **Teacher tries to publish module** → Backend validation runs
2. **No exam found** → Returns error with `exam_required: true`
3. **Frontend shows confirmation dialog** → "Create exam now?"
4. **Teacher clicks "Yes"** → Redirects to lesson creation
5. **Lesson editor opens with exam type selected** → Teacher creates exam
6. **Teacher can retry publishing** → Validation passes ✓

---

## 🎯 Validation Points

### Backend Validation:
- ✅ Module model `clean()` method
- ✅ ModuleView `update()` method
- ✅ Returns specific error response

### Frontend Validation:
- ✅ Module detail page warning
- ✅ Lesson editor auto-suggestion
- ✅ Module editor error handling
- ✅ Visual status indicators

---

## 📋 API Response Examples

### Module with Exam:
```json
{
  "id": 1,
  "title": "Introduction to Python",
  "has_exam": true,
  "exam_count": 2,
  "is_published": true
}
```

### Module without Exam (Publish Attempt):
```json
{
  "success": false,
  "error": "Cannot publish module without at least one final exam. Please create an exam lesson first.",
  "exam_required": true
}
```

---

## 🎨 UI States

### Module Detail Page:

**No Exam:**
```
┌─────────────────────────────────────────┐
│ ⚠️ Ujian Akhir Wajib Dibuat             │
│                                         │
│ Setiap modul harus memiliki minimal    │
│ 1 ujian akhir sebelum dapat           │
│ dipublikasikan.                        │
│                                         │
│ [Buat Ujian Sekarang]                  │
└─────────────────────────────────────────┘
```

**Has Exam:**
```
┌─────────────────────────────────────────┐
│ ✓ Modul ini memiliki 2 ujian akhir     │
└─────────────────────────────────────────┘
```

### Lesson Editor:

**Creating Lesson (No Exam in Module):**
```
┌─────────────────────────────────────────┐
│ ⚠ Modul ini belum memiliki ujian akhir │
│                                         │
│ Sebelum membuat materi biasa, pastikan │
│ Anda membuat ujian akhir terlebih      │
│ dahulu.                                │
│                                         │
│ [Ubah ke Tipe Ujian]                   │
└─────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

- [ ] Create new module → Should save as draft
- [ ] Try to publish without exam → Should show error
- [ ] Create exam lesson → Should save successfully
- [ ] Module detail shows exam count → Should display green banner
- [ ] Publish module with exam → Should succeed
- [ ] Create second lesson for module with exam → No warnings
- [ ] Edit module and try to unpublish → Should work
- [ ] Delete all exams from published module → Should prevent re-publishing

---

## 🔐 Business Rules

1. **Modules can be created without exams** (saved as draft)
2. **Modules CANNOT be published without at least 1 exam**
3. **Teachers are guided to create exams through UI hints**
4. **Backend validation is the final authority** (frontend is helper)
5. **Exam count is displayed to teachers** for transparency
6. **Auto-suggestions don't force** - teachers can override

---

## 🚀 Benefits

### For Teachers:
- ✅ Clear guidance on exam requirements
- ✅ Automatic suggestions reduce mistakes
- ✅ Visual feedback on exam status
- ✅ Can't accidentally publish incomplete modules

### For Students:
- ✅ All modules have proper assessments
- ✅ Consistent learning experience
- ✅ Clear evaluation criteria

### For System:
- ✅ Data integrity maintained
- ✅ Quality control enforced
- ✅ Reduced support requests

---

## 📝 Notes

- Exam lessons use `lesson_type='exam'` field
- Default exam duration is 60 minutes
- Exams are treated as special lessons in the module
- Teachers can have multiple exams per module
- Exam requirement only applies to published modules

---

## 🔄 Future Enhancements

- [ ] Add minimum exam duration requirement
- [ ] Require exam at end of module order
- [ ] Add exam preview for teachers
- [ ] Implement exam templates
- [ ] Add exam difficulty levels
- [ ] Track exam completion rates

---

**Implementation Date:** 2025-10-22
**Status:** ✅ Complete
**Tested:** Ready for testing
