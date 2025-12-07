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
  console.log('🔧 Update Admin User IDs Script\n');
  console.log('This will help you update the Supabase User IDs for existing admins.\n');

  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      currentUserId: '1234556',
    },
    {
      email: 'manager@alhulool-almuthla.com',
      currentUserId: '12321233',
    },
  ];

  for (const adminData of admins) {
    try {
      // Get current admin
      const admin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      if (!admin) {
        console.log(`❌ Admin ${adminData.email} not found in database.\n`);
        continue;
      }

      console.log(`\n📝 Updating: ${adminData.email}`);
      console.log(`   Current User ID: ${admin.supabaseUserId}`);
      console.log('\n⚠️  IMPORTANT: You must create this user in Supabase Auth first!');
      console.log('   1. Go to: Supabase Dashboard > Authentication > Users');
      console.log('   2. Create user with email:', adminData.email);
      console.log('   3. Copy the User ID (UUID format like: a1b2c3d4-e5f6-7890-abcd-ef1234567890)');
      console.log('   4. Or press Enter to skip this admin\n');

      const newUserId = await question(`Enter NEW Supabase User ID for ${adminData.email} (or press Enter to skip): `);

      if (!newUserId || newUserId.trim() === '') {
        console.log(`⏭️  Skipping ${adminData.email}\n`);
        continue;
      }

      // Validate UUID format (basic check)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(newUserId.trim())) {
        console.log(`⚠️  Warning: The User ID doesn't look like a valid UUID.`);
        const confirm = await question('Continue anyway? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
          console.log(`⏭️  Skipping ${adminData.email}\n`);
          continue;
        }
      }

      // Update admin record
      console.log(`📝 Updating admin record...`);
      const updatedAdmin = await prisma.admin.update({
        where: { email: adminData.email },
        data: {
          supabaseUserId: newUserId.trim(),
        },
      });

      console.log(`✅ Successfully updated admin: ${updatedAdmin.email}`);
      console.log(`   New User ID: ${updatedAdmin.supabaseUserId}\n`);
    } catch (error) {
      console.error(`❌ Error updating admin ${adminData.email}:`, error.message);
      console.log('');
    }
  }

  console.log('✨ Update completed!');
  console.log('\n💡 Now try logging in with the email and password you set in Supabase Auth.');
  rl.close();
}

main()
  .catch((e) => {
    console.error('❌ Update failed:', e);
    rl.close();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

