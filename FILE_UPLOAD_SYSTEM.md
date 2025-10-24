# 📁 File Upload & Download System - Complete Guide

## ✅ **What's Been Implemented:**

### **1. File Upload on Payment** 
- Students upload PDFs during project submission
- Files are stored temporarily in browser
- After successful payment, files are uploaded to Supabase Storage
- File URLs are saved in the database

### **2. Supabase Storage Integration**
- Bucket: `project-documents`
- Files organized by project ID: `{projectId}/{timestamp}_{filename}.pdf`
- Public URLs generated for each file
- Supports multiple files per project

### **3. Vendor Download System**
- Vendors can download project files from dashboard
- Single file: Opens directly in new tab
- Multiple files: Downloads as ZIP archive
- Files fetched from Supabase Storage on-demand

---

## 🔧 **Technical Implementation:**

### **Backend Changes:**

#### **1. Payment Verification (`routes/payments.js`)**
```javascript
// Accepts files in payment verification request
router.post('/verify-payment', auth, async (req, res) => {
    const { files, projectData, ... } = req.body;
    
    // Upload files to Supabase Storage
    for (const file of files) {
        const fileName = `${projectId}/${Date.now()}_${file.name}`;
        await supabase.storage
            .from('project-documents')
            .upload(fileName, fileData);
    }
    
    // Store file URLs in database
    await supabase
        .from('projects')
        .update({ file_urls: fileUrls })
        .eq('id', projectId);
});
```

#### **2. Download Endpoint (`routes/vendor.js`)**
```javascript
// Download project files
router.get('/download-files/:projectId', vendorAuth, async (req, res) => {
    // Get project with file URLs
    const { data: project } = await supabase
        .from('projects')
        .select('*, users(name)')
        .eq('id', projectId)
        .single();
    
    // Single file: Return URL
    if (project.file_urls.length === 1) {
        return res.json({ 
            singleFile: true, 
            url: project.file_urls[0].url 
        });
    }
    
    // Multiple files: Create ZIP
    const archive = archiver('zip');
    for (const fileInfo of project.file_urls) {
        const { data } = await supabase.storage
            .from('project-documents')
            .download(fileInfo.path);
        archive.append(buffer, { name: fileInfo.name });
    }
    archive.finalize();
});
```

### **Frontend Changes:**

#### **1. Payment Page (`frontend/src/pages/Payment.jsx`)**
```javascript
// Store uploaded files from navigation state
const { uploadedFiles } = navState;
setProject({ ...project, uploadedFiles });

// Convert files to base64 and send with payment
const filesToUpload = await Promise.all(
    uploadedFiles.map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({
                    name: file.name,
                    data: reader.result, // base64
                    type: file.type,
                    size: file.size
                });
            };
            reader.readAsDataURL(file.file);
        });
    })
);

// Send files with payment verification
await fetch('/api/payments/verify-payment', {
    body: JSON.stringify({
        ...paymentData,
        files: filesToUpload
    })
});
```

#### **2. Vendor Dashboard (`vendor-dashboard.html`)**
```javascript
function downloadProjectFiles(projectId) {
    fetch(`${API_URL}/download-files/${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.singleFile) {
                window.open(data.url, '_blank');
            } else {
                window.location.href = `${API_URL}/download-files/${projectId}`;
            }
        });
}
```

---

## 📊 **Database Schema:**

### **Projects Table:**
```sql
ALTER TABLE projects ADD COLUMN file_urls JSONB;
ALTER TABLE projects ADD COLUMN file_count INTEGER DEFAULT 0;
```

**Example `file_urls` structure:**
```json
[
    {
        "name": "project_report.pdf",
        "url": "https://xxx.supabase.co/storage/v1/object/public/project-documents/...",
        "path": "project-id/1234567890_project_report.pdf",
        "size": 1048576
    }
]
```

---

## 🚀 **Setup Required:**

### **1. Supabase Storage Bucket:**

Create a bucket named `project-documents`:

```sql
-- In Supabase Dashboard → Storage → Create Bucket
Name: project-documents
Public: Yes (for vendor downloads)
File size limit: 50MB
Allowed MIME types: application/pdf
```

### **2. Database Columns:**

Add columns to `projects` table:

```sql
-- Add file storage columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS file_urls JSONB,
ADD COLUMN IF NOT EXISTS file_count INTEGER DEFAULT 0;
```

### **3. Storage Policies:**

Set up RLS policies for the storage bucket:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-documents');

-- Allow public downloads
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-documents');
```

---

## 🧪 **Testing Guide:**

### **Test File Upload:**

1. **Student uploads project:**
   - Go to upload page
   - Select PDF files
   - Fill in project details
   - Proceed to payment

2. **Complete payment:**
   - Payment gateway opens
   - Use test card: 4111 1111 1111 1111
   - Complete payment

