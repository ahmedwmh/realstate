import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET all admins (only super_admin can access)
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.userId as string },
    });

    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only super admins can view all admins.' },
        { status: 403 }
      );
    }

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

// POST create new admin (only super_admin can create)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: { id: session.userId as string },
    });

    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only super admins can create admins.' },
        { status: 403 }
      );
    }

    const { email, password, name, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin record
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || 'admin',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
}

// PUT update admin
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: { id: session.userId as string },
    });

    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only super admins can update admins.' },
        { status: 403 }
      );
    }

    const { id, email, name, role, password } = await request.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;

    // Update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(admin);
  } catch (error: any) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update admin' },
      { status: 500 }
    );
  }
}

// DELETE admin
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentAdmin = await prisma.admin.findUnique({
      where: { id: session.userId as string },
    });

    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only super admins can delete admins.' },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (currentAdmin.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete from database
    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete admin' },
      { status: 500 }
    );
  }
}

