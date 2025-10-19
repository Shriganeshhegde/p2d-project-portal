# ⚠️ ngrok Manual Setup (Antivirus May Be Blocking)

## 🔍 Issue Detected

Your antivirus or Windows Defender may be blocking/deleting `ngrok.exe` because it's used for tunneling.

---

## ✅ Solution: Manual Setup with Antivirus Exception

### **Step 1: Add Antivirus Exception**

**Windows Defender:**
1. Open Windows Security
2. Go to: Virus & threat protection → Manage settings
3. Scroll to: Exclusions
4. Click: Add or remove exclusions
5. Click: Add an exclusion → Folder
6. Select: `C:\ngrok`

**Other Antivirus:**
- Add `C:\ngrok` folder to exclusions
- Or add `ngrok.exe` to trusted applications

---

### **Step 2: Extract ngrok Manually**

1. **Go to Downloads folder:**
   ```
   C:\Users\RAMACHANDRA S HEGDE\Downloads\
   ```

2. **Find file:**
   ```
   ngrok-v3-stable-windows-amd64.zip
   ```

3. **Right-click → Extract All**

4. **Extract to:**
   ```
   C:\ngrok\
   ```

5. **You should now have:**
   ```
   C:\ngrok\ngrok.exe
   ```

---

### **Step 3: Configure ngrok**

**Open PowerShell in C:\ngrok:**

1. Open File Explorer
2. Navigate to: `C:\ngrok`
3. Hold Shift + Right-click in folder
4. Click: "Open PowerShell window here"

**Run:**
```powershell
.\ngrok.exe config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
```

**Expected output:**
```
Authtoken saved to configuration file: C:\Users\...\ngrok.yml
```

---

### **Step 4: Test ngrok**

```powershell
.\ngrok.exe version
```

**Should show:**
```
ngrok version 3.x.x
```

---

## 🚀 Start Your App with ngrok

### **Terminal 1 - Backend:**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"
node server.js
```

### **Terminal 2 - Frontend:**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend"
npm start
```

### **Terminal 3 - ngrok for Frontend:**
```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

**Copy the HTTPS URL:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### **Terminal 4 - ngrok for Backend:**
```powershell
cd C:\ngrok
.\ngrok.exe http 5000
```

**Copy the HTTPS URL:**
```
Forwarding  https://xyz456.ngrok.io -> http://localhost:5000
```

---

## 📝 Update Configuration

### **Update frontend/.env:**

**File:** `student-project-portal\frontend\.env`

```env
REACT_APP_API_URL=https://xyz456.ngrok.io
```
*(Use YOUR backend ngrok URL)*

**Restart frontend** (Ctrl+C, then `npm start`)

---

## 🔗 Add to Razorpay

**Go to:** https://dashboard.razorpay.com/

**Settings → Website and App Details:**
```
Website URL: https://abc123.ngrok.io
```
*(YOUR frontend ngrok URL)*

**Settings → API Keys:**
- Copy Key ID
- Copy Key Secret

**Add to backend .env:**
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
ADMIN_KEY=admin_secure_key_123
```

**Restart backend** (Ctrl+C, then `node server.js`)

---

## 🧪 Test Payment

1. Access: `https://abc123.ngrok.io` (your ngrok URL)
2. Login/Signup
3. Upload project
4. Proceed to payment
5. Use test card:
   ```
   Card: 4111 1111 1111 1111
   CVV: 123
   Expiry: 12/25
   ```

---

## ⚠️ If ngrok.exe Still Gets Deleted

### **Option 1: Whitelist in Windows Defender**

**PowerShell (as Administrator):**
```powershell
Add-MpPreference -ExclusionPath "C:\ngrok"
```

### **Option 2: Use Different Location**

Extract to your user folder:
```
C:\Users\RAMACHANDRA S HEGDE\ngrok\
```

Then run from there:
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\ngrok"
.\ngrok.exe config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
.\ngrok.exe http 3000
```

### **Option 3: Use Alternative - localhost.run**

**No installation needed:**

```powershell
# For frontend
ssh -R 80:localhost:3000 localhost.run

# For backend (new terminal)
ssh -R 80:localhost:5000 localhost.run
```

You'll get HTTPS URLs automatically.

---

## 📋 Summary

1. **Add C:\ngrok to antivirus exclusions**
2. **Extract ngrok.exe to C:\ngrok**
3. **Configure with authtoken**
4. **Start backend and frontend**
5. **Start ngrok tunnels**
6. **Copy HTTPS URLs**
7. **Update frontend .env**
8. **Add to Razorpay**
9. **Test payment!**

---

## 🔒 Your Authtoken

```
34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
```

---

**Add antivirus exception first, then extract ngrok!** 🛡️✅
