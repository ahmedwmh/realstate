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
  console.log('🔄 Seeding Projects...\n');

  const projects = [
    {
      titleEn: "Serenity Lane Residential Complex",
      titleAr: "مجمع سكني سيرينيتي لين",
      descriptionEn: "A luxurious residential complex featuring modern architecture, spacious units, and premium amenities. Located in a prime location with easy access to schools, shopping centers, and healthcare facilities.",
      descriptionAr: "مجمع سكني فاخر يتميز بالهندسة المعمارية الحديثة والوحدات الواسعة والمرافق الفاخرة. يقع في موقع ممتاز مع سهولة الوصول إلى المدارس ومراكز التسوق والمرافق الصحية.",
      category: "Houses",
      images: [
        getImageUrl("properties/houses/123-serenity-lane.webp"),
        getImageUrl("properties/houses/123-serenity-lane-kitchen.webp"),
        getImageUrl("properties/houses/123-serenity-lane-living-room.webp"),
        getImageUrl("properties/houses/123-serenity-lane-bedroom.webp"),
      ],
      address: "123 Serenity Lane, Los Angeles, CA",
      features: {
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2500,
      },
    },
    {
      titleEn: "Harmony Drive Modern Villas",
      titleAr: "فلل هارموني درايف الحديثة",
      descriptionEn: "Contemporary villas designed for modern living. Each villa features private gardens, modern interiors, and smart home technology. Perfect for families seeking luxury and comfort.",
      descriptionAr: "فلل معاصرة مصممة للعيش الحديث. تتميز كل فيلا بحدائق خاصة وديكورات داخلية حديثة وتكنولوجيا المنزل الذكي. مثالية للعائلات التي تبحث عن الفخامة والراحة.",
      category: "Villas",
      images: [
        getImageUrl("properties/houses/456-harmony-drive.webp"),
        getImageUrl("properties/villas/luxury-estate-villa.webp"),
        getImageUrl("properties/villas/ocean-view-villa.webp"),
      ],
      address: "456 Harmony Drive, Beverly Hills, CA",
      features: {
        bedrooms: 4,
        bathrooms: 3,
        sqft: 3500,
      },
    },
    {
      titleEn: "Bliss Boulevard Townhouses",
      titleAr: "تاون هاوس بليس بوليفارد",
      descriptionEn: "Elegant townhouses in a vibrant community. Features include rooftop terraces, modern kitchens, and proximity to urban amenities. Ideal for young professionals and small families.",
      descriptionAr: "تاون هاوس أنيقة في مجتمع نابض بالحياة. تشمل الميزات شرفات على السطح ومطابخ حديثة وقرب من المرافق الحضرية. مثالية للشباب المحترفين والعائلات الصغيرة.",
      category: "Townhouses",
      images: [
        getImageUrl("properties/townhouses/123-modern-townhouse.webp"),
        getImageUrl("properties/townhouses/456-urban-townhouse.webp"),
        getImageUrl("properties/townhouses/789-suburban-townhouse.webp"),
      ],
      address: "789 Bliss Boulevard, San Francisco, CA",
      features: {
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1800,
      },
    },
    {
      titleEn: "Downtown Commercial Complex",
      titleAr: "مجمع تجاري وسط المدينة",
      descriptionEn: "Prime commercial space in the heart of the city. Features modern office spaces, retail units, and excellent connectivity. Perfect for businesses looking to establish a strong presence.",
      descriptionAr: "مساحة تجارية ممتازة في قلب المدينة. تتميز بمساحات مكتبية حديثة ووحدات تجارية واتصال ممتاز. مثالية للشركات التي تسعى لإنشاء وجود قوي.",
      category: "Commercial",
      images: [
        getImageUrl("properties/commercial/downtown-office.webp"),
        getImageUrl("properties/commercial/retail-space.webp"),
        getImageUrl("properties/commercial/industrial-warehouse.webp"),
      ],
      address: "100 Business District, New York, NY",
      features: {
        sqft: 10000,
        units: 20,
      },
    },
    {
      titleEn: "Suburban Apartment Complex",
      titleAr: "مجمع شقق الضواحي",
      descriptionEn: "Modern apartment complex offering comfortable living spaces with contemporary amenities. Features include fitness center, swimming pool, and 24/7 security.",
      descriptionAr: "مجمع شقق حديث يوفر مساحات معيشة مريحة مع مرافق معاصرة. تشمل الميزات مركز لياقة بدنية وحوض سباحة وأمان على مدار الساعة.",
      category: "Condos",
      images: [
        getImageUrl("properties/apartments/321-suburban-apartment.webp"),
        getImageUrl("properties/apartments/456-city-apartment.webp"),
        getImageUrl("properties/apartments/789-downtown-loft.webp"),
      ],
      address: "321 Suburban Avenue, Chicago, IL",
      features: {
        bedrooms: 1,
        bathrooms: 1,
        sqft: 800,
      },
    },
  ];

  try {
    // Delete all existing projects
    console.log('🗑️  Deleting all existing projects...');
    const deleted = await prisma.project.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count} project(s)\n`);

    // Create projects
    for (const projectData of projects) {
      try {
        console.log(`🏗️  Creating project: ${projectData.titleEn}...`);
        const project = await prisma.project.create({
          data: projectData,
        });

        console.log(`   ✅ Project created\n`);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    console.log('✨ Projects seeding completed!\n');
    console.log(`📊 Total projects: ${projects.length}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

