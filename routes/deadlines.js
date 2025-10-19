const express = require('express');
const router = express.Router();
const { supabase } = require('../utils/supabase');
const auth = require('../middleware/auth');

// Get deadline for a specific college
router.get('/check/:collegeName', auth, async (req, res) => {
  try {
    const { collegeName } = req.params;
    const { department } = req.query;

    console.log(`Checking deadline for: ${collegeName}, Department: ${department || 'All'}`);

    // Query deadline from database
    const { data, error } = await supabase
      .from('college_deadlines')
      .select('*')
      .eq('college_name', collegeName)
      .eq('is_active', true)
      .or(`department.eq.${department || 'All Departments'},department.eq.All Departments`)
      .order('deadline_date', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch deadline' });
    }

    if (!data) {
      // No deadline set for this college
      return res.json({
        hasDeadline: false,
        canUpload: true,
        message: 'No deadline set for this college'
      });
    }

    const deadlineDate = new Date(data.deadline_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    const isExpired = today > deadlineDate;

    res.json({
      hasDeadline: true,
      deadline: data.deadline_date,
      daysRemaining,
      isExpired,
      canUpload: !isExpired,
      notes: data.notes,
      department: data.department,
      academicYear: data.academic_year
    });

  } catch (error) {
    console.error('Error checking deadline:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all active deadlines
router.get('/all', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('college_deadlines')
      .select('*')
      .eq('is_active', true)
      .order('deadline_date', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch deadlines' });
    }

    // Calculate days remaining for each
    const deadlinesWithStatus = data.map(deadline => {
      const deadlineDate = new Date(deadline.deadline_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
      const isExpired = today > deadlineDate;

      return {
        ...deadline,
        daysRemaining,
        isExpired
      };
    });

    res.json(deadlinesWithStatus);

  } catch (error) {
    console.error('Error fetching deadlines:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Add or update deadline
router.post('/manage', auth, async (req, res) => {
  try {
    const {
      collegeName,
      department,
      deadlineDate,
      academicYear,
      semester,
      notes
    } = req.body;

    if (!collegeName || !deadlineDate) {
      return res.status(400).json({ error: 'College name and deadline date are required' });
    }

    // Check if deadline already exists
    const { data: existing } = await supabase
      .from('college_deadlines')
      .select('id')
      .eq('college_name', collegeName)
      .eq('department', department || 'All Departments')
      .single();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('college_deadlines')
        .update({
          deadline_date: deadlineDate,
          academic_year: academicYear,
          semester,
          notes,
          updated_at: new Date()
        })
        .eq('id', existing.id);
    } else {
      // Insert new
      result = await supabase
        .from('college_deadlines')
        .insert({
          college_name: collegeName,
          department: department || 'All Departments',
          deadline_date: deadlineDate,
          academic_year: academicYear,
          semester,
          notes
        });
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return res.status(500).json({ error: 'Failed to save deadline' });
    }

    res.json({
      success: true,
      message: existing ? 'Deadline updated successfully' : 'Deadline added successfully'
    });

  } catch (error) {
    console.error('Error managing deadline:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
