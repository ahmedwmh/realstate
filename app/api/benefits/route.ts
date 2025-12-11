import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/storage';

// GET all benefits
export async function GET() {
  try {
    const benefits = await prisma.benefit.findMany({
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(benefits, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benefits' },
      { status: 500 }
    );
  }
}

// POST create new benefit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, descriptionEn, descriptionAr, image, order, items } = body;

    const benefit = await prisma.benefit.create({
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        image,
        order: order ?? 0,
        items: {
          create: items?.map((item: any, index: number) => ({
            titleEn: item.titleEn,
            titleAr: item.titleAr,
            order: item.order ?? index,
          })) || []
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(benefit, { status: 201 });
  } catch (error) {
    console.error('Error creating benefit:', error);
    return NextResponse.json(
      { error: 'Failed to create benefit' },
      { status: 500 }
    );
  }
}

// PUT update benefit
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titleEn, titleAr, descriptionEn, descriptionAr, image, order, items, oldImage } = body;

    // Delete old image if new one is provided
    if (oldImage && image && oldImage !== image) {
      try {
        await deleteImage(oldImage);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    // Delete existing items and create new ones
    await prisma.benefitItem.deleteMany({
      where: { benefitId: id }
    });

    const benefit = await prisma.benefit.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        image,
        order: order ?? 0,
        items: {
          create: items?.map((item: any, index: number) => ({
            titleEn: item.titleEn,
            titleAr: item.titleAr,
            order: item.order ?? index,
          })) || []
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(benefit);
  } catch (error) {
    console.error('Error updating benefit:', error);
    return NextResponse.json(
      { error: 'Failed to update benefit' },
      { status: 500 }
    );
  }
}

// DELETE benefit
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

    // Get benefit to delete image
    const benefit = await prisma.benefit.findUnique({
      where: { id },
    });

    if (benefit) {
      // Delete image from storage
      try {
        await deleteImage(benefit.image);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Items will be deleted automatically due to cascade
    await prisma.benefit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    return NextResponse.json(
      { error: 'Failed to delete benefit' },
      { status: 500 }
    );
  }
}

