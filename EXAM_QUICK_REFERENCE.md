# Mandatory Exam Feature - Quick Reference

## 🎯 What Changed?

**Every module MUST have at least one final exam before publishing.**

---

## 🔴 For Teachers

### When Creating a Module:

1. **Create module** ✓ (can be draft)
2. **Add lessons** ✓ 
3. **⚠️ CREATE AT LEAST 1 EXAM** ← **MANDATORY**
4. **Publish module** ✓

### If You Try to Publish Without Exam:

```
❌ Error: Cannot publish module without at least one final exam.
   Please create an exam lesson first.

[Create Exam Now?]  [Cancel]
```

---

## 📋 Quick Steps to Add Exam

### Option 1: From Module Detail Page
1. Open module detail
2. See red warning: "⚠️ Ujian Akhir Wajib Dibuat"
3. Click **"Buat Ujian Sekarang"**
4. Fill exam content
5. Save

### Option 2: From Lesson Editor
1. Click "Tambah Materi"
2. Select module without exam
3. System auto-suggests: "Create exam?"
4. Accept suggestion
5. Type is auto-set to "Exam"
6. Fill content and save

### Option 3: Manual
1. Go to module detail
2. Click "Tambah Materi"
3. Set Type = "Final Exam"
4. Fill content
5. Save

---

## ✅ Visual Indicators

### Module HAS Exam:
```
┌──────────────────────────────┐
│ ✓ Modul ini memiliki 2 ujian │
└──────────────────────────────┘
[Green banner - all good!]
```

### Module MISSING Exam:
```
┌─────────────────────────────────┐
│ ⚠️ Ujian Akhir Wajib Dibuat     │
│ [Buat Ujian Sekarang]           │
└─────────────────────────────────┘
[Red banner - action required!]
```

---

## 🔧 Technical Details

### Backend Files Modified:
- `backend/modules/models.py` - Added validation methods
- `backend/modules/serializers.py` - Added exam info fields
- `backend/modules/views.py` - Added publish validation

### Frontend Files Modified:
- `frontend/src/pages/teacher/ModuleDetail.tsx` - Warning banners
- `frontend/src/pages/teacher/LessonEditor.tsx` - Auto-suggestions
- `frontend/src/pages/teacher/ModuleEditor.tsx` - Error handling

---

## 💡 Pro Tips

1. **Create exam first** when starting a new module
2. **Use default exam template** - auto-fills title and duration
3. **Check green banner** to confirm exam exists
4. **Multiple exams OK** - you can have more than one
5. **Draft modules don't need exams** - only for publishing

---

## ❓ FAQs

**Q: Can I save a module without an exam?**
A: Yes, as a draft. You can't publish it though.

**Q: How many exams do I need?**
A: Minimum 1. You can add more if needed.

**Q: What if I delete all exams from a published module?**
A: Module stays published, but you can't re-publish if you unpublish.

**Q: Can I create regular lessons first?**
A: Yes, but you'll see warnings. Better to create exam first.

**Q: What's the recommended exam duration?**
A: System defaults to 60 minutes. Adjust based on content.

---

## 🚨 Common Errors

### "Cannot publish module without exam"
**Solution:** Create an exam lesson before publishing.

### "Module has no exam" warning
**Solution:** Click the warning button to create exam quickly.

### Publish button disabled
**Solution:** Check if module has lessons AND at least one exam.

---

## 📞 Need Help?

1. Check red/yellow warning banners
2. Follow suggested actions
3. Refer to full documentation: `EXAM_REQUIREMENT_FEATURE.md`

---

**Remember:** Exams ensure students are properly assessed! 📝✅
