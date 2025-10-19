require('dotenv').config();
const { supabase } = require('./utils/supabase');

async function debugPayment() {
  console.log('🔍 Debugging Payment Issue...\n');

  // Check recent payments
  console.log('1️⃣ Checking recent payment records...\n');
  
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Error fetching payments:', error.message);
    } else {
      console.log(`✅ Found ${payments.length} recent payments:`);
      payments.forEach((p, i) => {
        console.log(`\n${i + 1}. Payment:`);
        console.log('   ID:', p.id);
        console.log('   Project ID:', p.project_id);
        console.log('   Student ID:', p.student_id);
        console.log('   Amount:', p.amount);
        console.log('   Status:', p.status);
        console.log('   Razorpay Order ID:', p.razorpay_order_id);
        console.log('   Created:', p.created_at);
      });
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n2️⃣ Checking if student_id exists in users table...\n');
  
  try {
    const { data: payments } = await supabase
      .from('payments')
      .select('student_id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (payments) {
      const studentId = payments.student_id;
      console.log('Latest payment student_id:', studentId);
      
      // Check if this user exists
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', studentId)
        .single();

      if (userError) {
        console.log('❌ User NOT found in users table!');
        console.log('   Error:', userError.message);
        console.log('\n💡 This is the problem!');
        console.log('   The student_id in payment record doesn\'t exist in users table.');
        console.log('   You need to login with a valid account that exists in the database.');
      } else {
        console.log('✅ User found in users table:');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Name:', user.name);
      }
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n3️⃣ Checking all users in database...\n');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log('❌ Error fetching users:', error.message);
    } else {
      console.log(`✅ Found ${users.length} users in database:`);
      users.forEach((u, i) => {
        console.log(`\n${i + 1}. User:`);
        console.log('   ID:', u.id);
        console.log('   Email:', u.email);
        console.log('   Name:', u.name);
        console.log('   Created:', u.created_at);
      });
      
      console.log('\n💡 Use one of these user accounts to login and test payment!');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

debugPayment();
