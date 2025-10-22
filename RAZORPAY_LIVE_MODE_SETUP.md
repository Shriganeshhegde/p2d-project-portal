# 🚀 Razorpay Live Mode Setup Guide

## ✅ You Have Live API Keys - Let's Go Live!

Congratulations on getting your Razorpay live API keys! Follow these steps to switch from test mode to live mode.

---

## 📋 Prerequisites

- ✅ Razorpay account fully activated
- ✅ Live API Key ID (starts with `rzp_live_`)
- ✅ Live API Key Secret
- ✅ Business details verified by Razorpay
- ✅ Bank account linked

---

## 🔧 Step-by-Step Setup

### **Step 1: Update Backend Environment Variables**

#### **A. Local Development (.env file)**

Open your `.env` file in the project root and update:

```bash
# Razorpay Configuration - LIVE MODE
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET_HERE

# Important: Remove or comment out test keys
# RAZORPAY_KEY_ID=rzp_test_xxxxx  # OLD TEST KEY
# RAZORPAY_KEY_SECRET=xxxxx       # OLD TEST SECRET
```

**⚠️ IMPORTANT:** 
- Live Key ID starts with `rzp_live_`
- Test Key ID starts with `rzp_test_`
- Make sure you're using the LIVE keys!

#### **B. Render Backend (Production)**

