require('dotenv').config();
const { supabase } = require('./utils/supabase');

async function checkSchema() {
  console.log('🔍 Checking projects table schema...\n');

  try {
    // Try minimal insert to see what columns exist
    const { data: insertData, error: insertError } = await supabase
      .from('projects')
      .insert([{
        title: 'Test',
        student_id: 'test'
      }])
      .select();

    if (insertError) {
      console.log('Insert error (expected):', insertError.message);
    } else if (insertData && insertData.length > 0) {
      console.log('✅ Columns in projects table:');
      console.log(Object.keys(insertData[0]));
      
      // Clean up
      await supabase.from('projects').delete().eq('id', insertData[0].id);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

checkSchema();
