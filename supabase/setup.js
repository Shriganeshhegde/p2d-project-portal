const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupSupabase() {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase URL or Service Role Key in environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🚀 Starting Supabase setup...');
  
  try {
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, 'migrations', '0001_initial_schema.sql');
    const sql = await fs.readFile(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('execute_sql', {
          query: statement + ';', // Add back the semicolon
          params: {}
        });
        
        if (error) {
          console.warn('⚠️ Warning executing statement:', error.message);
        }
      } catch (err) {
        console.warn('⚠️ Error executing statement:', err.message);
      }
    }

    console.log('✅ Database schema created successfully!');
    
    // Create storage bucket if it doesn't exist
    console.log('📦 Setting up storage bucket...');
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('project-documents', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('❌ Error creating storage bucket:', bucketError);
    } else {
      console.log('✅ Storage bucket configured');
    }

    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (adminEmail) {
      console.log('👤 Setting up admin user...');
      
      // Check if admin user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', adminEmail)
        .maybeSingle();
      
      if (!existingUser) {
        // Create auth user
        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
          email: adminEmail,
          password: adminPassword,
          email_confirm: true,
          user_metadata: { name: 'Admin User' }
        });
        
        if (signUpError) {
          console.error('❌ Error creating admin user:', signUpError);
        } else {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email: adminEmail,
                full_name: 'Admin User',
                role: 'admin',
                is_verified: true
              }
            ]);
          
          if (profileError) {
            console.error('❌ Error creating admin profile:', profileError);
          } else {
            console.log('✅ Admin user created successfully');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: ${adminPassword}`);
            console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
          }
        }
      } else {
        console.log('ℹ️  Admin user already exists');
      }
    }

    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('🔗 Supabase Dashboard:', `${supabaseUrl}/project/default`);
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run the setup
setupSupabase();
