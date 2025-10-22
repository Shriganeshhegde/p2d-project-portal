# ✅ Go Live Checklist - Razorpay Live Mode

## 🎯 Complete This Checklist Before Accepting Real Payments

---

## 📝 Pre-Live Setup

### **1. Razorpay Account Setup**
- [ ] Razorpay account fully activated
- [ ] Business details verified
- [ ] Bank account linked and verified
- [ ] Live API keys generated
- [ ] Live Key ID starts with `rzp_live_`

---

## 🔧 Backend Configuration

### **2. Local Backend (.env file)**
- [ ] Open `.env` file in project root
- [ ] Update `RAZORPAY_KEY_ID=rzp_live_YOUR_KEY`
- [ ] Update `RAZORPAY_KEY_SECRET=YOUR_SECRET`
- [ ] Add `RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test backend locally: `npm start`
- [ ] Backend starts without errors

### **3. Render Backend (Production)**
- [ ] Login to Render Dashboard
- [ ] Select your backend service
- [ ] Go to **Environment** tab
- [ ] Update `RAZORPAY_KEY_ID=rzp_live_YOUR_KEY`
- [ ] Update `RAZORPAY_KEY_SECRET=YOUR_SECRET`
- [ ] Add `RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET`
- [ ] Click **Save Changes**
- [ ] Wait for automatic redeploy
- [ ] Check logs - no errors
- [ ] Test health endpoint: `/api/health`

---

## 🎨 Frontend Configuration

### **4. Local Frontend (frontend/.env)**
- [ ] Open `frontend/.env`
- [ ] Update `REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY`
- [ ] Update `REACT_APP_API_URL` if needed
- [ ] Test frontend locally: `npm start`
- [ ] Frontend starts without errors

### **5. Vercel Frontend (Production)**
- [ ] Login to Vercel Dashboard
- [ ] Select p2d-project-portal project
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Update `REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY`
- [ ] Verify `REACT_APP_API_URL` points to Render backend
- [ ] Click **Save**
- [ ] Go to **Deployments** tab
- [ ] Click **Redeploy** on latest deployment
- [ ] Wait for deployment to complete
- [ ] Visit live site - loads without errors

---

## 🔔 Webhook Configuration

### **6. Razorpay Webhook Setup**
- [ ] Login to Razorpay Dashboard
- [ ] Go to **Settings** → **Webhooks**
- [ ] Click **+ Add New Webhook**
- [ ] Enter webhook URL: `https://your-backend.onrender.com/api/payments/webhook`
- [ ] Select events:
  - [ ] `payment.authorized`
  - [ ] `payment.captured`
  - [ ] `payment.failed`
  - [ ] `order.paid`
- [ ] Generate webhook secret
- [ ] Copy webhook secret
- [ ] Add secret to backend environment variables
- [ ] Click **Create Webhook**
- [ ] Webhook status shows **Active**

---

## 🧪 Testing Phase

### **7. Test Payment (₹10)**
- [ ] Login to your app
- [ ] Upload a small test project (1-2 pages)
- [ ] Proceed to payment
- [ ] Amount shows correctly (₹10)
- [ ] Razorpay checkout opens
- [ ] Complete payment with UPI/Card
- [ ] Payment success message appears
- [ ] Redirected to success page

### **8. Verify Payment in Database**
- [ ] Login to Supabase Dashboard
- [ ] Open `payments` table
- [ ] Find your test payment
- [ ] Verify `payment_id` starts with `pay_`
- [ ] Verify `status` is `captured` or `paid`
- [ ] Verify `amount` matches

### **9. Verify Order Status**
- [ ] Open `projects` table in Supabase
- [ ] Find your test project
- [ ] Verify `payment_status` is `paid`
- [ ] Verify `status` updated (e.g., `accepted`)
- [ ] Check order appears in "Your Orders"

### **10. Verify in Razorpay Dashboard**
- [ ] Login to Razorpay Dashboard
- [ ] Go to **Transactions** → **Payments**
- [ ] Find your test payment
- [ ] Status shows **Captured**
- [ ] Amount matches
- [ ] Payment details are correct

