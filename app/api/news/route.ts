import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { deleteImage } from '@/lib/storage';

// GET all news (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pinnedOnly = searchParams.get('pinned') === 'true';

    const news = await prisma.news.findMany({
      where: pinnedOnly ? { isPinned: true } : undefined,
      orderBy: [
        { isPinned: 'desc' }, // Pinned news first
        { order: 'asc' },
        { createdAt: 'desc' }, // Then by date
      ],
    });

    // Add cache headers with shorter duration for faster updates
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, s-maxage=10',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=10',
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST create new news (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { titleEn, titleAr, contentEn, contentAr, image, isPinned, order } = await request.json();

    if (!titleEn || !titleAr || !contentEn || !contentAr) {
      return NextResponse.json(
        { error: 'Title and content in both languages are required' },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        titleEn,
        titleAr,
        contentEn,
        contentAr,
        image: image || null,
        isPinned: isPinned || false,
        order: order || 0,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error: any) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create news' },
      { status: 500 }
    );
  }
}

// PUT update news (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, titleEn, titleAr, contentEn, contentAr, image, oldImage, isPinned, order } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Get current news to check old image
    const currentNews = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    // Delete old image if it's being replaced
    if (oldImage && image && oldImage !== image && currentNews?.image) {
      try {
        await deleteImage(currentNews.image);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }

    const updateData: any = {};
    if (titleEn !== undefined) updateData.titleEn = titleEn;
    if (titleAr !== undefined) updateData.titleAr = titleAr;
    if (contentEn !== undefined) updateData.contentEn = contentEn;
    if (contentAr !== undefined) updateData.contentAr = contentAr;
    if (image !== undefined) updateData.image = image;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (order !== undefined) updateData.order = order;

    const news = await prisma.news.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Revalidate cache after update
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE news (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Get news to delete image
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    // Delete image from storage if exists
    if (news?.image) {
      try {
        await deleteImage(news.image);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await prisma.news.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete news' },
      { status: 500 }
    );
  }
}

