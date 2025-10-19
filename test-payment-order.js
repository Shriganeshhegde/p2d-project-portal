require('dotenv').config();
const Razorpay = require('razorpay');
const { supabase } = require('./utils/supabase');

async function testPaymentOrder() {
  console.log('🧪 Testing Payment Order Creation...\n');

  // Test 1: Razorpay order creation
  try {
    console.log('1️⃣ Testing Razorpay order creation...');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: 50000, // ₹500 in paise
      currency: 'INR',
      receipt: `test_receipt_${Date.now()}`,
      notes: {
        test: 'true'
      }
    };

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created successfully!');
    console.log('   Order ID:', order.id);
    console.log('   Amount:', order.amount / 100, 'INR');
  } catch (error) {
    console.log('❌ Razorpay order creation failed:', error.message);
    return;
  }

  // Test 2: Check if payments table exists
  try {
    console.log('\n2️⃣ Checking payments table...');
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Payments table error:', error.message);
      console.log('   Code:', error.code);
      console.log('\n💡 The payments table might not exist or have wrong schema.');
      console.log('   You need to create it in Supabase dashboard.');
    } else {
      console.log('✅ Payments table exists!');
      console.log('   Found', data?.length || 0, 'records');
    }
  } catch (error) {
    console.log('❌ Database error:', error.message);
  }

  // Test 3: Try to insert a test payment
  try {
    console.log('\n3️⃣ Testing payment record insertion...');
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        project_id: 'test_project_123',
        student_id: 'test_user_123',
        amount: 500,
        currency: 'INR',
        status: 'pending',
        razorpay_order_id: 'order_test_123',
        project_data: { test: true },
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.log('❌ Failed to insert payment record:', error.message);
      console.log('   Code:', error.code);
      console.log('   Details:', error.details);
      console.log('\n💡 Possible issues:');
      console.log('   - Table doesn\'t exist');
      console.log('   - Column names don\'t match');
      console.log('   - Missing required columns');
      console.log('   - Wrong data types');
    } else {
      console.log('✅ Payment record inserted successfully!');
      console.log('   Payment ID:', data.id);
      
      // Clean up test record
      await supabase.from('payments').delete().eq('id', data.id);
      console.log('   (Test record cleaned up)');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Test complete!');
}

testPaymentOrder();
