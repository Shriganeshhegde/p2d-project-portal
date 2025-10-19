# 🔒 HTTPS Setup for Local Development

## ⚠️ Razorpay Requirement

Razorpay requires HTTPS for security. For local development, you have 3 options:

---

## 🎯 Option 1: Use ngrok (Easiest - Recommended)

### **What is ngrok?**
Creates a secure HTTPS tunnel to your localhost.

### **Step 1: Install ngrok**

**Download:**
```
https://ngrok.com/download
```

**Or install via Chocolatey (Windows):**
```powershell
choco install ngrok
```

### **Step 2: Sign Up (Free)**
```
https://dashboard.ngrok.com/signup
```

### **Step 3: Get Auth Token**
1. Login to ngrok dashboard
2. Go to: https://dashboard.ngrok.com/get-started/your-authtoken
3. Copy your auth token

### **Step 4: Configure ngrok**
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### **Step 5: Start Your Servers**

**Terminal 1 - Backend:**
```bash
cd student-project-portal
node server.js
```
*Backend runs on port 5000*

**Terminal 2 - Frontend:**
```bash
cd student-project-portal/frontend
npm start
```
*Frontend runs on port 3000*

### **Step 6: Create HTTPS Tunnels**

**Terminal 3 - ngrok for Frontend:**
```bash
ngrok http 3000
```

**Terminal 4 - ngrok for Backend:**
```bash
ngrok http 5000
```

### **Step 7: Copy HTTPS URLs**

**You'll see output like:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copy these URLs:**
- Frontend: `https://abc123.ngrok.io`
- Backend: `https://xyz456.ngrok.io`

### **Step 8: Update Frontend .env**

**File:** `student-project-portal/frontend/.env`

```env
REACT_APP_API_URL=https://xyz456.ngrok.io
```

### **Step 9: Restart Frontend**
```bash
cd student-project-portal/frontend
npm start
```

### **Step 10: Use in Razorpay**

**Add to Razorpay Dashboard:**
```
Website URL: https://abc123.ngrok.io
Webhook URL: https://xyz456.ngrok.io/api/payments/webhook
```

---

## 🎯 Option 2: Use localhost.run (No Installation)

### **Step 1: Start Your Servers**
```bash
# Backend on port 5000
# Frontend on port 3000
```

### **Step 2: Create SSH Tunnel**

**For Frontend:**
```bash
ssh -R 80:localhost:3000 localhost.run
```

**For Backend:**
```bash
ssh -R 80:localhost:5000 localhost.run
```

**You'll get HTTPS URLs like:**
```
https://random-name.localhost.run
```

---

## 🎯 Option 3: Self-Signed SSL Certificate (Advanced)

### **Step 1: Generate SSL Certificate**

**Install mkcert:**
```powershell
choco install mkcert
```

**Generate certificate:**
```bash
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

### **Step 2: Configure Backend for HTTPS**

**Update `server.js`:**
```javascript
const https = require('https');
const fs = require('fs');

// SSL Certificate
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

