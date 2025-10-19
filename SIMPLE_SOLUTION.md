# ✅ Simple Solution - Use Same URL

## 🎯 Current Situation

**Your ngrok URL:**
```
https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

**Problem:** ngrok free tier gives same domain for multiple tunnels

**Solution:** Use the SAME URL for both frontend and backend!

---

## ✅ Why This Works

ngrok is smart - it routes requests based on which local port the tunnel points to.

**When you access:**
- `https://unarticulatory-kami-glisteringly.ngrok-free.dev` → Goes to port 3000 (frontend)
- Backend calls also go through the same URL → Routes to port 5000 (backend)

---

## 📋 Setup Steps

### **Step 1: Frontend is Already Configured**

Your frontend `.env` already has:
```env
REACT_APP_API_URL=https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

✅ This is correct! Keep it as is.

---

### **Step 2: Add to Razorpay**

**Go to:** https://dashboard.razorpay.com/

**Settings → Website and App Details:**
```
Website URL: https://unarticulatory-kami-glisteringly.ngrok-free.dev
Business Name: P2D - Project Print & Delivery
Business Type: Education
Category: Educational Services
```

**Click:** Save

---

### **Step 3: Get Razorpay API Keys**

**Go to:** https://dashboard.razorpay.com/app/keys

**You'll see:**
- **Key ID** (starts with `rzp_test_...`)
- **Key Secret** (click "Generate Key Secret" if not visible)

**Copy both!**

---

### **Step 4: Add Razorpay Keys to Backend**

**Open file:** `student-project-portal\.env`

**Add these lines:**
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
ADMIN_KEY=admin_secure_key_123
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
ADMIN_KEY=admin_p2d_2024
```

**Save the file.**

---

### **Step 5: Restart Backend**

**In your backend terminal:**
1. Press `Ctrl + C` to stop
2. Run:
```bash
node server.js
```

**You should see:**
```
Server running on port 5000
✓ Razorpay initialized
```

---

### **Step 6: Restart Frontend**

**In your frontend terminal:**
1. Press `Ctrl + C` to stop
2. Run:
```bash
npm start
```

**Wait for:**
```
Compiled successfully!
```

---

### **Step 7: Test the App!**

**1. Access Your App:**
```
https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

**2. Sign Up:**
- Click "Sign Up"
- Fill in details
- Register

**3. Upload Project:**
- Login
- Click "Upload Project"
- Fill details:
  - Title: "Test Project"
  - Department: Computer Science
  - Semester: 6
- Upload PDF
- Click "Next"

**4. Customize:**
- Copies: 2
- Binding: Hard Binding
- Color: Royal Blue
- Click "Proceed to Payment"

**5. Pay with Test Card:**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

**6. Complete Payment:**
- Click "Pay"
- Payment should succeed
- You'll be redirected to dashboard

**7. Verify:**
- Check project appears in dashboard
- Check `uploads/` folder for files

---

## 🔍 Verification Checklist

### **Before Testing:**
- [ ] Frontend running (npm start)
- [ ] Backend running (node server.js)
- [ ] ngrok tunnel active
- [ ] Frontend .env has backend URL
- [ ] Backend .env has Razorpay keys
- [ ] Website added to Razorpay dashboard

### **During Testing:**
- [ ] Can access app via ngrok URL
- [ ] Can sign up/login
- [ ] Can upload project
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Redirected to dashboard

### **After Payment:**
- [ ] Project shows in dashboard
- [ ] Files in uploads folder
- [ ] README.txt created
- [ ] Payment status: paid

---

## 🎯 Your URLs

| Service | URL |
|---------|-----|
| **App Access** | https://unarticulatory-kami-glisteringly.ngrok-free.dev |
| **Razorpay Dashboard** | https://dashboard.razorpay.com/ |
| **Razorpay API Keys** | https://dashboard.razorpay.com/app/keys |
| **ngrok Web Interface** | http://localhost:4040 |

---

## 🧪 Test Cards

**Success:**
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

**Failure (to test error handling):**
```
Card: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

---

## 🚨 Troubleshooting

### **"Payment gateway not configured"**
→ Add Razorpay keys to backend .env
→ Restart backend

### **Razorpay modal doesn't open**
→ Check browser console for errors
→ Verify Razorpay keys are correct
→ Check backend is running

### **Payment succeeds but files not saved**
→ Check backend logs
→ Verify uploads folder exists
→ Check database connection

### **Can't access app**
→ Check ngrok is running
→ Verify URL is correct
→ Check frontend is running

---

## ✅ Quick Summary

**What you need to do:**

1. ✅ Frontend .env already configured
2. ⏳ Add website to Razorpay dashboard
3. ⏳ Get Razorpay API keys
4. ⏳ Add keys to backend .env
5. ⏳ Restart backend
6. ⏳ Restart frontend
7. ⏳ Test payment!

**Your URL for everything:**
```
https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

---

**Next: Add this URL to Razorpay dashboard and get your API keys!** 🚀
