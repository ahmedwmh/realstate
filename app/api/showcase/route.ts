import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/storage';

// Utility function to convert YouTube URLs to embed format
function convertToEmbedUrl(url: string): string {
  if (!url) return url;
  
  // Already an embed URL
  if (url.includes('/embed/')) {
    return url;
  }
  
  // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Return as-is if no match (might be other video platform)
  return url;
}

// GET showcase
export async function GET() {
  try {
    const showcase = await prisma.showcase.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    // Ensure video URL is in embed format
    if (showcase && showcase.videoUrl) {
      showcase.videoUrl = convertToEmbedUrl(showcase.videoUrl);
    }
    
    return NextResponse.json(showcase || null, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching showcase:', error);
    return NextResponse.json(
      { error: 'Failed to fetch showcase' },
      { status: 500 }
    );
  }
}

// POST create new showcase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, descriptionEn, descriptionAr, thumbnailImage, videoUrl } = body;

    // Delete old showcase if exists
    const existing = await prisma.showcase.findFirst();
    if (existing) {
      try {
        await deleteImage(existing.thumbnailImage);
      } catch (error) {
        console.error('Error deleting old thumbnail:', error);
      }
      await prisma.showcase.delete({
        where: { id: existing.id }
      });
    }

    const showcase = await prisma.showcase.create({
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        thumbnailImage,
        videoUrl: convertToEmbedUrl(videoUrl), // Convert to embed URL
      },
    });

    return NextResponse.json(showcase, { status: 201 });
  } catch (error) {
    console.error('Error creating showcase:', error);
    return NextResponse.json(
      { error: 'Failed to create showcase' },
      { status: 500 }
    );
  }
}

// PUT update showcase
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titleEn, titleAr, descriptionEn, descriptionAr, thumbnailImage, videoUrl, oldThumbnailImage } = body;

    // Delete old thumbnail if new one is provided
    if (oldThumbnailImage && thumbnailImage && oldThumbnailImage !== thumbnailImage) {
      try {
        await deleteImage(oldThumbnailImage);
      } catch (error) {
        console.error('Error deleting old thumbnail:', error);
      }
    }

    const showcase = await prisma.showcase.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        thumbnailImage,
        videoUrl: convertToEmbedUrl(videoUrl), // Convert to embed URL
      },
    });

    return NextResponse.json(showcase);
  } catch (error) {
    console.error('Error updating showcase:', error);
    return NextResponse.json(
      { error: 'Failed to update showcase' },
      { status: 500 }
    );
  }
}

// DELETE showcase
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

    // Get showcase to delete thumbnail
    const showcase = await prisma.showcase.findUnique({
      where: { id },
    });

    if (showcase) {
      // Delete thumbnail from storage
      try {
        await deleteImage(showcase.thumbnailImage);
      } catch (error) {
        console.error('Error deleting thumbnail:', error);
      }
    }

    await prisma.showcase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting showcase:', error);
    return NextResponse.json(
      { error: 'Failed to delete showcase' },
      { status: 500 }
    );
  }
}

