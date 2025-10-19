# 📥 Install ngrok - Step by Step

## 🎯 Method 1: Direct Download (Easiest)

### **Step 1: Download ngrok**

**Go to:**
```
https://ngrok.com/download
```

**Click:** "Download for Windows"

### **Step 2: Extract the ZIP**

1. Open Downloads folder
2. Find `ngrok-v3-stable-windows-amd64.zip`
3. Right-click → Extract All
4. Choose location: `C:\ngrok\`

### **Step 3: Add to PATH**

**Option A: Add to System PATH (Recommended)**

1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New"
7. Add: `C:\ngrok`
8. Click "OK" on all windows
9. **Restart PowerShell/Terminal**

**Option B: Use Full Path**

Instead of `ngrok`, use:
```powershell
C:\ngrok\ngrok.exe config add-authtoken YOUR_TOKEN
```

### **Step 4: Verify Installation**

**Open NEW PowerShell window and run:**
```powershell
ngrok version
```

**Should show:**
```
ngrok version 3.x.x
```

### **Step 5: Add Auth Token**

```powershell
ngrok config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
```

---

## 🎯 Method 2: Using Chocolatey

### **Step 1: Install Chocolatey (if not installed)**

**Open PowerShell as Administrator:**

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### **Step 2: Install ngrok**

```powershell
choco install ngrok
```

### **Step 3: Add Auth Token**

```powershell
ngrok config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
```

---

## 🎯 Method 3: Using Scoop

### **Step 1: Install Scoop (if not installed)**

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### **Step 2: Install ngrok**

```powershell
scoop install ngrok
```

### **Step 3: Add Auth Token**

```powershell
ngrok config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
```

---

## ✅ Quick Install (Recommended)

### **Download & Extract Manually:**

1. **Download:** https://ngrok.com/download
2. **Extract to:** `C:\ngrok\`
3. **Open PowerShell in that folder:**
   ```powershell
   cd C:\ngrok
   ```
4. **Add token:**
   ```powershell
   .\ngrok.exe config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
   ```
5. **Start tunnel:**
   ```powershell
   .\ngrok.exe http 3000
   ```

---

## 🧪 Test ngrok

### **After installation:**

**Terminal 1 - Start Backend:**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal"
node server.js
```

**Terminal 2 - Start Frontend:**
```powershell
cd "C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend"
npm start
```

**Terminal 3 - ngrok for Frontend:**
```powershell
ngrok http 3000
```

**You should see:**
```
Session Status                online
Account                       Your Account
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Copy the HTTPS URL:** `https://abc123.ngrok.io`

---

## 📋 After Installation

### **1. Configure Auth Token:**
```powershell
ngrok config add-authtoken 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7
```

### **2. Start Tunnels:**

**Frontend (port 3000):**
```powershell
ngrok http 3000
```

**Backend (port 5000) - New terminal:**
```powershell
ngrok http 5000
```

### **3. Copy HTTPS URLs:**
- Frontend: `https://abc123.ngrok.io`
- Backend: `https://xyz456.ngrok.io`

### **4. Update Frontend .env:**
```env
REACT_APP_API_URL=https://xyz456.ngrok.io
```

### **5. Add to Razorpay:**
```
Website URL: https://abc123.ngrok.io
```

---

## 🔧 Troubleshooting

### **"ngrok not found" after installation:**
- Restart PowerShell/Terminal
- Check PATH was added correctly
- Try using full path: `C:\ngrok\ngrok.exe`

### **"Permission denied":**
- Run PowerShell as Administrator
- Check antivirus isn't blocking

### **"Auth token invalid":**
- Copy token carefully (no spaces)
- Get new token from dashboard

---

## 📞 Quick Reference

**Download:** https://ngrok.com/download

**Dashboard:** https://dashboard.ngrok.com/

**Your Token:** 34CX65kCtKX1VDIO1Vcb2YCCiOj_5yVxY6BLkc9uokyJ1n3N7

**Commands:**
```powershell
# Configure
ngrok config add-authtoken YOUR_TOKEN

# Start tunnel
ngrok http 3000

# Check version
ngrok version
```

---

**Download ngrok first, then configure!** 📥✅
