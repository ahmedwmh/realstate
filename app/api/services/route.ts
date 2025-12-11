import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(services, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, titleEn, titleAr, descriptionEn, descriptionAr, order } = body;

    const service = await prisma.service.create({
      data: {
        icon,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        order: order ?? 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, icon, titleEn, titleAr, descriptionEn, descriptionAr, order } = body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        icon,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        order: order ?? 0,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE service
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

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}

