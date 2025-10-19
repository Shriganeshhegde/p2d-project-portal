# Deployment Guide

This guide covers deploying the Student Project Portal to various platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

- Node.js 16+ installed
- Git installed
- Supabase account
- Razorpay account (for payments)
- Domain name (optional)

---

## Environment Setup

### 1. Production Environment Variables

Create `.env.production` file:

```env
# Server
NODE_ENV=production
PORT=5000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# JWT
JWT_SECRET=your_strong_production_secret_key_here
JWT_EXPIRE=30d

# Storage
SUPABASE_STORAGE_BUCKET=project-documents
MAX_FILE_UPLOAD=10000000

# Frontend URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

---

## Backend Deployment

### Option 1: Deploy to Heroku

#### 1. Install Heroku CLI

```bash
npm install -g heroku
```

#### 2. Login to Heroku

```bash
heroku login
```

#### 3. Create Heroku App

```bash
heroku create your-app-name
```

#### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# ... set all other environment variables
```

#### 5. Create Procfile

```bash
echo "web: node server.js" > Procfile
```

#### 6. Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 7. Open App

```bash
heroku open
```

---

### Option 2: Deploy to Railway

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. Login

```bash
railway login
```

#### 3. Initialize Project

```bash
railway init
```

#### 4. Add Environment Variables

Go to Railway dashboard and add all environment variables.

#### 5. Deploy

```bash
railway up
```

---

### Option 3: Deploy to Render

#### 1. Create account at render.com

#### 2. Create New Web Service

- Connect your GitHub repository
- Select branch: `main`
- Build Command: `npm install`
- Start Command: `node server.js`

#### 3. Add Environment Variables

Add all environment variables in Render dashboard.

#### 4. Deploy

Render will automatically deploy on git push.

---

### Option 4: Deploy to DigitalOcean/AWS/GCP

#### 1. Create Server Instance

- Ubuntu 20.04 or later
- At least 1GB RAM
- 25GB storage

#### 2. SSH into Server

```bash
ssh root@your-server-ip
```

#### 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 4. Install PM2

```bash
npm install -g pm2
```

#### 5. Clone Repository

```bash
git clone https://github.com/your-repo/student-project-portal.git
cd student-project-portal
```

#### 6. Install Dependencies

```bash
npm install --production
```

#### 7. Create .env File

```bash
nano .env
# Add all environment variables
```

#### 8. Start with PM2

```bash
pm2 start server.js --name student-portal
pm2 save
pm2 startup
```

#### 9. Setup Nginx (Optional)

```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/student-portal
```

Add configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/student-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 10. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Navigate to Frontend

```bash
cd frontend
```

#### 3. Deploy

```bash
vercel
```

#### 4. Set Environment Variables

```bash
vercel env add REACT_APP_API_URL
# Enter: https://your-backend-url.com/api
```

#### 5. Production Deploy

```bash
vercel --prod
```

---

### Option 2: Deploy to Netlify

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

#### 2. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 3. Deploy

```bash
netlify deploy --prod --dir=build
```

#### 4. Set Environment Variables

Go to Netlify dashboard > Site settings > Environment variables

---

### Option 3: Deploy with Backend (Static)

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

#### 2. Copy Build to Backend

```bash
cp -r build ../public
```

#### 3. Serve Static Files in Express

Update `server.js`:

```javascript
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

---

## Database Setup

### Supabase Production Setup

#### 1. Create Production Project

- Go to supabase.com
- Create new project
- Note down project URL and keys

#### 2. Run Migrations

Execute SQL schema from README.md in Supabase SQL Editor.

#### 3. Setup Storage

- Create `project-documents` bucket
- Set appropriate policies
- Enable public access if needed

#### 4. Setup Row Level Security (RLS)

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Add more policies as needed
```

---

## Post-Deployment

### 1. Health Check

Test the health endpoint:

```bash
curl https://your-backend-url.com/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Test Authentication

```bash
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "studentId": "TEST001",
    "college": "Test College"
  }'
```

### 3. Monitor Logs

#### Heroku:

```bash
heroku logs --tail
```

#### PM2:

```bash
pm2 logs student-portal
```

#### Railway:

Check logs in Railway dashboard

### 4. Setup Monitoring

#### Option A: Use PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Option B: Use External Service

- Sentry for error tracking
- LogRocket for session replay
- New Relic for performance monitoring

### 5. Setup Backups

#### Database Backups:

Supabase provides automatic backups. Configure in dashboard.

#### File Backups:

Setup automated backups for Supabase storage:

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
supabase db dump > backup_$DATE.sql
```

### 6. Configure CDN (Optional)

Use Cloudflare or AWS CloudFront for:
- Static asset caching
- DDoS protection
- SSL/TLS
- Global distribution

### 7. Setup CI/CD

#### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
```

---

## Performance Optimization

### 1. Enable Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Enable Caching

```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=31536000');
  next();
});
```

### 3. Optimize Images

Use image optimization service or CDN.

### 4. Enable HTTP/2

Configure in Nginx or use platform that supports it.

---

## Security Checklist

- [ ] All environment variables set correctly
- [ ] JWT secret is strong and unique
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Security headers configured
- [ ] File upload restrictions enforced
- [ ] Database backups configured
- [ ] Error logging setup
- [ ] Monitoring enabled

---

## Troubleshooting Deployment

### Build Fails

- Check Node.js version
- Clear node_modules and reinstall
- Check for syntax errors

### Environment Variables Not Loading

- Verify variable names match
- Restart application after changes
- Check platform-specific syntax

### Database Connection Fails

- Verify Supabase URL and keys
- Check network/firewall settings
- Verify database exists

### File Upload Fails

- Check storage bucket exists
- Verify storage policies
- Check file size limits

---

## Rollback Procedure

### Heroku:

```bash
heroku releases
heroku rollback v123
```

### PM2:

```bash
git checkout previous-commit
pm2 restart student-portal
```

### Vercel/Netlify:

Use dashboard to rollback to previous deployment.

---

## Support

For deployment issues:
- Check logs first
- Review troubleshooting guide
- Contact platform support
- Create GitHub issue

---

## Maintenance

### Regular Tasks:

- Update dependencies monthly
- Review logs weekly
- Check error rates daily
- Backup database weekly
- Monitor disk space
- Review security advisories

### Update Procedure:

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run tests
npm test

# Restart application
pm2 restart student-portal
```
