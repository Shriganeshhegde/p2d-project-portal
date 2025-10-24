# 🔧 Razorpay Webhook Fix Guide

## ⚠️ Problem

Razorpay webhook is failing because:
1. Webhook URL is pointing to placeholder: `https://your-backend.onrender.com`
2. Need to update to actual deployed backend URL
3. Webhook has been disabled by Razorpay

---

## ✅ Solution Steps

### **Step 1: Deploy Backend to Render (If Not Already Done)**

#### Option A: Using Render Dashboard

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Login with your account

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select: `Shriganeshhegde/p2d-project-portal`

3. **Configure Service:**
   ```
   Name: p2d-backend
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: student-project-portal
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables:**
   
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   NODE_ENV = production
   PORT = 10000
   
   SUPABASE_URL = [Your Supabase URL]
   SUPABASE_ANON_KEY = [Your Supabase Anon Key]
   SUPABASE_SERVICE_KEY = [Your Supabase Service Key]
   SUPABASE_STORAGE_BUCKET = project-files
   
   RAZORPAY_KEY_ID = [Your Razorpay Key ID]
   RAZORPAY_KEY_SECRET = [Your Razorpay Key Secret]
   RAZORPAY_WEBHOOK_SECRET = [Your Razorpay Webhook Secret]
   
   JWT_SECRET = [Generate a random string]
   VENDOR_PASSWORD = vendor123
   
   FRONTEND_URL = https://p2d-project-portal.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://p2d-backend.onrender.com`

---

#### Option B: Using render.yaml (Automated)

1. **Push render.yaml to GitHub** (already done)

2. **Import to Render:**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect repository
   - Select `student-project-portal/render.yaml`
   - Add environment variables manually
   - Deploy

---

### **Step 2: Get Your Backend URL**

After deployment completes:

1. **Find Your URL:**
   - Go to Render Dashboard
   - Click on your service (p2d-backend)
   - Copy the URL (e.g., `https://p2d-backend.onrender.com`)

2. **Test Backend:**
   ```bash
   # Test health endpoint
   curl https://your-backend-url.onrender.com/api/health
   
   # Should return: {"status":"ok"}
   ```

---

### **Step 3: Update Razorpay Webhook URL**

1. **Login to Razorpay Dashboard:**
   - Visit: https://dashboard.razorpay.com
   - Login with your credentials

2. **Go to Webhooks:**
   - Settings → Webhooks
   - Or direct link: https://dashboard.razorpay.com/app/webhooks

3. **Update Webhook URL:**
   
   **Old URL (Wrong):**
   ```
   https://your-backend.onrender.com/api/payments/webhook
   ```
   
   **New URL (Correct):**
   ```
   https://p2d-backend.onrender.com/api/payments/webhook
   ```
   
   Replace `p2d-backend` with your actual Render service name.

4. **Select Events:**
   
   Enable these events:
   - ✅ `payment.authorized`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `order.paid`

5. **Get Webhook Secret:**
   - Copy the "Webhook Secret" shown
   - You'll need this for environment variables

6. **Enable Webhook:**
   - Toggle the webhook to "Active"
   - Click "Save"

---

### **Step 4: Update Environment Variables**

Add the webhook secret to your backend:

#### On Render:

1. Go to your service → Environment
2. Add new variable:
   ```
   RAZORPAY_WEBHOOK_SECRET = [Your webhook secret from Razorpay]
   ```
3. Save changes
4. Service will auto-redeploy

#### Locally (for testing):

Update your `.env` file:
```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

---

### **Step 5: Update Frontend API URL**

Update the frontend to point to your actual backend:

1. **Check Current Configuration:**
   - File: `frontend/src/config.js` or similar
   - Look for API_URL or backend URL

2. **Update to Production URL:**
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 
                   'https://p2d-backend.onrender.com/api';
   ```

3. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL = https://p2d-backend.onrender.com/api
     ```
   - Redeploy frontend

---

### **Step 6: Test Webhook**

1. **Test Payment Flow:**
   - Go to your app: https://p2d-project-portal.vercel.app
   - Upload a project
   - Make a test payment
   - Check if webhook is received

2. **Check Webhook Logs:**
   - Razorpay Dashboard → Webhooks → Logs
   - Should show successful deliveries

3. **Check Backend Logs:**
   - Render Dashboard → Your Service → Logs
   - Look for webhook received messages

---

## 🔍 Troubleshooting

### Issue 1: Webhook Still Failing

**Check:**
- ✅ Backend is deployed and running
- ✅ Health endpoint returns 200 OK
- ✅ Webhook URL is correct (no typos)
- ✅ Webhook secret is set in environment variables
- ✅ Backend route `/api/payments/webhook` exists

**Test Manually:**
```bash
curl -X POST https://your-backend.onrender.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.captured"}'
```

---

### Issue 2: Backend Not Responding

**Possible Causes:**
1. **Free tier sleep:** Render free tier sleeps after inactivity
   - Solution: First request takes 30-60 seconds to wake up
   
2. **Environment variables missing:**
   - Check all required variables are set
   
3. **Build failed:**
   - Check Render logs for build errors

---

### Issue 3: Webhook Secret Mismatch

**Symptoms:**
- Webhook received but validation fails
- Error: "Invalid signature"

**Solution:**
1. Copy webhook secret from Razorpay dashboard
2. Update `RAZORPAY_WEBHOOK_SECRET` in Render
3. Redeploy backend

---

## 📋 Checklist

Before marking as complete:

- [ ] Backend deployed to Render
- [ ] Backend URL obtained (e.g., `https://p2d-backend.onrender.com`)
- [ ] Health endpoint working (`/api/health` returns 200)
- [ ] All environment variables set on Render
- [ ] Webhook URL updated in Razorpay dashboard
- [ ] Webhook secret added to environment variables
- [ ] Webhook enabled in Razorpay
- [ ] Frontend updated with backend URL
- [ ] Test payment completed successfully
- [ ] Webhook logs show successful delivery

---

## 🚀 Quick Commands

### Test Backend Health:
```bash
curl https://p2d-backend.onrender.com/api/health
```

### Test Webhook Endpoint:
```bash
curl -X POST https://p2d-backend.onrender.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test" \
  -d '{"event":"test"}'
```

### Check Backend Logs (Render CLI):
```bash
render logs -s p2d-backend
```

---

## 📞 Important URLs

| Service | URL |
|---------|-----|
| **Razorpay Dashboard** | https://dashboard.razorpay.com |
| **Razorpay Webhooks** | https://dashboard.razorpay.com/app/webhooks |
| **Render Dashboard** | https://dashboard.render.com |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Frontend (Live)** | https://p2d-project-portal.vercel.app |
| **Backend (Live)** | https://p2d-backend.onrender.com |

---

## 🔐 Environment Variables Reference

### Required for Backend:

```env
# Node
NODE_ENV=production
PORT=10000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_STORAGE_BUCKET=project-files

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Security
JWT_SECRET=random_string_here
VENDOR_PASSWORD=vendor123

# CORS
FRONTEND_URL=https://p2d-project-portal.vercel.app
```

---

## ⚡ Next Steps

1. **Deploy backend to Render** (if not done)
2. **Get your actual backend URL**
3. **Update Razorpay webhook URL**
4. **Add webhook secret to environment**
5. **Enable webhook in Razorpay**
6. **Test with a real payment**

---

## 💡 Pro Tips

1. **Keep Webhook Active:**
   - Render free tier sleeps after 15 min inactivity
   - First webhook after sleep takes 30-60 seconds
   - Consider upgrading to paid plan for production

2. **Monitor Webhooks:**
   - Check Razorpay webhook logs regularly
   - Set up alerts for failures

3. **Backup Plan:**
   - If webhook fails, payment status can be checked manually
   - Implement polling as backup

4. **Security:**
   - Always verify webhook signatures
   - Never expose webhook secret
   - Use HTTPS only

---

## 📝 Notes

- Webhook secret is different from API key secret
- Get webhook secret from Razorpay webhook settings
- Backend must be publicly accessible
- Render free tier has cold starts (30-60s)
- Test in test mode before going live

---

**Need Help?**
- Razorpay Docs: https://razorpay.com/docs/webhooks/
- Render Docs: https://render.com/docs
- Check backend logs for errors
