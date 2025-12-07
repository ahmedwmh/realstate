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

// Load image URLs if available
let imageUrls = {};
try {
  const urlsFile = path.join(process.cwd(), 'prisma', 'image-urls.json');
  if (fs.existsSync(urlsFile)) {
    imageUrls = JSON.parse(fs.readFileSync(urlsFile, 'utf8'));
  }
} catch (error) {
  console.log('⚠️  Could not load image URLs, using placeholder paths');
}

function getImageUrl(relativePath) {
  return imageUrls[relativePath] || `/images/${relativePath}`;
}

async function main() {
  console.log('🔄 Seeding Hero Slides...\n');

  const heroSlides = [
    {
      order: 0,
      titleEn: "Find Your Next Home Sweet Home",
      titleAr: "ابحث عن منزلك المثالي القادم",
      descriptionEn: "A spacious and modern home with an open floor plan, large windows, and a beautifully landscaped garden, perfect for those seeking peace and tranquility.",
      descriptionAr: "منزل واسع وعصري بتصميم مفتوح ونوافذ كبيرة وحديقة جميلة، مثالي لمن يبحثون عن السلام والهدوء.",
      mainImage: getImageUrl("properties/houses/123-serenity-lane.webp"),
      contentImage: getImageUrl("intro.webp"),
    },
    {
      order: 1,
      titleEn: "Luxury Living Awaits",
      titleAr: "العيش الفاخر ينتظرك",
      descriptionEn: "A beautiful and spacious home with a large garden, swimming pool, and stunning views of the city, perfect for those who love to entertain.",
      descriptionAr: "منزل جميل وواسع مع حديقة كبيرة وحوض سباحة وإطلالات خلابة على المدينة، مثالي لمن يحبون الاستضافة والترفيه.",
      mainImage: getImageUrl("properties/houses/456-harmony-drive.webp"),
      contentImage: getImageUrl("benefit-1.webp"),
    },
    {
      order: 2,
      titleEn: "Your Dream Property",
      titleAr: "عقار أحلامك",
      descriptionEn: "A stunning and luxurious home with a large garden, swimming pool, and breathtaking views of the ocean, perfect for those who love the finer things in life.",
      descriptionAr: "منزل فاخر ومذهل مع حديقة كبيرة وحوض سباحة وإطلالات خلابة على المحيط، مثالي لمن يحبون الأشياء الراقية في الحياة.",
      mainImage: getImageUrl("properties/houses/989-bliss-boulevard.webp"),
      contentImage: getImageUrl("benefit-2.webp"),
    },
    {
      order: 3,
      titleEn: "Modern Urban Living",
      titleAr: "العيش الحضري العصري",
      descriptionEn: "A stylish townhouse with contemporary design, featuring a rooftop terrace, open living spaces, and modern amenities.",
      descriptionAr: "منزل أنيق بتصميم معاصر، يتميز بشرفة على السطح ومساحات معيشة مفتوحة ووسائل راحة حديثة.",
      mainImage: getImageUrl("properties/townhouses/123-modern-townhouse.webp"),
      contentImage: getImageUrl("gallery/01.webp"),
    },
  ];

  try {
    // Delete all existing hero slides
    console.log('🗑️  Deleting all existing hero slides...');
    const deleted = await prisma.heroSlide.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count} hero slide(s)\n`);

    // Create hero slides
    for (const slideData of heroSlides) {
      try {
        console.log(`📸 Creating hero slide: ${slideData.titleEn}...`);
        const slide = await prisma.heroSlide.create({
          data: slideData,
        });

        console.log(`   ✅ Hero slide created\n`);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    console.log('✨ Hero slides seeding completed!\n');
    console.log(`📊 Total slides: ${heroSlides.length}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

