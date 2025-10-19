# 🎨 Logo & Deadline System - Complete Setup Guide

## ✅ What's Been Implemented

### 1. **Animated Logo Component** 
- ✅ Beautiful animated logo with rotating rings
- ✅ Sparkle effects
- ✅ Smooth fade-in animation
- ✅ Responsive design
- ✅ Added to Login page
- ✅ Fallback emoji if logo image not found

### 2. **College Deadline System**
- ✅ Database schema created
- ✅ Backend API endpoints
- ✅ Deadline banner component
- ✅ Dashboard integration
- ✅ Upload page validation
- ✅ Automatic deadline checking

---

## 📸 Step 1: Add Your Logo

### Place Logo Image:
1. **Save your logo as:** `logo.png`
2. **Place it in:** `frontend/public/images/logo.png`

**Full path:**
```
C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend\public\images\logo.png
```

### Logo Specifications:
- **Format:** PNG (with transparent background recommended)
- **Size:** 500x500px or higher (square format)
- **File size:** Under 500KB for best performance

---

## 🗄️ Step 2: Setup Database (Supabase)

### Run SQL in Supabase SQL Editor:

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
CREATE INDEX idx_college_deadlines_college ON college_deadlines(college_name);
CREATE INDEX idx_college_deadlines_date ON college_deadlines(deadline_date);
CREATE INDEX idx_college_deadlines_active ON college_deadlines(is_active);

-- Insert sample data
INSERT INTO college_deadlines (college_name, department, deadline_date, academic_year, notes) VALUES
('Dayananda Sagar Academy of Technology and Management', 'All Departments', '2025-10-14', '2024-25', 'Project submission deadline for all departments'),
('RV College of Engineering', 'Computer Science', '2025-10-20', '2024-25', 'Final year project submission'),
('BMS College of Engineering', 'All Departments', '2025-10-18', '2024-25', 'Project report submission'),
('PES University', 'All Departments', '2025-10-25', '2024-25', 'Final submission deadline');
```

---

## 🎯 How Deadline System Works

### **For Students:**

1. **Dashboard View:**
   - Deadline banner appears at top
   - Shows days remaining
   - Color-coded urgency:
     - 🟢 Green: 8+ days remaining
     - 🟠 Orange: 4-7 days remaining
     - 🔴 Red: 1-3 days remaining
     - ⚫ Gray: Deadline passed

2. **Upload Page:**
   - Deadline banner shows when college is selected
   - Validates deadline before allowing upload
   - Blocks upload if deadline passed
   - Shows clear error message

### **Deadline Validation:**
```
User selects college → System checks deadline → 
If expired: ⛔ Upload blocked
If active: ✅ Upload allowed
```

---

## 📊 Example Deadlines

| College | Department | Deadline | Status |
|---------|------------|----------|--------|
| Dayananda Sagar Academy | All | 14/10/2025 | Active |
| RV College | CS | 20/10/2025 | Active |
| BMS College | All | 18/10/2025 | Active |
| PES University | All | 25/10/2025 | Active |

---

## 🎨 Logo Animation Features

### **Effects:**
- ✨ 3 rotating rings around logo
- ✨ 4 sparkle animations
- ✨ Pulsing glow effect
- ✨ Smooth fade-in on load
- ✨ Responsive sizing

### **Sizes Available:**
- `small` - 80x80px
- `medium` - 120x120px (Login page)
- `large` - 200x200px (default)

### **Usage:**
```jsx
<AnimatedLogo size="medium" showText={true} />
```

---

## 🧪 Testing

### **Test Logo:**
1. Place logo image in `frontend/public/images/logo.png`
2. Refresh browser (Ctrl + F5)
3. Go to Login page
4. Should see animated logo with rings and sparkles

### **Test Deadline System:**

**Scenario 1: Active Deadline**
1. Login as student
2. Go to Dashboard
3. Should see deadline banner (if college has deadline)
4. Go to Upload Project
5. Select "Dayananda Sagar Academy"
6. Should see deadline banner
7. Try to upload - Should work

**Scenario 2: Expired Deadline**
1. Change deadline in database to past date:
   ```sql
   UPDATE college_deadlines 
   SET deadline_date = '2025-01-01' 
   WHERE college_name = 'Dayananda Sagar Academy of Technology and Management';
   ```
2. Go to Upload Project
3. Select college
4. Try to proceed - Should be blocked with error

---

## 🔧 Managing Deadlines

### **Add New Deadline:**
```sql
INSERT INTO college_deadlines (college_name, department, deadline_date, academic_year, notes)
VALUES ('Your College Name', 'All Departments', '2025-12-31', '2024-25', 'Final submission');
```

### **Update Deadline:**
```sql
UPDATE college_deadlines
SET deadline_date = '2025-11-30'
WHERE college_name = 'Your College Name';
```

### **Disable Deadline:**
```sql
UPDATE college_deadlines
SET is_active = false
WHERE college_name = 'Your College Name';
```

---

## 📁 Files Created/Modified

### **New Components:**
- `frontend/src/components/AnimatedLogo/` - Logo component
- `frontend/src/components/DeadlineBanner/` - Deadline banner

### **New Backend:**
- `routes/deadlines.js` - Deadline API
- `database/college_deadlines.sql` - Database schema

### **Modified:**
- `Login.jsx` - Added animated logo
- `Dashboard.jsx` - Added deadline banner
- `UploadProject.jsx` - Added deadline validation
- `server.js` - Added deadline routes

---

## 🎯 Features Summary

### **Logo:**
- ✅ Animated with multiple effects
- ✅ Responsive design
- ✅ Fallback if image missing
- ✅ Customizable size

### **Deadline System:**
- ✅ College-specific deadlines
- ✅ Department-specific (optional)
- ✅ Visual countdown
- ✅ Upload blocking when expired
- ✅ Dashboard alerts
- ✅ Upload page validation

---

## 🚀 Quick Start

1. **Add logo:** Place `logo.png` in `frontend/public/images/`
2. **Run SQL:** Execute schema in Supabase
3. **Restart backend:** `npm run dev`
4. **Refresh frontend:** Ctrl + F5
5. **Test:** Login and check dashboard

---

## 💡 Customization

### **Change Logo Size:**
```jsx
<AnimatedLogo size="small" showText={false} />
```

### **Customize Deadline Colors:**
Edit `DeadlineBanner.css`:
- `.deadline-banner.warning` - Orange (4-7 days)
- `.deadline-banner.critical` - Red (1-3 days)
- `.deadline-banner.expired` - Gray (passed)

---

**Everything is ready! Just add your logo and run the SQL!** 🎉
