# 🚀 Start Application - Backend & Frontend

## Quick Start Commands

### **Option 1: Two Separate Terminals (Recommended)**

**Terminal 1 - Backend:**
```bash
cd student-project-portal
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd student-project-portal/frontend
npm start
```

---

### **Option 2: PowerShell Commands**

**Backend (Terminal 1):**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"
node server.js
```

**Frontend (Terminal 2):**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend"
npm start
```

---

## 📋 What Runs Where

### **Backend (Port 5000):**
- API server
- Database connections
- File uploads
- Authentication
- Vendor APIs

**URL:** http://localhost:5000

### **Frontend (Port 3000):**
- React application
- User interface
- Student portal
- Upload forms

**URL:** http://localhost:3000

---

## ✅ Startup Checklist

**Before starting:**
- [ ] Supabase credentials in `.env`
- [ ] Database tables created
- [ ] `node_modules` installed in root
- [ ] `node_modules` installed in frontend
- [ ] Port 5000 available
- [ ] Port 3000 available

---

## 🎯 Step-by-Step Startup

### **Step 1: Open Two Terminals**

**In VS Code:**
- Press `` Ctrl + ` `` to open terminal
- Click `+` icon to open second terminal
- Or click split terminal icon

### **Step 2: Start Backend**

**Terminal 1:**
```bash
cd student-project-portal
node server.js
```

**You should see:**
```
Server running on port 5000
Connected to Supabase
```

### **Step 3: Start Frontend**

**Terminal 2:**
```bash
cd student-project-portal/frontend
npm start
```

**You should see:**
```
Compiled successfully!
Local: http://localhost:3000
```

### **Step 4: Access Application**

Open browser: http://localhost:3000

---

## 🔧 Troubleshooting

### **Backend won't start:**

**Check 1: Port in use**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Check 2: Dependencies**
```bash
cd student-project-portal
npm install
```

**Check 3: .env file**
- Check `SUPABASE_URL`
- Check `SUPABASE_KEY`
- Check `PORT=5000`

### **Frontend won't start:**

**Check 1: Port in use**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Check 2: Dependencies**
```bash
cd student-project-portal/frontend
npm install
```

**Check 3: .env file**
```bash
cd student-project-portal/frontend
# Check REACT_APP_API_URL
```

### **Connection errors:**

**Check backend is running:**
```bash
curl http://localhost:5000/health
```

**Should return:**
```json
{"status":"ok","timestamp":"..."}
```

---

## 🎨 What You'll See

### **Backend Terminal:**
```
Server running on port 5000
Connected to Supabase
✓ Auth routes loaded
✓ Projects routes loaded
✓ Payments routes loaded
✓ Vendor routes loaded
```

### **Frontend Terminal:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

webpack compiled with 0 errors
```

### **Browser:**
- Login/Signup page
- Animated logo
- P2D branding
- Deadline banner (if set)

---

## 📊 Verify Everything Works

### **Test 1: Health Check**
```bash
curl http://localhost:5000/health
```

### **Test 2: Frontend Loads**
Open: http://localhost:3000

### **Test 3: API Connection**
- Try to login
- Check browser console (F12)
- Should see API calls to localhost:5000

### **Test 4: Vendor API**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/stats
```

---

## 🛑 Stop Application

### **Stop Backend:**
- Go to backend terminal
- Press `Ctrl + C`

### **Stop Frontend:**
- Go to frontend terminal
- Press `Ctrl + C`
- Type `Y` when asked

---

## 🔄 Restart Application

**If you make code changes:**

**Backend:**
- Stop with `Ctrl + C`
- Start again: `node server.js`

**Frontend:**
- Usually auto-reloads
- If not, stop and start again

---

## 📝 Environment Variables

### **Backend (.env in root):**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
VENDOR_PASSWORD=vendor123
```

### **Frontend (.env in frontend/):**
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🎯 Quick Reference

| Component | Directory | Command | Port |
|-----------|-----------|---------|------|
| Backend | `student-project-portal/` | `node server.js` | 5000 |
| Frontend | `student-project-portal/frontend/` | `npm start` | 3000 |

---

## 🚀 Production Deployment

**Backend:**
```bash
# Use PM2 or similar
pm2 start server.js --name "p2d-backend"
```

**Frontend:**
```bash
# Build for production
npm run build

# Serve with nginx or similar
```

---

**Start both backend and frontend in separate terminals!** 🚀
