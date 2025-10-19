# ⚡ Quick Deadline Setup Guide

## ⚠️ Deadline Not Showing? Follow These Steps

### **Step 1: Run SQL in Supabase** (REQUIRED)

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project**
3. **Click "SQL Editor"** (left sidebar)
4. **Click "New Query"**
5. **Copy and paste this SQL:**

```sql
-- Create college_deadlines table
CREATE TABLE IF NOT EXISTS college_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_name TEXT NOT NULL,
  department TEXT,
  deadline_date DATE NOT NULL,
  academic_year TEXT,
  semester INTEGER,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_college_deadlines_college ON college_deadlines(college_name);
CREATE INDEX IF NOT EXISTS idx_college_deadlines_date ON college_deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_college_deadlines_active ON college_deadlines(is_active);

-- Insert sample data (including Dayananda Sagar)
INSERT INTO college_deadlines (college_name, department, deadline_date, academic_year, notes) VALUES
('Dayananda Sagar Academy of Technology and Management', 'All Departments', '2025-10-14', '2024-25', 'Project submission deadline for all departments'),
('RV College of Engineering', 'All Departments', '2025-10-20', '2024-25', 'Final year project submission'),
('BMS College of Engineering', 'All Departments', '2025-10-18', '2024-25', 'Project report submission'),
('PES University', 'All Departments', '2025-10-25', '2024-25', 'Final submission deadline')
ON CONFLICT DO NOTHING;
```

6. **Click "Run"** (or press Ctrl+Enter)
7. **Check for success message**

---

### **Step 2: Verify Table Created**

1. In Supabase, click **"Table Editor"** (left sidebar)
2. You should see **"college_deadlines"** table
3. Click on it to see the 4 sample deadlines

---

### **Step 3: Check Your User Has College**

The deadline system uses the **logged-in user's college**.

**To verify:**
1. In Supabase, go to **"Table Editor"**
2. Click **"users"** table
3. Find your user
4. Check if **"college"** column has a value
5. **It must match EXACTLY** the college name in deadlines table

**Example:**
- ✅ Correct: `Dayananda Sagar Academy of Technology and Management`
- ❌ Wrong: `Dayananda Sagar` (partial name won't match)

---

### **Step 4: Test**

1. **Refresh browser** (Ctrl + F5)
2. **Login** to your account
3. **Go to Dashboard** - Should see deadline banner
4. **Go to Upload Project** - Should see deadline banner
5. **Try to upload** - Should validate deadline

---

## 🎯 What You Should See

### **Dashboard:**
```
┌─────────────────────────────────────────┐
│ 📅 Project Submission Deadline          │
│ Dayananda Sagar Academy                 │
│ Deadline: 14 Oct 2025                   │
│ [5] days remaining                      │
└─────────────────────────────────────────┘
```

### **Upload Page:**
- Same banner appears at top
- If deadline passed: Upload blocked with error

---

## 🔧 Troubleshooting

### **Banner Still Not Showing?**

**Check 1: Is SQL run?**
- Go to Supabase → Table Editor
- Look for `college_deadlines` table
- If not there → Run SQL again

**Check 2: Does user have college?**
- Go to Supabase → users table
- Check your user's `college` field
- Must match deadline table exactly

**Check 3: Is backend running?**
- Backend must be running: `npm run dev`
- Check terminal for errors
- API route: `/api/deadlines/check/:collegeName`

**Check 4: Browser console**
- Press F12
- Check Console tab
- Look for deadline API errors

---

## 📊 Add More Colleges

**To add your college:**

```sql
INSERT INTO college_deadlines (college_name, department, deadline_date, academic_year, notes)
VALUES 
('Your College Name', 'All Departments', '2025-12-31', '2024-25', 'Submission deadline');
```

**Important:**
- College name must match EXACTLY what's in users table
- Date format: `YYYY-MM-DD`
- Department: Use `'All Departments'` for all students

---

## 🎨 Urgency Colors

Deadline banner changes color based on days remaining:

- 🟢 **Green:** 8+ days (normal)
- 🟠 **Orange:** 4-7 days (warning)
- 🔴 **Red:** 1-3 days (critical)
- ⚫ **Gray:** Expired (blocked)

---

## ✅ Quick Checklist

- [ ] SQL run in Supabase
- [ ] `college_deadlines` table exists
- [ ] Sample data inserted
- [ ] User has college in profile
- [ ] College name matches exactly
- [ ] Backend server running
- [ ] Browser refreshed
- [ ] Logged in and tested

---

**After running SQL and refreshing, deadline should appear!** 🎯
