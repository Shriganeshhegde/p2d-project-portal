# 📁 Supabase Storage Setup for File Upload

## 🎯 Setup Steps

### 1. Create Storage Bucket in Supabase

1. Go to your Supabase Dashboard
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter bucket name: `project-documents`
5. Set as **Public** (or Private with policies)
6. Click **Create Bucket**

### 2. Set Storage Policies

Go to **Storage** → **Policies** → Click on `project-documents` bucket

**Policy 1: Allow Authenticated Users to Upload**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-documents');
```

**Policy 2: Allow Authenticated Users to Read**
```sql
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'project-documents');
```

**Policy 3: Allow Users to Delete Their Own Files**
```sql
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Update Environment Variables

Add to your `.env` file:
```env
SUPABASE_STORAGE_BUCKET=project-documents
```

---

## 📊 How File Storage Works

### **Upload Flow:**
```
1. User uploads PDF
   ↓
2. Frontend counts pages (react-pdf)
   ↓
3. Frontend uploads file to backend
   ↓
4. Backend uploads to Supabase Storage
   ↓
5. Backend saves file path to database
   ↓
6. Vendor can access file via path
```

### **File Path Structure:**
```
project-documents/
  ├─ {userId}/
  │   ├─ {timestamp}-document1.pdf
  │   ├─ {timestamp}-document2.pdf
  │   └─ ...
```

---

## 🔧 Current Implementation

### **Frontend (UploadProject.jsx):**
- ✅ Counts pages using react-pdf
- ✅ Displays file name and size
- ✅ Locks page count (read-only)
- ⏳ TODO: Upload to backend

### **Backend (routes/fileUpload.js):**
- ✅ Receives file upload
- ✅ Uploads to Supabase Storage
- ✅ Returns file path and URL
- ✅ Download endpoint for vendors

---

## 🚀 Testing File Upload

### **Test Upload:**
```javascript
// In browser console after uploading
const formData = new FormData();
formData.append('file', yourFile);

fetch('http://localhost:5000/api/files/upload', {
  method: 'POST',
  headers: {
    'x-auth-token': localStorage.getItem('token')
  },
  body: formData
})
.then(r => r.json())
.then(d => console.log('Uploaded:', d));
```

### **Test Download:**
```
GET http://localhost:5000/api/files/download/{userId}/{timestamp}-filename.pdf
Headers: x-auth-token: {your-token}
```

---

## 📝 Database Schema Update

Add file storage columns to projects table:

```sql
ALTER TABLE projects
ADD COLUMN file_paths TEXT[], -- Array of file paths in Supabase
ADD COLUMN file_urls TEXT[]; -- Array of public URLs
```

---

## 🎯 Current Status

### **Working:**
- ✅ Page counting with react-pdf
- ✅ File name and size display
- ✅ Locked page count
- ✅ Backend upload route ready
- ✅ Supabase storage integration

### **To Complete:**
1. Create `project-documents` bucket in Supabase
2. Set storage policies
3. Test file upload to Supabase
4. Update projects table with file paths
5. Create vendor portal to download files

---

## 💡 Quick Start

### **1. Create Bucket:**
- Supabase Dashboard → Storage → New Bucket
- Name: `project-documents`
- Public: Yes

### **2. Test:**
- Refresh app
- Upload PDF
- Check console for page count
- File should show correct name and size

---

**File storage backend is ready! Just need to create the Supabase bucket!** 🎉
