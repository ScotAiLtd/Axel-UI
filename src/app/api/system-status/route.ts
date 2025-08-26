/**
 * System Status API Route
 * Handles CRUD operations for system status
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Get current user from cookies
 */
function getCurrentUser(request: NextRequest): string | null {
  const authCookie = request.cookies.get('axle-auth');
  const userCookie = request.cookies.get('axle-user');
  
  if (!authCookie || authCookie.value !== 'authenticated' || !userCookie) {
    return null;
  }
  
  return userCookie.value; // This is the user email
}

/**
 * Check if user is admin
 */
async function isUserAdmin(userEmail: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });
  
  return user?.role === 'ADMIN';
}

/**
 * GET /api/system-status
 * Get current active system status
 */
export async function GET(request: NextRequest) {
  try {
    const status = await prisma.systemStatus.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    // Default status if none exists
    const defaultStatus = {
      id: 'default',
      status: 'live',
      message: 'All systems are operational and running smoothly.',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      status: status || defaultStatus
    });

  } catch (error) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/system-status
 * Create/Update system status (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const userEmail = getCurrentUser(request);
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!(await isUserAdmin(userEmail))) {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, message } = body;

    if (!status || !message) {
      return NextResponse.json(
        { error: 'Status and message are required' },
        { status: 400 }
      );
    }

    // Valid status values
    const validStatuses = ['live', 'maintenance', 'issue'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be live, maintenance, or issue' },
        { status: 400 }
      );
    }

    // Deactivate all existing status entries
    await prisma.systemStatus.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Create new active status
    const newStatus = await prisma.systemStatus.create({
      data: {
        status: status.trim(),
        message: message.trim(),
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      status: newStatus
    });

  } catch (error) {
    console.error('Error updating system status:', error);
    return NextResponse.json(
      { error: 'Failed to update system status' },
      { status: 500 }
    );
  }
}


