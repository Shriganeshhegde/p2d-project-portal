# Getting Started Checklist

Use this checklist to set up your Student Project Portal step by step.

## ☑️ Pre-Installation

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm 8+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor installed (VS Code recommended)
- [ ] Modern browser installed (Chrome/Firefox/Edge)

---

## ☑️ Account Setup

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new Supabase project
- [ ] Note down Supabase URL
- [ ] Note down Supabase anon key
- [ ] Note down Supabase service role key
- [ ] (Optional) Create Razorpay account for payments

---

## ☑️ Installation

### Backend
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Verify no errors in installation

### Frontend
- [ ] Navigate to `frontend` directory
- [ ] Run `npm install`
- [ ] Verify no errors in installation

---

## ☑️ Database Setup

- [ ] Open Supabase SQL Editor
- [ ] Create `users` table (copy SQL from QUICKSTART.md)
- [ ] Create `projects` table
- [ ] Create `project_documents` table
- [ ] Create `payments` table
- [ ] Verify all tables created successfully

---

## ☑️ Storage Setup

- [ ] Go to Supabase Storage
- [ ] Create new bucket named `project-documents`
- [ ] Set bucket to Public
- [ ] Verify bucket created

---

## ☑️ Environment Configuration

- [ ] Create `.env` file in root directory
- [ ] Add `PORT=5000`
- [ ] Add `NODE_ENV=development`
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL=...`
- [ ] Add `SUPABASE_ANON_KEY=...`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Add `JWT_SECRET=...`
- [ ] Add `JWT_EXPIRE=30d`
- [ ] Add `SUPABASE_STORAGE_BUCKET=project-documents`
- [ ] Add `MAX_FILE_UPLOAD=10000000`
- [ ] Add `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- [ ] (Optional) Add Razorpay keys
- [ ] Save `.env` file

---

## ☑️ PowerShell Fix (Windows Only)

If you get "running scripts is disabled" error:

- [ ] Open PowerShell as Administrator
- [ ] Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- [ ] Type `Y` and press Enter
- [ ] Close and reopen terminal

---

## ☑️ First Run

### Backend
- [ ] Open terminal in project root
- [ ] Run `npm run dev`
- [ ] Wait for "Server running on port 5000"
- [ ] Wait for "Connected to Supabase"
- [ ] Leave terminal running

### Frontend
- [ ] Open new terminal
- [ ] Navigate to `frontend` directory
- [ ] Run `npm start`
- [ ] Wait for browser to open
- [ ] Verify app loads at `http://localhost:3000`

---

## ☑️ Testing

### Health Check
- [ ] Open browser to `http://localhost:5000/api/health`
- [ ] Verify response: `{"status":"ok","timestamp":"..."}`

### User Registration
- [ ] Go to `http://localhost:3000`
- [ ] Click "Register" (or navigate to registration)
- [ ] Fill in test user details:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
  - Student ID: STU001
  - College: Test College
- [ ] Click Register
- [ ] Verify success message
- [ ] Verify JWT token received

### User Login
- [ ] Click "Login"
- [ ] Enter email: test@example.com
- [ ] Enter password: password123
- [ ] Click Login
- [ ] Verify successful login

### File Upload
- [ ] Navigate to upload page
- [ ] Click "Upload Files" or drag file
- [ ] Select a PDF file (< 10MB)
- [ ] Verify file appears in list
- [ ] Click "Upload All"
- [ ] Verify upload progress
- [ ] Verify success message

### Document Scanner
- [ ] Click "Scan Document" tab
- [ ] Allow camera access when prompted
- [ ] Verify camera preview appears
- [ ] Capture a document
- [ ] Verify preview appears
- [ ] Click "Extract Text"
- [ ] Verify OCR processing
- [ ] Verify text extracted
- [ ] Click "Save Document"

### Supabase Verification
- [ ] Go to Supabase Dashboard
- [ ] Check `users` table has test user
- [ ] Check `projects` table (if project created)
- [ ] Check Storage bucket has uploaded files

---

## ☑️ Code Quality

- [ ] Run `npm run lint` (backend)
- [ ] Fix any linting errors
- [ ] Run `cd frontend && npm run lint` (frontend)
- [ ] Fix any linting errors

---

## ☑️ Testing

- [ ] Run `npm test` (backend)
- [ ] Verify all tests pass
- [ ] Check test coverage report

---

## ☑️ Documentation Review

- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Bookmark API_DOCUMENTATION.md
- [ ] Bookmark TROUBLESHOOTING.md
- [ ] Bookmark DEPLOYMENT.md

---

## ☑️ Git Setup

- [ ] Initialize git: `git init`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Verify `.gitignore` exists
- [ ] Verify `.env` is in `.gitignore`
- [ ] Stage files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Push: `git push -u origin main`

---

## ☑️ Optional Enhancements

- [ ] Setup Razorpay for payments
- [ ] Configure email service
- [ ] Add custom branding
- [ ] Customize file types
- [ ] Adjust file size limits
- [ ] Add more test cases
- [ ] Setup CI/CD
- [ ] Configure monitoring

---

## ☑️ Deployment Preparation

- [ ] Read DEPLOYMENT.md
- [ ] Choose deployment platform
- [ ] Create production Supabase project
- [ ] Setup production environment variables
- [ ] Test production build locally
- [ ] Prepare domain name (if applicable)

---

## ☑️ Production Deployment

- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure DNS
- [ ] Setup SSL certificate
- [ ] Test production deployment
- [ ] Monitor for errors
- [ ] Setup backups

---

## ☑️ Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Check performance
- [ ] Setup monitoring alerts
- [ ] Document any issues
- [ ] Create user guide

---

## 🎯 Success Indicators

You're ready when:

✅ Backend runs without errors  
✅ Frontend loads successfully  
✅ Can register new user  
✅ Can login  
✅ Can upload files  
✅ Can scan documents  
✅ Files appear in Supabase Storage  
✅ All tests pass  
✅ No console errors  

---

## 🆘 Need Help?

If you're stuck on any step:

1. **Check the error message** - Read it carefully
2. **Check TROUBLESHOOTING.md** - Common issues listed
3. **Check browser console** - Press F12
4. **Check backend logs** - Look at terminal output
5. **Verify environment variables** - Double-check `.env`
6. **Check Supabase** - Verify tables and storage
7. **Search documentation** - Use Ctrl+F in docs
8. **Check GitHub issues** - See if others had same issue

---

## 📝 Notes Section

Use this space to track your progress:

**Date Started:** _______________

**Issues Encountered:**
- 
- 
- 

**Solutions Found:**
- 
- 
- 

**Custom Modifications:**
- 
- 
- 

**Deployment Date:** _______________

**Production URL:** _______________

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] All above checkboxes completed
- [ ] Application runs smoothly
- [ ] No errors in console
- [ ] All features tested
- [ ] Documentation reviewed
- [ ] Code committed to git
- [ ] Ready for deployment or development

---

**Status:** 
- [ ] Setup In Progress
- [ ] Setup Complete
- [ ] Ready for Development
- [ ] Ready for Deployment
- [ ] Deployed to Production

**Completion Date:** _______________

---

🎉 **Congratulations on completing the setup!** 🎉

You're now ready to start developing or deploy to production!
