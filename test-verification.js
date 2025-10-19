require('dotenv').config();
const { supabase } = require('./utils/supabase');
const { v4: uuidv4 } = require('uuid');

async function testVerification() {
  console.log('🧪 Testing Payment Verification Flow...\n');

  const testUserId = uuidv4();
  const testProjectId = uuidv4();
  
  // Test data
  const projectData = {
    title: 'Test Project',
    pages: 45,
    copies: 2,
    printType: 'color',
    paperType: 'normal-a4',
    bindingType: 'hard',
    bindingColor: 'blue',
    deliveryAddress: 'Test Address',
    deliveryCollege: 'Test College',
    department: 'Computer Science',
    semester: 6
  };

  console.log('1️⃣ Testing project insert with actual schema...\n');
  
  try {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        id: testProjectId,
        student_id: testUserId,
        title: projectData.title,
        description: `${projectData.pages} pages, ${projectData.copies} copies, ${projectData.printType} print, ${projectData.bindingType} binding`,
        department: projectData.department || 'General',
        semester: projectData.semester || 1,
        payment_status: 'paid',
        status: 'pending',
        submission_date: new Date().toISOString()
      }])
      .select()
      .single();

    if (projectError) {
      console.log('❌ Project insert failed!');
      console.log('Error:', projectError.message);
      console.log('Code:', projectError.code);
      console.log('Details:', projectError.details);
      console.log('Hint:', projectError.hint);
      
      if (projectError.code === '23503') {
        console.log('\n💡 Foreign key constraint error!');
        console.log('   The student_id must exist in the users/students table.');
        console.log('   For testing, you need a real user ID from the database.');
      }
    } else {
      console.log('✅ Project inserted successfully!');
      console.log('Project ID:', project.id);
      console.log('Title:', project.title);
      console.log('Department:', project.department);
      
      // Clean up
      await supabase.from('projects').delete().eq('id', testProjectId);
      console.log('(Test record cleaned up)');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n2️⃣ Checking if you have any existing users...\n');
  
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(1);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else if (users && users.length > 0) {
      console.log('✅ Found existing user:');
      console.log('   ID:', users[0].id);
      console.log('   Email:', users[0].email);
      console.log('   Name:', users[0].name);
      console.log('\n💡 Use this user ID for testing payment verification!');
    } else {
      console.log('⚠️  No users found in database.');
      console.log('   You need to sign up first before testing payment.');
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

testVerification();
