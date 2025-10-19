# 🔗 Razorpay App Registration Guide

## 📋 Your App URLs

### **Frontend (Main App):**
```
http://localhost:3000
```

### **Backend API:**
```
http://localhost:5000
```

### **Payment Callback URL:**
```
http://localhost:3000/payment-success
```

### **Webhook URL (Optional):**
```
http://localhost:5000/api/payments/webhook
```

---

## 🚀 Step-by-Step: Register App in Razorpay

### **Step 1: Login to Razorpay Dashboard**
1. Go to: https://dashboard.razorpay.com/
2. Login with your credentials
3. Select your account

---

### **Step 2: Get API Keys**

**Navigate to:**
```
Dashboard → Settings → API Keys
```

**Or direct link:**
```
https://dashboard.razorpay.com/app/keys
```

**You'll see:**
- **Key ID** (starts with `rzp_test_` for test mode)
- **Key Secret** (click "Generate" if not visible)

**Copy both keys!**

---

### **Step 3: Configure Webhooks (Optional but Recommended)**

**Navigate to:**
```
Dashboard → Settings → Webhooks
```

**Add Webhook:**
1. Click "Add New Webhook"
2. **Webhook URL:** `http://localhost:5000/api/payments/webhook`
3. **Active Events:** Select:
   - ✅ payment.authorized
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
4. **Secret:** Generate a secret key
5. Click "Create Webhook"

---

### **Step 4: Add Your App Details**

**Navigate to:**
```
Dashboard → Settings → Website and App Details
```

**Fill in:**

**Business/Website Name:**
```
P2D - Project Print & Delivery
```

**Website URL:**
```
http://localhost:3000
```
*(For production, use your actual domain)*

**Business Type:**
```
Education / Services
```

**Business Category:**
```
Education
```

**Business Sub-category:**
```
Educational Services
```

**Description:**
```
Student project printing, binding, and delivery service. 
Students upload their project reports, customize printing 
options, and get them printed and delivered.
```

---

### **Step 5: Add Logo (Optional)**

**Upload your P2D logo:**
- Recommended size: 256x256 pixels
- Format: PNG with transparent background
- Shows on payment page

---

### **Step 6: Configure Payment Methods**

**Navigate to:**
```
Dashboard → Settings → Payment Methods
```

**Enable:**
- ✅ Cards (Debit/Credit)
- ✅ UPI
- ✅ Netbanking
- ✅ Wallets (optional)

---

### **Step 7: Add Your .env Configuration**

**Open your `.env` file and add:**

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE

# Webhook Secret (if configured)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Admin Key
ADMIN_KEY=admin_secure_key_123
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
RAZORPAY_WEBHOOK_SECRET=webhook_secret_xyz789
ADMIN_KEY=admin_p2d_secure_2024
```

---

### **Step 8: Restart Your Servers**

**Stop current servers (Ctrl + C in both terminals)**

**Restart Backend:**
```bash
cd student-project-portal
node server.js
```

**Restart Frontend:**
```bash
cd student-project-portal/frontend
npm start
```

---

## 🧪 Test Payment Integration

### **Step 1: Access Your App**
```
http://localhost:3000
```

### **Step 2: Create Test Account**
1. Click "Sign Up"
2. Fill details
3. Register

### **Step 3: Upload Test Project**
1. Login
2. Click "Upload Project"
3. Fill project details
4. Upload a PDF
5. Choose customization
6. Click "Proceed to Payment"

### **Step 4: Test Payment**

**Use Razorpay Test Card:**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```

**Click "Pay"**

**Expected Result:**
- ✅ Payment succeeds
- ✅ Success message shown
- ✅ Redirected to dashboard
- ✅ Project appears in dashboard
- ✅ Files saved in uploads folder

---

## 📊 Verify in Razorpay Dashboard

**After test payment:**

1. Go to: https://dashboard.razorpay.com/app/payments
2. You should see your test payment
3. Check:
   - Amount matches
   - Status is "Captured"
   - Customer details correct
   - Order ID matches

---

## 🌐 Production Setup (When Ready)

### **Step 1: Complete KYC**
```
Dashboard → Settings → Account & Settings → KYC
```

**Required Documents:**
- PAN Card
- Business Registration
- Bank Account Details
- Address Proof

### **Step 2: Get Live Keys**
```
Dashboard → Settings → API Keys → Generate Live Keys
```

### **Step 3: Update .env for Production**
```env
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET
```

### **Step 4: Update URLs**
```env
# Production URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### **Step 5: Update Razorpay Settings**
- Website URL: Your actual domain
- Webhook URL: Your production API URL
- Enable required payment methods

---

## 🔒 Security Checklist

Before going live:
- [ ] KYC completed
- [ ] Live keys obtained
- [ ] HTTPS enabled on production
- [ ] Webhook secret configured
- [ ] Payment verification tested
- [ ] Error handling tested
- [ ] Refund process defined
- [ ] Customer support ready

---

## 📱 Payment Flow URLs

### **For Razorpay Configuration:**

**Success URL:**
```
http://localhost:3000/dashboard
```
*(Handled by frontend after payment)*

**Failure URL:**
```
http://localhost:3000/payment-failed
```
*(Optional - can show error in modal)*

**Webhook URL:**
```
http://localhost:5000/api/payments/webhook
```
*(For payment notifications)*

---

## 🎯 Important Notes

### **Test Mode:**
- All payments are simulated
- No real money charged
- Use test cards only
- Keys start with `rzp_test_`

### **Live Mode:**
- Real money transactions
- Requires KYC completion
- Use live keys `rzp_live_`
- Settlements to bank account

### **Local Development:**
- Use localhost URLs
- Test mode keys only
- Webhooks won't work (need public URL)
- Use ngrok for webhook testing

---

## 🔧 Webhook Testing (Advanced)

**If you want to test webhooks locally:**

### **Step 1: Install ngrok**
```bash
# Download from: https://ngrok.com/
```

### **Step 2: Start ngrok**
```bash
ngrok http 5000
```

### **Step 3: Use ngrok URL**
```
Webhook URL: https://your-ngrok-url.ngrok.io/api/payments/webhook
```

### **Step 4: Update Razorpay**
Add the ngrok URL in Razorpay webhook settings

---

## ✅ Quick Reference

| Item | Value |
|------|-------|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:5000 |
| **Dashboard** | https://dashboard.razorpay.com/ |
| **API Keys** | Dashboard → Settings → API Keys |
| **Webhooks** | Dashboard → Settings → Webhooks |
| **Test Card** | 4111 1111 1111 1111 |

---

## 📞 Support

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: +91-80-6108-6200
- Docs: https://razorpay.com/docs/
- Dashboard: https://dashboard.razorpay.com/

**Common Issues:**
- Keys not working → Check test vs live mode
- Payment failing → Use test cards
- Webhook not receiving → Use ngrok for local testing

---

**Your servers are starting! Access your app at http://localhost:3000** 🚀

**Next: Copy your app URL and add to Razorpay dashboard!**
