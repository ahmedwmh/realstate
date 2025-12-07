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

const { createClient } = require('@supabase/supabase-js');
const fsPromises = require('fs').promises;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const bucketName = process.env.BUCKET_NAME || process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || 'images';

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!supabaseServiceKey && !supabaseAnonKey) {
  console.error('❌ Missing Supabase keys. Need either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createClient(supabaseUrl, supabaseAnonKey);

async function uploadImage(filePath, bucketPath) {
  try {
    const fileBuffer = await fsPromises.readFile(filePath);
    const fileName = path.basename(filePath);
    const fullPath = `${bucketPath}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/webp'
      });

    if (error) {
      console.error(`   ❌ Error uploading ${fileName}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fullPath);

    console.log(`   ✅ Uploaded: ${fileName}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`   ❌ Error reading ${filePath}:`, error.message);
    return null;
  }
}

async function uploadDirectory(dirPath, bucketPath) {
  const files = await fsPromises.readdir(dirPath);
  const urls = {};

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fsPromises.stat(filePath);

    if (stat.isDirectory()) {
      const subUrls = await uploadDirectory(filePath, `${bucketPath}/${file}`);
      Object.assign(urls, subUrls);
    } else if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const url = await uploadImage(filePath, bucketPath);
      if (url) {
        const relativePath = path.relative('public/images', filePath).replace(/\\/g, '/');
        urls[relativePath] = url;
      }
    }
  }

  return urls;
}

async function main() {
  console.log('📤 Uploading images to Supabase Storage...\n');
  console.log(`Bucket: ${bucketName}\n`);

  const imagesDir = path.join(process.cwd(), 'public/images');
  
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ Images directory not found:', imagesDir);
    process.exit(1);
  }

  const urls = await uploadDirectory(imagesDir, 'images');
  
  console.log('\n✨ Upload completed!\n');
  console.log('📋 Uploaded images:');
  Object.entries(urls).forEach(([relativePath, url]) => {
    console.log(`   ${relativePath} -> ${url}`);
  });

  // Save URLs to a JSON file for reference
  const urlsFile = path.join(process.cwd(), 'prisma', 'image-urls.json');
  await fsPromises.writeFile(urlsFile, JSON.stringify(urls, null, 2));
  console.log(`\n💾 URLs saved to: ${urlsFile}`);
}

main().catch(console.error);

