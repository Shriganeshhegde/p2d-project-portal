# ✅ Complete Razorpay Setup - Final Steps

## 🎯 Current Status

✅ Backend URL configured: `https://unarticulatory-kami-glisteringly.ngrok-free.dev`
✅ Frontend .env updated with backend URL
✅ Frontend restarting...

---

## 📋 What You Need to Do Now

### **Step 1: Get Your Frontend URL**

**Open in browser:**
```
http://localhost:4040
```

**Look for the frontend tunnel (port 3000):**
```
https://YOUR-FRONTEND-URL.ngrok.io -> localhost:3000
```

**Copy this URL!** You'll need it for Razorpay.

---

### **Step 2: Add Website URL to Razorpay**

**Go to:** https://dashboard.razorpay.com/

**Navigate to:** Settings → Website and App Details

**Fill in:**
```
Website URL: https://YOUR-FRONTEND-URL.ngrok.io
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
- **Key Secret** (click "Generate" if not visible)

**Copy both keys!**

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

### **Step 5: Restart Backend Server**

**In your backend terminal:**
1. Press `Ctrl + C` to stop
2. Run: `node server.js`

**You should see:**
```
Server running on port 5000
✓ Razorpay initialized
```

---

### **Step 6: Test the Complete Flow**

**1. Access Your App:**
```
https://YOUR-FRONTEND-URL.ngrok.io
```

**2. Create Account:**
- Click "Sign Up"
- Fill in your details
- Register

**3. Upload Test Project:**
- Login to dashboard
- Click "Upload Project"
- Fill project details:
  - Title: "Test Project"
  - Department: Computer Science
  - Semester: 6
- Upload a PDF file
- Click "Next"

**4. Customize Project:**
- Copies: 2
- Print Type: Color Print
- Binding: Hard Binding
- Binding Color: Royal Blue
- Click "Proceed to Payment"

**5. Complete Payment:**
- Review payment details
- Enter delivery address
- Click "Pay Now"
- Razorpay modal opens
- Enter test card:
  ```
  Card Number: 4111 1111 1111 1111
  CVV: 123
  Expiry: 12/25
  Name: Test User
  ```
- Click "Pay"

**6. Verify Success:**
- ✅ Payment success message
- ✅ Redirected to dashboard
- ✅ Project appears in dashboard
- ✅ Check `uploads/` folder for files

---

## 🔍 Verification Checklist

### **Frontend:**
- [ ] Frontend running on port 3000
- [ ] Can access via ngrok HTTPS URL
- [ ] .env has backend URL configured
- [ ] No console errors

### **Backend:**
- [ ] Backend running on port 5000
- [ ] Razorpay keys configured in .env
- [ ] Server logs show "Razorpay initialized"
- [ ] No startup errors

### **Razorpay:**
- [ ] Website URL added to dashboard
- [ ] API keys copied
- [ ] Test mode enabled
- [ ] Payment methods enabled

### **Payment Flow:**
- [ ] Can sign up/login
- [ ] Can upload project
- [ ] Can customize options
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Files saved in uploads folder

---

## 🧪 Test Cards

### **Success:**
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### **Failure (to test error handling):**
```
Card: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

### **More test cards:**
https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

## 📊 What Happens After Payment

### **On Success:**
1. Payment verified by Razorpay
2. Backend validates signature
3. Project saved to database
4. Files moved to permanent storage
5. Folder created: `uploads/StudentName_College_projXXX/`
6. README.txt generated with details
7. Student sees project in dashboard
8. Vendor can access files

### **On Failure:**
1. Payment not completed
2. Files NOT saved
3. No database entry
4. Student can retry
5. Temp data cleaned after 30 minutes

---

## 🗂️ File Structure After Payment

```
uploads/
  └─ StudentName_CollegeName_proj123/
      ├─ README.txt              ← All details
      ├─ STUDENT_DETAILS.json    ← Complete data
      ├─ Project_Report.pdf      ← Uploaded file
      └─ Certificate.jpg         ← If uploaded
```

---

## 💰 Pricing (Hidden from Customer)

### **Per Copy:**
```
Base Printing: ₹1.25 × pages
Binding: ₹80
Glass Sheet: ₹40
Transport: ₹18 (fixed)
Additional Markup: ₹25
Profit Margin: 35% of base cost
```

### **Example (45 pages, 2 copies):**
```
Base Cost: ₹438.50
Markup: ₹50 (₹25 × 2)
Profit: ₹153.48 (35%)
Total: ₹642
```

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| **Frontend Tunnel** | http://localhost:4040 |
| **Backend URL** | https://unarticulatory-kami-glisteringly.ngrok-free.dev |
| **Razorpay Dashboard** | https://dashboard.razorpay.com/ |
| **Razorpay API Keys** | https://dashboard.razorpay.com/app/keys |
| **Razorpay Test Cards** | https://razorpay.com/docs/payments/payments/test-card-upi-details/ |

---

## 🚨 Troubleshooting

### **"Payment gateway not configured"**
→ Check backend .env has Razorpay keys
→ Restart backend server

### **Payment modal doesn't open**
→ Check frontend can reach backend
→ Check browser console for errors
→ Verify backend URL in frontend .env

### **Payment succeeds but files not saved**
→ Check backend logs for errors
→ Verify database connection
→ Check uploads folder permissions

### **"Invalid signature" error**
→ Verify RAZORPAY_KEY_SECRET is correct
→ Check no extra spaces in .env
→ Ensure keys are from same account

---

## ✅ Next Steps Summary

1. **Get frontend URL** from http://localhost:4040
2. **Add to Razorpay** dashboard
3. **Get Razorpay keys** from dashboard
4. **Add keys to backend .env**
5. **Restart backend** server
6. **Test payment** with test card
7. **Verify files** saved in uploads folder

---

## 🎉 You're Almost Done!

**Current Progress:**
- ✅ Pricing increased by ₹25 per copy
- ✅ ngrok configured and running
- ✅ Backend URL configured in frontend
- ✅ Frontend restarting
- ⏳ Need: Add website to Razorpay
- ⏳ Need: Add Razorpay keys to backend
- ⏳ Need: Test payment

**Just 3 more steps and you're ready to go live!** 🚀
