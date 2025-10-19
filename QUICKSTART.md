# Quick Start Guide

Get the Student Project Portal up and running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Git installed
- Supabase account (free tier works)

---

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
cd student-project-portal

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Step 2: Setup Supabase (2 minutes)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created

### Get API Keys

1. Go to Project Settings > API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Create Database Tables

1. Go to SQL Editor in Supabase
2. Copy and run this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  student_id VARCHAR(100) UNIQUE NOT NULL,
  college VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  semester INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  department VARCHAR(255),
  semester INTEGER,
  status VARCHAR(50) DEFAULT 'submitted',
  payment_status VARCHAR(50) DEFAULT 'pending',
  submission_date TIMESTAMP DEFAULT NOW()
);

-- Project Documents table
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  path VARCHAR(1000) NOT NULL,
  size BIGINT,
  mime_type VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Create Storage Bucket

1. Go to Storage in Supabase
2. Click "New Bucket"
3. Name: `project-documents`
4. Make it Public
5. Click "Create bucket"

---

## Step 3: Configure Environment (1 minute)

Create `.env` file in root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase (replace with your values)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_random_secret_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Storage
SUPABASE_STORAGE_BUCKET=project-documents
MAX_FILE_UPLOAD=10000000

# Frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Razorpay (optional for now)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Run the Application

### Terminal 1 - Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ Connected to Supabase
```

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

Browser will open at `http://localhost:3000`

---

## Step 5: Test the Application

### Test Health Endpoint

Open browser: `http://localhost:5000/api/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Register a Test User

1. Open `http://localhost:3000`
2. Click "Register"
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Student ID: STU001
   - College: Test College
4. Click "Register"

### Test File Upload

1. Login with test user
2. Go to "Submit Project"
3. Upload a PDF file
4. Check if file appears in Supabase Storage

---

## Common Issues

### PowerShell Script Error

**Error:** `running scripts is disabled on this system`

**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt (cmd) instead.

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Fix:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Supabase Connection Error

**Fix:**
- Double-check URL and keys in `.env`
- Ensure tables are created
- Check internet connection

### Module Not Found

**Fix:**
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

---

## Next Steps

### 1. Explore Features

- **Document Upload**: Upload PDF, DOC, DOCX files
- **Document Scanner**: Use camera to scan documents
- **OCR**: Extract text from scanned images
- **Project Management**: View and manage projects

### 2. Customize

- Update branding in frontend
- Modify allowed file types
- Adjust file size limits
- Customize email templates

### 3. Setup Payments

1. Create Razorpay account
2. Get API keys
3. Update `.env` with keys
4. Test payment flow

### 4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

---

## Useful Commands

### Backend

```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
npm test           # Run tests
npm run lint       # Check code quality
```

### Frontend

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run lint       # Check code quality
```

---

## Project Structure

```
student-project-portal/
├── frontend/              # React frontend
│   ├── src/
│   │   └── components/   # React components
│   └── package.json
├── routes/               # API routes
│   ├── auth.js          # Authentication
│   ├── projects.js      # Project management
│   └── payments.js      # Payment processing
├── utils/               # Utility functions
│   ├── fileUpload.js   # File upload handler
│   ├── socket.js       # WebSocket setup
│   └── supabase.js     # Database connection
├── middleware/          # Express middleware
│   └── auth.js         # JWT authentication
├── tests/              # Test files
├── .env                # Environment variables
├── server.js           # Main server file
└── package.json        # Dependencies
```

---

## Getting Help

- **Documentation**: See [README.md](README.md)
- **API Docs**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Tips

1. **Use Chrome DevTools**: Press F12 to see console errors
2. **Check Backend Logs**: Look at terminal running backend
3. **Test API with Postman**: Import API collection
4. **Use React DevTools**: Install browser extension
5. **Enable Hot Reload**: Changes auto-refresh in dev mode

---

## What's Next?

✅ Application is running!

Now you can:
- [ ] Customize the UI
- [ ] Add more features
- [ ] Setup payment gateway
- [ ] Deploy to production
- [ ] Add email notifications
- [ ] Implement admin panel

Happy coding! 🚀
