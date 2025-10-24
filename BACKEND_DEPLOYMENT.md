# 🚀 Backend Deployment Guide - Quick Setup

## ✅ **Use These Alternative Names:**

Since `p2d-backend` is taken, use one of these:

```
✅ p2d-project-backend
✅ student-project-backend
✅ p2d-printing-backend
✅ project-portal-api
✅ p2d-api-server
```

Or create your own: `your-name-p2d-backend`

---

## 🎯 **Quick Deployment Steps**

### **Step 1: Go to Render**

1. Visit: https://dashboard.render.com
2. Click "New +" → "Web Service"

---

### **Step 2: Connect GitHub**

1. Click "Connect account" (if not connected)
2. Select repository: `Shriganeshhegde/p2d-project-portal`
3. Click "Connect"

---

### **Step 3: Configure Service**

Fill in these details:

```
Name: p2d-project-backend (or your chosen name)
Region: Singapore (or closest to you)
Branch: main
Root Directory: student-project-portal
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

---

### **Step 4: Add Environment Variables**

Click "Advanced" → "Add Environment Variable"

**Copy and paste these (update with your actual values):**

```env
NODE_ENV=production
PORT=10000

# Supabase (Get from Supabase Dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
SUPABASE_STORAGE_BUCKET=project-files

# Razorpay (Get from Razorpay Dashboard)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Security
JWT_SECRET=your_random_secret_string_here
VENDOR_PASSWORD=vendor123

# Frontend
FRONTEND_URL=https://p2d-project-portal.vercel.app
```

---

### **Step 5: Deploy**

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://p2d-project-backend.onrender.com`

---

### **Step 6: Test Backend**

Once deployed, test it:

```bash
# Test health endpoint
curl https://p2d-project-backend.onrender.com/api/health

# Should return: {"status":"ok"}
```

---

### **Step 7: Update Razorpay Webhook**

1. **Go to Razorpay Dashboard:**
   - https://dashboard.razorpay.com/app/webhooks

2. **Edit Webhook:**
   - Click on your existing webhook
   - Update URL to: `https://p2d-project-backend.onrender.com/api/payments/webhook`
   - (Replace with your actual Render URL)

3. **Copy Webhook Secret:**
   - You'll see "Webhook Secret" on the page
   - Copy it

4. **Add to Render:**
   - Go back to Render → Your Service → Environment
   - Find `RAZORPAY_WEBHOOK_SECRET`
   - Paste the webhook secret
   - Save (service will auto-redeploy)

5. **Enable Webhook:**
   - Back in Razorpay, toggle webhook to "Active"
   - Click "Save"

---

## 📋 **Where to Get Environment Variables:**

### **Supabase Variables:**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_KEY`

### **Razorpay Variables:**

1. Go to: https://dashboard.razorpay.com
2. Settings → API Keys
3. Copy:
   - Key ID → `RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET`
4. Settings → Webhooks
5. Copy:
   - Webhook Secret → `RAZORPAY_WEBHOOK_SECRET`

### **JWT Secret:**

Generate a random string:
```bash
# Option 1: Use online generator
# Visit: https://randomkeygen.com/

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Just use any random string
# Example: mySecretKey123!@#
```

---

## ✅ **Checklist:**

Before testing:

- [ ] Backend deployed on Render
- [ ] All environment variables added
- [ ] Deployment successful (green checkmark)
- [ ] Health endpoint returns 200 OK
- [ ] Backend URL copied
- [ ] Razorpay webhook URL updated
- [ ] Webhook secret added to Render
- [ ] Webhook enabled in Razorpay

---

## 🧪 **Test Your Setup:**

### **1. Test Backend Health:**
```bash
curl https://your-backend-url.onrender.com/api/health
```
Expected: `{"status":"ok"}`

### **2. Test Webhook Endpoint:**
```bash
curl -X POST https://your-backend-url.onrender.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test"}'
```
Expected: `{"status":"ok"}` or `{"status":"error",...}`

### **3. Make a Test Payment:**
1. Go to your app
2. Upload a project
3. Make a test payment
4. Check Razorpay webhook logs
5. Should show successful delivery

---

## 🔍 **Troubleshooting:**

### **Issue: Deployment Failed**

**Check Build Logs:**
1. Render Dashboard → Your Service → Logs
2. Look for errors in build process
3. Common issues:
   - Missing dependencies
   - Node version mismatch
   - Build command incorrect

