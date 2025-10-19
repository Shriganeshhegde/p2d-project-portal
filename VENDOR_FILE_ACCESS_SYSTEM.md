# 📁 Vendor File Access System - Complete Guide

## 🎯 Overview

This system organizes all student uploads into separate folders for easy vendor access. Each student's files are stored in a dedicated folder with complete details.

---

## 📂 Folder Structure

### **Main Structure:**
```
uploads/
  ├─ RameshKumar_DayanandaSagarAcademy_proj123/
  │   ├─ STUDENT_DETAILS.json
  │   ├─ README.txt
  │   ├─ Project_Report.pdf
  │   └─ Internship_Certificate.jpg
  │
  ├─ PriyaSharma_RVCollege_proj124/
  │   ├─ STUDENT_DETAILS.json
  │   ├─ README.txt
  │   └─ Final_Year_Project.pdf
  │
  └─ ...
```

### **Folder Naming Convention:**
```
Format: StudentName_CollegeName_ProjectID

Example: RameshKumar_DayanandaSagarAcademy_proj123

Components:
- Student Name (cleaned, max 30 chars)
- College Name (cleaned, max 40 chars)
- Project ID (unique identifier)
```

---

## 📄 Files in Each Folder

### **1. STUDENT_DETAILS.json**
Complete student and project information in JSON format.

**Contains:**
```json
{
  "studentInfo": {
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "studentId": "1RV19CS001",
    "college": "Dayananda Sagar Academy",
    "department": "Computer Science",
    "semester": "8",
    "phone": "+91 9876543210"
  },
  "projectInfo": {
    "projectId": "proj123",
    "title": "AI Based Traffic Management",
    "description": "...",
    "subject": "Artificial Intelligence",
    "guide": "Dr. Sharma",
    "totalPages": 85,
    "submittedDate": "2025-10-10T10:30:00Z"
  },
  "printingDetails": {
    "copies": 3,
    "printType": "Color",
    "paperType": "Bond Paper",
    "bindingType": "Hard Binding",
    "bindingColor": "Royal Blue"
  },
  "additionalInfo": {
    "hasInternshipCertificate": true,
    "certificatePages": 2
  },
  "files": {
    "projectDocument": "Project_Report.pdf",
    "certificateDocument": "Internship_Certificate.jpg"
  },
  "pricing": {
    "totalAmount": 850,
    "paymentStatus": "paid"
  }
}
```

### **2. README.txt**
Human-readable version of student details.

**Example:**
```
╔════════════════════════════════════════════════════════════════╗
║                    STUDENT PROJECT DETAILS                     ║
╚════════════════════════════════════════════════════════════════╝

STUDENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:           Ramesh Kumar
Email:          ramesh@example.com
Student ID:     1RV19CS001
College:        Dayananda Sagar Academy
Department:     Computer Science
Semester:       8
Phone:          +91 9876543210

PROJECT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project ID:     proj123
Title:          AI Based Traffic Management
Total Pages:    85
Submitted:      10/10/2025, 10:30:00 AM

PRINTING SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Copies:         3
Print Type:     Color Print
Paper Type:     Bond Paper
Binding:        Hard Binding
Binding Color:  Royal Blue

ADDITIONAL ITEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Internship Certificate: YES
Certificate Pages:      2

FILES IN THIS FOLDER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project Document:       Project_Report.pdf
Certificate Document:   Internship_Certificate.jpg

PAYMENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount:   ₹850
Payment Status: paid
```

### **3. Project Documents**
- PDF files (project reports)
- JPG/PNG files (certificates, scanned documents)
- Original filenames preserved

---

## 🔌 Vendor API Endpoints

### **Base URL:** `http://localhost:5000/api/vendor`

### **Authentication:**
All endpoints require vendor password in header:
```
x-vendor-password: vendor123
```

---

### **1. Get All Submissions**
```
GET /api/vendor/submissions
```

**Response:**
```json
{
  "totalSubmissions": 25,
  "submissions": [
    {
      "folderName": "RameshKumar_DayanandaSagar_proj123",
      "studentName": "Ramesh Kumar",
      "college": "Dayananda Sagar Academy",
      "projectTitle": "AI Traffic Management",
      "submittedDate": "2025-10-10T10:30:00Z",
      "totalPages": 85,
      "copies": 3,
      "paymentStatus": "paid",
      "fileCount": 3
    },
    ...
  ]
}
```

---

### **2. Get Specific Submission Details**
```
GET /api/vendor/submission/:folderName
```

**Example:**
```
GET /api/vendor/submission/RameshKumar_DayanandaSagar_proj123
```

**Response:**
```json
{
  "folderName": "RameshKumar_DayanandaSagar_proj123",
  "folderPath": "/path/to/uploads/...",
  "files": [
    {
      "name": "STUDENT_DETAILS.json",
      "size": 1024,
      "modified": "2025-10-10T10:30:00Z"
    },
    {
      "name": "Project_Report.pdf",
      "size": 2048576,
      "modified": "2025-10-10T10:30:00Z"
    }
  ],
  "studentDetails": { ... }
}
```

---

