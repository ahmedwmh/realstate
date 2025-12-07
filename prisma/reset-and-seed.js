// Load environment variables
const path = require('path');
const fs = require('fs');

// Try different env file locations
const envFiles = ['.env.local', '.env'];
for (const envFile of envFiles) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    break;
  }
}

const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();

// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing Supabase environment variables.');
  console.error('Please ensure your .env file contains:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

async function main() {
  console.log('🔄 Reset and Seed Script\n');
  console.log('This will:');
  console.log('1. Delete all admin records from database');
  if (supabaseAdmin) {
    console.log('2. Delete all users from Supabase Auth');
    console.log('3. Create new users with AUTO-CONFIRMED emails (no email confirmation needed!)');
    console.log('4. Create admin records in database\n');
  } else {
    console.log('2. Use existing users from Supabase Auth (or create new ones)');
    console.log('3. Create admin records in database\n');
    console.log('⚠️  Note: Without SUPABASE_SERVICE_ROLE_KEY, email confirmation may be required');
    console.log('   To disable email confirmation:');
    console.log('   Supabase Dashboard > Authentication > Settings > Disable "Confirm email"\n');
  }

  // Define admins to seed (all with admin role)
  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      password: 'Admin@123456',
      name: 'Main Administrator',
      role: 'admin', // Only admin role
    },
    {
      email: 'manager@alhulool-almuthla.com',
      password: 'Manager@123456',
      name: 'Manager',
      role: 'admin', // Only admin role
    },
  ];

  try {
    // Step 1: Delete all admin records from database
    console.log('🗑️  Step 1: Deleting all admin records from database...');
    const deletedAdmins = await prisma.admin.deleteMany({});
    console.log(`   ✅ Deleted ${deletedAdmins.count} admin record(s)\n`);

    // Step 2: Delete users from Supabase Auth (if service role key available)
    if (supabaseAdmin) {
      console.log('🗑️  Step 2: Deleting users from Supabase Auth...');
      
      for (const adminData of admins) {
        try {
          // Get user by email
          const { data: users } = await supabaseAdmin.auth.admin.listUsers();
          const user = users?.users?.find(u => u.email === adminData.email);
          
          if (user) {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
            if (error) {
              console.log(`   ⚠️  Could not delete ${adminData.email}: ${error.message}`);
            } else {
              console.log(`   ✅ Deleted user: ${adminData.email}`);
            }
          } else {
            console.log(`   ℹ️  User ${adminData.email} not found in Supabase Auth`);
          }
        } catch (error) {
          console.log(`   ⚠️  Error deleting ${adminData.email}: ${error.message}`);
        }
      }
      console.log('');
    }

    // Step 3: Create users in Supabase Auth
    console.log('👤 Step 3: Creating/Updating users in Supabase Auth...');
    
    for (const adminData of admins) {
      try {
        let supabaseUserId = null;

        if (supabaseAdmin) {
          // Use admin API to create user with confirmed email
          console.log(`   Creating ${adminData.email}...`);
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: adminData.email,
            password: adminData.password,
            email_confirm: true, // Auto-confirm email
          });

          if (authError) {
            console.error(`   ❌ Error: ${authError.message}`);
            continue;
          }

          if (authUser?.user) {
            supabaseUserId = authUser.user.id;
            console.log(`   ✅ User created (ID: ${supabaseUserId})`);
          }
        } else {
          // Use regular API - try to create user directly
          console.log(`   Creating ${adminData.email}...`);
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: adminData.email,
            password: adminData.password,
          });

          if (signUpError) {
            if (signUpError.message.includes('already registered') || 
                signUpError.message.includes('already exists') || 
                signUpError.message.includes('invalid')) {
              console.log(`   ⚠️  User still exists in Supabase Auth`);
              console.log(`   💡 Please make sure you deleted the user from:`);
              console.log(`      Supabase Dashboard > Authentication > Users`);
              console.log(`   Then wait a few seconds and run this script again\n`);
              continue;
            } else {
              console.error(`   ❌ Error: ${signUpError.message}\n`);
              continue;
            }
          } else if (signUpData?.user) {
            supabaseUserId = signUpData.user.id;
            console.log(`   ✅ User created successfully (ID: ${supabaseUserId})`);
            console.log(`   ⚠️  Email may need manual confirmation in Supabase Dashboard`);
          } else {
            console.error(`   ❌ Failed to create user - no user data returned\n`);
            continue;
          }
        }

        if (!supabaseUserId) {
          console.error(`   ❌ Could not get User ID for ${adminData.email}\n`);
          continue;
        }

        // Step 4: Create admin record in database
        console.log(`   📝 Creating admin record...`);
        const admin = await prisma.admin.create({
          data: {
            email: adminData.email,
            name: adminData.name,
            role: adminData.role,
            supabaseUserId: supabaseUserId,
          },
        });
        console.log(`   ✅ Admin record created (${admin.role})\n`);
      } catch (error) {
        console.error(`   ❌ Error processing ${adminData.email}: ${error.message}\n`);
      }
    }

    console.log('✨ Reset and seed completed!\n');
    console.log('📝 Login Credentials:');
    admins.forEach(admin => {
      console.log(`   ${admin.email} - Password: ${admin.password}`);
    });
    console.log('\n⚠️  IMPORTANT:');
    console.log('   - Change passwords after first login');
    if (!supabaseServiceKey) {
      console.log('   - If login fails with "Email not confirmed", confirm emails manually in:');
      console.log('     Supabase Dashboard > Authentication > Users');
      console.log('   - To auto-confirm emails, add SUPABASE_SERVICE_ROLE_KEY to .env');
    }
  } catch (error) {
    console.error('❌ Reset and seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