**Solution:**
- Make sure `package.json` exists in `student-project-portal`
- Check Node version compatibility
- Verify build command: `npm install`

---

### **Issue: Environment Variables Not Working**

**Symptoms:**
- Backend starts but features don't work
- Database connection fails
- Payment creation fails

**Solution:**
1. Go to Render → Environment
2. Check all variables are set
3. No typos in variable names
4. Values are correct (no extra spaces)
5. Save and redeploy

---

### **Issue: Webhook Still Failing**

**Check:**
1. Backend is running (not sleeping)
2. Webhook URL is correct
3. Webhook secret matches
4. Webhook is enabled in Razorpay

**Test Manually:**
```bash
# Wake up backend first
curl https://your-backend.onrender.com/api/health

# Then test webhook
curl -X POST https://your-backend.onrender.com/api/payments/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: test" \
  -d '{"event":"payment.captured"}'
```

---

### **Issue: Backend Sleeping (Free Tier)**

**Symptoms:**
- First request takes 30-60 seconds
- Webhook times out

**Solutions:**

**Option 1: Keep Alive (Free)**
- Use a service like UptimeRobot
- Ping your backend every 10 minutes
- Keeps it awake

**Option 2: Upgrade to Paid Plan**
- $7/month
- No sleeping
- Better for production

**Option 3: Accept Cold Starts**
- First webhook after sleep may fail
- Razorpay will retry
- Usually works on 2nd attempt

---

## 📱 **Update Frontend (If Needed):**

If your frontend is hardcoded to a different backend URL:

### **Option 1: Environment Variable (Recommended)**

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend.onrender.com/api
     ```
   - Redeploy

### **Option 2: Update Code**

Find and update API URL in your frontend code:
```javascript
// Look for files like:
// - src/config.js
// - src/utils/api.js
// - src/services/api.js

// Update to:
const API_URL = 'https://your-backend.onrender.com/api';
```

---

## 🎯 **Final Steps:**

1. ✅ Deploy backend with unique name
2. ✅ Add all environment variables
3. ✅ Test health endpoint
4. ✅ Update Razorpay webhook URL
5. ✅ Add webhook secret to Render
6. ✅ Enable webhook in Razorpay
7. ✅ Test with real payment
8. ✅ Check webhook logs

---

## 📞 **Important URLs:**

| Service | URL |
|---------|-----|
| Render Dashboard | https://dashboard.render.com |
| Razorpay Dashboard | https://dashboard.razorpay.com |
| Razorpay Webhooks | https://dashboard.razorpay.com/app/webhooks |
| Supabase Dashboard | https://supabase.com/dashboard |
| Vercel Dashboard | https://vercel.com/dashboard |

---

## 💡 **Pro Tips:**

1. **Save Your Backend URL:**
   - Write it down somewhere
   - You'll need it for webhook configuration

2. **Monitor Logs:**
   - Render Dashboard → Logs
   - Watch for errors
   - Check webhook received messages

3. **Test in Test Mode First:**
   - Use Razorpay test keys
   - Make test payments
   - Verify webhooks work
   - Then switch to live mode

4. **Keep Secrets Safe:**
   - Never commit `.env` to Git
   - Don't share secrets publicly
   - Use environment variables

---

## 🚨 **Common Mistakes to Avoid:**

1. ❌ Wrong root directory (should be `student-project-portal`)
2. ❌ Missing environment variables
3. ❌ Typos in webhook URL
4. ❌ Using API key instead of webhook secret
5. ❌ Forgetting to enable webhook in Razorpay
6. ❌ Not waiting for deployment to complete

---

## ✅ **Success Indicators:**

You'll know it's working when:

1. ✅ Render shows "Live" status (green)
2. ✅ Health endpoint returns 200 OK
3. ✅ Test payment completes successfully
4. ✅ Razorpay webhook logs show "Success"
5. ✅ Backend logs show "Webhook received"
6. ✅ Payment status updates in database

---

## 🎉 **You're Done When:**

- Backend is deployed and running
- Webhook URL updated in Razorpay
- Webhook secret configured
- Test payment works
- Webhook logs show success

---

**Need help? Check the logs in Render Dashboard for any errors!**

**Your backend URL will be: `https://YOUR-CHOSEN-NAME.onrender.com`**
