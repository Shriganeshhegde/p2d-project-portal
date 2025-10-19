require('dotenv').config();
const { supabase } = require('./utils/supabase');

async function updateDeadline() {
  try {
    const collegeName = 'Dayananda Sagar Academy of Technology and Management';
    const newDeadline = '2025-10-25';
    
    console.log(`Updating deadline for: ${collegeName}`);
    console.log(`New deadline: ${newDeadline}`);
    
    // Check if deadline exists
    const { data: existing, error: checkError } = await supabase
      .from('college_deadlines')
      .select('*')
      .eq('college_name', collegeName)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing deadline:', checkError);
      return;
    }
    
    let result;
    if (existing) {
      // Update existing deadline
      console.log('Updating existing deadline...');
      result = await supabase
        .from('college_deadlines')
        .update({
          deadline_date: newDeadline
        })
        .eq('id', existing.id)
        .select();
    } else {
      // Insert new deadline
      console.log('Creating new deadline...');
      result = await supabase
        .from('college_deadlines')
        .insert({
          college_name: collegeName,
          department: 'All Departments',
          deadline_date: newDeadline,
          academic_year: '2024-2025',
          is_active: true,
          notes: 'Submission deadline'
        })
        .select();
    }
    
    if (result.error) {
      console.error('Error updating deadline:', result.error);
      return;
    }
    
    console.log('\n✅ Deadline updated successfully!');
    console.log('Updated data:', result.data);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

updateDeadline();
