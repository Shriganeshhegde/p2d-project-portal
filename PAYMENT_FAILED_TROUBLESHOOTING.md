# 🔧 Payment Failed - Troubleshooting Guide

## ✅ Razorpay Configuration Status

**Backend Check:** ✅ Razorpay is properly configured
- Key ID: Configured (rzp_test_...)
- Key Secret: Configured (24 characters)
- Razorpay instance: Created successfully

---

## 🔍 Common Causes of Payment Failure

### **1. Browser Console Errors**

**Check browser console (F12):**
- Look for red error messages
- Check Network tab for failed requests
- Look for CORS errors

**Common errors:**
- "Failed to fetch"
- "Network error"
- "CORS policy"
- "Razorpay is not defined"

---

### **2. Razorpay Script Not Loaded**

**Issue:** Razorpay checkout script not loading

**Fix:** Check if script is in HTML
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**Verify:** Open browser console and type:
```javascript
typeof Razorpay
```
Should return: `"function"`

---

### **3. Backend Not Reachable**

**Test backend connection:**
```bash
curl http://localhost:5000/api/health
```

**Expected:** `{"status":"ok"}`

**If fails:**
- Backend not running
- Wrong port
- Firewall blocking

---

### **4. Authentication Token Missing**

**Issue:** User not logged in or token expired

**Check:**
```javascript
// In browser console
localStorage.getItem('token')
```

**Should return:** A long JWT token string

**If null:**
- User not logged in
- Token expired
- Need to login again

---

### **5. Project Data Missing**

**Issue:** Project ID or data not passed correctly

**Check:** Payment page should have project details
- Title
- Pages
- Department
- Semester

**If missing:** Go back and upload project again

---

## 🧪 Step-by-Step Debugging

### **Step 1: Check Backend**

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"ok"}
```

### **Step 2: Check Frontend Connection**

**Open browser console (F12) and run:**
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Error:', e))
```

**Expected:** `Backend: {status: "ok"}`

### **Step 3: Check Authentication**

**In browser console:**
```javascript
console.log('Token:', localStorage.getItem('token'))
```

**Should show:** Long token string

**If null:** Login again

### **Step 4: Check Razorpay Script**

**In browser console:**
```javascript
console.log('Razorpay loaded:', typeof Razorpay !== 'undefined')
```

**Should show:** `Razorpay loaded: true`

### **Step 5: Check Network Requests**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try payment again
4. Look for:
   - `/api/payments/create-order` - Should return 200
   - Check response for errors

---

## 🔧 Quick Fixes

### **Fix 1: Restart Everything**

```bash
# Kill all processes
# Restart backend
cd student-project-portal
node server.js

# Restart frontend
cd frontend
npm start
```

### **Fix 2: Clear Browser Cache**

1. Press Ctrl + Shift + Delete
2. Clear cache and cookies
3. Refresh page
4. Login again

### **Fix 3: Check .env File**

**Backend .env should have:**
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
ADMIN_KEY=admin_secure_key_123
```

**Frontend .env should have:**
```env
REACT_APP_API_URL=http://localhost:5000
```

### **Fix 4: Verify Test Card**

**Use correct test card:**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25 (or any future date)
Name: Test User
```

**Don't use:**
- Real card numbers
- Expired dates
- Invalid CVV

---

## 📊 Check Backend Logs

**Look for errors in backend terminal:**

**Good logs:**
```
Server running on port 5000
✓ Razorpay initialized
```

**Bad logs:**
```
⚠️ Razorpay credentials not configured
Error: ...
```

---

## 🎯 Specific Error Messages

### **"Payment gateway not configured"**

**Cause:** Razorpay keys missing or invalid

**Fix:**
1. Check .env has RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
2. Keys should start with `rzp_test_`
3. Restart backend

### **"Failed to create order"**

**Cause:** Backend can't create Razorpay order

**Fix:**
1. Check Razorpay keys are correct
2. Check internet connection
3. Verify Razorpay account is active

### **"Payment verification failed"**

**Cause:** Signature mismatch

**Fix:**
1. Verify RAZORPAY_KEY_SECRET is correct
2. No extra spaces in .env
3. Keys from same Razorpay account

### **"Network error"**

**Cause:** Frontend can't reach backend

**Fix:**
1. Check backend is running
2. Verify frontend .env has correct API URL
3. Check firewall/antivirus

---

## 🔍 Advanced Debugging

### **Enable Detailed Logging**

**Add to Payment.jsx:**
```javascript
const handlePayment = async () => {
  console.log('Starting payment...');
  console.log('Project:', project);
  console.log('Costs:', costs);
  console.log('Token:', localStorage.getItem('token'));
  
  // ... rest of code
}
```

### **Check Razorpay Dashboard**

1. Go to: https://dashboard.razorpay.com/app/payments
2. Check if any orders were created
3. Look for error messages
4. Verify test mode is enabled

---

## ✅ Complete Checklist

**Before trying payment:**
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Logged in (token present)
- [ ] Razorpay keys in backend .env
- [ ] Frontend .env has backend URL
- [ ] Browser console clear of errors
- [ ] Using test card (4111 1111 1111 1111)
- [ ] Internet connection active

---

## 🚨 Still Not Working?

### **Try This:**

1. **Open browser console (F12)**
2. **Go to Console tab**
3. **Try payment**
4. **Copy any error messages**
5. **Check what the error says**

**Common errors and fixes:**

**"Razorpay is not defined"**
→ Razorpay script not loaded
→ Check internet connection
→ Refresh page

**"Failed to fetch"**
→ Backend not reachable
→ Check backend is running
→ Verify API URL in frontend .env

**"401 Unauthorized"**
→ Not logged in
→ Token expired
→ Login again

**"400 Bad Request"**
→ Invalid data sent
→ Check project details
→ Try uploading project again

---

## 📞 Quick Test Commands

**Test backend:**
```bash
curl http://localhost:5000/api/health
```

**Test Razorpay config:**
```bash
node check-razorpay.js
```

**Check frontend connection:**
```javascript
// In browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 💡 Most Common Solution

**90% of payment failures are due to:**

1. **Backend not running** → Start it
2. **Not logged in** → Login again
3. **Wrong API URL** → Check frontend .env
4. **Browser cache** → Clear and refresh

**Try these first!**

---

**Check browser console for specific error message and follow the fixes above!** 🔧
