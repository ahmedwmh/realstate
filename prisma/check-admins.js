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
  console.log('🔍 Checking admin records in database...\n');

  const admins = [
    'admin@alhulool-almuthla.com',
    'manager@alhulool-almuthla.com',
  ];

  for (const email of admins) {
    try {
      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (admin) {
        console.log(`✅ Found admin: ${email}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Supabase User ID: ${admin.supabaseUserId}`);
        console.log('');
      } else {
        console.log(`❌ Admin NOT found: ${email}`);
        console.log(`   Run seed script after creating user in Supabase Auth\n`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${email}:`, error.message);
    }
  }

  console.log('💡 To create admins:');
  console.log('1. Create users in Supabase Dashboard > Authentication > Users');
  console.log('2. Copy their User IDs');
  console.log('3. Update prisma/seed.js with User IDs');
  console.log('4. Run: npm run db:seed');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