// Create HTTPS server
https.createServer(options, app).listen(5000, () => {
  console.log('HTTPS Server running on https://localhost:5000');
});
```

### **Step 3: Configure Frontend for HTTPS**

**Create `.env` in frontend:**
```env
HTTPS=true
SSL_CRT_FILE=../localhost.pem
SSL_KEY_FILE=../localhost-key.pem
REACT_APP_API_URL=https://localhost:5000
```

### **Step 4: Start with HTTPS**
```bash
npm start
```

**Access at:**
```
https://localhost:3000
```

**⚠️ Note:** Self-signed certificates won't work with Razorpay. Use ngrok instead.

---

## ✅ Recommended Setup (Using ngrok)

### **Complete Setup:**

**1. Install ngrok:**
```
https://ngrok.com/download
```

**2. Configure ngrok:**
```bash
ngrok config add-authtoken YOUR_TOKEN
```

**3. Start Backend:**
```bash
cd student-project-portal
node server.js
```

**4. Start Frontend:**
```bash
cd student-project-portal/frontend
npm start
```

**5. Start ngrok for Frontend:**
```bash
ngrok http 3000
```
*Copy the HTTPS URL (e.g., https://abc123.ngrok.io)*

**6. Start ngrok for Backend:**
```bash
ngrok http 5000
```
*Copy the HTTPS URL (e.g., https://xyz456.ngrok.io)*

**7. Update Frontend .env:**
```env
REACT_APP_API_URL=https://xyz456.ngrok.io
```

**8. Restart Frontend:**
```bash
npm start
```

**9. Access Your App:**
```
https://abc123.ngrok.io
```

**10. Add to Razorpay:**
```
Website URL: https://abc123.ngrok.io
```

---

## 🎨 ngrok Pro Tips

### **Custom Subdomain (Paid):**
```bash
ngrok http 3000 --subdomain=p2d-app
```
*URL: https://p2d-app.ngrok.io*

### **Multiple Tunnels (One Command):**

**Create `ngrok.yml`:**
```yaml
tunnels:
  frontend:
    proto: http
    addr: 3000
  backend:
    proto: http
    addr: 5000
```

**Start all:**
```bash
ngrok start --all
```

### **View Requests:**
```
http://localhost:4040
```
*ngrok inspector - see all HTTP requests*

---

## 📊 Comparison

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **ngrok** | ✅ Easy<br>✅ Real HTTPS<br>✅ Works with Razorpay | ⚠️ URLs change on restart | Development |
| **localhost.run** | ✅ No install<br>✅ Free | ⚠️ Less reliable | Quick testing |
| **Self-signed** | ✅ Permanent URLs | ❌ Not trusted<br>❌ Won't work with Razorpay | Local only |

---

## 🚀 Quick Start Commands

### **Using ngrok (Recommended):**

```bash
# Terminal 1 - Backend
cd student-project-portal
node server.js

# Terminal 2 - Frontend  
cd student-project-portal/frontend
npm start

# Terminal 3 - ngrok Frontend
ngrok http 3000

# Terminal 4 - ngrok Backend
ngrok http 5000
```

**Then:**
1. Copy ngrok HTTPS URLs
2. Update frontend .env with backend URL
3. Add frontend URL to Razorpay
4. Test payment!

---

## 🔒 For Production

### **Use Real Domain with SSL:**

**1. Get Domain:**
```
yourdomain.com
```

**2. Deploy to Hosting:**
- Vercel (Frontend)
- Heroku/Railway (Backend)
- Or VPS with Nginx

**3. SSL Certificate:**
- Let's Encrypt (Free)
- Cloudflare (Free)
- Or hosting provider

**4. Update Razorpay:**
```
Website URL: https://yourdomain.com
Webhook URL: https://api.yourdomain.com/api/payments/webhook
```

---

## ⚠️ Important Notes

### **ngrok Free Tier:**
- URLs change on restart
- 40 connections/minute limit
- Good for development

### **ngrok Paid:**
- Custom subdomains
- Reserved domains
- Higher limits
- $8/month

### **Razorpay Requirements:**
- HTTPS mandatory
- Valid SSL certificate
- Public URL (not localhost)

---

## ✅ Verification Checklist

After setup:
- [ ] ngrok installed
- [ ] Auth token configured
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] ngrok tunnels active
- [ ] HTTPS URLs obtained
- [ ] Frontend .env updated
- [ ] Frontend restarted
- [ ] Can access via HTTPS
- [ ] Razorpay URL updated

---

## 📞 Help & Resources

**ngrok:**
- Website: https://ngrok.com/
- Docs: https://ngrok.com/docs
- Dashboard: https://dashboard.ngrok.com/

**Razorpay:**
- Requires HTTPS for security
- Test mode also needs HTTPS
- Use ngrok for local development

---

**Use ngrok to get HTTPS URLs for Razorpay integration!** 🔒✅
