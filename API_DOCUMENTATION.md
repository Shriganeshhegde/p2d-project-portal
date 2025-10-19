# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the request header:

```
x-auth-token: <your-jwt-token>
```

---

## Authentication Endpoints

### Register Student

**Endpoint:** `POST /auth/register`

**Description:** Register a new student account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "studentId": "STU12345",
  "college": "ABC University",
  "department": "Computer Science",
  "semester": 6
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - User already exists
- `500 Internal Server Error` - Server error

---

### Login Student

**Endpoint:** `POST /auth/login`

**Description:** Login with student credentials

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "studentId": "STU12345",
    "college": "ABC University"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid credentials
- `500 Internal Server Error` - Server error

---

## Project Endpoints

### Submit New Project

**Endpoint:** `POST /projects`

**Description:** Submit a new project with document

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
```
title: "Machine Learning Project"
description: "A project on ML algorithms"
department: "Computer Science"
semester: 6
document: <file>
```

**Response:** `201 Created`
```json
{
  "id": "uuid-here",
  "student_id": "uuid-here",
  "title": "Machine Learning Project",
  "description": "A project on ML algorithms",
  "department": "Computer Science",
  "semester": 6,
  "status": "submitted",
  "payment_status": "pending",
  "submission_date": "2024-01-15T10:30:00Z",
  "document": {
    "name": "project_report.pdf",
    "url": "https://supabase.co/storage/...",
    "mimeType": "application/pdf",
    "size": 1024000
  }
}
```

**Error Responses:**
- `400 Bad Request` - No file uploaded / Invalid file type
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Get All User Projects

**Endpoint:** `GET /projects/my-projects`

**Description:** Get all projects for the authenticated student

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-here",
    "student_id": "uuid-here",
    "title": "Machine Learning Project",
    "description": "A project on ML algorithms",
    "department": "Computer Science",
    "semester": 6,
    "status": "submitted",
    "payment_status": "completed",
    "submission_date": "2024-01-15T10:30:00Z",
    "documents": [
      {
        "id": "uuid-here",
        "name": "project_report.pdf",
        "path": "user-id/projects/filename.pdf",
        "size": 1024000,
        "mime_type": "application/pdf",
        "is_primary": true,
        "uploaded_at": "2024-01-15T10:30:00Z",
        "url": "https://supabase.co/storage/..."
      }
    ],
    "document": {
      "id": "uuid-here",
      "name": "project_report.pdf",
      "url": "https://supabase.co/storage/...",
      "is_primary": true
    }
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Get Single Project

**Endpoint:** `GET /projects/:projectId`

**Description:** Get a single project with all documents

**Authentication:** Required

**URL Parameters:**
- `projectId` - UUID of the project

**Response:** `200 OK`
```json
{
  "id": "uuid-here",
  "student_id": "uuid-here",
  "title": "Machine Learning Project",
  "description": "A project on ML algorithms",
  "department": "Computer Science",
  "semester": 6,
  "status": "submitted",
  "payment_status": "completed",
  "submission_date": "2024-01-15T10:30:00Z",
  "documents": [
    {
      "id": "uuid-here",
      "name": "project_report.pdf",
      "path": "user-id/projects/filename.pdf",
      "size": 1024000,
      "mime_type": "application/pdf",
      "is_primary": true,
      "uploaded_at": "2024-01-15T10:30:00Z",
      "url": "https://supabase.co/storage/..."
    }
  ],
  "document": {
    "id": "uuid-here",
    "name": "project_report.pdf",
    "url": "https://supabase.co/storage/..."
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Project not found
- `500 Internal Server Error` - Server error

---

### Upload Additional Documents

**Endpoint:** `POST /projects/:projectId/documents`

**Description:** Upload additional documents for a project

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `projectId` - UUID of the project

**Request Body:**
```
documents: <file[]> (max 5 files)
```

**Response:** `200 OK`
```json
{
  "id": "uuid-here",
  "student_id": "uuid-here",
  "title": "Machine Learning Project",
  "documents": [
    {
      "id": "uuid-here",
      "name": "additional_doc.pdf",
      "path": "user-id/projects/project-id/additional/filename.pdf",
      "size": 512000,
      "mime_type": "application/pdf",
      "is_primary": false,
      "uploaded_at": "2024-01-15T11:00:00Z",
      "url": "https://supabase.co/storage/..."
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - No files uploaded / Too many files / Invalid file type
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Project not found or access denied
- `500 Internal Server Error` - Server error

---

### Delete Document

**Endpoint:** `DELETE /projects/documents/:documentId`

**Description:** Delete a document (cannot delete primary document)

**Authentication:** Required

**URL Parameters:**
- `documentId` - UUID of the document

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Cannot delete primary document
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized to delete this document
- `404 Not Found` - Document not found
- `500 Internal Server Error` - Server error

---

## Payment Endpoints

### Create Payment Order

**Endpoint:** `POST /payments/create-order`

**Description:** Create a Razorpay payment order

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": "uuid-here",
  "amount": 500
}
```

**Response:** `200 OK`
```json
{
  "orderId": "order_xyz123",
  "amount": 50000,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid project or amount
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Verify Payment

**Endpoint:** `POST /payments/verify`

**Description:** Verify Razorpay payment signature

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": "uuid-here",
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_hash"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "id": "uuid-here",
    "project_id": "uuid-here",
    "amount": 500,
    "status": "completed",
    "razorpay_payment_id": "pay_abc456"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid signature / Payment verification failed
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

### Get User Payments

**Endpoint:** `GET /payments/my-payments`

**Description:** Get all payments for the authenticated student

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-here",
    "project_id": "uuid-here",
    "student_id": "uuid-here",
    "amount": 500,
    "currency": "INR",
    "status": "completed",
    "razorpay_order_id": "order_xyz123",
    "razorpay_payment_id": "pay_abc456",
    "payment_method": "card",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

## File Upload Specifications

### Allowed File Types

- PDF: `application/pdf`
- Word: `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Images: `image/jpeg`, `image/png`, `image/jpg`

### File Size Limits

- Maximum file size: **10MB** per file
- Maximum files per upload: **5 files**

### File Naming

Files are automatically renamed with UUID to prevent conflicts:
```
{userId}/{folder}/{uuid}.{extension}
```

Example: `abc123-def456/projects/xyz789-ghi012.pdf`

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message here",
  "details": "Detailed error information (development only)"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production:

- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute

---

## WebSocket Events (Socket.IO)

### Connection

```javascript
const socket = io('http://localhost:5000');
```

### Events

#### `project:submitted`
Emitted when a project is submitted

```javascript
socket.on('project:submitted', (data) => {
  console.log('Project submitted:', data);
});
```

#### `payment:completed`
Emitted when a payment is completed

```javascript
socket.on('payment:completed', (data) => {
  console.log('Payment completed:', data);
});
```

#### `project:status:updated`
Emitted when project status changes

```javascript
socket.on('project:status:updated', (data) => {
  console.log('Project status updated:', data);
});
```

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "studentId": "STU12345",
    "college": "ABC University"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Upload Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -F "title=My Project" \
  -F "description=Project description" \
  -F "department=Computer Science" \
  -F "semester=6" \
  -F "document=@/path/to/file.pdf"
```

### Get Projects

```bash
curl -X GET http://localhost:5000/api/projects/my-projects \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

---

## Postman Collection

Import the following JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "Student Project Portal API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"studentId\": \"STU12345\",\n  \"college\": \"ABC University\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```
