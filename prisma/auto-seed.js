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

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing Supabase environment variables.');
  console.error('Please ensure your .env file contains:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nYou can find SUPABASE_SERVICE_ROLE_KEY in:');
  console.error('  Supabase Dashboard > Project Settings > API > service_role key');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🚀 Auto Seed Script - Creating users and admin records automatically...\n');

  // Define admins to seed
  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      password: 'Admin@123456', // Change this password after first login!
      name: 'Main Administrator',
      role: 'super_admin',
    },
    {
      email: 'manager@alhulool-almuthla.com',
      password: 'Manager@123456', // Change this password after first login!
      name: 'Manager',
      role: 'admin',
    },
  ];

  for (const adminData of admins) {
    try {
      // Check if admin already exists in database
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      let supabaseUserId = null;

      if (existingAdmin) {
        console.log(`📋 Admin ${adminData.email} already exists in database`);
        supabaseUserId = existingAdmin.supabaseUserId;
        
        // Check if user exists in Supabase Auth
        if (supabaseUserId) {
          try {
            const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(supabaseUserId);
            if (user && !error) {
              console.log(`   ✅ User exists in Supabase Auth (ID: ${supabaseUserId})`);
              console.log(`   ⏭️  Skipping creation...\n`);
              continue;
            }
          } catch (error) {
            console.log(`   ⚠️  User ID ${supabaseUserId} not found in Supabase Auth, will create new user...`);
          }
        }
      }

      // Create or update user in Supabase Auth
      console.log(`👤 Creating/Updating Supabase user for ${adminData.email}...`);
      
      // Check if user exists by email
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === adminData.email);

      if (existingUser) {
        console.log(`   ✅ User already exists in Supabase Auth (ID: ${existingUser.id})`);
        supabaseUserId = existingUser.id;
        
        // Update password if needed
        if (adminData.password) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: adminData.password,
          });
          console.log(`   🔑 Password updated`);
        }
      } else {
        // Create new user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: adminData.email,
          password: adminData.password,
          email_confirm: true, // Auto-confirm email
        });

        if (authError) {
          console.error(`   ❌ Error creating Supabase user:`, authError.message);
          continue;
        }

        if (!authUser.user) {
          console.error(`   ❌ Failed to create Supabase user`);
          continue;
        }

        supabaseUserId = authUser.user.id;
        console.log(`   ✅ User created in Supabase Auth (ID: ${supabaseUserId})`);
      }

      // Create or update admin record in database
      if (existingAdmin) {
        console.log(`📝 Updating admin record for ${adminData.email}...`);
        await prisma.admin.update({
          where: { email: adminData.email },
          data: {
            supabaseUserId: supabaseUserId,
            name: adminData.name,
            role: adminData.role,
          },
        });
        console.log(`   ✅ Admin record updated\n`);
      } else {
        console.log(`📝 Creating admin record for ${adminData.email}...`);
        const admin = await prisma.admin.create({
          data: {
            email: adminData.email,
            name: adminData.name,
            role: adminData.role,
            supabaseUserId: supabaseUserId,
          },
        });
        console.log(`   ✅ Admin record created (${admin.role})\n`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${adminData.email}:`, error.message);
      console.log('');
    }
  }

  console.log('✨ Auto seed completed!');
  console.log('\n📝 Login Credentials:');
  admins.forEach(admin => {
    console.log(`   ${admin.email} - Password: ${admin.password}`);
  });
  console.log('\n⚠️  IMPORTANT: Change passwords after first login!');
}

main()
  .catch((e) => {
    console.error('❌ Auto seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

