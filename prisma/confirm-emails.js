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

// Initialize Supabase Admin client (if service role key available)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!supabaseUrl) {
  console.error('\n❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

async function main() {
  console.log('📧 Email Confirmation Helper\n');

  const admins = [
    'admin@alhulool-almuthla.com',
    'manager@alhulool-almuthla.com',
  ];

  if (supabaseServiceKey) {
    console.log('✅ Service Role Key found - Using Admin API to confirm emails...\n');
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    for (const email of admins) {
      try {
        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (!admin || !admin.supabaseUserId) {
          console.log(`⏭️  Skipping ${email} - Admin record not found\n`);
          continue;
        }

        console.log(`📧 Confirming email for: ${email}...`);
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
          admin.supabaseUserId,
          {
            email_confirm: true,
          }
        );

        if (error) {
          console.error(`   ❌ Error: ${error.message}\n`);
        } else {
          console.log(`   ✅ Email confirmed!\n`);
        }
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }
  } else {
    console.log('⚠️  Service Role Key not found.\n');
    console.log('📋 Manual Confirmation Instructions:\n');
    console.log('1. Go to: Supabase Dashboard > Authentication > Users');
    console.log('2. Find each user by email:');
    admins.forEach(email => {
      console.log(`   - ${email}`);
    });
    console.log('3. Click on each user');
    console.log('4. Look for "Email Confirmed" status');
    console.log('5. If not confirmed, click "Confirm Email" or "Send Confirmation Email"\n');
    console.log('💡 Alternative: Add SUPABASE_SERVICE_ROLE_KEY to .env to auto-confirm');
    console.log('   You can find it in: Supabase Dashboard > Project Settings > API > service_role key\n');
  }

  console.log('✨ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

