import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all contact messages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isRead = searchParams.get('isRead');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const where: any = {};
    if (isRead !== null) {
      where.isRead = isRead === 'true';
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    const total = await prisma.contactMessage.count({ where });
    const unreadCount = await prisma.contactMessage.count({ where: { isRead: false } });

    return NextResponse.json({
      messages,
      total,
      unreadCount,
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

// POST create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, message } = body;

    if (!firstName || !lastName || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        phone,
        message,
      },
    });

    return NextResponse.json(contactMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to create contact message' },
      { status: 500 }
    );
  }
}

// PUT mark message as read/unread
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isRead } = body;

    if (id) {
      // Update single message
      const message = await prisma.contactMessage.update({
        where: { id },
        data: { isRead },
      });
      return NextResponse.json(message);
    } else if (isRead !== undefined) {
      // Mark all as read
      await prisma.contactMessage.updateMany({
        where: { isRead: !isRead },
        data: { isRead },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

// DELETE a contact message
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}

