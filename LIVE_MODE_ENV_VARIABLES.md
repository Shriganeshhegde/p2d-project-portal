# 🔑 Live Mode Environment Variables - Quick Reference

## 📍 Where to Update

### **1. Backend (Local)**
File: `.env` (project root)

### **2. Backend (Production)**
Platform: **Render Dashboard**
- Go to: https://dashboard.render.com
- Service: Your backend service
- Tab: **Environment**

### **3. Frontend (Local)**
File: `frontend/.env`

### **4. Frontend (Production)**
Platform: **Vercel Dashboard**
- Go to: https://vercel.com/dashboard
- Project: p2d-project-portal
- Settings → **Environment Variables**

---

## 🔧 Backend Environment Variables

### **Local: `.env` file**
```bash
# Node Environment
NODE_ENV=production

# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_STORAGE_BUCKET=project-files

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# Razorpay LIVE Configuration
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay

# CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,https://p2d-project-portal.vercel.app
```

### **Render (Production)**
```bash
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_STORAGE_BUCKET=project-files
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay
```

---

## 🎨 Frontend Environment Variables

### **Local: `frontend/.env` file**
```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

# Razorpay LIVE Key (Public Key)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
```

### **Vercel (Production)**
```bash
REACT_APP_API_URL=https://your-backend.onrender.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
```

---

## ⚠️ CRITICAL: Test vs Live Keys

### **Test Mode Keys (OLD - Don't use in production)**
```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=test_secret_here
```

### **Live Mode Keys (NEW - Use these)**
```bash
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=live_secret_here
```

**How to identify:**
- Test keys start with: `rzp_test_`
- Live keys start with: `rzp_live_`

---

## 🔄 Update Steps

### **Step 1: Update Backend**

#### **A. Local (.env)**
1. Open `.env` in project root
2. Replace test keys with live keys
3. Save file
4. Restart backend: `npm start`

#### **B. Render (Production)**
1. Go to Render Dashboard
2. Select your backend service
3. Click **Environment** tab
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
5. Add `RAZORPAY_WEBHOOK_SECRET` (new)
6. Click **Save Changes**
7. Wait for auto-redeploy

### **Step 2: Update Frontend**

#### **A. Local (frontend/.env)**
1. Open `frontend/.env`
2. Replace test key with live key
3. Save file
4. Restart frontend: `npm start`

#### **B. Vercel (Production)**
1. Go to Vercel Dashboard
2. Select p2d-project-portal
3. Go to **Settings** → **Environment Variables**
4. Update `REACT_APP_RAZORPAY_KEY_ID`
5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on latest deployment

---

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit `.env` to Git
- [ ] Live keys only in production
- [ ] Test keys only in development
- [ ] Webhook secret is secure
- [ ] JWT secret is strong (32+ characters)
- [ ] No keys hardcoded in source code

---

## ✅ Verification

### **Check Backend Keys**
```bash
# In your backend terminal, check logs on startup
# Should show: RAZORPAY_KEY_ID: rzp_live_xxxxx
```

### **Check Frontend Keys**
```javascript
// In browser console
console.log(process.env.REACT_APP_RAZORPAY_KEY_ID);
// Should show: rzp_live_xxxxx
```

### **Test Payment**
1. Make a ₹10 test payment
2. Check Razorpay Dashboard
3. Payment should appear in live mode
4. Verify in your database

---

## 🆘 Quick Troubleshooting

### **"Invalid Key ID" Error**
- ✅ Verify key starts with `rzp_live_`
- ✅ Check both backend and frontend updated
- ✅ Redeploy both services
- ✅ Clear browser cache

### **Payment Not Updating Order**
- ✅ Check webhook configured
- ✅ Verify webhook secret matches
- ✅ Check Render logs for errors

### **Backend Not Starting**
- ✅ Check all env variables set
- ✅ Verify no syntax errors in `.env`
- ✅ Check Render logs

---

## 📋 Copy-Paste Template

### **Backend .env Template**
```bash
NODE_ENV=production
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
SUPABASE_STORAGE_BUCKET=project-files
JWT_SECRET=
RAZORPAY_KEY_ID=rzp_live_
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

### **Frontend .env Template**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=rzp_live_
```

---

## 🎯 Final Check

Before going live, verify:

1. **Backend .env**: Has `rzp_live_` keys ✅
2. **Render env**: Has `rzp_live_` keys ✅
3. **Frontend .env**: Has `rzp_live_` key ✅
4. **Vercel env**: Has `rzp_live_` key ✅
5. **Webhook**: Configured on Razorpay ✅
6. **Test payment**: Completed successfully ✅

---

**You're ready to accept live payments!** 🚀💰