---

## 🔍 Additional Tests

### **11. Test Payment Failure**
- [ ] Start a new payment
- [ ] Cancel payment midway
- [ ] Verify order status remains `pending`
- [ ] Verify no duplicate orders created
- [ ] Can retry payment successfully

### **12. Test Different Payment Methods**
- [ ] Test UPI payment - Success ✅
- [ ] Test Credit/Debit Card - Success ✅
- [ ] Test Net Banking - Success ✅

### **13. Test Order Tracking**
- [ ] Go to "Your Orders"
- [ ] Click on test order
- [ ] Order tracking page loads
- [ ] All details displayed correctly
- [ ] Delivery date calculated correctly

---

## 🔐 Security Verification

### **14. Security Checks**
- [ ] `.env` file is in `.gitignore`
- [ ] No keys committed to Git
- [ ] Live keys only in production
- [ ] Test keys removed from production
- [ ] Webhook secret is secure
- [ ] JWT secret is strong (32+ chars)
- [ ] HTTPS enabled on all endpoints

---

## 📊 Monitoring Setup

### **15. Setup Monitoring**
- [ ] Bookmark Razorpay Dashboard
- [ ] Bookmark Render Logs
- [ ] Bookmark Supabase Dashboard
- [ ] Setup email notifications (Razorpay)
- [ ] Test webhook delivery in Razorpay

---

## 📱 User Experience

### **16. Final User Testing**
- [ ] Login flow works smoothly
- [ ] Upload project works
- [ ] Customization options work
- [ ] Pricing calculation correct
- [ ] Payment flow is smooth
- [ ] Success page displays correctly
- [ ] Order confirmation received
- [ ] Order tracking accessible

---

## 💰 Settlement Verification

### **17. Settlement Setup**
- [ ] Verify bank account linked
- [ ] Check settlement cycle (T+3 days)
- [ ] Understand settlement process
- [ ] Know how to check settlements
- [ ] Bookmark Settlements page

---

## 📞 Support & Documentation

### **18. Documentation Ready**
- [ ] Read `RAZORPAY_LIVE_MODE_SETUP.md`
- [ ] Read `LIVE_MODE_ENV_VARIABLES.md`
- [ ] Bookmark Razorpay Docs
- [ ] Save Razorpay support contact
- [ ] Document your webhook URL
- [ ] Save backend health check URL

---

## 🚀 Go Live Decision

### **19. Final Go/No-Go**

**All items above completed?**
- [ ] YES - All ✅ → **GO LIVE!** 🎉
- [ ] NO - Fix pending items first

---

## ⚠️ Important Reminders

### **Before Going Live:**
1. **Test with small amounts first** (₹10-50)
2. **Monitor closely for first 24 hours**
3. **Check payments every few hours**
4. **Verify settlements after 3 days**
5. **Keep webhook active at all times**

### **After Going Live:**
1. **Monitor Razorpay Dashboard daily**
2. **Check failed payments and retry**
3. **Respond to customer payment issues quickly**
4. **Keep track of settlements**
5. **Update keys if compromised immediately**

---

## 🆘 Emergency Contacts

### **If Something Goes Wrong:**

**Razorpay Support:**
- Email: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com
- Docs: https://razorpay.com/docs

**Your Backend:**
- Health Check: `https://your-backend.onrender.com/api/health`
- Logs: Render Dashboard → Logs

**Quick Rollback:**
- Switch back to test keys
- Redeploy backend and frontend
- Fix issues
- Test again before going live

---

## ✅ Completion

**Date Completed:** _______________

**Completed By:** _______________

**First Live Payment:** _______________

**Status:** 
- [ ] All tests passed
- [ ] Ready for production
- [ ] Live payments enabled

---

## 🎉 Congratulations!

You're now accepting live payments! 

**Remember:**
- Monitor payments regularly
- Keep webhook active
- Check settlements
- Provide excellent customer support

**Good luck!** 💰🚀
