import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/storage';

// GET all hero slides
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
      take: 10 // Limit results for better performance
    });
    
    // Add cache headers for better performance
    return NextResponse.json(slides, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

// POST create new hero slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, descriptionEn, descriptionAr, mainImage, contentImage, order } = body;

    const slide = await prisma.heroSlide.create({
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        mainImage,
        contentImage,
        order: order ?? 0,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}

// PUT update hero slide
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titleEn, titleAr, descriptionEn, descriptionAr, mainImage, contentImage, order, oldMainImage, oldContentImage } = body;

    // Delete old images if new ones are provided
    if (oldMainImage && mainImage && oldMainImage !== mainImage) {
      try {
        await deleteImage(oldMainImage);
      } catch (error) {
        console.error('Error deleting old main image:', error);
      }
    }

    if (oldContentImage && contentImage && oldContentImage !== contentImage) {
      try {
        await deleteImage(oldContentImage);
      } catch (error) {
        console.error('Error deleting old content image:', error);
      }
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        mainImage,
        contentImage,
        order: order ?? 0,
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

// DELETE hero slide
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Get slide to delete images
    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (slide) {
      // Delete images from storage
      try {
        await deleteImage(slide.mainImage);
        await deleteImage(slide.contentImage);
      } catch (error) {
        console.error('Error deleting images:', error);
      }
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}

