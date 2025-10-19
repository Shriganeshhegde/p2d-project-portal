# Registration Issue - Quick Fix Guide

## Problem
Registration fails when signing up new users.

## Possible Causes & Solutions

### 1. **Database Tables Not Created** (Most Common)

**Solution:** Run the SQL script in Supabase

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the content from `DATABASE_SETUP.sql`
4. Click "Run"
5. Wait for "Database setup completed successfully!" message

---

### 2. **Backend Not Running**

**Check if backend is running:**
```bash
# Open browser and visit:
http://localhost:5000/api/health
```

**Should see:**
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

**If not running, start it:**
```bash
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"
npm run dev
```

---

### 3. **Supabase Not Configured**

**Check `.env` file has:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

**Get keys from:**
1. Supabase Dashboard
2. Project Settings > API
3. Copy URL and keys

---

### 4. **CORS Issue**

**Check browser console (F12) for errors like:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** Backend should already have CORS enabled. Restart backend:
```bash
npm run dev
```

---

### 5. **Port Conflict**

**If port 5000 is busy:**

Change in `.env`:
```env
PORT=5001
```

Then update frontend API URL or restart both servers.

---

## Quick Test Steps

### Step 1: Check Backend
```bash
# Terminal 1
cd student-project-portal
npm run dev
```

Look for:
- ✅ "Server running on port 5000"
- ✅ "Connected to Supabase"

### Step 2: Check Database
Visit Supabase Dashboard > Table Editor
- Should see `users` table
- Should have columns: id, name, email, password, student_id, etc.

### Step 3: Test Registration
1. Open browser console (F12)
2. Go to http://localhost:3000/signup
3. Fill form and click "Sign Up"
4. Check console for error messages

---

## Error Messages Explained

### "Cannot connect to server"
- Backend not running
- Wrong port
- Firewall blocking

**Fix:** Start backend on port 5000

### "User already exists"
- Email already registered
- Try different email

### "relation 'users' does not exist"
- Database table not created
- Run DATABASE_SETUP.sql

### "Invalid API key"
- Wrong Supabase keys in .env
- Check Supabase dashboard for correct keys

---

## Alternative: Demo Mode (No Database)

If you just want to test the UI without database:

**Edit `Signup.jsx`** - Add demo mode:

```javascript
// At the top of onSubmit function, add:
if (true) { // Demo mode
  localStorage.setItem('token', 'demo-token-' + Date.now());
  localStorage.setItem('user', JSON.stringify({
    name, email, studentId, college, department, semester
  }));
  navigate('/dashboard');
  return;
}
```

This bypasses the backend and lets you test the UI.

---

## Still Not Working?

### Check Browser Console
1. Press F12
2. Go to Console tab
3. Look for red error messages
4. Share the error message

### Check Backend Logs
Look at the terminal running `npm run dev`
- Any error messages?
- Connection errors?

### Common Issues:

**"EADDRINUSE"** - Port already in use
```bash
# Windows: Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**"MODULE_NOT_FOUND"** - Dependencies missing
```bash
npm install
cd frontend
npm install
```

---

## Quick Database Setup (Copy-Paste)

If you haven't created the database yet:

1. **Go to Supabase** → SQL Editor
2. **Paste this:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id VARCHAR(100) UNIQUE NOT NULL,
  college VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  semester INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Click Run**
4. **Try registration again**

---

## Success Checklist

- [ ] Backend running on port 5000
- [ ] Supabase credentials in .env
- [ ] Database tables created
- [ ] Frontend running on port 3000
- [ ] Browser console shows no errors
- [ ] Can access http://localhost:5000/api/health

Once all checked, registration should work! ✅

---

## Need More Help?

1. Check TROUBLESHOOTING.md
2. Review error in browser console
3. Check backend terminal for errors
4. Verify Supabase connection
