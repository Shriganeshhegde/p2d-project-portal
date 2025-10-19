const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

// Configure axios to use environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
const JWT_TOKEN = process.env.JWT_TOKEN; // Get this from your auth endpoint

// Test user data
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123',
};

// Test project data
const TEST_PROJECT = {
  title: 'Test Project',
  description: 'This is a test project',
  department: 'Computer Science',
  semester: 6,
};

// Helper function to create form data
function createFormData(fields, files = []) {
  const form = new FormData();
  
  // Add regular fields
  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, value);
  });
  
  // Add files
  files.forEach(({ field, path, type }) => {
    form.append(field, fs.createReadStream(path), {
      filename: path.split('/').pop(),
      contentType: type,
    });
  });
  
  return form;
}

// Test suite
describe('Project API Tests', () => {
  let projectId;
  let documentId;
  
  // Set up axios instance with auth header
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // Test project creation
  test('Create a new project with document', async () => {
    const form = createFormData(
      TEST_PROJECT,
      [
        {
          field: 'document',
          path: './tests/test-document.pdf', // Create this test file
          type: 'application/pdf',
        },
      ]
    );
    
    const response = await api.post('/projects', form, {
      headers: form.getHeaders(),
    });
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toBe(TEST_PROJECT.title);
    expect(response.data.document).toBeDefined();
    
    projectId = response.data.id;
    documentId = response.data.document.id;
  }, 30000);
  
  // Test get project
  test('Get project details', async () => {
    const response = await api.get(`/projects/${projectId}`);
    
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(projectId);
    expect(response.data.documents).toBeInstanceOf(Array);
  });
  
  // Test upload additional documents
  test('Upload additional documents', async () => {
    const form = createFormData(
      {},
      [
        {
          field: 'documents',
          path: './tests/additional-doc.pdf',
          type: 'application/pdf',
        },
        {
          field: 'documents',
          path: './tests/screenshot.png',
          type: 'image/png',
        },
      ]
    );
    
    const response = await api.post(`/projects/${projectId}/documents`, form, {
      headers: form.getHeaders(),
    });
    
    expect(response.status).toBe(200);
    expect(response.data.documents.length).toBeGreaterThan(1);
  }, 30000);
  
  // Test list projects
  test('List all projects', async () => {
    const response = await api.get('/projects/my-projects');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });
  
  // Test delete document
  test('Delete a document', async () => {
    // First, get the project to find a non-primary document
    const { data: project } = await api.get(`/projects/${projectId}`);
    const nonPrimaryDoc = project.documents.find(doc => !doc.is_primary);
    
    if (nonPrimaryDoc) {
      const response = await api.delete(`/projects/documents/${nonPrimaryDoc.id}`);
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    } else {
      console.log('No non-primary documents to delete');
    }
  });
});

// Helper function to run tests
async function runTests() {
  try {
    // Run the test suite
    const testResults = await require('jest').runCLI({
      testMatch: ['**/api.test.js'],
      testEnvironment: 'node',
      verbose: true,
      forceExit: true,
    }, [process.cwd()]);
    
    if (testResults.results.success) {
      console.log('✅ All tests passed!');
    } else {
      console.error('❌ Some tests failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  if (!JWT_TOKEN) {
    console.error('❌ JWT_TOKEN environment variable is required');
    process.exit(1);
  }
  
  // Create test directory if it doesn't exist
  if (!fs.existsSync('./tests')) {
    fs.mkdirSync('./tests');
  }
  
  // Create test files if they don't exist
  const testFiles = [
    { path: './tests/test-document.pdf', content: Buffer.alloc(1024, 'Test PDF content') },
    { path: './tests/additional-doc.pdf', content: Buffer.alloc(1024, 'Additional PDF content') },
    { path: './tests/screenshot.png', content: Buffer.alloc(1024, 'Test image') },
  ];
  
  testFiles.forEach(({ path, content }) => {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, content);
      console.log(`Created test file: ${path}`);
    }
  });
  
  runTests();
}
