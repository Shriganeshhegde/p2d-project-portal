require('dotenv').config();
const { supabase } = require('./utils/supabase');
const { v4: uuidv4 } = require('uuid');

async function getColumns() {
  console.log('🔍 Getting projects table columns...\n');

  try {
    // Try to insert with minimal valid data
    const testId = uuidv4();
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        id: testId,
        student_id: uuidv4(),
        title: 'Test Project'
      }])
      .select();

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Code:', error.code);
      
      // Try to select to see columns
      const { data: selectData, error: selectError } = await supabase
        .from('projects')
        .select('*')
        .limit(1);
      
      if (selectData && selectData.length > 0) {
        console.log('\n✅ Columns found from existing record:');
        console.log(Object.keys(selectData[0]));
      } else {
        console.log('\nNo existing records. Trying select with specific columns...');
        
        // Try common columns
        const testColumns = [
          'id', 'student_id', 'title', 'total_pages', 'copies',
          'print_type', 'paper_type', 'binding_type',
          'delivery_address', 'delivery_college', 'total_amount',
          'payment_status', 'status', 'submitted_date', 'created_at'
        ];
        
        console.log('\nTesting which columns exist...');
        for (const col of testColumns) {
          const { error: colError } = await supabase
            .from('projects')
            .select(col)
            .limit(0);
          
          if (!colError) {
            console.log(`✅ ${col}`);
          } else if (colError.code === 'PGRST204') {
            console.log(`❌ ${col} - doesn't exist`);
          }
        }
      }
    } else {
      console.log('✅ Insert successful! Columns:');
      console.log(Object.keys(data[0]));
      
      // Clean up
      await supabase.from('projects').delete().eq('id', testId);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

getColumns();
