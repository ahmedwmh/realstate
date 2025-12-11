const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding contact information...');

  // Delete existing contact if any
  await prisma.contact.deleteMany({});

  // Create contact information
  const contact = await prisma.contact.create({
    data: {
      titleEn: "Get In Touch",
      titleAr: "تواصل معنا",
      descriptionEn: "We'd love to hear from you! Whether you have a question about our listings, services, or just want to talk about your dream home, our team is here to help.",
      descriptionAr: "نود أن نسمع منك! سواء كان لديك سؤال حول قوائمنا أو خدماتنا، أو تريد فقط التحدث عن منزل أحلامك، فريقنا هنا لمساعدتك.",
      officeAddressEn: "123 Main Street, Hometown, USA",
      officeAddressAr: "123 Main Street, Hometown, USA",
      phone: "(123) 456-7890",
      phone2: "",
      email: "INFO@ALHULOOL-ALMUTHLA.COM",
      facebook: "https://web.facebook.com/p/%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D9%84%D8%AD%D9%84%D9%88%D9%84-%D8%A7%D9%84%D9%85%D8%AB%D9%84%D9%89-100093715775841/?_rdc=1&_rdr#",
      instagram: "https://www.instagram.com/alhulool_almuthla",
      whatsapp: "966501234567",
      linkedin: "",
      youtube: "",
      taglineEn: "Building Dreams, One Home at a Time.",
      taglineAr: "بناء الأحلام، منزل واحد في كل مرة.",
    },
  });

  console.log('✅ Contact information seeded successfully!');
  console.log('Contact ID:', contact.id);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding contact:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

