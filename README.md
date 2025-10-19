# Student Project Submission Portal

A comprehensive web application for students to submit project reports with document scanning capabilities, payment processing, and report delivery to colleges.

## Features

- **Student Authentication**: Secure registration and login system
- **Project Report Upload**: Upload project documents with support for PDF, DOC, DOCX, JPG, and PNG
- **Document Scanner**: CamScanner-like functionality for scanning documents using device camera
- **OCR Text Extraction**: Extract text from scanned documents using Tesseract.js
- **Payment Processing**: Transparent payment system with Razorpay integration
- **Real-time Updates**: Socket.IO for real-time notifications
- **File Management**: Secure file storage using Supabase Storage
- **Progress Tracking**: Track project submission and payment status

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Supabase** for database and storage
- **JWT** for authentication
- **Multer** for file uploads
- **Socket.IO** for real-time communication
- **Razorpay** for payment processing

### Frontend
- **React** 18.x
- **React Router** for navigation
- **Axios** for API calls
- **React Dropzone** for drag-and-drop file uploads
- **React PDF** for PDF preview
- **Tesseract.js** for OCR
- **React Icons** for UI icons

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Supabase account
- Razorpay account (for payment processing)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd student-project-portal
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# File Upload
SUPABASE_STORAGE_BUCKET=project-documents
MAX_FILE_UPLOAD=10000000

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Gateway (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
```

### 5. Supabase Setup

#### Create Tables

Run the following SQL in your Supabase SQL editor:

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
  contact_number VARCHAR(20),
  address TEXT,
  avatar VARCHAR(500),
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  submission_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  razorpay_signature VARCHAR(500),
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_documents_project ON project_documents(project_id);
CREATE INDEX idx_payments_project ON payments(project_id);
CREATE INDEX idx_payments_student ON payments(student_id);
```

#### Create Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `project-documents`
3. Set the bucket to **Public** or configure appropriate policies

#### Storage Policies

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-documents');

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'project-documents');

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-documents');
```

## Running the Application

### Development Mode

#### Start Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
cd ..
```

#### Start Backend

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Student login

### Projects

- `POST /api/projects` - Submit new project (requires auth)
- `GET /api/projects/my-projects` - Get all user projects (requires auth)
- `GET /api/projects/:projectId` - Get single project (requires auth)
- `POST /api/projects/:projectId/documents` - Upload additional documents (requires auth)
- `DELETE /api/projects/documents/:documentId` - Delete document (requires auth)

### Payments

- `POST /api/payments/create-order` - Create Razorpay order (requires auth)
- `POST /api/payments/verify` - Verify payment (requires auth)
- `GET /api/payments/my-payments` - Get user payments (requires auth)

## Component Usage

### DocumentUpload Component

```jsx
import DocumentUpload from './components/DocumentUpload';

function App() {
  const handleUploadComplete = (files) => {
    console.log('Uploaded files:', files);
  };

  return (
    <DocumentUpload
      onUploadComplete={handleUploadComplete}
      maxFiles={5}
      allowedTypes={['application/pdf', 'image/jpeg', 'image/png']}
    />
  );
}
```

### FileUpload Component

```jsx
import FileUpload from './components/FileUpload/FileUpload';

function App() {
  const handleUpload = (files) => {
    console.log('Files:', files);
  };

  return (
    <FileUpload
      onUploadComplete={handleUpload}
      maxFiles={5}
      maxSizeMB={10}
    />
  );
}
```

### DocumentScanner Component

```jsx
import DocumentScanner from './components/DocumentScanner/DocumentScanner';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (scannedDoc) => {
    console.log('Scanned document:', scannedDoc);
  };

  return (
    <>
      <button onClick={() => setShowScanner(true)}>Scan Document</button>
      {showScanner && (
        <DocumentScanner
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
}
```

## Testing

### Run Backend Tests

```bash
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

## Project Structure

```
student-project-portal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUpload/
│   │   │   ├── FileUpload/
│   │   │   └── DocumentScanner/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Project.js
│   └── Payment.js
├── routes/
│   ├── auth.js
│   ├── projects.js
│   └── payments.js
├── utils/
│   ├── fileUpload.js
│   ├── socket.js
│   └── supabase.js
├── .env
├── server.js
└── package.json
```

## Security Considerations

- All API routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated for type and size
- CORS is configured for specific origins
- Environment variables are used for sensitive data
- SQL injection prevention through Supabase parameterized queries

## Troubleshooting

### Camera Access Issues

If the document scanner cannot access the camera:
1. Ensure HTTPS is enabled (camera API requires secure context)
2. Check browser permissions for camera access
3. Try using a different browser

### File Upload Errors

- Check file size limits (default 10MB)
- Verify allowed file types
- Ensure Supabase storage bucket is properly configured
- Check storage bucket policies

### Payment Issues

- Verify Razorpay API keys are correct
- Ensure webhook URL is configured in Razorpay dashboard
- Check payment status in Razorpay dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support, email admin@yourdomain.com or create an issue in the repository.
