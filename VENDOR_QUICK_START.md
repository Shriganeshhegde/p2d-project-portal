# 🚀 Vendor Quick Start Guide

## ⚠️ Important: Backend Must Be Running!

The vendor dashboard (Method 1) requires the backend server to be running.

---

## 🎯 Step-by-Step: Start Backend & Access Vendor Dashboard

### **Step 1: Start Backend Server**

**Open PowerShell/Terminal:**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"
node server.js
```

**You should see:**
```
Server running on port 5000
```

**Keep this terminal open!**

---

### **Step 2: Open Vendor Dashboard**

**Double-click this file:**
```
C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\vendor-dashboard.html
```

**Or right-click → Open with → Browser**

---

### **Step 3: Login**

1. Enter password: `vendor123`
2. Click "Login"
3. See all submissions!

---

## 🔧 If Backend Warning Shows

**The dashboard will show a yellow warning if backend is not running.**

**To fix:**
1. Open terminal
2. Navigate to `student-project-portal`
3. Run: `node server.js`
4. Wait for "Server running on port 5000"
5. Refresh the vendor dashboard page

---

## 📁 Alternative: Direct Folder Access (No Backend Needed!)

**If you don't want to start backend, use Method 2:**

**Just open this folder:**
```
C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\uploads\
```

**What you'll find:**
- Each student has their own folder
- Folder name: `StudentName_CollegeName_ProjectID`
- Open `README.txt` for complete details
- All files (PDF, JPG) in same folder

**No backend, no API, no login needed!**

---

## 📊 Comparison

| Method | Requires Backend | Features | Difficulty |
|--------|-----------------|----------|------------|
| **HTML Dashboard** | ✅ Yes | Statistics, Download, Search | Easy |
| **Direct Folder** | ❌ No | Read files directly | Easiest |
| **API Access** | ✅ Yes | Full automation | Advanced |

---

## 🎯 Recommended Workflow

### **For Daily Use:**
Use **Direct Folder Access** (Method 2)
- No setup needed
- Just open uploads folder
- Read README.txt files
- Print as specified

### **For Statistics:**
Use **HTML Dashboard** (Method 1)
- Start backend once
- See total orders, revenue
- Download multiple folders
- Track pending orders

---

## 🚀 Quick Commands

**Start Backend:**
```powershell
cd student-project-portal
node server.js
```

**Open Vendor Dashboard:**
```
vendor-dashboard.html
```

**Open Uploads Folder:**
```
uploads/
```

---

## ✅ Checklist

**Before using HTML dashboard:**
- [ ] Backend server running (`node server.js`)
- [ ] See "Server running on port 5000"
- [ ] Open `vendor-dashboard.html`
- [ ] Login with `vendor123`

**For direct folder access:**
- [ ] Just open `uploads/` folder
- [ ] No other requirements!

---

**Easiest method: Just open the uploads folder!** 📁✅
