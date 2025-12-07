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
  console.log('🔄 Seeding News...\n');

  // Define news articles
  const newsArticles = [
    {
      titleEn: "New Residential Complex Launch",
      titleAr: "إطلاق مجمع سكني جديد",
      contentEn: "We are excited to announce the launch of our latest residential complex featuring modern architecture, sustainable design, and premium amenities. This project represents our commitment to excellence in real estate development.",
      contentAr: "نحن متحمسون للإعلان عن إطلاق أحدث مجمع سكني لدينا والذي يتميز بالهندسة المعمارية الحديثة والتصميم المستدام والمرافق الفاخرة. يمثل هذا المشروع التزامنا بالتميز في التطوير العقاري.",
      image: null,
      isPinned: true,
      order: 1,
    },
    {
      titleEn: "Partnership with Leading Architects",
      titleAr: "شراكة مع مهندسين معماريين رائدين",
      contentEn: "Al Hulool Al Muthla has entered into a strategic partnership with internationally renowned architects to bring innovative design solutions to our upcoming projects. This collaboration will enhance our ability to deliver world-class developments.",
      contentAr: "دخلت شركة الحلول المثلى في شراكة استراتيجية مع مهندسين معماريين معروفين دولياً لجلب حلول تصميم مبتكرة لمشاريعنا القادمة. ستعزز هذه الشراكة قدرتنا على تقديم تطويرات عالمية المستوى.",
      image: null,
      isPinned: true,
      order: 2,
    },
    {
      titleEn: "Sustainable Building Practices",
      titleAr: "ممارسات البناء المستدامة",
      contentEn: "Our commitment to sustainability continues with the implementation of green building practices across all our projects. We are investing in renewable energy, water conservation, and eco-friendly materials to create a better future.",
      contentAr: "يستمر التزامنا بالاستدامة مع تنفيذ ممارسات البناء الأخضر في جميع مشاريعنا. نحن نستثمر في الطاقة المتجددة والحفاظ على المياه والمواد الصديقة للبيئة لخلق مستقبل أفضل.",
      image: null,
      isPinned: false,
      order: 0,
    },
    {
      titleEn: "Award-Winning Project Recognition",
      titleAr: "اعتراف بمشروع حائز على جائزة",
      contentEn: "We are proud to announce that our latest commercial development has received recognition for excellence in architectural design and construction quality. This award reflects our dedication to delivering exceptional projects.",
      contentAr: "نفخر بالإعلان عن أن أحدث تطوير تجاري لدينا قد حصل على اعتراف بالتميز في التصميم المعماري وجودة البناء. تعكس هذه الجائزة تفانينا في تقديم مشاريع استثنائية.",
      image: null,
      isPinned: false,
      order: 0,
    },
    {
      titleEn: "Community Development Initiative",
      titleAr: "مبادرة تطوير المجتمع",
      contentEn: "As part of our social responsibility, we are launching a new community development initiative that will provide affordable housing solutions and support local economic growth in underserved areas.",
      contentAr: "كجزء من مسؤوليتنا الاجتماعية، نطلق مبادرة جديدة لتطوير المجتمع ستوفر حلول سكنية ميسورة التكلفة وستدعم النمو الاقتصادي المحلي في المناطق المحرومة.",
      image: null,
      isPinned: false,
      order: 0,
    },
    {
      titleEn: "Technology Integration in Smart Buildings",
      titleAr: "دمج التكنولوجيا في المباني الذكية",
      contentEn: "We are integrating cutting-edge smart building technologies into our new developments, including IoT sensors, automated systems, and energy management solutions to enhance comfort and efficiency.",
      contentAr: "نحن ندمج أحدث تقنيات المباني الذكية في تطويراتنا الجديدة، بما في ذلك أجهزة استشعار إنترنت الأشياء والأنظمة الآلية وحلول إدارة الطاقة لتعزيز الراحة والكفاءة.",
      image: null,
      isPinned: false,
      order: 0,
    },
  ];

  try {
    // Delete all existing news
    console.log('🗑️  Deleting all existing news...');
    const deleted = await prisma.news.deleteMany({});
    console.log(`   ✅ Deleted ${deleted.count} news article(s)\n`);

    // Create news articles
    for (const newsData of newsArticles) {
      try {
        console.log(`📰 Creating news: ${newsData.titleEn}...`);
        const news = await prisma.news.create({
          data: newsData,
        });

        console.log(`   ✅ News created ${newsData.isPinned ? '(Pinned)' : ''}\n`);
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    console.log('✨ News seeding completed!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Pinned news: ${newsArticles.filter(n => n.isPinned).length}`);
    console.log(`   - Regular news: ${newsArticles.filter(n => !n.isPinned).length}`);
    console.log(`   - Total: ${newsArticles.length}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

