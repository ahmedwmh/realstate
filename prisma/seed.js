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

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');
  console.log('📝 This script will create admin records in the database.');
  console.log('⚠️  Make sure you have already created these users in Supabase Auth first!\n');

  // Define admins to seed
  // IMPORTANT: You must create these users in Supabase Auth first, then get their User IDs
  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      supabaseUserId: null, // Will be filled from Supabase Auth User ID
      name: 'Main Administrator',
      role: 'super_admin',
    },
    {
      email: 'manager@alhulool-almuthla.com',
      supabaseUserId: null, // Will be filled from Supabase Auth User ID
      name: 'Manager',
      role: 'admin',
    },
  ];

  console.log('📋 Instructions:');
  console.log('1. Go to Supabase Dashboard > Authentication > Users');
  console.log('2. Create users with these emails:');
  admins.forEach(admin => {
    console.log(`   - ${admin.email}`);
  });
  console.log('3. Copy the User ID for each user');
  console.log('4. Update the supabaseUserId in prisma/seed.js\n');

  // Check if admins already exist
  for (const adminData of admins) {
    try {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        console.log(`⏭️  Admin ${adminData.email} already exists, skipping...`);
        continue;
      }

      // If supabaseUserId is null, skip and show message
      if (!adminData.supabaseUserId) {
        console.log(`⚠️  Skipping ${adminData.email} - supabaseUserId not set.`);
        console.log(`   Please create this user in Supabase Auth and update the seed file.\n`);
        continue;
      }

      // Create admin record in database
      console.log(`📝 Creating admin record for ${adminData.email}...`);
      const admin = await prisma.admin.create({
        data: {
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
          supabaseUserId: adminData.supabaseUserId,
        },
      });

      console.log(`✅ Successfully created admin: ${admin.email} (${admin.role})\n`);
    } catch (error) {
      console.error(`❌ Error seeding admin ${adminData.email}:`, error.message);
    }
  }

  console.log('✨ Seed completed!');
  console.log('\n💡 Tip: After creating users in Supabase Auth, update supabaseUserId in seed.js and run again.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

