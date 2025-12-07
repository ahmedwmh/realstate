// Load environment variables
const path = require('path');
const fs = require('fs');
const readline = require('readline');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🌱 Interactive Admin Seed Script\n');
  console.log('This will help you create admin records.\n');

  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      name: 'Main Administrator',
      role: 'super_admin',
    },
    {
      email: 'manager@alhulool-almuthla.com',
      name: 'Manager',
      role: 'admin',
    },
  ];

  for (const adminData of admins) {
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        console.log(`⏭️  Admin ${adminData.email} already exists, skipping...\n`);
        continue;
      }

      console.log(`\n📝 Setting up: ${adminData.email}`);
      console.log(`   Role: ${adminData.role}`);
      console.log('\n⚠️  IMPORTANT: You must create this user in Supabase Auth first!');
      console.log('   1. Go to: Supabase Dashboard > Authentication > Users');
      console.log('   2. Click "Add user" or "Create new user"');
      console.log(`   3. Email: ${adminData.email}`);
      console.log('   4. Password: (choose a secure password)');
      console.log('   5. Auto Confirm User: ✓ (enable this)');
      console.log('   6. Copy the User ID (UUID) after creation\n');

      const supabaseUserId = await question(`Enter Supabase User ID for ${adminData.email}: `);

      if (!supabaseUserId || supabaseUserId.trim() === '') {
        console.log(`⚠️  Skipping ${adminData.email} - no User ID provided.\n`);
        continue;
      }

      // Create admin record
      console.log(`📝 Creating admin record...`);
      const admin = await prisma.admin.create({
        data: {
          email: adminData.email,
          name: adminData.name,
          role: adminData.role,
          supabaseUserId: supabaseUserId.trim(),
        },
      });

      console.log(`✅ Successfully created admin: ${admin.email} (${admin.role})\n`);
    } catch (error) {
      console.error(`❌ Error seeding admin ${adminData.email}:`, error.message);
      console.log('');
    }
  }

  console.log('✨ Seed completed!');
  rl.close();
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    rl.close();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

