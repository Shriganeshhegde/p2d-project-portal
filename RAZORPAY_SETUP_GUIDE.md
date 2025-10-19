# 💳 Razorpay Integration & Payment Setup Guide

## ✅ What's Been Updated

### **1. Pricing Increase**
- ✅ Added ₹25 per copy (hidden from customer)
- ✅ Adjusted profit margin from 40% to 35%
- ✅ Total increase: ₹25 + 35% profit on base cost

### **2. Razorpay Integration**
- ✅ Full Razorpay payment gateway integration
- ✅ Secure payment verification
- ✅ Payment signature validation

### **3. Payment-Conditional File Storage**
- ✅ Files saved ONLY after successful payment
- ✅ Automatic cleanup of unpaid records
- ✅ No files stored for failed/cancelled payments

---

## 🚀 Setup Instructions

### **Step 1: Get Razorpay Account**

1. **Sign up at:** https://razorpay.com/
2. **Verify your account** (email, phone, business details)
3. **Get API Keys:**
   - Go to: https://dashboard.razorpay.com/app/keys
   - You'll see:
     - **Key ID** (starts with `rzp_test_` for test mode)
     - **Key Secret** (click "Generate" if not visible)

---

### **Step 2: Add Razorpay Credentials**

**Open your `.env` file and add:**

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE

# Admin key for cleanup
ADMIN_KEY=your_secure_random_key_here
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwxyz123456
ADMIN_KEY=admin_secure_key_12345
```

---

### **Step 3: Test Mode vs Live Mode**

**Test Mode (Development):**
- Use keys starting with `rzp_test_`
- No real money charged
- Use test cards for testing

**Live Mode (Production):**
- Use keys starting with `rzp_live_`
- Real money transactions
- Requires KYC verification

---

### **Step 4: Restart Server**

```bash
# Stop current server (Ctrl + C)
# Restart
cd student-project-portal
node server.js
```

---

## 💰 Pricing Breakdown

### **Old Pricing (Per Copy):**
```
Base Cost: ₹219.25
Profit (40%): ₹87.70
Total: ₹307
```

### **New Pricing (Per Copy):**
```
Base Cost: ₹219.25
Additional Markup: ₹25.00
Profit (35%): ₹76.74
Total: ₹321
```

**Increase per copy: ₹14** (₹25 markup - reduced profit)

---

## 🔒 Payment Flow

### **1. Student Uploads Project**
- Fills project details
- Uploads PDF files
- Chooses customization
- **Files uploaded to temp storage**

### **2. Student Proceeds to Payment**
- Sees total amount
- Clicks "Pay Now"
- Razorpay payment modal opens

### **3. Payment Processing**
```
┌─────────────────────────────────┐
│  Razorpay Payment Modal         │
│  ┌───────────────────────────┐  │
│  │ Enter Card Details        │  │
│  │ Card Number: ____         │  │
│  │ Expiry: __/__             │  │
│  │ CVV: ___                  │  │
│  │                           │  │
│  │ [Pay ₹321]                │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### **4. Payment Success**
- ✅ Razorpay verifies payment
- ✅ Backend validates signature
- ✅ **Project saved to database**
- ✅ **Files moved to permanent storage**
- ✅ Student redirected to dashboard

### **5. Payment Failed/Cancelled**
- ❌ Payment not completed
- ❌ **Files NOT saved**
- ❌ **Temp data deleted after 30 minutes**
- ❌ Student can try again

---

## 🧪 Testing Payment

### **Test Cards (Razorpay Test Mode):**

**Success:**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

**Failure:**
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

**More test cards:** https://razorpay.com/docs/payments/payments/test-card-upi-details/

---

## 📊 Payment Verification Process

### **Security Layers:**

1. **Razorpay Order Creation**
   - Server creates order with Razorpay
   - Gets unique order ID
   - Stores in database as "pending"

2. **Payment Signature**
   - Razorpay generates signature
   - Backend verifies using HMAC SHA256
   - Ensures payment authenticity

3. **Database Validation**
   - Checks payment record exists
   - Verifies user owns the payment
   - Confirms amount matches

