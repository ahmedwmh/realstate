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
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Simple Seed Script (No Supabase Auth)\n');

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
    // Delete all existing admins
    console.log('🗑️  Deleting all admin records...');
    const deleted = await prisma.admin.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count} admin record(s)\n`);

    // Create new admins
    for (const adminData of admins) {
      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        console.log(`👤 Creating admin: ${adminData.email}...`);
        const admin = await prisma.admin.create({
          data: {
            email: adminData.email,
            password: hashedPassword,
            name: adminData.name,
            role: adminData.role,
          },
        });

        console.log(`   ✅ Admin created (${admin.role})\n`);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    console.log('✨ Seed completed!\n');
    console.log('📝 Login Credentials:');
    admins.forEach(admin => {
      console.log(`   ${admin.email} - Password: ${admin.password}`);
    });
    console.log('\n⚠️  IMPORTANT: Change passwords after first login!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