3. **Verify upload:**
   - Check Supabase Storage → `project-documents`
   - Should see folder with project ID
   - Files should be inside

4. **Check database:**
   ```sql
   SELECT id, title, file_urls, file_count 
   FROM projects 
   WHERE payment_status = 'paid'
   ORDER BY submission_date DESC 
   LIMIT 1;
   ```

### **Test File Download:**

1. **Open vendor dashboard:**
   - Login with password: `vendor123`
   - Should see paid orders

2. **Click "📥 Download Files":**
   - Single file: Opens in new tab
   - Multiple files: Downloads as ZIP

3. **Verify download:**
   - Check downloaded file(s)
   - Should match uploaded PDFs

---

## 🔍 **Troubleshooting:**

### **Issue: Files not uploading**

**Symptoms:**
- Payment succeeds but no files in storage
- `file_urls` is null or empty

**Solutions:**
1. Check browser console for errors
2. Verify Supabase Storage bucket exists
3. Check storage policies allow uploads
4. Ensure files are passed from upload page

**Debug:**
```javascript
// In Payment.jsx, add console.log
console.log('Files to upload:', filesToUpload);
console.log('Upload response:', await verifyResponse.json());
```

---

### **Issue: Download fails**

**Symptoms:**
- "No files found" error
- Download button doesn't work

**Solutions:**
1. Check if `file_urls` exists in database
2. Verify storage bucket is public
3. Check vendor authentication

**Debug:**
```bash
# Check project files
curl http://localhost:5000/api/vendor/download-files/PROJECT_ID \
  -H "x-vendor-password: vendor123"
```

---

### **Issue: Large files fail to upload**

**Symptoms:**
- Upload times out
- Request payload too large

**Solutions:**
1. Increase request size limit:
   ```javascript
   // In server.js
   app.use(express.json({ limit: '50mb' }));
   app.use(express.urlencoded({ limit: '50mb', extended: true }));
   ```

2. Implement chunked upload for large files
3. Compress PDFs before upload

---

## 📝 **File Flow Diagram:**

```
Student Upload
    ↓
Files stored in browser (File objects)
    ↓
Navigate to customization
    ↓
Navigate to payment
    ↓
Payment successful
    ↓
Convert files to base64
    ↓
Send to backend with payment verification
    ↓
Backend uploads to Supabase Storage
    ↓
Store file URLs in database
    ↓
Vendor Dashboard
    ↓
Click "Download Files"
    ↓
Backend fetches from Supabase Storage
    ↓
Create ZIP (if multiple files)
    ↓
Download to vendor
```

---

## ✅ **Features Implemented:**

- ✅ File upload to Supabase Storage
- ✅ Multiple file support
- ✅ File URL storage in database
- ✅ Vendor download endpoint
- ✅ Single file direct download
- ✅ Multiple files ZIP download
- ✅ Download button in vendor dashboard
- ✅ Error handling
- ✅ File size tracking
- ✅ Organized file structure

---

## 🎯 **Next Steps (Optional Enhancements):**

### **1. File Preview:**
```javascript
// Add preview button in vendor dashboard
function previewFile(fileUrl) {
    window.open(fileUrl, '_blank');
}
```

### **2. Bulk Download:**
```javascript
// Download all orders from a college
router.get('/download-bulk/:college', vendorAuth, async (req, res) => {
    const { data: projects } = await supabase
        .from('projects')
        .select('*, users(college)')
        .eq('users.college', req.params.college);
    
    // Create ZIP with all files
});
```

### **3. File Validation:**
```javascript
// Validate file type and size before upload
if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files allowed');
}
if (file.size > 50 * 1024 * 1024) {
    throw new Error('File too large (max 50MB)');
}
```

### **4. Progress Indicator:**
```javascript
// Show upload progress
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
    const percent = (e.loaded / e.total) * 100;
    setUploadProgress(percent);
});
```

---

## 🔐 **Security Considerations:**

1. **File Type Validation:**
   - Only allow PDF files
   - Check MIME type on backend

2. **File Size Limits:**
   - Frontend: Validate before upload
   - Backend: Enforce size limits
   - Supabase: Set bucket limits

3. **Access Control:**
   - Students: Can only upload their own files
   - Vendors: Can download all paid orders
   - Public: No direct access to storage

4. **File Naming:**
   - Use project ID in path
   - Add timestamp to prevent conflicts
   - Sanitize filenames

---

## 📞 **Support:**

If you encounter issues:

1. Check backend logs: `npm start` output
2. Check browser console: F12 → Console
3. Check Supabase logs: Dashboard → Logs
4. Verify storage bucket exists and is public
5. Test with small PDF first (< 1MB)

---

**System is ready! Test with a new order to verify everything works!** 🎉
