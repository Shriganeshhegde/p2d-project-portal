require('dotenv').config();

console.log('🔍 Checking Razorpay Configuration...\n');

// Check if keys exist
const hasKeyId = !!process.env.RAZORPAY_KEY_ID;
const hasKeySecret = !!process.env.RAZORPAY_KEY_SECRET;

console.log('RAZORPAY_KEY_ID:', hasKeyId ? '✅ Configured' : '❌ Missing');
if (hasKeyId) {
  console.log('  Value starts with:', process.env.RAZORPAY_KEY_ID.substring(0, 15) + '...');
}

console.log('RAZORPAY_KEY_SECRET:', hasKeySecret ? '✅ Configured' : '❌ Missing');
if (hasKeySecret) {
  console.log('  Length:', process.env.RAZORPAY_KEY_SECRET.length, 'characters');
}

console.log('\n');

if (!hasKeyId || !hasKeySecret) {
  console.log('❌ Razorpay is NOT configured properly!');
  console.log('\n📋 To fix:');
  console.log('1. Open .env file in the root directory');
  console.log('2. Add these lines:');
  console.log('   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID');
  console.log('   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET');
  console.log('3. Get keys from: https://dashboard.razorpay.com/app/keys');
  console.log('4. Restart backend: node server.js');
} else {
  console.log('✅ Razorpay is configured!');
  
  // Test Razorpay initialization
  try {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay instance created successfully!');
    console.log('\n🎉 Payment gateway is ready to use!');
  } catch (error) {
    console.log('❌ Error initializing Razorpay:', error.message);
  }
}
