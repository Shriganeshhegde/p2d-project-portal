require('dotenv').config();
const { supabase } = require('./utils/supabase');

async function checkSchema() {
  console.log('🔍 Checking payments table schema...\n');

  try {
    // Try to get one record to see the structure
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Error:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Found existing record. Columns:');
      console.log(Object.keys(data[0]));
    } else {
      console.log('ℹ️  No records found. Trying to insert minimal record...');
      
      // Try minimal insert to see what columns are required
      const { data: insertData, error: insertError } = await supabase
        .from('payments')
        .insert([{
          amount: 100,
          status: 'pending'
        }])
        .select();

      if (insertError) {
        console.log('\n❌ Insert failed:', insertError.message);
        console.log('Code:', insertError.code);
        console.log('Details:', insertError.details);
      } else {
        console.log('\n✅ Minimal insert worked! Columns:');
        console.log(Object.keys(insertData[0]));
        
        // Clean up
        await supabase.from('payments').delete().eq('id', insertData[0].id);
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

checkSchema();