1. Go to **Render Dashboard** (https://dashboard.render.com)
2. Select your backend service
3. Click **Environment** tab
4. Update these variables:

```bash
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_LIVE_KEY_SECRET_HERE
```

5. Click **Save Changes**
6. Render will automatically redeploy

---

### **Step 2: Update Frontend Environment Variables**

#### **A. Local Development (frontend/.env)**

Open `frontend/.env` and update:

```bash
# Razorpay Live Key (Public Key)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE

# Backend API URL
REACT_APP_API_URL=https://your-backend.onrender.com
```

#### **B. Vercel Frontend (Production)**

1. Go to **Vercel Dashboard** (https://vercel.com/dashboard)
2. Select your project (p2d-project-portal)
3. Go to **Settings** → **Environment Variables**
4. Update or add:

```bash
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

---

### **Step 3: Configure Razorpay Webhooks (IMPORTANT!)**

Webhooks are crucial for payment verification in live mode.

#### **A. Get Your Webhook URL**

Your webhook URL is:
```
https://your-backend.onrender.com/api/payments/webhook
```

#### **B. Setup Webhook on Razorpay Dashboard**

1. Go to **Razorpay Dashboard** (https://dashboard.razorpay.com)
2. Click **Settings** → **Webhooks**
3. Click **+ Add New Webhook**
4. Fill in details:

**Webhook URL:**
```
https://your-backend.onrender.com/api/payments/webhook
```

**Active Events:** Select these events:
- ✅ `payment.authorized`
- ✅ `payment.captured`
- ✅ `payment.failed`
- ✅ `order.paid`

**Secret:** Generate a webhook secret (save this!)

5. Click **Create Webhook**

#### **C. Add Webhook Secret to Backend**

Update your backend `.env` and Render environment:

```bash
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

---

### **Step 4: Test Live Payments**

#### **⚠️ WARNING: Live Mode Uses Real Money!**

Test with small amounts first (₹1 or ₹10).

#### **A. Test Payment Flow**

1. **Login to your app**
2. **Upload a test project** (1-2 pages)
3. **Proceed to payment**
4. **Use REAL payment method:**
   - UPI
   - Credit/Debit Card
   - Net Banking

#### **B. Test Payment Methods**

**✅ UPI (Recommended for first test):**
- Amount: ₹10
- Use your personal UPI ID
- Complete payment
- Verify order status updates

**✅ Credit/Debit Card:**
- Use your personal card
- Amount: ₹10
- Complete payment

**✅ Net Banking:**
- Use test bank account
- Amount: ₹10

---

### **Step 5: Verify Payment Processing**

After making a test payment:

#### **A. Check Database (Supabase)**

1. Go to Supabase Dashboard
2. Open `payments` table
3. Verify new payment record:
   - `payment_id` should start with `pay_`
   - `status` should be `captured` or `paid`
   - `amount` should match

#### **B. Check Project Status**

1. Go to Supabase Dashboard
2. Open `projects` table
3. Verify project record:
   - `payment_status` should be `paid`
   - `status` should update to `accepted` or `printing`

#### **C. Check Razorpay Dashboard**

1. Go to Razorpay Dashboard
2. Click **Transactions** → **Payments**
3. Verify your test payment appears
4. Status should be **Captured**

---

## 🔍 Differences: Test Mode vs Live Mode

| Feature | Test Mode | Live Mode |
|---------|-----------|-----------|
| **Key ID** | `rzp_test_xxxxx` | `rzp_live_xxxxx` |
| **Money** | Fake (no real transactions) | Real money charged |
| **Cards** | Test cards only | Real cards only |
| **UPI** | Test UPI IDs | Real UPI IDs |
| **Settlements** | No settlements | Real settlements to bank |
| **Webhooks** | Optional | **Required** |
| **Testing** | Unlimited free tests | Costs real money |

---

## ⚠️ Important Security Notes

### **1. Never Commit Live Keys to Git**

```bash
# Make sure .env is in .gitignore
echo ".env" >> .gitignore
```

### **2. Use Environment Variables Only**

- ✅ Store keys in `.env` files
- ✅ Use Render/Vercel environment variables
- ❌ Never hardcode keys in code
- ❌ Never commit keys to GitHub

### **3. Webhook Secret**

- Keep webhook secret secure
- Use it to verify webhook authenticity
- Never share publicly

---

## 🧪 Testing Checklist

Before going fully live, test these scenarios:

### **Payment Success Flow:**
- [ ] Small amount payment (₹10)
- [ ] UPI payment works
- [ ] Card payment works
- [ ] Payment status updates in database
- [ ] Order status changes to "paid"
- [ ] User receives confirmation
- [ ] Webhook receives payment notification

### **Payment Failure Flow:**
- [ ] Cancel payment midway
- [ ] Payment status remains "pending"
- [ ] User can retry payment
- [ ] No duplicate orders created

### **Order Processing:**
- [ ] Paid orders show in "Your Orders"
- [ ] Order tracking works
- [ ] Delivery date calculated correctly
- [ ] Order details are accurate

---

## 📊 Monitoring Live Payments

### **A. Razorpay Dashboard**

Monitor payments at:
```
https://dashboard.razorpay.com/app/payments
```

Check:
- Payment success rate
- Failed payments
- Settlement status
- Refunds (if any)

### **B. Application Logs**

Check Render logs for:
```
✅ Payment verified successfully
✅ Order updated to paid status
```

### **C. Database**

Regularly check Supabase:
- `payments` table for all transactions
- `projects` table for order status
- Match payment records with orders

---

## 💰 Settlement & Payouts

### **When Will You Receive Money?**

Razorpay settles funds based on your settlement cycle:

**Standard Settlement:**
- T+3 days (3 business days after payment)
- Automatic transfer to linked bank account

**Instant Settlement:**
- Available for eligible merchants
- Charges apply (check Razorpay pricing)

### **Check Settlement Status:**

1. Go to Razorpay Dashboard
2. Click **Settlements**
3. View pending and completed settlements

---

## 🔄 Rollback to Test Mode (If Needed)

If you need to go back to test mode:

### **Backend (.env & Render):**
```bash
RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
RAZORPAY_KEY_SECRET=YOUR_TEST_SECRET
```

### **Frontend (.env & Vercel):**
```bash
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_TEST_KEY
```

Then redeploy both frontend and backend.

---

## 🆘 Troubleshooting

### **Issue 1: Payment Fails Immediately**

**Possible Causes:**
- Wrong API keys
- Keys not updated on Render/Vercel
- Webhook not configured

**Solution:**
1. Verify keys start with `rzp_live_`
2. Check Render environment variables
3. Redeploy backend and frontend

### **Issue 2: Payment Succeeds but Order Not Updated**

**Possible Causes:**
- Webhook not configured
- Webhook secret mismatch
- Backend not receiving webhook

**Solution:**
1. Configure webhook on Razorpay dashboard
2. Add webhook secret to backend
3. Check Render logs for webhook errors

### **Issue 3: "Invalid Key ID" Error**

**Cause:** Using test key in live mode or vice versa

**Solution:**
1. Verify key starts with `rzp_live_`
2. Update both backend and frontend
3. Clear browser cache
4. Redeploy

---

## ✅ Final Checklist Before Going Live

- [ ] Live API keys added to backend (.env & Render)
- [ ] Live API key added to frontend (.env & Vercel)
- [ ] Webhook configured on Razorpay dashboard
- [ ] Webhook secret added to backend
- [ ] Test payment completed successfully (₹10)
- [ ] Payment verified in database
- [ ] Order status updated correctly
- [ ] Razorpay dashboard shows payment
- [ ] All test keys removed/commented out
- [ ] `.env` files not committed to Git
- [ ] Backend and frontend redeployed

---

## 📞 Support

### **Razorpay Support:**
- Dashboard: https://dashboard.razorpay.com
- Docs: https://razorpay.com/docs
- Support: support@razorpay.com

### **Your Backend:**
- Health Check: `https://your-backend.onrender.com/api/health`
- Logs: Render Dashboard → Logs

---

## 🎉 You're Ready to Go Live!

Once all checklist items are complete, your app is ready to accept real payments!

**Remember:**
- Start with small test amounts
- Monitor payments closely for first few days
- Keep webhook configured and active
- Check settlements regularly

**Good luck with your live payments!** 💰🚀
