# Troubleshooting Guide

## Common Issues and Solutions

### 1. PowerShell Execution Policy Error

**Error:**
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Solutions:**

#### Option A: Change Execution Policy (Recommended)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Option B: Use Command Prompt Instead
Use `cmd.exe` instead of PowerShell to run npm commands.

#### Option C: Bypass for Single Command
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

---

### 2. Dependencies Not Installed

**Error:**
```
Cannot find module 'express'
```

**Solution:**

Install backend dependencies:
```bash
cd student-project-portal
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
```

---

### 3. Supabase Connection Error

**Error:**
```
❌ Supabase connection error: Invalid API key
```

**Solution:**

1. Check your `.env` file has correct Supabase credentials
2. Get credentials from: Supabase Dashboard > Project Settings > API
3. Ensure you're using the correct project URL and keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

---

### 4. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

#### Windows:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Or change the port in `.env`:
```env
PORT=5001
```

---

### 5. CORS Error

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

1. Ensure backend is running on the correct port
2. Update `NEXT_PUBLIC_APP_URL` in `.env`:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Check CORS configuration in `server.js`

---

### 6. File Upload Fails

**Error:**
```
Error uploading file: File too large
```

**Solutions:**

1. **Check file size**: Maximum 10MB per file
2. **Check file type**: Only PDF, DOC, DOCX, JPG, PNG allowed
3. **Check Supabase storage**:
   - Bucket exists: `project-documents`
   - Bucket is public or has correct policies
   - Storage quota not exceeded

---

### 7. Camera Access Denied

**Error:**
```
Could not access the camera. Please check permissions.
```

**Solutions:**

1. **Use HTTPS**: Camera API requires secure context
   - Use `https://localhost:3000` or deploy to HTTPS server
2. **Check browser permissions**: Allow camera access in browser settings
3. **Check device**: Ensure camera is not being used by another application

---

### 8. JWT Token Invalid

**Error:**
```
Token is not valid
```

**Solutions:**

1. **Token expired**: Login again to get new token
2. **Wrong secret**: Ensure `JWT_SECRET` in `.env` matches
3. **Token format**: Ensure token is sent in header as `x-auth-token`

---

### 9. Database Table Not Found

**Error:**
```
relation "users" does not exist
```

**Solution:**

Run the SQL schema in Supabase SQL Editor (see README.md for schema):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  -- ... rest of schema
);
```

---

### 10. React Build Fails

**Error:**
```
Module not found: Can't resolve 'react-pdf'
```

**Solution:**

1. Clear node_modules and reinstall:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear cache:
   ```bash
   npm cache clean --force
   ```

---

### 11. Razorpay Payment Error

**Error:**
```
Razorpay key not found
```

**Solution:**

1. Get Razorpay API keys from: https://dashboard.razorpay.com/
2. Add to `.env`:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   ```
3. Restart server after updating `.env`

---

### 12. OCR Not Working

**Error:**
```
OCR Error: Failed to load language data
```

**Solutions:**

1. **Check internet connection**: Tesseract.js downloads language data
2. **Wait for initialization**: First OCR may take longer
3. **Clear browser cache**: Old cached data may be corrupted

---

### 13. Socket.IO Connection Failed

**Error:**
```
WebSocket connection failed
```

**Solutions:**

1. **Check backend is running**: Ensure server is started
2. **Check port**: Ensure Socket.IO is on same port as Express
3. **Check firewall**: Allow WebSocket connections

---

### 14. Environment Variables Not Loading

**Error:**
```
process.env.JWT_SECRET is undefined
```

**Solutions:**

1. **Check .env file location**: Must be in root directory
2. **Restart server**: Changes to `.env` require restart
3. **Check dotenv**: Ensure `require('dotenv').config()` is at top of `server.js`

---

### 15. Module Version Conflicts

**Error:**
```
npm ERR! peer dependency conflict
```

**Solutions:**

1. **Use --legacy-peer-deps**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Update npm**:
   ```bash
   npm install -g npm@latest
   ```

---

## Installation Issues

### Node Version Too Old

**Error:**
```
error: Unsupported engine
```

**Solution:**

Install Node.js >= 16.0.0 from https://nodejs.org/

Check version:
```bash
node --version
```

---

## Development Tips

### Hot Reload Not Working

**Solution:**

1. **Frontend**: Check if `react-scripts` is running
2. **Backend**: Ensure `nodemon` is installed and used:
   ```bash
   npm run dev
   ```

### Debugging Backend

Add debug logging:
```javascript
console.log('Debug:', variable);
```

Or use Node debugger:
```bash
node --inspect server.js
```

### Debugging Frontend

Use React DevTools browser extension

Check browser console for errors (F12)

---

## Performance Issues

### Slow File Upload

**Solutions:**

1. **Compress files**: Use smaller file sizes
2. **Check network**: Ensure stable internet connection
3. **Increase timeout**: Adjust axios timeout in frontend

### Slow OCR Processing

**Solutions:**

1. **Reduce image size**: Resize before OCR
2. **Use grayscale**: Convert to grayscale before processing
3. **Limit text area**: Crop to relevant document area

---

## Security Issues

### Exposed API Keys

**Solution:**

1. **Never commit `.env`**: Add to `.gitignore`
2. **Rotate keys**: If exposed, regenerate in Supabase/Razorpay
3. **Use environment variables**: Never hardcode keys

---

## Getting Help

If you encounter issues not listed here:

1. **Check logs**: Look at server console and browser console
2. **Search issues**: Check GitHub issues for similar problems
3. **Create issue**: Provide error message, steps to reproduce, and environment details
4. **Contact support**: Email admin@yourdomain.com

---

## Useful Commands

### Check if port is in use
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

### Clear npm cache
```bash
npm cache clean --force
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check npm version
```bash
npm --version
node --version
```

### View environment variables (Windows)
```powershell
Get-Content .env
```

### Test API endpoint
```bash
curl http://localhost:5000/api/health
```

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10, macOS 10.15, Ubuntu 20.04
- **Node.js**: 16.0.0 or higher
- **RAM**: 4GB
- **Storage**: 500MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Recommended Requirements
- **RAM**: 8GB or more
- **Storage**: 2GB free space
- **Internet**: Stable broadband connection