4. **File Storage**
   - Only after ALL verifications pass
   - Files moved to permanent location
   - Project marked as "paid"

---

## 🗑️ Automatic Cleanup

### **Expired Payments Cleanup:**

**What gets cleaned:**
- Payments pending for > 30 minutes
- Associated temporary data
- Unpaid project records

**How to trigger:**
```bash
curl -X POST http://localhost:5000/api/payments/cleanup-expired \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "your_admin_key_here"}'
```

**Recommended:** Set up a cron job to run this every hour

---

## 📁 File Storage Logic

### **Before Payment:**
```
temp_uploads/
  └─ pending_proj123/
      ├─ project.pdf
      └─ certificate.jpg
```
**Status:** Temporary, will be deleted if not paid

### **After Payment:**
```
uploads/
  └─ StudentName_College_proj123/
      ├─ README.txt
      ├─ STUDENT_DETAILS.json
      ├─ project.pdf
      └─ certificate.jpg
```
**Status:** Permanent, ready for vendor

---

## 🎯 Payment States

| State | Description | Files Saved | Can Retry |
|-------|-------------|-------------|-----------|
| **Pending** | Payment initiated | ❌ No | ✅ Yes |
| **Completed** | Payment successful | ✅ Yes | ❌ No |
| **Failed** | Payment declined | ❌ No | ✅ Yes |
| **Expired** | Timeout (30 min) | ❌ No | ✅ Yes |

---

## 🔧 Troubleshooting

### **"Payment gateway not configured"**
- Check `.env` has `RAZORPAY_KEY_ID`
- Check `.env` has `RAZORPAY_KEY_SECRET`
- Restart server after adding keys

### **"Invalid signature"**
- Check `RAZORPAY_KEY_SECRET` is correct
- Ensure no extra spaces in `.env`
- Verify keys are from same account

### **Payment succeeds but files not saved**
- Check server logs for errors
- Verify database connection
- Check Supabase permissions

### **Test payment not working**
- Use test mode keys (`rzp_test_`)
- Use test card numbers
- Check Razorpay dashboard for logs

---

## 📱 Razorpay Dashboard

**Access:** https://dashboard.razorpay.com/

**What you can see:**
- All transactions
- Payment success/failure rates
- Settlement details
- Refund management
- Analytics

---

## 💡 Best Practices

### **Security:**
- ✅ Never commit `.env` to git
- ✅ Use test keys for development
- ✅ Validate all payments server-side
- ✅ Log all payment attempts

### **User Experience:**
- ✅ Show clear payment status
- ✅ Provide retry option on failure
- ✅ Send confirmation emails
- ✅ Display receipt after payment

### **Operations:**
- ✅ Monitor failed payments
- ✅ Run cleanup regularly
- ✅ Check Razorpay dashboard daily
- ✅ Handle refunds promptly

---

## 🚀 Going Live

### **Before Production:**

1. **Complete KYC** on Razorpay
2. **Get live API keys** (rzp_live_)
3. **Update `.env`** with live keys
4. **Test thoroughly** with real small amounts
5. **Set up webhooks** (optional)
6. **Configure settlements**
7. **Enable required payment methods**

### **Checklist:**
- [ ] KYC completed
- [ ] Live keys obtained
- [ ] Test transactions successful
- [ ] Error handling tested
- [ ] Cleanup cron job set up
- [ ] Monitoring in place
- [ ] Support process defined

---

## 📞 Support

**Razorpay Support:**
- Email: support@razorpay.com
- Docs: https://razorpay.com/docs/
- Dashboard: https://dashboard.razorpay.com/

**Integration Issues:**
- Check server logs
- Verify API keys
- Test with curl/Postman
- Check Razorpay dashboard

---

## ✅ Summary

**What's Working:**
- ✅ ₹25 price increase per copy
- ✅ Razorpay payment integration
- ✅ Payment verification
- ✅ Files saved only after payment
- ✅ Automatic cleanup of unpaid records

**Next Steps:**
1. Add Razorpay credentials to `.env`
2. Restart server
3. Test with test cards
4. Verify payment flow
5. Check file storage

---

**Payment system is ready! Add your Razorpay keys and test!** 💳✅
