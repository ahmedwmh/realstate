import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to validate URLs
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// GET contact information (single record)
export async function GET() {
  try {
    const contact = await prisma.contact.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    // If no contact exists, return default structure
    if (!contact) {
      return NextResponse.json({
        titleEn: "Get In Touch",
        titleAr: "تواصل معنا",
        descriptionEn: "We'd love to hear from you! Whether you have a question about our listings, services, or just want to talk about your dream home, our team is here to help.",
        descriptionAr: "نود أن نسمع منك! سواء كان لديك سؤال حول قوائمنا أو خدماتنا، أو تريد فقط التحدث عن منزل أحلامك، فريقنا هنا لمساعدتك.",
        officeAddressEn: "",
        officeAddressAr: "",
        phone: "",
        phone2: "",
        email: "",
        facebook: "",
        instagram: "",
        whatsapp: "",
        linkedin: "",
        youtube: "",
        taglineEn: "",
        taglineAr: "",
      });
    }
    
    return NextResponse.json(contact, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

  // POST create contact information
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, descriptionEn, descriptionAr, officeAddressEn, officeAddressAr, phone, phone2, email, facebook, instagram, whatsapp, linkedin, youtube, taglineEn, taglineAr } = body;

    // Validate required fields with friendly messages
    const validationErrors: string[] = [];

    if (!titleEn || titleEn.trim() === '') {
      validationErrors.push('English title is required');
    }

    if (!titleAr || titleAr.trim() === '') {
      validationErrors.push('Arabic title is required');
    }

    if (!descriptionEn || descriptionEn.trim() === '') {
      validationErrors.push('English description is required');
    }

    if (!descriptionAr || descriptionAr.trim() === '') {
      validationErrors.push('Arabic description is required');
    }

    if (!email || email.trim() === '') {
      validationErrors.push('Email address is required');
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        validationErrors.push('Please enter a valid email address');
      }
    }

    // Validate URLs if provided
    if (facebook && facebook.trim() !== '' && !isValidUrl(facebook.trim())) {
      validationErrors.push('Please enter a valid Facebook URL');
    }

    if (instagram && instagram.trim() !== '' && !isValidUrl(instagram.trim())) {
      validationErrors.push('Please enter a valid Instagram URL');
    }

    if (linkedin && linkedin.trim() !== '' && !isValidUrl(linkedin.trim())) {
      validationErrors.push('Please enter a valid LinkedIn URL');
    }

    if (youtube && youtube.trim() !== '' && !isValidUrl(youtube.trim())) {
      validationErrors.push('Please enter a valid YouTube URL');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Please fix the following errors',
          validationErrors: validationErrors 
        },
        { status: 400 }
      );
    }

    // Delete existing contact if any (only one contact record allowed)
    await prisma.contact.deleteMany({});

    // Build create data object, only including fields that exist in the schema
    const createData: any = {
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionAr: descriptionAr.trim(),
      officeAddressEn: (officeAddressEn || "").trim(),
      officeAddressAr: (officeAddressAr || "").trim(),
      phone: (phone || "").trim(),
      email: email.trim(),
      phone2: phone2 && phone2.trim() !== "" ? phone2.trim() : null,
      facebook: facebook && facebook.trim() !== "" ? facebook.trim() : null,
      instagram: instagram && instagram.trim() !== "" ? instagram.trim() : null,
      whatsapp: whatsapp && whatsapp.trim() !== "" ? whatsapp.trim() : null,
    };

    // Only add new fields if they exist in the schema
    try {
      if (linkedin !== undefined) {
        createData.linkedin = linkedin && linkedin.trim() !== "" ? linkedin.trim() : null;
      }
      if (youtube !== undefined) {
        createData.youtube = youtube && youtube.trim() !== "" ? youtube.trim() : null;
      }
      if (taglineEn !== undefined) {
        createData.taglineEn = taglineEn && taglineEn.trim() !== "" ? taglineEn.trim() : null;
      }
      if (taglineAr !== undefined) {
        createData.taglineAr = taglineAr && taglineAr.trim() !== "" ? taglineAr.trim() : null;
      }
    } catch (e) {
      // If fields don't exist, continue without them
      console.log('Some optional fields may not be available in the database schema');
    }

    const contact = await prisma.contact.create({
      data: createData,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error: any) {
    console.error('Error creating contact:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to create contact information. Please try again.';
    
    if (error.code === 'P2002') {
      errorMessage = 'This contact information already exists. Please check your data.';
    } else if (error.message && error.message.includes('Unknown argument')) {
      errorMessage = 'Database schema needs to be updated. Please run: npx prisma db push';
    } else if (error.message) {
      errorMessage = error.message.replace(/Invalid `prisma\.\w+\.\w+\(\)` invocation:/g, '');
      errorMessage = errorMessage.replace(/Unknown argument `\w+`/g, 'Some fields are not available in the database');
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// PUT update contact information
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titleEn, titleAr, descriptionEn, descriptionAr, officeAddressEn, officeAddressAr, phone, phone2, email, facebook, instagram, whatsapp, linkedin, youtube, taglineEn, taglineAr } = body;

    // Validate required fields with friendly messages
    const validationErrors: string[] = [];

    if (!id) {
      validationErrors.push('Contact ID is required');
    }

    if (!titleEn || titleEn.trim() === '') {
      validationErrors.push('English title is required');
    }

    if (!titleAr || titleAr.trim() === '') {
      validationErrors.push('Arabic title is required');
    }

    if (!descriptionEn || descriptionEn.trim() === '') {
      validationErrors.push('English description is required');
    }

    if (!descriptionAr || descriptionAr.trim() === '') {
      validationErrors.push('Arabic description is required');
    }

    if (!email || email.trim() === '') {
      validationErrors.push('Email address is required');
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        validationErrors.push('Please enter a valid email address');
      }
    }

    // Validate URLs if provided
    if (facebook && facebook.trim() !== '' && !isValidUrl(facebook.trim())) {
      validationErrors.push('Please enter a valid Facebook URL');
    }

    if (instagram && instagram.trim() !== '' && !isValidUrl(instagram.trim())) {
      validationErrors.push('Please enter a valid Instagram URL');
    }

    if (linkedin && linkedin.trim() !== '' && !isValidUrl(linkedin.trim())) {
      validationErrors.push('Please enter a valid LinkedIn URL');
    }

    if (youtube && youtube.trim() !== '' && !isValidUrl(youtube.trim())) {
      validationErrors.push('Please enter a valid YouTube URL');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Please fix the following errors',
          validationErrors: validationErrors 
        },
        { status: 400 }
      );
    }

    // Check if contact exists
    const existingContact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact information not found. Please refresh the page and try again.' },
        { status: 404 }
      );
    }

    // Build update data object, only including fields that exist in the schema
    const updateData: any = {
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      descriptionEn: descriptionEn.trim(),
      descriptionAr: descriptionAr.trim(),
      officeAddressEn: (officeAddressEn || "").trim(),
      officeAddressAr: (officeAddressAr || "").trim(),
      phone: (phone || "").trim(),
      email: email.trim(),
      phone2: phone2 && phone2.trim() !== "" ? phone2.trim() : null,
      facebook: facebook && facebook.trim() !== "" ? facebook.trim() : null,
      instagram: instagram && instagram.trim() !== "" ? instagram.trim() : null,
      whatsapp: whatsapp && whatsapp.trim() !== "" ? whatsapp.trim() : null,
    };

    // Only add new fields if they exist in the schema (check by trying to access them)
    try {
      // Try to include new fields - if they don't exist in schema, they'll be ignored
      if (linkedin !== undefined) {
        updateData.linkedin = linkedin && linkedin.trim() !== "" ? linkedin.trim() : null;
      }
      if (youtube !== undefined) {
        updateData.youtube = youtube && youtube.trim() !== "" ? youtube.trim() : null;
      }
      if (taglineEn !== undefined) {
        updateData.taglineEn = taglineEn && taglineEn.trim() !== "" ? taglineEn.trim() : null;
      }
      if (taglineAr !== undefined) {
        updateData.taglineAr = taglineAr && taglineAr.trim() !== "" ? taglineAr.trim() : null;
      }
    } catch (e) {
      // If fields don't exist, continue without them
      console.log('Some optional fields may not be available in the database schema');
    }

    const contact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(contact);
  } catch (error: any) {
    console.error('Error updating contact:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to update contact information. Please try again.';
    
    if (error.code === 'P2025') {
      errorMessage = 'Contact information not found. Please refresh the page and try again.';
    } else if (error.code === 'P2002') {
      errorMessage = 'This contact information already exists. Please check your data.';
    } else if (error.message && error.message.includes('Unknown argument')) {
      errorMessage = 'Database schema needs to be updated. Please run: npx prisma db push';
    } else if (error.message) {
      // Make error messages more friendly
      errorMessage = error.message.replace(/Invalid `prisma\.\w+\.\w+\(\)` invocation:/g, '');
      errorMessage = errorMessage.replace(/Unknown argument `\w+`/g, 'Some fields are not available in the database');
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

