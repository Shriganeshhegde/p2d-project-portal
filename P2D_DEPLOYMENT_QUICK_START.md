# 🚀 P2D Deployment - Quick Start

## 📦 Project: P2D (Print to Doorstep)

Your project portal for printing and delivering student projects.

---

## ✅ Step 1: GitHub Repository

**Create repository:**
- Name: `p2d-project-portal`
- Description: "P2D - Print to Doorstep Project Portal"

**Push code:**
```bash
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"

git init
git add .
git commit -m "Initial commit - P2D ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/p2d-project-portal.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 2: Deploy Backend (Railway)

**URL:** https://railway.app/

1. Sign in with GitHub
2. New Project → Deploy from GitHub
3. Select `p2d-project-portal`
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `ADMIN_KEY`
   - `NODE_ENV=production`
   - `PORT=5000`
5. Deploy
6. Copy Railway URL (e.g., `https://p2d-portal-production.up.railway.app`)

---

## ✅ Step 3: Deploy Frontend (Vercel)

**URL:** https://vercel.com/

1. Sign in with GitHub
2. Import `p2d-project-portal`
3. **Root Directory:** `frontend` ← IMPORTANT!
4. Add environment variable:
   - `REACT_APP_API_URL` = (your Railway URL)
5. Deploy
6. Copy Vercel URL (e.g., `https://p2d-portal.vercel.app`)

---

## ✅ Step 4: Update CORS

**In `server.js`:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://p2d-portal.vercel.app'  // Your Vercel URL
];
```

**Push:**
```bash
git add server.js
git commit -m "Add P2D production CORS"
git push
```

---

## ✅ Step 5: Configure Razorpay

1. Go to: https://dashboard.razorpay.com/
2. Settings → Website Details
3. Add: `https://p2d-portal.vercel.app`
4. Save

---

## 🎯 Your P2D URLs

**Frontend:**
```
https://p2d-portal.vercel.app
```

**Backend:**
```
https://p2d-portal-production.up.railway.app
```

---

## ✅ Test P2D

1. Access: `https://p2d-portal.vercel.app`
2. Sign up
3. Upload project
4. Complete payment (test card: 5267 3181 8797 5449)
5. Verify success ✅

---

**See `DEPLOY_NOW.md` for detailed instructions!** 📖

**P2D - Print to Doorstep is ready to deploy!** 🚀✅
