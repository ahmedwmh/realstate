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
      generalInfo: {
        itemsEn: [
          "This beautifully designed project offers a fantastic opportunity for a serene and spacious living environment in the desirable Serenity Lane community.",
          "The home features a light and bright floor plan with a large living room, dining area, and a spacious kitchen with a breakfast bar and plenty of cabinet and counter space.",
          "The master bedroom is large and comfortable, and the master bath features a large tub/shower combo.",
          "The second and third bedrooms are also spacious and comfortable, perfect for families or guests.",
        ],
        itemsAr: [
          "يوفر هذا المشروع المصمم بشكل جميل فرصة رائعة لبيئة معيشة هادئة وواسعة في مجتمع سيرينيتي لين المرغوب فيه.",
          "يتميز المنزل بخطة أرضية مضيئة ومشرقة مع غرفة معيشة كبيرة ومنطقة طعام ومطبخ واسع مع بار إفطار والكثير من مساحة الخزائن والعدادات.",
          "الغرفة الرئيسية كبيرة ومريحة، وتتميز الحمام الرئيسي بحوض استحمام/دش كبير.",
          "الغرفتان الثانية والثالثة أيضًا واسعتان ومريحتان، مثالية للعائلات أو الضيوف.",
        ],
      },
      interiorDetails: {
        itemsEn: [
          "Modern kitchen with stainless steel appliances and granite countertops.",
          "Hardwood flooring throughout the main living areas.",
          "Large windows providing abundant natural light.",
        ],
        itemsAr: [
          "مطبخ حديث مع أجهزة من الفولاذ المقاوم للصدأ وأسطح من الجرانيت.",
          "أرضيات خشبية صلبة في جميع مناطق المعيشة الرئيسية.",
          "نوافذ كبيرة توفر إضاءة طبيعية وفيرة.",
        ],
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
      generalInfo: {
        itemsEn: [
          "Luxurious modern villas with contemporary architecture and premium finishes throughout.",
          "Each villa includes a private garden and outdoor entertainment area perfect for family gatherings.",
          "Spacious open-plan living areas with high ceilings and large windows.",
          "Premium location in Beverly Hills with easy access to shopping, dining, and entertainment.",
        ],
        itemsAr: [
          "فلل حديثة فاخرة مع هندسة معمارية معاصرة وتشطيبات فاخرة في جميع أنحاء المنزل.",
          "تتضمن كل فيلا حديقة خاصة ومنطقة ترفيه خارجية مثالية لتجمعات العائلة.",
          "مناطق معيشة واسعة مفتوحة مع أسقف عالية ونوافذ كبيرة.",
          "موقع فاخر في بيفرلي هيلز مع سهولة الوصول إلى التسوق والمطاعم والترفيه.",
        ],
      },
      interiorDetails: {
        itemsEn: [
          "Smart home technology integrated throughout with automated lighting, climate control, and security systems.",
          "Premium kitchen with Italian marble countertops and professional-grade appliances.",
          "Master suite with walk-in closet and spa-like bathroom with jacuzzi.",
          "Home theater and entertainment room for family enjoyment.",
        ],
        itemsAr: [
          "تكنولوجيا المنزل الذكي مدمجة في جميع أنحاء المنزل مع إضاءة آلية ومراقبة المناخ وأنظمة الأمان.",
          "مطبخ فاخر مع أسطح رخام إيطالي وأجهزة احترافية.",
          "جناح رئيسي مع خزانة ملابس كبيرة وحمام يشبه المنتجع الصحي مع جاكوزي.",
          "مسرح منزلي وغرفة ترفيه للاستمتاع العائلي.",
        ],
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
      generalInfo: {
        itemsEn: [
          "Modern townhouses designed for urban living with contemporary style and functionality.",
          "Prime location in San Francisco with excellent public transportation access.",
          "Community amenities include shared courtyard, fitness center, and parking facilities.",
          "Energy-efficient design with solar panels and smart home features.",
        ],
        itemsAr: [
          "تاون هاوس حديثة مصممة للعيش الحضري مع أسلوب معاصر ووظيفية.",
          "موقع ممتاز في سان فرانسيسكو مع وصول ممتاز لوسائل النقل العام.",
          "تشمل مرافق المجتمع فناء مشترك ومركز لياقة بدنية ومرافق وقوف السيارات.",
          "تصميم موفر للطاقة مع ألواح شمسية وميزات المنزل الذكي.",
        ],
      },
      interiorDetails: {
        itemsEn: [
          "Open-concept living space with modern finishes and natural light.",
          "Rooftop terrace with city views, perfect for entertaining or relaxation.",
          "Modern kitchen with quartz countertops and energy-efficient appliances.",
          "Spacious bedrooms with ample storage and modern bathroom fixtures.",
        ],
        itemsAr: [
          "مساحة معيشة مفتوحة مع تشطيبات حديثة وإضاءة طبيعية.",
          "شرفة على السطح مع إطلالات على المدينة، مثالية للترفيه أو الاسترخاء.",
          "مطبخ حديث مع أسطح كوارتز وأجهزة موفرة للطاقة.",
          "غرف نوم واسعة مع تخزين وفير وتركيبات حمام حديثة.",
        ],
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
      generalInfo: {
        itemsEn: [
          "Prime commercial location in the heart of New York's business district with high foot traffic.",
          "Modern building with state-of-the-art facilities and professional management.",
          "Flexible floor plans suitable for offices, retail, restaurants, or mixed-use purposes.",
          "Excellent connectivity with multiple subway lines and bus routes nearby.",
        ],
        itemsAr: [
          "موقع تجاري ممتاز في قلب منطقة الأعمال في نيويورك مع حركة مرور عالية.",
          "مبنى حديث مع مرافق حديثة وإدارة احترافية.",
          "خطط أرضية مرنة مناسبة للمكاتب والتجارة والمطاعم أو الاستخدامات المختلطة.",
          "اتصال ممتاز مع خطوط مترو أنفاق متعددة وطرق حافلات قريبة.",
        ],
      },
      interiorDetails: {
        itemsEn: [
          "Modern office spaces with floor-to-ceiling windows and open layouts.",
          "Retail units with storefront windows and high visibility from the street.",
          "Professional-grade HVAC systems and high-speed internet infrastructure.",
          "Ample parking facilities and loading docks for commercial operations.",
        ],
        itemsAr: [
          "مساحات مكتبية حديثة مع نوافذ من الأرض إلى السقف وتخطيطات مفتوحة.",
          "وحدات تجارية مع نوافذ واجهة متجر ووضوح عالي من الشارع.",
          "أنظمة تكييف هواء احترافية وبنية تحتية إنترنت عالية السرعة.",
          "مرافق وقوف سيارات واسعة وأرصفة تحميل للعمليات التجارية.",
        ],
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
      generalInfo: {
        itemsEn: [
          "Modern apartment complex in a peaceful suburban setting with easy access to downtown Chicago.",
          "Well-maintained community with professional on-site management and maintenance staff.",
          "Pet-friendly building with nearby parks and walking trails.",
          "Close proximity to schools, shopping centers, and healthcare facilities.",
        ],
        itemsAr: [
          "مجمع شقق حديث في إعداد ضاحوي هادئ مع سهولة الوصول إلى وسط مدينة شيكاغو.",
          "مجتمع محافظ عليه جيدًا مع إدارة احترافية في الموقع وطاقم صيانة.",
          "مبنى صديق للحيوانات الأليفة مع حدائق قريبة ومسارات للمشي.",
          "قرب من المدارس ومراكز التسوق والمرافق الصحية.",
        ],
      },
      interiorDetails: {
        itemsEn: [
          "Spacious apartments with modern layouts and efficient use of space.",
          "Updated kitchens with stainless steel appliances and ample cabinet storage.",
          "Large windows providing natural light and views of the surrounding area.",
          "In-unit laundry facilities and climate control for year-round comfort.",
        ],
        itemsAr: [
          "شقق واسعة مع تخطيطات حديثة واستخدام فعال للمساحة.",
          "مطابخ محدثة مع أجهزة من الفولاذ المقاوم للصدأ وتخزين خزائن وفير.",
          "نوافذ كبيرة توفر إضاءة طبيعية وإطلالات على المنطقة المحيطة.",
          "مرافق غسيل داخل الوحدة ومراقبة المناخ للراحة على مدار السنة.",
        ],
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

