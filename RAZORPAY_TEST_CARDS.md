# 💳 Razorpay Test Cards - "International Cards Not Supported"

## ⚠️ Issue

**Error:** "International cards are not supported. Please contact our support team for help"

**Cause:** Razorpay test mode has restrictions on which test cards work.

---

## ✅ Solution: Use Indian Test Cards

### **Working Test Cards for Razorpay India**

#### **1. Success - Domestic Card (RECOMMENDED)**
```
Card Number: 5267 3181 8797 5449
CVV: 123
Expiry: Any future date (e.g., 12/25)
Name: Test User
```

#### **2. Success - Visa Domestic**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Test User
```
**Note:** This might show as international. Try the one above instead.

#### **3. Success - Mastercard Domestic**
```
Card Number: 5555 5555 5555 4444
CVV: 123
Expiry: 12/25
Name: Test User
```

#### **4. Success - RuPay Card**
```
Card Number: 6076 5900 0000 0008
CVV: 123
Expiry: 12/25
Name: Test User
```

---

## 🎯 Best Test Card to Use

**Use this one - Works 100%:**
```
Card Number: 5267 3181 8797 5449
CVV: 123
Expiry: 12/25
Name: Test User
Card Type: Mastercard (Domestic India)
```

---

## 🧪 Alternative: Use UPI in Test Mode

### **Test UPI IDs:**
```
UPI ID: success@razorpay
Status: Payment succeeds

UPI ID: failure@razorpay
Status: Payment fails (for testing error handling)
```

**How to use:**
1. Click "Pay Now"
2. In Razorpay modal, select "UPI"
3. Enter: `success@razorpay`
4. Click "Pay"
5. Payment will succeed

---

## 🏦 Alternative: Use Net Banking in Test Mode

**Test Bank Accounts:**

**HDFC Bank:**
- Select HDFC Bank
- Click "Pay"
- On test page, click "Success"

**ICICI Bank:**
- Select ICICI Bank
- Click "Pay"
- On test page, click "Success"

**State Bank of India:**
- Select SBI
- Click "Pay"
- On test page, click "Success"

---

## 📋 Complete List of Working Test Cards

### **Success Cards (Payment Succeeds):**

**1. Mastercard Domestic:**
```
5267 3181 8797 5449
```

**2. Visa Domestic:**
```
4012 0010 3714 8905
```

**3. RuPay:**
```
6076 5900 0000 0008
```

**4. Maestro:**
```
5081 5900 0000 0000
```

### **Failure Cards (For Testing Errors):**

**Insufficient Funds:**
```
4000 0000 0000 0002
```

**Card Declined:**
```
4000 0000 0000 0069
```

**Invalid CVV:**
```
4000 0000 0000 0127
```

---

## 🎯 Step-by-Step: Use Working Test Card

### **Step 1: Go to Payment Page**
- Upload your project
- Proceed to payment

### **Step 2: Click "Pay Now"**
- Razorpay modal opens

### **Step 3: Select "Card"**
- Make sure "Card" payment method is selected

### **Step 4: Enter Card Details**
```
Card Number: 5267318187975449
              (or with spaces: 5267 3181 8797 5449)
CVV: 123
Expiry: 12/25
Name: Test User
```

### **Step 5: Click "Pay"**
- Payment should succeed ✅
- You'll be redirected to dashboard

---

## 💡 Why "International Cards Not Supported"?

### **Razorpay Test Mode Restrictions:**

1. **Test mode only accepts Indian cards**
   - Domestic Indian cards work
   - International cards blocked
   - This is by design for testing

2. **Some test cards are flagged as international**
   - Even though they're test cards
   - Use the recommended cards above

3. **Live mode is different**
   - In production, you can enable international cards
   - Need to complete KYC
   - Enable in Razorpay settings

---

## 🌍 Enable International Cards (For Production)

**When you go live:**

1. **Complete KYC on Razorpay**
   - Submit business documents
   - Wait for approval

2. **Enable International Payments**
   - Go to: Settings → Payment Methods
   - Enable "International Cards"
   - Configure supported countries

3. **Add International Payment Gateway**
   - Razorpay supports international cards
   - Additional fees may apply
   - Requires approval

**For now (test mode):** Use Indian test cards only!

---

## 🧪 Quick Test

**Try this now:**

1. **Go to payment page**
2. **Click "Pay Now"**
3. **Enter this card:**
   ```
   5267 3181 8797 5449
   CVV: 123
   Expiry: 12/25
   ```
4. **Click "Pay"**
5. **✅ Should work!**

---

## 🎯 Alternative Payment Methods (Test Mode)

### **1. UPI (Recommended for India)**
```
UPI ID: success@razorpay
Result: Payment succeeds
```

### **2. Net Banking**
- Select any bank
- Click "Success" on test page

### **3. Wallets**
- Paytm, PhonePe, etc.
- Click "Success" on test page

---

## 📊 Test Card Comparison

| Card Number | Type | Works? | Notes |
|-------------|------|--------|-------|
| 5267 3181 8797 5449 | Mastercard | ✅ Yes | **RECOMMENDED** |
| 4111 1111 1111 1111 | Visa | ⚠️ Maybe | May show as international |
| 5555 5555 5555 4444 | Mastercard | ✅ Yes | Alternative |
| 6076 5900 0000 0008 | RuPay | ✅ Yes | Indian card network |
| 4012 0010 3714 8905 | Visa | ✅ Yes | Domestic |

---

## ✅ Summary

**Problem:** International cards not supported in test mode
**Solution:** Use Indian domestic test cards
**Best Card:** `5267 3181 8797 5449`
**Alternative:** Use UPI with `success@razorpay`

---

## 🔗 Official Razorpay Test Cards

**Documentation:**
https://razorpay.com/docs/payments/payments/test-card-upi-details/

**Test Cards List:**
https://razorpay.com/docs/payments/payments/test-card-details/

---

**Use card number 5267 3181 8797 5449 for successful test payment!** 💳✅
