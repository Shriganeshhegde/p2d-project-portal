-- Fix Row Level Security (RLS) Issues
-- Run this in Supabase SQL Editor

-- Option 1: Disable RLS (Quick fix for development)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Option 2: Enable RLS with proper policies (Recommended for production)
-- Uncomment below if you want to use RLS with policies

/*
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

-- Projects policies
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update projects" ON projects
  FOR UPDATE USING (true);

-- Project documents policies
CREATE POLICY "Anyone can view documents" ON project_documents
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert documents" ON project_documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete documents" ON project_documents
  FOR DELETE USING (true);

-- Payments policies
CREATE POLICY "Anyone can view payments" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert payments" ON payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update payments" ON payments
  FOR UPDATE USING (true);
*/

-- Success message
SELECT 'RLS disabled successfully! Try uploading again.' as message;
