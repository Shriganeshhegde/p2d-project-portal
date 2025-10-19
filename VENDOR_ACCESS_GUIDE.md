# 🔑 Vendor Access Guide

## 🎯 Quick Access Methods

### **Method 1: Using Browser (Easiest)**

**Step 1: Install REST Client Extension**
- Install "REST Client" or "Thunder Client" in VS Code
- Or use Postman

**Step 2: Test API Endpoints**

Open browser or REST client and try these URLs:

---

### **Method 2: Using PowerShell/CMD**

**Get All Submissions:**
```powershell
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/submissions
```

**Get Statistics:**
```powershell
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/stats
```

**Get Pending Orders:**
```powershell
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/pending-orders
```

**Download Student Folder:**
```powershell
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/download-folder/StudentName_College_ID -o student_files.zip
```

---

### **Method 3: Direct Folder Access (Simplest)**

**Navigate to uploads folder:**
```
C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\uploads\
```

**Each student has a folder:**
```
uploads/
  ├─ RameshKumar_DayanandaSagar_proj123/
  │   ├─ README.txt          ← Open this for details
  │   ├─ STUDENT_DETAILS.json
  │   ├─ Project_Report.pdf
  │   └─ Certificate.jpg
```

**Just open README.txt to see all details!**

---

## 📋 API Endpoints Reference

### **Base URL:** `http://localhost:5000/api/vendor`
### **Authentication:** Header `x-vendor-password: vendor123`

---

### **1. Get All Submissions**
```
GET /api/vendor/submissions
```

**Example:**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/submissions
```

**Response:**
```json
{
  "totalSubmissions": 5,
  "submissions": [
    {
      "folderName": "RameshKumar_DayanandaSagar_proj123",
      "studentName": "Ramesh Kumar",
      "college": "Dayananda Sagar Academy",
      "projectTitle": "AI Traffic Management",
      "totalPages": 85,
      "copies": 3,
      "paymentStatus": "paid"
    }
  ]
}
```

---

### **2. Get Vendor Statistics**
```
GET /api/vendor/stats
```

**Example:**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/stats
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

### **3. Get Pending Orders**
```
GET /api/vendor/pending-orders
```

**Example:**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/pending-orders
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
        "college": "Dayananda Sagar Academy",
        "phone": "+91 9876543210"
      }
    }
  ]
}
```

---

### **4. Get Specific Student Folder**
```
GET /api/vendor/submission/:folderName
```

**Example:**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/submission/RameshKumar_DayanandaSagar_proj123
```

---

### **5. Download Single File**
```
GET /api/vendor/download/:folderName/:fileName
```

**Example:**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/download/RameshKumar_DayanandaSagar_proj123/Project_Report.pdf -o project.pdf
```

---

### **6. Download Entire Folder as ZIP**
```
GET /api/vendor/download-folder/:folderName
```

**Example:**
```bash
curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/download-folder/RameshKumar_DayanandaSagar_proj123 -o student_files.zip
```

---

### **7. Update Project Status**
```
PUT /api/vendor/update-status/:projectId
```

**Example:**
```bash
curl -X PUT -H "x-vendor-password: vendor123" -H "Content-Type: application/json" -d "{\"status\":\"completed\",\"notes\":\"Printed and bound\"}" http://localhost:5000/api/vendor/update-status/proj123
```

---

## 🖥️ Using Postman

### **Setup:**
1. Open Postman
2. Create new request
3. Add header: `x-vendor-password: vendor123`
4. Set URL: `http://localhost:5000/api/vendor/submissions`
5. Click Send

### **Save as Collection:**
1. Create collection: "P2D Vendor APIs"
2. Add all endpoints
3. Set header globally
4. Easy access anytime

---

## 🌐 Using Browser (Simple Test)

**You can test GET endpoints directly in browser:**

1. Open browser
2. Install extension: "ModHeader" or "Simple Modify Headers"
3. Add header: `x-vendor-password: vendor123`
4. Visit: `http://localhost:5000/api/vendor/stats`

---

## 📁 Direct File Access (Recommended for Vendors)

### **Step 1: Open Uploads Folder**
```
C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\uploads\
```

### **Step 2: Browse Student Folders**
Each folder is named: `StudentName_CollegeName_ProjectID`

### **Step 3: Open README.txt**
Contains all information you need:
- Student details
- Contact info
- Printing specifications
- Number of copies
- Binding color
- Payment status

### **Step 4: Print Documents**
All files are in the same folder!

---

## 🎯 Typical Vendor Workflow

### **Daily Routine:**

**Morning:**
1. Check pending orders:
   ```bash
   curl -H "x-vendor-password: vendor123" http://localhost:5000/api/vendor/pending-orders
   ```

2. Or just open uploads folder:
   ```
   C:\...\student-project-portal\uploads\
   ```

3. Check new folders (sorted by date)

**Processing:**
1. Open student folder
2. Read `README.txt` for specifications
3. Print documents as specified
4. Bind with chosen color
5. Mark as completed

**Mark Complete:**
```bash
curl -X PUT -H "x-vendor-password: vendor123" -H "Content-Type: application/json" -d "{\"status\":\"completed\"}" http://localhost:5000/api/vendor/update-status/proj123
```

---

## 🔒 Change Vendor Password

### **In .env file:**
```env
VENDOR_PASSWORD=your_secure_password
```

### **Then use new password:**
```bash
curl -H "x-vendor-password: your_secure_password" http://localhost:5000/api/vendor/stats
```

---

## 📊 Example: Check Today's Orders

**PowerShell Script:**
```powershell
# Get all submissions
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/vendor/submissions" -Headers @{"x-vendor-password"="vendor123"}

# Display
$response.submissions | Format-Table studentName, college, projectTitle, paymentStatus
```

---

## 🎨 What You'll See in README.txt

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
Phone:          +91 9876543210

PRINTING SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Copies:         3
Print Type:     Color Print
Paper Type:     Bond Paper
Binding:        Hard Binding
Binding Color:  Royal Blue
Total Pages:    85

PAYMENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount:   ₹850
Payment Status: paid
```

---

## 🚀 Quick Start for Vendors

### **Easiest Method:**

1. **Open uploads folder:**
   ```
   C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\uploads\
   ```

2. **Look for new folders** (by date)

3. **Open README.txt** in each folder

4. **Print and bind** as specified

5. **Done!** No API needed for basic workflow

---

## 📱 Future: Vendor Web Dashboard

**Coming soon:**
- Login interface
- Browse submissions
- Download files
- Update status
- View statistics
- Mobile friendly

**For now:** Use API or direct folder access

---

## 🆘 Troubleshooting

### **"Unauthorized" Error:**
- Check password: `vendor123`
- Check header: `x-vendor-password`
- Check server is running

### **"Cannot find folder" Error:**
- Check folder name spelling
- Check uploads directory exists
- Check student has uploaded

### **No submissions showing:**
- Check if any students uploaded
- Check uploads folder exists
- Check database has projects

---

## 📞 Contact Info in Files

**Every README.txt contains:**
- Student name
- Email
- Phone number
- College
- Department

**Easy to contact for clarifications!**

---

**Vendor access is ready! Use API or direct folder access!** 🔑✅
