const path = require('path');
const fs = require('fs').promises;

/**
 * Generate folder name for student uploads
 * Format: StudentName_CollegeName_ProjectID
 */
function generateStudentFolderName(studentName, collegeName, projectId) {
  // Clean names: remove special characters, replace spaces with underscores
  const cleanStudentName = studentName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  const cleanCollegeName = collegeName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  
  // Limit length to avoid filesystem issues
  const shortStudentName = cleanStudentName.substring(0, 30);
  const shortCollegeName = cleanCollegeName.substring(0, 40);
  
  return `${shortStudentName}_${shortCollegeName}_${projectId}`;
}

/**
 * Create organized folder structure for vendor access
 * Structure: uploads/StudentName_College_ProjectID/
 */
async function createStudentFolder(studentName, collegeName, projectId) {
  const folderName = generateStudentFolderName(studentName, collegeName, projectId);
  const folderPath = path.join(__dirname, '..', 'uploads', folderName);
  
  try {
    await fs.mkdir(folderPath, { recursive: true });
    return { folderPath, folderName };
  } catch (error) {
    console.error('Error creating student folder:', error);
    throw error;
  }
}

/**
 * Generate student details file (JSON format for vendor)
 */
async function createStudentDetailsFile(folderPath, studentData, projectData) {
  const details = {
    studentInfo: {
      name: studentData.name,
      email: studentData.email,
      studentId: studentData.studentId,
      college: studentData.college,
      department: studentData.department,
      semester: studentData.semester,
      phone: studentData.phone || 'N/A'
    },
    projectInfo: {
      projectId: projectData.id,
      title: projectData.title,
      description: projectData.description,
      subject: projectData.subject,
      guide: projectData.guide,
      totalPages: projectData.totalPages,
      submittedDate: projectData.submittedDate
    },
    printingDetails: {
      copies: projectData.copies,
      printType: projectData.printType || 'Color',
      paperType: projectData.paperType || 'Bond Paper',
      bindingType: projectData.bindingType || 'Hard Binding',
      bindingColor: projectData.bindingColor
    },
    additionalInfo: {
      hasInternshipCertificate: projectData.hasInternshipCertificate || false,
      certificatePages: projectData.certificatePages || 0
    },
    files: {
      projectDocument: projectData.projectFileName,
      certificateDocument: projectData.certificateFileName || null
    },
    pricing: {
      totalAmount: projectData.totalAmount,
      paymentStatus: projectData.paymentStatus
    },
    generatedAt: new Date().toISOString()
  };
  
  const detailsPath = path.join(folderPath, 'STUDENT_DETAILS.json');
  await fs.writeFile(detailsPath, JSON.stringify(details, null, 2), 'utf8');
  
  // Also create a readable text file
  const textContent = `
╔════════════════════════════════════════════════════════════════╗
║                    STUDENT PROJECT DETAILS                     ║
╚════════════════════════════════════════════════════════════════╝

STUDENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:           ${studentData.name}
Email:          ${studentData.email}
Student ID:     ${studentData.studentId}
College:        ${studentData.college}
Department:     ${studentData.department}
Semester:       ${studentData.semester}
Phone:          ${studentData.phone || 'N/A'}

PROJECT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project ID:     ${projectData.id}
Title:          ${projectData.title}
Description:    ${projectData.description}
Subject:        ${projectData.subject}
Guide:          ${projectData.guide}
Total Pages:    ${projectData.totalPages}
Submitted:      ${new Date(projectData.submittedDate).toLocaleString('en-IN')}

PRINTING SPECIFICATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Copies:         ${projectData.copies}
Print Type:     ${projectData.printType || 'Color Print'}
Paper Type:     ${projectData.paperType || 'Bond Paper'}
Binding:        ${projectData.bindingType || 'Hard Binding'}
Binding Color:  ${projectData.bindingColor}

ADDITIONAL ITEMS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Internship Certificate: ${projectData.hasInternshipCertificate ? 'YES' : 'NO'}
Certificate Pages:      ${projectData.certificatePages || 0}

FILES IN THIS FOLDER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project Document:       ${projectData.projectFileName}
Certificate Document:   ${projectData.certificateFileName || 'None'}

PAYMENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount:   ₹${projectData.totalAmount}
Payment Status: ${projectData.paymentStatus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date().toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  
  const textPath = path.join(folderPath, 'README.txt');
  await fs.writeFile(textPath, textContent, 'utf8');
  
  return { detailsPath, textPath };
}

/**
 * Move uploaded files to student folder
 */
async function organizeUploadedFiles(files, folderPath) {
  const organizedFiles = [];
  
  for (const file of files) {
    const newPath = path.join(folderPath, file.originalname);
    await fs.rename(file.path, newPath);
    organizedFiles.push({
      originalName: file.originalname,
      newPath: newPath,
      size: file.size,
      mimetype: file.mimetype
    });
  }
  
  return organizedFiles;
}

/**
 * Get all student folders for vendor access
 */
async function getAllStudentFolders() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  
  try {
    const folders = await fs.readdir(uploadsDir, { withFileTypes: true });
    const studentFolders = folders
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    return studentFolders;
  } catch (error) {
    console.error('Error reading student folders:', error);
    return [];
  }
}

/**
 * Get student folder contents
 */
async function getStudentFolderContents(folderName) {
  const folderPath = path.join(__dirname, '..', 'uploads', folderName);
  
  try {
    const files = await fs.readdir(folderPath);
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime,
          isDirectory: stats.isDirectory()
        };
      })
    );
    
    // Read student details if exists
    const detailsPath = path.join(folderPath, 'STUDENT_DETAILS.json');
    let studentDetails = null;
    try {
      const detailsContent = await fs.readFile(detailsPath, 'utf8');
      studentDetails = JSON.parse(detailsContent);
    } catch (err) {
      // Details file doesn't exist
    }
    
    return {
      folderName,
      folderPath,
      files: fileDetails,
      studentDetails
    };
  } catch (error) {
    console.error('Error reading folder contents:', error);
    throw error;
  }
}

module.exports = {
  generateStudentFolderName,
  createStudentFolder,
  createStudentDetailsFile,
  organizeUploadedFiles,
  getAllStudentFolders,
  getStudentFolderContents
};
