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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('🔄 Force Seed - Creating Admin Records\n');

  // Define admins
  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      password: 'Admin@123456',
      name: 'Main Administrator',
      role: 'admin',
    },
    {
      email: 'manager@alhulool-almuthla.com',
      password: 'Manager@123456',
      name: 'Manager',
      role: 'admin',
    },
  ];

  try {
    // Step 1: Delete all admin records
    console.log('🗑️  Deleting all admin records...');
    const deleted = await prisma.admin.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count} admin record(s)\n`);

    // Step 2: Create users and admin records
    for (const adminData of admins) {
      try {
        console.log(`👤 Processing: ${adminData.email}...`);

        // Try to sign up (will create if not exists, or return existing user)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminData.email,
          password: adminData.password,
        });

        let supabaseUserId = null;

        if (signUpData?.user) {
          supabaseUserId = signUpData.user.id;
          console.log(`   ✅ User ID: ${supabaseUserId}`);
        } else if (signUpError) {
          // If user exists, try to sign in to get user ID
          if (signUpError.message.includes('already registered') || 
              signUpError.message.includes('already exists')) {
            console.log(`   ℹ️  User exists, trying to sign in...`);
            
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: adminData.email,
              password: adminData.password,
            });

            if (signInData?.user) {
              supabaseUserId = signInData.user.id;
              console.log(`   ✅ Found user ID: ${supabaseUserId}`);
            } else {
              console.log(`   ⚠️  Could not sign in: ${signInError?.message || 'Unknown error'}`);
              console.log(`   💡 Please check password or confirm email in Supabase Dashboard\n`);
              continue;
            }
          } else {
            console.log(`   ❌ Error: ${signUpError.message}\n`);
            continue;
          }
        }

        if (!supabaseUserId) {
          console.log(`   ❌ Could not get User ID\n`);
          continue;
        }

        // Create admin record
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
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    console.log('✨ Force seed completed!\n');
    console.log('📝 Login Credentials:');
    admins.forEach(admin => {
      console.log(`   ${admin.email} - Password: ${admin.password}`);
    });
    console.log('\n⚠️  If login fails:');
    console.log('   - Confirm emails in Supabase Dashboard > Authentication > Users');
    console.log('   - Or reset passwords in Supabase Dashboard');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

