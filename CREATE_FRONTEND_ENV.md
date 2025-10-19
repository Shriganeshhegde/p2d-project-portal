# 🔧 Fix: Create Frontend .env File

## ⚠️ Issue
Frontend can't connect to backend because `.env` file is missing.

---

## ✅ Solution: Create .env File

### **Step 1: Open File Explorer**
Navigate to:
```
C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend
```

### **Step 2: Create New File**
1. Right-click in the folder
2. New → Text Document
3. Name it: `.env` (including the dot at the start)
4. If Windows asks about changing extension, click "Yes"

### **Step 3: Edit the File**
1. Open `.env` in Notepad or any text editor
2. Add this single line:
```
REACT_APP_API_URL=https://unarticulatory-kami-glisteringly.ngrok-free.dev
```
3. Save and close

### **Step 4: Restart Frontend**
1. Go to frontend terminal
2. Press `Ctrl + C` to stop
3. Run: `npm start`
4. Wait for "Compiled successfully!"

---

## 🎯 Alternative: Use VS Code

### **In VS Code:**
1. Open folder: `student-project-portal\frontend`
2. Click "New File" icon
3. Name it: `.env`
4. Paste this line:
```
REACT_APP_API_URL=https://unarticulatory-kami-glisteringly.ngrok-free.dev
```
5. Save (Ctrl + S)
6. Restart frontend

---

## 🎯 Alternative: Use PowerShell

**Open PowerShell in frontend folder:**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend"

# Create .env file
@"
REACT_APP_API_URL=https://unarticulatory-kami-glisteringly.ngrok-free.dev
"@ | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

# Verify it was created
Get-Content .env
```

---

## ✅ Verify It Works

### **After creating .env and restarting:**

1. **Check console logs:**
   - Open browser console (F12)
   - Try to sign up
   - You should see: "Attempting registration to: https://unarticulatory-kami-glisteringly.ngrok-free.dev/api/auth/register"

2. **Test registration:**
   - Fill in signup form
   - Click "Register"
   - Should work now!

---

## 📋 Complete .env File Content

**File:** `frontend\.env`

```env
REACT_APP_API_URL=https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

**That's it! Just one line.**

---

## 🚨 Common Issues

### **Issue: File not recognized**
- Make sure filename is exactly `.env` (with dot at start)
- No `.txt` extension
- Check in File Explorer with "File name extensions" enabled

### **Issue: Still can't connect**
- Verify .env file is in `frontend` folder (not root)
- Restart frontend completely (Ctrl+C, then npm start)
- Check browser console for the correct URL

### **Issue: "Invalid character" error**
- Make sure there are no extra spaces
- No quotes around the URL
- Save file as UTF-8 encoding

---

## 🎯 Quick Check

**After creating .env, verify:**
```powershell
cd frontend
Get-Content .env
```

**Should show:**
```
REACT_APP_API_URL=https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

---

**Create this file and restart frontend to fix the connection issue!** 🔧✅
