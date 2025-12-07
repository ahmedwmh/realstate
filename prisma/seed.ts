import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

// Initialize Supabase Admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  console.log('🌱 Starting seed...\n');

  // Define admins to seed
  const admins = [
    {
      email: 'admin@alhulool-almuthla.com',
      password: 'Admin@123456', // Change this password after first login!
      name: 'Main Administrator',
      role: 'super_admin' as const,
    },
    {
      email: 'manager@alhulool-almuthla.com',
      password: 'Manager@123456', // Change this password after first login!
      name: 'Manager',
      role: 'admin' as const,
    },
  ];

  for (const adminData of admins) {
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        console.log(`⏭️  Admin ${adminData.email} already exists, skipping...`);
        continue;
      }

      // Create user in Supabase Auth
      console.log(`👤 Creating Supabase user for ${adminData.email}...`);
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: adminData.email,
        password: adminData.password,
        email_confirm: true, // Auto-confirm email
      });

      if (authError) {
        console.error(`❌ Error creating Supabase user for ${adminData.email}:`, authError.message);
        continue;
      }

      if (!authUser.user) {
        console.error(`❌ Failed to create Supabase user for ${adminData.email}`);
        continue;
      }

      // Hash password (using a simple hash for seed, in production use bcrypt)
      // Note: Since we're using Supabase Auth, we don't need to store password in Admin table
      // The password is managed by Supabase Auth
      const hashedPassword = 'supabase_auth'; // Placeholder since password is in Supabase Auth

      // Create admin record in database
      console.log(`📝 Creating admin record for ${adminData.email}...`);
      const admin = await prisma.admin.create({
        data: {
          email: adminData.email,
          password: hashedPassword, // Placeholder, actual auth is handled by Supabase
          name: adminData.name,
          role: adminData.role,
        },
      });

      console.log(`✅ Successfully created admin: ${admin.email} (${admin.role})\n`);
    } catch (error) {
      console.error(`❌ Error seeding admin ${adminData.email}:`, error);
    }
  }

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

