# 🔧 Login Fix - Access App Locally

## ⚠️ Issue

ngrok free tier gives the same URL for both frontend and backend, causing login to fail.

## ✅ Solution: Access App Locally

Since you're testing locally, use `localhost` URLs instead of ngrok.

---

## 📋 Quick Fix Steps

### **Step 1: Update Frontend .env**

**File:** `frontend\.env`

**Change to:**
```
REACT_APP_API_URL=http://localhost:5000
```

**This is already done!** ✅

### **Step 2: Kill Frontend Process**

**Find process:**
```powershell
netstat -ano | findstr :3000 | findstr LISTENING
```

**Kill it:**
```powershell
Stop-Process -Id <PID> -Force
```
*(Replace <PID> with the number shown)*

### **Step 3: Restart Frontend**

```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend"
npm start
```

### **Step 4: Access App Locally**

**Open in browser:**
```
http://localhost:3000
```

**NOT the ngrok URL!**

---

## 🧪 Test Locally

### **1. Sign Up:**
- Go to: http://localhost:3000
- Click "Sign Up"
- Fill in details
- Register

### **2. Login:**
- Enter credentials
- Click "Login"
- ✅ Should work now!

### **3. Upload Project:**
- Upload PDF
- Customize options
- Proceed to payment

### **4. Test Payment:**
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

---

## 💡 Why This Works

**Problem:**
- ngrok free tier = same URL for both ports
- Frontend can't distinguish between port 3000 and 5000

**Solution:**
- Access frontend via `localhost:3000`
- Frontend calls backend via `localhost:5000`
- Both on same machine = works perfectly!

---

## 🌐 For Production (Later)

When you deploy to production:

1. **Frontend:** Deploy to Vercel/Netlify
   - Gets its own domain: `https://yourapp.vercel.app`

2. **Backend:** Deploy to Heroku/Railway
   - Gets its own domain: `https://yourapi.herokuapp.com`

3. **Update frontend .env:**
   ```
   REACT_APP_API_URL=https://yourapi.herokuapp.com
   ```

4. **Add to Razorpay:**
   ```
   Website URL: https://yourapp.vercel.app
   ```

---

## ✅ Current Setup (Local Testing)

**Frontend:** http://localhost:3000
**Backend:** http://localhost:5000
**Razorpay:** Test mode (works locally)

**This is perfect for development and testing!**

---

## 🎯 Quick Commands

**Kill frontend:**
```powershell
netstat -ano | findstr :3000 | findstr LISTENING
Stop-Process -Id <PID> -Force
```

**Restart frontend:**
```powershell
cd frontend
npm start
```

**Access app:**
```
http://localhost:3000
```

---

## 📊 What to Test

- [ ] Sign up works
- [ ] Login works
- [ ] Upload project works
- [ ] Payment modal opens
- [ ] Test payment succeeds
- [ ] Files saved in uploads folder
- [ ] Project shows in dashboard

---

## 🚨 If Still Not Working

### **Check Backend is Running:**
```powershell
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"ok"}`

### **Check Frontend .env:**
```powershell
cd frontend
Get-Content .env
```
**Expected:** `REACT_APP_API_URL=http://localhost:5000`

### **Check Browser Console:**
- Open browser (F12)
- Go to Console tab
- Look for errors
- Should see API calls to `http://localhost:5000`

---

**Access app at http://localhost:3000 and test locally!** 🚀
