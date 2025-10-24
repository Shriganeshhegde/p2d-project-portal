# 🧪 Testing Mode - ₹1 Pricing

## ✅ **Current Status: TESTING MODE ENABLED**

All orders will be charged **₹1 only** for testing purposes.

---

## 💰 **Pricing Breakdown:**

### **Testing Mode (ACTIVE):**
```
Printing Cost:       ₹0.50
Binding Cost:        ₹0.25
Transportation Cost: ₹0.25
─────────────────────────
TOTAL:              ₹1.00
```

### **Production Mode (DISABLED):**
```
Will be enabled after testing phase
Based on:
- Pages × Copies × ₹1.25 per page
- Binding charges
- Transportation charges
- Profit margin
```

---

## 🔧 **How to Switch Modes:**

### **File:** `frontend/src/pages/Payment.jsx`

**Line 75:**
```javascript
const TESTING_MODE = true;  // ← Change this
```

**To Enable Production Pricing:**
```javascript
const TESTING_MODE = false;  // Set to false
```

**To Keep Testing Pricing:**
```javascript
const TESTING_MODE = true;   // Keep as true
```

---

## 🧪 **Testing with ₹1:**

### **Benefits:**
- ✅ Easy to test payments
- ✅ Minimal Razorpay test charges
- ✅ Quick order creation
- ✅ Test file upload/download
- ✅ Test vendor workflow

### **Test Card:**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
Name: Any name
```

### **What Gets Charged:**
```
Order Total: ₹1.00
Razorpay Fee: ~₹0.02 (in test mode: ₹0)
Student Pays: ₹1.00
```

---

## 📊 **Payment Page Display:**

**Customer sees:**
```
┌─────────────────────────────────┐
│ Payment Summary                 │
├─────────────────────────────────┤
│ Printing Cost:        ₹0.50     │
│ Binding Cost:         ₹0.25     │
│ Transportation:       ₹0.25     │
├─────────────────────────────────┤
│ TOTAL AMOUNT:         ₹1.00     │
└─────────────────────────────────┘
```

**Regardless of:**
- Number of pages
- Number of copies
- Print type
- Binding type
- Paper type

**All orders = ₹1.00** 🎯

---

## 🚀 **When to Switch to Production:**

### **After Testing:**
1. ✅ File upload/download works
2. ✅ Payment flow works
3. ✅ Vendor dashboard works
4. ✅ Order tracking works
5. ✅ All features tested

### **Then:**
1. Set `TESTING_MODE = false`
2. Commit and push
3. Redeploy frontend
4. Announce to users
5. Monitor first few orders

---

## 💡 **Production Pricing Formula:**

```javascript
// When TESTING_MODE = false
basePrintingCost = pages × copies × ₹1.25
additionalMarkup = ₹25 × copies
profitMargin = baseCost × 35%
total = baseCost + markup + profit
```

**Example (50 pages, 2 copies):**
```
Base: 50 × 2 × ₹1.25 = ₹125
Markup: ₹25 × 2 = ₹50
Profit: ₹125 × 35% = ₹43.75
─────────────────────────
TOTAL: ₹218.75
```

---

## 🔍 **Verify Testing Mode:**

### **Check Payment Page:**
1. Upload a project
2. Go to payment page
3. Check total amount
4. Should show: **₹1.00**

### **Check Database:**
```sql
SELECT id, title, total_amount 
FROM payments 
ORDER BY created_at DESC 
LIMIT 5;
```
All should show: `total_amount = 1.00`

### **Check Razorpay:**
- Dashboard → Payments
- All test payments should be ₹1.00

---

## ⚠️ **Important Notes:**

### **1. Test Mode Only:**
- Use Razorpay **TEST** keys
- Not real money
- Can't withdraw

### **2. Before Going Live:**
- Switch to Razorpay **LIVE** keys
- Set `TESTING_MODE = false`
- Test with real small amount first
- Monitor closely

### **3. Database:**
- All test orders will have `total_amount = 1.00`
- This is expected
- Can filter/delete test orders later

---

## 📝 **Deployment Checklist:**

### **Testing Phase (Current):**
- [x] `TESTING_MODE = true`
- [x] Razorpay TEST keys
- [x] All orders = ₹1
- [x] File upload enabled
- [x] Vendor download enabled

### **Production Phase (Future):**
- [ ] `TESTING_MODE = false`
- [ ] Razorpay LIVE keys
- [ ] Real pricing enabled
- [ ] Test with small order first
- [ ] Monitor payments
- [ ] Customer support ready

---

## 🎯 **Quick Reference:**

| Mode | Price | Keys | Purpose |
|------|-------|------|---------|
| **Testing** | ₹1.00 | TEST | Development & Testing |
| **Production** | Calculated | LIVE | Real customers |

**Current Mode:** 🧪 **TESTING** (₹1.00)

---

## 🔄 **To Switch Back to Production:**

1. **Edit file:**
   ```
   frontend/src/pages/Payment.jsx
   Line 75: TESTING_MODE = false
   ```

2. **Commit:**
   ```bash
   git add frontend/src/pages/Payment.jsx
   git commit -m "enable-production-pricing"
   git push origin main
   ```

3. **Redeploy:**
   - Vercel auto-deploys
   - Wait 2-3 minutes
   - Test with one order

4. **Verify:**
   - Check payment amount
   - Should be calculated based on pages/copies
   - Not ₹1.00

---

## 📞 **Support:**

**If pricing shows wrong amount:**
1. Check `TESTING_MODE` value
2. Check browser cache (hard refresh: Ctrl+Shift+R)
3. Check deployment status
4. Verify correct branch deployed

**If stuck at ₹1 after disabling:**
1. Clear browser cache
2. Check Vercel deployment
3. Verify latest code deployed
4. Check console for errors

---

**Testing mode active! All orders will be ₹1.00 until you disable it.** 🧪

**Perfect for testing file upload/download without worrying about pricing!** 🎉
