import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/storage';

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15 // Limit results for better performance
    });
    
    // Add cache headers with shorter duration for admin updates
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'CDN-Cache-Control': 'public, s-maxage=10',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=10',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleEn, titleAr, descriptionEn, descriptionAr, category, images, address, features, generalInfo, interiorDetails } = body;

    const project = await prisma.project.create({
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        category,
        images: images || [],
        address,
        features: features || null,
        generalInfo: generalInfo || null,
        interiorDetails: interiorDetails || null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT update project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titleEn, titleAr, descriptionEn, descriptionAr, category, images, address, features, generalInfo, interiorDetails, oldImages } = body;

    // Delete old images that are not in the new images array
    if (oldImages && images) {
      const imagesToDelete = oldImages.filter((img: string) => !images.includes(img));
      for (const imageUrl of imagesToDelete) {
        try {
          await deleteImage(imageUrl);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        category,
        images: images || [],
        address,
        features: features || null,
        generalInfo: generalInfo || null,
        interiorDetails: interiorDetails || null,
      },
    });

    // Revalidate cache after update
    return NextResponse.json(project, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project
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

    // Get project to delete images
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (project && project.images) {
      // Delete all images from storage
      for (const imageUrl of project.images) {
        try {
          await deleteImage(imageUrl);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

