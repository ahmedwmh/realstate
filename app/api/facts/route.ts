import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all facts
export async function GET() {
  try {
    const facts = await prisma.fact.findMany({
      orderBy: { order: 'asc' }
    });
    
    return NextResponse.json(facts, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching facts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facts' },
      { status: 500 }
    );
  }
}

// POST create new fact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, title, descriptionEn, descriptionAr, order } = body;

    const fact = await prisma.fact.create({
      data: {
        icon,
        title,
        descriptionEn,
        descriptionAr,
        order: order ?? 0,
      },
    });

    return NextResponse.json(fact, { status: 201 });
  } catch (error) {
    console.error('Error creating fact:', error);
    return NextResponse.json(
      { error: 'Failed to create fact' },
      { status: 500 }
    );
  }
}

// PUT update fact
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, icon, title, descriptionEn, descriptionAr, order } = body;

    const fact = await prisma.fact.update({
      where: { id },
      data: {
        icon,
        title,
        descriptionEn,
        descriptionAr,
        order: order ?? 0,
      },
    });

    return NextResponse.json(fact);
  } catch (error) {
    console.error('Error updating fact:', error);
    return NextResponse.json(
      { error: 'Failed to update fact' },
      { status: 500 }
    );
  }
}

// DELETE fact
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

    await prisma.fact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting fact:', error);
    return NextResponse.json(
      { error: 'Failed to delete fact' },
      { status: 500 }
    );
  }
}

