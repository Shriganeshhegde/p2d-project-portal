# 🚀 Final Setup Steps - Get Everything Working!

## ✅ Complete Setup Checklist

Follow these steps in order to get your Student Project Portal fully working:

---

## 📋 **Step 1: Database Setup (5 minutes)**

### 1.1 Open Supabase
- Go to [supabase.com](https://supabase.com)
- Login to your account
- Select your project

### 1.2 Create Tables
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy content from `DATABASE_SETUP.sql`
4. Click **Run**
5. Wait for success message

### 1.3 Disable RLS (for development)
Run this SQL:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
```

### 1.4 Setup Storage
1. Go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Name: `project-documents`
4. Make it **Public**
5. Click **Create**

### 1.5 Storage Policy
1. Click on `project-documents` bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Select **"For full customization"**
5. Policy name: `Allow all`
6. For all operations, enter: `true`
7. Click **Save**

---

## 📋 **Step 2: Environment Configuration (2 minutes)**

### 2.1 Get Supabase Credentials
1. Supabase Dashboard > Settings > API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (⚠️ Keep secret!)

### 2.2 Update `.env` File
```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_generated_secret_here
JWT_EXPIRE=30d

# Storage
SUPABASE_STORAGE_BUCKET=project-documents
MAX_FILE_UPLOAD=10000000

# Frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.3 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy output and paste as `JWT_SECRET`

---

## 📋 **Step 3: Install Dependencies (3 minutes)**

### 3.1 Backend
```bash
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"
npm install
```

### 3.2 Frontend
```bash
cd frontend
npm install
cd ..
```

---

## 📋 **Step 4: Start Servers (1 minute)**

### 4.1 Terminal 1 - Backend
```bash
npm run dev
```

**Should see:**
```
🚀 Server running on port 5000
✅ Connected to Supabase
```

### 4.2 Terminal 2 - Frontend
```bash
cd frontend
npm start
```

**Should see:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 📋 **Step 5: Test the Application (5 minutes)**

### 5.1 Clear Old Data
Open browser console (F12):
```javascript
localStorage.clear();
location.reload();
```

### 5.2 Register New User
1. Go to `http://localhost:3000/signup`
2. Fill in all fields:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Student ID: STU001
   - College: Your College
   - Department: Computer Science
   - Semester: 6
3. Click **Sign Up**
4. Should redirect to Dashboard ✅

### 5.3 Test Upload
1. Click **"New Project"** or **"Upload Project"**
2. Fill project details:
   - Title: Test Project
   - Description: Testing upload
   - Department: Computer Science
   - Semester: 6
3. Click **Next**
4. Upload a file (PDF or image)
5. Click **Next**
6. Review and **Submit**
7. Should see success! ✅

### 5.4 Test Payment
1. After submitting project
2. Should redirect to payment page
3. See cost breakdown
4. Enter delivery address
5. Click **Pay** (demo mode)
6. Should see success! ✅

---

## ✅ **Success Indicators**

Your app is working when:

**Backend:**
- ✅ Server running on port 5000
- ✅ "Connected to Supabase" message
- ✅ No errors in terminal

**Frontend:**
- ✅ App loads at localhost:3000
- ✅ Can navigate between pages
- ✅ No console errors (F12)

**Database:**
- ✅ Tables exist in Supabase
- ✅ Storage bucket created
- ✅ RLS disabled

**Features:**
- ✅ Can register new user
- ✅ Can login
- ✅ Can view dashboard
- ✅ Can upload files
- ✅ Can see payment page

---

## 🐛 **Common Issues & Fixes**

### Issue 1: "Cannot connect to server"
**Fix:** Start backend with `npm run dev`

### Issue 2: "Registration failed"
**Fix:** 
- Check database tables exist
- Verify Supabase credentials in `.env`
- Clear localStorage and try again

### Issue 3: "Row level security policy"
**Fix:** Run RLS disable SQL (see Step 1.3)

### Issue 4: "Foreign key constraint violation"
**Fix:**
- Clear localStorage
- Register fresh user
- User ID must exist in database

### Issue 5: "File upload failed"
**Fix:**
- Check storage bucket exists
- Verify storage policy allows all
- Make bucket public

### Issue 6: Port 5000 in use
**Fix:**
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🎯 **Quick Verification Commands**

### Check Backend Health
```
http://localhost:5000/api/health
```
Should return: `{"status":"ok",...}`

### Check Database Tables
In Supabase SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```
Should show: users, projects, project_documents, payments

### Check Storage Bucket
In Supabase Storage, should see `project-documents` bucket

---

## 📊 **Complete Flow Test**

1. ✅ Register → Should create user in database
2. ✅ Login → Should get JWT token
3. ✅ Dashboard → Should show stats
4. ✅ Profile → Should show user details
5. ✅ Upload → Should upload file to storage
6. ✅ Payment → Should calculate costs
7. ✅ Logout → Should clear session

---

## 🎉 **You're Done!**

If all steps completed successfully:
- ✅ Backend running
- ✅ Frontend running
- ✅ Database configured
- ✅ Storage working
- ✅ Can register/login
- ✅ Can upload files
- ✅ Can make payments

**Your Student Project Portal is fully functional!** 🚀

---

## 📞 **Need Help?**

Check these files:
- `TROUBLESHOOTING.md` - Common issues
- `REGISTRATION_FIX.md` - Registration problems
- `UPLOAD_TESTING_GUIDE.md` - Upload issues
- `API_DOCUMENTATION.md` - API reference

---

## 🔄 **Reset Everything**

If you want to start fresh:

```bash
# Clear browser
localStorage.clear();
location.reload();

# Restart backend
# Ctrl+C in backend terminal
npm run dev

# Restart frontend
# Ctrl+C in frontend terminal
npm start
```

---

**Follow these steps in order and everything will work perfectly!** ✅