### **3. Download Single File**
```
GET /api/vendor/download/:folderName/:fileName
```

**Example:**
```
GET /api/vendor/download/RameshKumar_DayanandaSagar_proj123/Project_Report.pdf
```

Downloads the specific file.

---

### **4. Download Entire Folder (ZIP)**
```
GET /api/vendor/download-folder/:folderName
```

**Example:**
```
GET /api/vendor/download-folder/RameshKumar_DayanandaSagar_proj123
```

Downloads entire folder as ZIP file.

---

### **5. Get Pending Orders**
```
GET /api/vendor/pending-orders
```

**Response:**
```json
{
  "totalPending": 10,
  "orders": [
    {
      "id": "proj123",
      "title": "AI Traffic Management",
      "status": "pending",
      "payment_status": "paid",
      "users": {
        "name": "Ramesh Kumar",
        "email": "ramesh@example.com",
        "college": "Dayananda Sagar Academy"
      }
    },
    ...
  ]
}
```

---

### **6. Update Project Status**
```
PUT /api/vendor/update-status/:projectId
```

**Body:**
```json
{
  "status": "completed",
  "notes": "Printed and bound successfully"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project status updated",
  "project": { ... }
}
```

---

### **7. Get Vendor Statistics**
```
GET /api/vendor/stats
```

**Response:**
```json
{
  "total": 50,
  "pending": 10,
  "inProgress": 15,
  "completed": 25,
  "paid": 40,
  "unpaid": 10,
  "totalRevenue": 42500
}
```

---

## 🖥️ How Vendors Access Files

### **Method 1: Direct Folder Access**
1. Navigate to `uploads/` folder on server
2. Each student has their own folder
3. Open folder to see all files
4. Read `README.txt` for details
5. Print/bind documents as specified

### **Method 2: API Access**
1. Use vendor API endpoints
2. Get list of all submissions
3. Download specific files or entire folders
4. Update status when completed

### **Method 3: Web Interface (Future)**
- Vendor dashboard
- Browse submissions
- Filter by college/date/status
- Download files
- Mark as completed

---

## 🔒 Security

### **Current:**
- Simple password authentication
- Header-based auth: `x-vendor-password`
- Default password: `vendor123`

### **Recommended for Production:**
- JWT token authentication
- Vendor user accounts
- Role-based access control
- API rate limiting
- Audit logging

---

## 📊 Vendor Workflow

### **Step 1: Check New Submissions**
```bash
GET /api/vendor/submissions
```

### **Step 2: Download Files**
```bash
GET /api/vendor/download-folder/StudentName_College_ID
```

### **Step 3: Print & Bind**
- Read specifications from README.txt
- Print required copies
- Bind with specified color
- Include certificates if any

### **Step 4: Mark as Completed**
```bash
PUT /api/vendor/update-status/proj123
{
  "status": "completed",
  "notes": "Ready for pickup"
}
```

---

## 🛠️ Setup Instructions

### **1. Install Dependencies**
```bash
npm install archiver
```

### **2. Set Vendor Password**
Add to `.env`:
```
VENDOR_PASSWORD=your_secure_password
```

### **3. Create Uploads Directory**
```bash
mkdir uploads
```

### **4. Test API**
```bash
# Get all submissions
curl -H "x-vendor-password: vendor123" \
  http://localhost:5000/api/vendor/submissions

# Download folder
curl -H "x-vendor-password: vendor123" \
  http://localhost:5000/api/vendor/download-folder/StudentName_College_ID \
  -o student_files.zip
```

---

## 📝 Example Use Cases

### **Use Case 1: Daily Batch Processing**
1. Vendor logs in at end of day
2. Gets all new submissions (paid status)
3. Downloads all folders as ZIP
4. Prints overnight
5. Marks as completed next morning

### **Use Case 2: Individual Order**
1. Student pays for project
2. Vendor gets notification
3. Downloads specific student folder
4. Prints immediately
5. Updates status

### **Use Case 3: Bulk College Order**
1. College deadline passes
2. Multiple students submitted
3. Vendor filters by college name
4. Downloads all college submissions
5. Batch processes all projects

---

## 🎯 Benefits

### **For Vendors:**
- ✅ Organized file structure
- ✅ All details in one place
- ✅ Easy to find student files
- ✅ Clear printing specifications
- ✅ Batch download capability

### **For Students:**
- ✅ Professional file organization
- ✅ Complete information preserved
- ✅ Easy tracking
- ✅ No file mix-ups

### **For System:**
- ✅ Scalable structure
- ✅ Easy backup
- ✅ Clear audit trail
- ✅ Automated organization

---

## 🚀 Future Enhancements

1. **Vendor Web Dashboard**
   - Login interface
   - Browse submissions
   - Download files
   - Update status

2. **Notifications**
   - Email on new submission
   - SMS for urgent orders
   - WhatsApp integration

3. **Analytics**
   - Revenue reports
   - College-wise statistics
   - Peak time analysis

4. **Mobile App**
   - Vendor mobile access
   - Scan QR codes
   - Update status on-the-go

---

**Vendor file access system is ready! All student files are organized in separate folders with complete details!** 📁✅
