-- College Deadlines Table
CREATE TABLE IF NOT EXISTS college_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_name TEXT NOT NULL,
  department TEXT,
  deadline_date DATE NOT NULL,
  academic_year TEXT,
  semester INTEGER,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_college_deadlines_college ON college_deadlines(college_name);
CREATE INDEX idx_college_deadlines_date ON college_deadlines(deadline_date);
CREATE INDEX idx_college_deadlines_active ON college_deadlines(is_active);

-- Insert sample data
INSERT INTO college_deadlines (college_name, department, deadline_date, academic_year, semester, notes) VALUES
('Dayananda Sagar Academy of Technology and Management', 'All Departments', '2025-10-14', '2024-25', NULL, 'Project submission deadline for all departments'),
('RV College of Engineering', 'Computer Science', '2025-10-20', '2024-25', 6, 'Final year project submission'),
('BMS College of Engineering', 'All Departments', '2025-10-18', '2024-25', NULL, 'Project report submission'),
('PES University', 'All Departments', '2025-10-25', '2024-25', NULL, 'Final submission deadline');

-- Function to check if deadline has passed
CREATE OR REPLACE FUNCTION check_deadline_passed(p_college_name TEXT, p_department TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_deadline DATE;
  v_is_active BOOLEAN;
BEGIN
  SELECT deadline_date, is_active INTO v_deadline, v_is_active
  FROM college_deadlines
  WHERE college_name = p_college_name
    AND (p_department IS NULL OR department = p_department OR department = 'All Departments')
    AND is_active = true
  ORDER BY deadline_date DESC
  LIMIT 1;
  
  IF v_deadline IS NULL THEN
    RETURN false; -- No deadline set, allow upload
  END IF;
  
  RETURN CURRENT_DATE > v_deadline;
END;
$$ LANGUAGE plpgsql;

-- Function to get deadline info
CREATE OR REPLACE FUNCTION get_college_deadline(p_college_name TEXT, p_department TEXT DEFAULT NULL)
RETURNS TABLE (
  deadline_date DATE,
  days_remaining INTEGER,
  is_expired BOOLEAN,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cd.deadline_date,
    (cd.deadline_date - CURRENT_DATE)::INTEGER as days_remaining,
    (CURRENT_DATE > cd.deadline_date) as is_expired,
    cd.notes
  FROM college_deadlines cd
  WHERE cd.college_name = p_college_name
    AND (p_department IS NULL OR cd.department = p_department OR cd.department = 'All Departments')
    AND cd.is_active = true
  ORDER BY cd.deadline_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
