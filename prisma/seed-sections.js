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
  console.log('🌱 Starting sections seed...\n');

  try {
    // Seed Benefits
    console.log('📋 Seeding Benefits...');
    
    // Clear existing benefits
    await prisma.benefitItem.deleteMany({});
    await prisma.benefit.deleteMany({});

    const benefits = [
      {
        titleEn: "Why choose us?",
        titleAr: "لماذا تختارنا؟",
        descriptionEn: "We are committed to providing exceptional service and unparalleled expertise in the real estate market. Our features are designed to ensure a smooth and rewarding experience for our clients, whether you are buying, selling, or investing.",
        descriptionAr: "نحن ملتزمون بتقديم خدمة استثنائية وخبرة لا مثيل لها في سوق العقارات. تم تصميم ميزاتنا لضمان تجربة سلسة ومجزية لعملائنا، سواء كنت تشتري أو تبيع أو تستثمر.",
        image: "/images/benefit-1.webp",
        order: 1,
        items: [
          {
            titleEn: "Expert agents",
            titleAr: "وكلاء خبراء",
            order: 0,
          },
          {
            titleEn: "Comprehensive listings",
            titleAr: "قوائم شاملة",
            order: 1,
          },
          {
            titleEn: "Personalized service",
            titleAr: "خدمة مخصصة",
            order: 2,
          },
        ],
      },
      {
        titleEn: "Benefits of choosing Al Hulool Al Muthla",
        titleAr: "فوائد اختيار الحلول المثلى",
        descriptionEn: "We offer a range of benefits that set us apart from other real estate agencies. Our team of experts will guide you through the process, ensuring you get the best deal possible.",
        descriptionAr: "نحن نقدم مجموعة من الفوائد التي تميزنا عن وكالات العقارات الأخرى. سيرشدك فريق الخبراء لدينا خلال العملية، مما يضمن حصولك على أفضل صفقة ممكنة.",
        image: "/images/benefit-2.webp",
        order: 2,
        items: [
          {
            titleEn: "Tailored approach",
            titleAr: "نهج مخصص",
            order: 0,
          },
          {
            titleEn: "Extensive network",
            titleAr: "شبكة واسعة",
            order: 1,
          },
          {
            titleEn: "Proven track record",
            titleAr: "سجل حافل",
            order: 2,
          },
        ],
      },
    ];

    for (const benefitData of benefits) {
      const { items, ...benefitFields } = benefitData;
      const benefit = await prisma.benefit.create({
        data: {
          ...benefitFields,
          items: {
            create: items,
          },
        },
      });
      console.log(`   ✅ Created benefit: ${benefit.titleEn}`);
    }

    // Seed Facts
    console.log('\n📊 Seeding Facts...');
    
    await prisma.fact.deleteMany({});

    const facts = [
      {
        icon: "HappyHeart",
        title: "98%",
        descriptionEn: "With a client satisfaction rate of 98%, our commitment to exceptional service and personalized support is evident in every interaction.",
        descriptionAr: "مع معدل رضا العملاء بنسبة 98%، التزامنا بالخدمة الاستثنائية والدعم المخصص واضح في كل تفاعل.",
        order: 1,
      },
      {
        icon: "Building",
        title: "300+",
        descriptionEn: "We have over 300 clients, ranging from small businesses to Fortune 500 companies, who trust us to manage their digital marketing needs.",
        descriptionAr: "لدينا أكثر من 300 عميل، من الشركات الصغيرة إلى شركات Fortune 500، الذين يثقون بنا لإدارة احتياجاتهم التسويقية الرقمية.",
        order: 2,
      },
      {
        icon: "Medal",
        title: "15",
        descriptionEn: "Our team of 15 experts is dedicated to providing the highest quality service and support to our clients.",
        descriptionAr: "فريقنا المكون من 15 خبيرًا ملتزم بتقديم أعلى جودة من الخدمة والدعم لعملائنا.",
        order: 3,
      },
    ];

    for (const fact of facts) {
      const created = await prisma.fact.create({
        data: fact,
      });
      console.log(`   ✅ Created fact: ${created.title}`);
    }

    // Seed Services
    console.log('\n🛠️  Seeding Services...');
    
    await prisma.service.deleteMany({});

    const services = [
      {
        icon: "House",
        titleEn: "Buying a home",
        titleAr: "شراء منزل",
        descriptionEn: "We provide expert guidance and support to help you secure the best mortgage rates and terms.",
        descriptionAr: "نوفر التوجيه والدعم الخبير لمساعدتك في الحصول على أفضل أسعار وشروط الرهن العقاري.",
        order: 1,
      },
      {
        icon: "TrendUp",
        titleEn: "Selling your property",
        titleAr: "بيع ممتلكاتك",
        descriptionEn: "We offer comprehensive services to sell your property quickly and at the best price.",
        descriptionAr: "نقدم خدمات شاملة لبيع ممتلكاتك بسرعة وبأفضل سعر.",
        order: 2,
      },
      {
        icon: "Building",
        titleEn: "Property management",
        titleAr: "إدارة الممتلكات",
        descriptionEn: "Our property management services ensure that your investment is well-maintained and profitable.",
        descriptionAr: "تضمن خدمات إدارة الممتلكات لدينا أن استثمارك محافظ عليه ومربح.",
        order: 3,
      },
      {
        icon: "Bag",
        titleEn: "Investment consultation",
        titleAr: "استشارة الاستثمار",
        descriptionEn: "Our investment consultants provide expert advice and strategic planning to help you build wealth.",
        descriptionAr: "يوفر مستشارو الاستثمار لدينا المشورة الخبيرة والتخطيط الاستراتيجي لمساعدتك في بناء الثروة.",
        order: 4,
      },
      {
        icon: "BubbleChart",
        titleEn: "Market analysis",
        titleAr: "تحليل السوق",
        descriptionEn: "Our market analysis services provide you with detailed insights into the current market trends.",
        descriptionAr: "توفر خدمات تحليل السوق لدينا رؤى مفصلة حول اتجاهات السوق الحالية.",
        order: 5,
      },
      {
        icon: "DoubleBed",
        titleEn: "Home staging",
        titleAr: "تجهيز المنزل",
        descriptionEn: "Our home staging services enhance the appeal of your property, making it more attractive to potential buyers.",
        descriptionAr: "تعزز خدمات تجهيز المنزل لدينا جاذبية ممتلكاتك، مما يجعلها أكثر جاذبية للمشترين المحتملين.",
        order: 6,
      },
    ];

    for (const service of services) {
      const created = await prisma.service.create({
        data: service,
      });
      console.log(`   ✅ Created service: ${created.titleEn}`);
    }

    // Seed Showcase
    console.log('\n🎬 Seeding Showcase...');
    
    await prisma.showcase.deleteMany({});

    const showcase = {
      titleEn: "Experience Our Properties in Action",
      titleAr: "اختبر ممتلكاتنا في العمل",
      descriptionEn: "Explore our collection of videos showcasing our stunning properties, client testimonials, virtual tours, and expert advice.",
      descriptionAr: "استكشف مجموعتنا من مقاطع الفيديو التي تعرض ممتلكاتنا الرائعة وشهادات العملاء والجولات الافتراضية والمشورة الخبيرة.",
      thumbnailImage: "/images/video.webp",
      videoUrl: "https://www.youtube.com/embed/e0qNKnwV40E?si=n93FTEud-6g2LhAH",
    };

    const createdShowcase = await prisma.showcase.create({
      data: showcase,
    });
    console.log(`   ✅ Created showcase: ${createdShowcase.titleEn}`);

    console.log('\n✨ Sections seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding sections:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

