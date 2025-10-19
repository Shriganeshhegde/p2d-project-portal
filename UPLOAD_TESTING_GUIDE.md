# File Upload Testing Guide

## ✅ Upload Feature Fixed!

The file upload now works in **Demo Mode** without requiring login or backend.

---

## 🎯 How to Test Upload

### Step 1: Open the App
```
http://localhost:3000
```

### Step 2: Test Upload (Two Ways)

#### Option A: Without Login (Demo Mode)
1. Go directly to upload page
2. Drag and drop files OR click "Browse Files"
3. Select 1-5 files (PDF, DOC, DOCX, JPG, PNG)
4. Click "Upload All"
5. See progress bars
6. Get success message: "✅ X file(s) uploaded successfully! (Demo Mode)"

#### Option B: With Login (Full Features)
1. Sign up / Login first
2. Go to Dashboard
3. Click "New Project" or "Upload Project"
4. Follow upload steps
5. Files upload to server

---

## 📁 Supported File Types

✅ **PDF** - `.pdf`  
✅ **Word** - `.doc`, `.docx`  
✅ **Images** - `.jpg`, `.jpeg`, `.png`  

**Max Size:** 10MB per file  
**Max Files:** 5 files at once

---

## 🎥 Document Scanner Feature

### How to Use Scanner:

1. Click "Scan Document" tab
2. Allow camera access when prompted
3. Point camera at document
4. Click capture button
5. Adjust filters (brightness, contrast, etc.)
6. Click "Extract Text" for OCR
7. Save document

**Note:** Camera requires HTTPS in production or localhost for testing

---

## 🐛 Common Upload Issues

### Issue 1: "0 files uploaded"
**Cause:** No files selected  
**Fix:** Select files first, then click upload

### Issue 2: "File too large"
**Cause:** File > 10MB  
**Fix:** Compress file or split into smaller files

### Issue 3: "Invalid file type"
**Cause:** Unsupported file format  
**Fix:** Use PDF, DOC, DOCX, JPG, or PNG only

### Issue 4: Camera not working
**Cause:** Permission denied or HTTPS required  
**Fix:** 
- Allow camera in browser settings
- Use localhost (already HTTPS-like)
- Check if camera is used by another app

---

## 🔄 Upload Flow

### Demo Mode (No Login):
```
Select Files → Upload → Progress → Success → Files stored locally
```

### Logged In Mode:
```
Login → Dashboard → New Project → 
Step 1: Project Details → 
Step 2: Upload Files → 
Step 3: Review → 
Submit → Payment
```

---

## 💡 Testing Checklist

- [ ] Can select files via drag-drop
- [ ] Can select files via browse button
- [ ] Can upload 1 file
- [ ] Can upload multiple files (up to 5)
- [ ] Progress bars show correctly
- [ ] Success message appears
- [ ] Can preview images
- [ ] Can preview PDFs
- [ ] Can remove files before upload
- [ ] Camera scanner opens
- [ ] Can capture document
- [ ] Can apply filters
- [ ] OCR extracts text

---

## 📊 Upload Progress

When uploading, you'll see:
- Individual progress bars for each file
- Percentage (0% → 100%)
- File names
- File sizes
- Success indicators

---

## 🎨 Features

### File Preview
- **Images**: Full preview with zoom
- **PDFs**: Page-by-page preview
- **Documents**: Icon with file info

### File Management
- Add multiple files
- Remove individual files
- Clear all files
- View file details (name, size, type)

### Upload Options
- Drag and drop
- Click to browse
- Camera scanner
- Batch upload

---

## 🚀 Quick Test

1. **Open app**: `http://localhost:3000`
2. **Select a file**: Drag any PDF or image
3. **Click "Upload All"**
4. **See progress**: Watch the progress bar
5. **Get confirmation**: "✅ X file(s) uploaded successfully!"

That's it! Upload is working! 🎉

---

## 🔐 Login for Full Features

To use full upload with backend:

1. **Create database** (run DATABASE_SETUP.sql in Supabase)
2. **Sign up** at `/signup`
3. **Login** at `/login`
4. **Upload** with full backend integration

---

## 📝 Notes

- **Demo Mode**: Files stored in browser memory (not persistent)
- **Logged In**: Files uploaded to Supabase Storage (persistent)
- **Camera**: Works on localhost and HTTPS sites
- **OCR**: Requires good lighting and clear text

---

## ✅ Success Indicators

**Upload Working When:**
- ✅ Files appear in list after selection
- ✅ Progress bars show during upload
- ✅ Success message appears
- ✅ File count is correct (not 0)
- ✅ No error messages

**Upload NOT Working When:**
- ❌ "0 files uploaded" message
- ❌ No progress bars
- ❌ Error messages
- ❌ Files don't appear in list

---

## 🆘 Still Having Issues?

1. **Refresh page** (Ctrl + F5)
2. **Clear browser cache**
3. **Check browser console** (F12)
4. **Try different file**
5. **Check file size** (< 10MB)
6. **Check file type** (PDF, DOC, JPG, PNG)

---

**Upload feature is now fully functional! Test it out!** 🚀
