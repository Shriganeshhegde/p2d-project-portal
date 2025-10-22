# 🔧 Render Backend Deployment Fix

## ❌ Issue: Instance Failed (qb9g9)

Your backend instance on Render failed on October 22, 2025 at 2:17 PM.

---

## ✅ Solution Steps

### **1. Check Environment Variables on Render**

Go to your Render dashboard → Your service → Environment tab and verify these variables are set:

#### **Required Environment Variables:**

```bash
NODE_ENV=production
PORT=10000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_STORAGE_BUCKET=project-files

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

### **2. Update Build & Start Commands**

In Render Dashboard → Settings:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

---

### **3. Check Node Version**

Render should use Node.js 20.x or higher (as specified in package.json).

In Render Dashboard → Settings → Environment:
- Node Version: **20.x** or **Latest LTS**

---

### **4. Verify Health Check**

In Render Dashboard → Settings → Health Check Path:
```
/api/health
```

---

### **5. Check Logs for Specific Errors**

Go to Render Dashboard → Logs and look for:

#### **Common Errors:**

**A. Missing Environment Variables:**
```
Error: SUPABASE_URL is not defined
```
**Fix:** Add missing environment variables

**B. Port Binding Error:**
```
Error: listen EADDRINUSE
```
**Fix:** Ensure PORT is set to 10000 (Render's default)

**C. Database Connection Error:**
```
❌ Supabase connection error
```
**Fix:** Verify Supabase credentials

**D. Module Not Found:**
```
Error: Cannot find module 'express'
```
**Fix:** Clear build cache and redeploy

---

### **6. Manual Redeploy**

1. Go to Render Dashboard
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. Wait for deployment to complete
4. Check logs for any errors

---

## 🔍 Debugging Checklist

- [ ] All environment variables are set correctly
- [ ] Build command is `npm install`
- [ ] Start command is `npm start`
- [ ] Health check path is `/api/health`
- [ ] Node version is 20.x or higher
- [ ] Supabase URL and keys are correct
- [ ] Razorpay keys are set (if using payments)
- [ ] No syntax errors in server.js
- [ ] All dependencies are in package.json

---

## 📋 Quick Test After Deployment

Once deployed, test these endpoints:

### **1. Health Check:**
```bash
curl https://your-backend-url.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T08:47:00.000Z"
}
```

### **2. Test Database Connection:**
Check logs for:
```
✅ Connected to Supabase
```

---

## 🚨 If Still Failing

### **Check Render Logs:**

1. Go to Render Dashboard → Your Service
2. Click on **Logs** tab
3. Look for the error message
4. Common issues:

#### **Error: Cannot find module**
```bash
# Solution: Clear build cache
# Render Dashboard → Settings → Clear build cache & deploy
```

#### **Error: Port already in use**
```bash
# Solution: Ensure PORT env variable is set to 10000
```

#### **Error: ECONNREFUSED**
```bash
# Solution: Check Supabase URL and keys
# Verify Supabase is accessible
```

---

## 🔄 Alternative: Redeploy from GitHub

If manual deploy doesn't work:

1. Make a small change to README.md
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Trigger Render redeploy"
git push origin main
```
3. Render will auto-deploy from GitHub

---

## 📞 Get Your Backend URL

After successful deployment:

1. Go to Render Dashboard
2. Copy your service URL (e.g., `https://p2d-backend-xyz.onrender.com`)
3. Update frontend `.env`:
```bash
REACT_APP_API_URL=https://p2d-backend-xyz.onrender.com
```

---

## ✅ Success Indicators

Your backend is working when you see:

```
🚀 Server running on 0.0.0.0:10000
🌐 Environment: production
✅ Connected to Supabase
🔒 Authentication: Enabled
📁 Storage Bucket: project-files
🌍 CORS Allowed Origins: http://localhost:3000, https://p2d-project-portal.vercel.app
```

---

## 🆘 Still Having Issues?

Share the error logs from Render Dashboard → Logs tab.

Common log locations:
- Build logs: Shows npm install errors
- Deploy logs: Shows startup errors
- Runtime logs: Shows application errors
