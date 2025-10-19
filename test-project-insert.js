require('dotenv').config();
const { supabase } = require('./utils/supabase');

async function testProjectInsert() {
  console.log('🧪 Testing Project Insert...\n');

  // Test data
  const testProject = {
    id: 'test_proj_' + Date.now(),
    student_id: 'test_user_123',
    title: 'Test Project',
    total_pages: 45,
    copies: 2,
    print_type: 'color',
    paper_type: 'normal-a4',
    binding_type: 'hard',
    binding_color: 'blue',
    delivery_address: 'Test Address',
    delivery_college: 'Test College',
    total_amount: 500,
    payment_status: 'paid',
    status: 'pending',
    submitted_date: new Date().toISOString()
  };

  console.log('Attempting to insert project with fields:');
  console.log(Object.keys(testProject));
  console.log('\n');

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([testProject])
      .select()
      .single();

    if (error) {
      console.log('❌ Insert failed!');
      console.log('Error message:', error.message);
      console.log('Error code:', error.code);
      console.log('Error details:', error.details);
      console.log('Error hint:', error.hint);
      
      console.log('\n💡 Possible issues:');
      console.log('- Column names don\'t match database schema');
      console.log('- Missing required columns');
      console.log('- Wrong data types');
      console.log('- Table doesn\'t exist');
    } else {
      console.log('✅ Project inserted successfully!');
      console.log('Project ID:', data.id);
      console.log('Columns in response:', Object.keys(data));
      
      // Clean up
      await supabase.from('projects').delete().eq('id', data.id);
      console.log('(Test record cleaned up)');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

testProjectInsert();
