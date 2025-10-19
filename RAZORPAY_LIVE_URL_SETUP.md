# 🌐 Razorpay Live URL Setup - Complete Guide

## ✅ All Servers Restarted

**Current Status:**
- ✅ Backend: Running on port 5000
- ✅ Frontend: Running on port 3000
- ✅ ngrok: Active tunnel created

---

## 🌐 Your Live URL

**ngrok URL:**
```
https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

**This URL is now LIVE and accessible from anywhere!**

Razorpay can verify this URL because it's publicly accessible.

---

## 📋 Razorpay Dashboard Setup

### **Step 1: Login to Razorpay**
Go to: https://dashboard.razorpay.com/

### **Step 2: Navigate to Settings**
- Click on "Settings" (gear icon)
- Go to "API Keys" section

### **Step 3: Add Website URL**
- Find "Website Details" or "Business Website"
- Enter your ngrok URL:
  ```
  https://unarticulatory-kami-glisteringly.ngrok-free.dev
  ```
- Click "Save"

### **Step 4: Verify URL**
- Razorpay will verify the URL
- Since it's live via ngrok, verification will succeed ✅

---

## 🔧 Important: Update Frontend .env

**For Razorpay to work, frontend needs to use localhost for API calls:**

**File:** `frontend\.env`

**Content:**
```env
REACT_APP_API_URL=http://localhost:5000
```

**Why localhost?**
- Frontend runs on your machine
- Backend runs on your machine (port 5000)
- They communicate locally
- ngrok only exposes frontend to internet

---

## 🧪 Complete Test Flow

### **Step 1: Access Your App**

**Via ngrok (public URL):**
```
https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

**Or via localhost:**
```
http://localhost:3000
```

**Both work!** Use ngrok URL for Razorpay verification.

### **Step 2: Sign Up / Login**
- Create account or login
- Use your college name

### **Step 3: Upload Project**
- Fill in all fields:
  - Title
  - Department
  - Semester
- Upload PDF file
- Choose customization options

### **Step 4: Proceed to Payment**
- Review details
- Click "Pay Now"

### **Step 5: Complete Payment**

**Use Indian test card:**
```
Card Number: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25
Name: Test User
```

**Or use UPI:**
```
UPI ID: success@razorpay
```

### **Step 6: Verify Success**
- ✅ Payment completes
- ✅ Verification succeeds
- ✅ Redirected to dashboard
- ✅ Project appears

---

## 🔍 Check ngrok Status

**View ngrok dashboard:**
```
http://localhost:4040
```

**What you'll see:**
- Active tunnel URL
- Request logs
- Traffic statistics

---

## 📊 System Architecture

```
Internet (Razorpay)
        ↓
    ngrok Tunnel
        ↓
Frontend (localhost:3000)
        ↓
Backend (localhost:5000)
        ↓
    Supabase Database
```

**How it works:**
1. Users access via ngrok URL
2. ngrok forwards to localhost:3000
3. Frontend calls backend at localhost:5000
4. Backend processes and saves to database
5. Razorpay verifies via ngrok URL ✅

---

## 🚨 Important Notes

### **ngrok Free Tier:**
- URL stays same for your account
- Tunnel expires after 2 hours of inactivity
- Need to restart ngrok if it expires
- URL remains: `unarticulatory-kami-glisteringly.ngrok-free.dev`

### **Keep Servers Running:**
While testing, keep these running:
- Backend (port 5000)
- Frontend (port 3000)
- ngrok tunnel

### **If ngrok Stops:**
Restart it:
```bash
cd C:\ngrok
.\ngrok.exe http 3000
```

---

## 📋 Razorpay Configuration Checklist

**In Razorpay Dashboard:**
- [ ] Website URL added: `https://unarticulatory-kami-glisteringly.ngrok-free.dev`
- [ ] URL verified by Razorpay ✅
- [ ] Test mode enabled
- [ ] API keys copied to backend .env

**Backend .env:**
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
ADMIN_KEY=admin_secure_key_123
```

**Frontend .env:**
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🎯 Quick Commands

### **Check Backend:**
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"ok"}`

### **Check Frontend:**
Open browser: `http://localhost:3000`

### **Check ngrok:**
Open browser: `http://localhost:4040`

### **Restart ngrok:**
```bash
cd C:\ngrok
.\ngrok.exe http 3000
```

---

## 🔧 Troubleshooting

### **"ngrok tunnel expired"**
→ Restart ngrok:
```bash
cd C:\ngrok
.\ngrok.exe http 3000
```

### **"Cannot connect to backend"**
→ Check backend is running:
```bash
curl http://localhost:5000/api/health
```

### **"Razorpay can't verify URL"**
→ Make sure:
- ngrok is running
- Frontend is running on port 3000
- URL is accessible: `https://unarticulatory-kami-glisteringly.ngrok-free.dev`

### **"Payment verification failed"**
→ Clear browser cache:
```
Ctrl + F5
```
→ Upload new project
→ Try payment again

---

## 🌐 For Production (Later)

**When you deploy to production:**

1. **Frontend:** Deploy to Vercel/Netlify
   - Get permanent URL: `https://yourapp.vercel.app`

2. **Backend:** Deploy to Heroku/Railway
   - Get permanent URL: `https://yourapi.herokuapp.com`

3. **Update Razorpay:**
   - Change website URL to production URL
   - Switch to live mode
   - Use live API keys (rzp_live_...)

4. **No ngrok needed!**
   - Production URLs are permanent
   - Always accessible
   - No expiration

---

## ✅ Current Setup Summary

**Servers Running:**
- ✅ Backend: `http://localhost:5000`
- ✅ Frontend: `http://localhost:3000`
- ✅ ngrok: `https://unarticulatory-kami-glisteringly.ngrok-free.dev`

**Razorpay:**
- Website URL: Use ngrok URL
- Test mode: Enabled
- API keys: Configured

**Ready to test:**
1. Add ngrok URL to Razorpay dashboard
2. Access app via ngrok URL
3. Complete payment flow
4. Verify success!

---

## 📞 Next Steps

1. **Add URL to Razorpay Dashboard**
   - Go to Razorpay settings
   - Add: `https://unarticulatory-kami-glisteringly.ngrok-free.dev`
   - Save and verify

2. **Test Complete Flow**
   - Access via ngrok URL
   - Sign up / Login
   - Upload project
   - Complete payment
   - Verify success

3. **Monitor ngrok Dashboard**
   - Open: `http://localhost:4040`
   - Watch requests in real-time
   - Debug if needed

---

**All servers are running! Add the ngrok URL to Razorpay and test!** 🚀✅
