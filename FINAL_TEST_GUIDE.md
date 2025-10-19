# 🎯 Final Complete Test Guide

## ✅ System Status

**All servers running:**
- ✅ Backend: Port 5000 (with detailed error logging)
- ✅ Frontend: Port 3000
- ✅ ngrok: Active tunnel
- ✅ CORS: Configured for both localhost and ngrok
- ✅ Razorpay: Test mode enabled

**Your account:**
- ✅ Email: shriganeshhegde495@gmail.com
- ✅ Name: Shriganesh Hegde
- ✅ User ID: c6bd19fc-c14c-4bc4-bf21-2f70f74c520f
- ✅ Exists in database

---

## 🧪 Complete Payment Test - Step by Step

### **Step 1: Access App**

**Via ngrok (for Razorpay verification):**
```
https://unarticulatory-kami-glisteringly.ngrok-free.dev
```

**Or via localhost:**
```
http://localhost:3000
```

---

### **Step 2: Login**

**Use your existing account:**
- Email: `shriganeshhegde495@gmail.com`
- Password: (your password)

**Verify login successful:**
- Check browser console (F12):
```javascript
localStorage.getItem('token')
```
- Should return a long token string

---

### **Step 3: Upload Project**

**Click "Upload Project" and fill:**

1. **Title:** e.g., "Machine Learning Project"
2. **Department:** e.g., "Computer Science"
3. **Semester:** e.g., 6
4. **Upload PDF:** Any PDF file
5. **Customization:**
   - Copies: 2
   - Print Type: Color or Black & White
   - Binding: Hard or Spiral
   - Binding Color: Blue/Black/Red

**Click "Submit" or "Proceed to Payment"**

---

### **Step 4: Review Payment Details**

**On payment page, verify:**
- Project title shown
- Pages calculated
- Cost breakdown displayed
- Delivery to college shown

**Click "Pay Now"**

---

### **Step 5: Complete Payment**

**Razorpay modal opens**

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

**Click "Pay"**

---

### **Step 6: Monitor Backend**

**Watch backend terminal for logs:**

**Should see:**
```
Payment verification started: {
  projectId: '...',
  userId: 'c6bd19fc-c14c-4bc4-bf21-2f70f74c520f',
  orderId: 'order_...',
  hasProjectData: true
}
```

**If error occurs, you'll see:**
```
Error verifying payment: ...
Error stack: ...
Error details: { ... }
```

**This tells you EXACTLY what went wrong!**

---

### **Step 7: Verify Success**

**If successful:**
- ✅ Alert: "Payment successful!"
- ✅ Redirected to dashboard
- ✅ Project appears in dashboard
- ✅ Payment status: "paid"

**If failed:**
- ❌ Alert: "Payment verification failed"
- Check backend logs for exact error
- See troubleshooting section below

---

## 🔍 Troubleshooting

### **If Payment Verification Fails:**

**1. Check Backend Logs**

Look in backend terminal for:
```
Error verifying payment: ...
```

**Common errors:**

**"Payment record not found"**
→ Payment order wasn't created
→ Try uploading project again

**"Invalid payment signature"**
→ Razorpay keys mismatch
→ Check RAZORPAY_KEY_SECRET in .env

**"User account not found"**
→ Not logged in properly
→ Login again

**Foreign key constraint error**
→ User ID doesn't exist
→ Shouldn't happen (your user exists!)

---

**2. Check Browser Console**

Press F12 → Console tab

**Look for:**
- Network errors
- Failed API calls
- Response details

---

**3. Verify Token**

**In browser console:**
```javascript
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);

if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('User ID in token:', payload.id);
  console.log('Expected User ID:', 'c6bd19fc-c14c-4bc4-bf21-2f70f74c520f');
}
```

**User IDs should match!**

---

**4. Check Payment Record**

**Run debug script:**
```bash
node debug-payment.js
```

**Shows:**
- Recent payments
- Payment status
- Student ID used
- If user exists

---

## 🚨 Common Issues & Fixes

### **Issue 1: "Cannot connect to server"**

**Fix:**
- Check backend is running
- Check frontend .env has correct API URL
- Clear browser cache (Ctrl+F5)

---

### **Issue 2: "CORS error"**

**Fix:**
- Backend should allow ngrok URL
- Already configured!
- Restart backend if needed

---

### **Issue 3: "Payment verification failed"**

**Fix:**
- Check backend logs for exact error
- Verify you're logged in
- Try uploading fresh project
- Use correct test card

---

### **Issue 4: "International cards not supported"**

**Fix:**
- Use Indian test card: `5267 3181 8797 5449`
- Or use UPI: `success@razorpay`
- Don't use `4111 1111 1111 1111`

---

## 📊 What Happens Behind the Scenes

```
1. User uploads project
   ↓
2. Frontend creates payment order
   - POST /api/payments/create-order
   - Backend creates Razorpay order
   - Backend stores payment record (status: pending)
   ↓
3. Razorpay modal opens
   - User enters card details
   - Razorpay processes payment
   ↓
4. Payment succeeds
   - Razorpay calls success handler
   ↓
5. Frontend sends verification
   - POST /api/payments/verify-payment
   - Includes: order_id, payment_id, signature, projectData
   ↓
6. Backend verifies signature
   - Creates HMAC with secret key
   - Compares with Razorpay signature
   ↓
7. Backend saves project
   - Inserts into projects table
   - Uses actual database schema
   ↓
8. Backend updates payment
   - Status: completed
   - Adds payment_id and signature
   ↓
9. Success response
   - Frontend shows success message
   - Redirects to dashboard
```

---

## 🎯 Expected Results

### **After Successful Payment:**

**In Database:**

**Payment record:**
```json
{
  "status": "completed",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "..."
}
```

**Project record:**
```json
{
  "id": "...",
  "student_id": "c6bd19fc-c14c-4bc4-bf21-2f70f74c520f",
  "title": "Machine Learning Project",
  "description": "45 pages, 2 copies, color print, hard binding",
  "department": "Computer Science",
  "semester": 6,
  "payment_status": "paid",
  "status": "pending"
}
```

**On Dashboard:**
- Project listed
- Shows title
- Shows status
- Shows payment status: "paid"

---

## 📋 Pre-Flight Checklist

**Before testing:**
- [ ] Backend running (check terminal)
- [ ] Frontend running (check browser)
- [ ] ngrok running (check localhost:4040)
- [ ] Logged in (check localStorage)
- [ ] Browser cache cleared (Ctrl+F5)

**During test:**
- [ ] Upload fresh project
- [ ] Fill all fields
- [ ] Use correct test card
- [ ] Watch backend logs

**After test:**
- [ ] Check backend logs
- [ ] Check browser console
- [ ] Verify dashboard shows project
- [ ] Run debug-payment.js if needed

---

## 🔧 Quick Commands

**Check backend:**
```bash
curl http://localhost:5000/api/health
```

**Debug payment:**
```bash
node debug-payment.js
```

**Check ngrok:**
```
http://localhost:4040
```

**Restart backend:**
```bash
cd student-project-portal
node server.js
```

---

## ✅ Summary

**System:** All servers running ✅
**User:** Account exists in database ✅
**CORS:** Configured for ngrok ✅
**Razorpay:** Test mode enabled ✅
**Logging:** Detailed error logging added ✅

**Ready to test!**

---

**Login with your account, upload project, and complete payment. Check backend logs if it fails!** 🚀✅
