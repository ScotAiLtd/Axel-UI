/**
 * System Status All API Route
 * Admin-only endpoint to get all system status entries
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
 * GET /api/system-status/all
 * Get all system status entries (admin only)
 */
export async function GET(request: NextRequest) {
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

    const statuses = await prisma.systemStatus.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      statuses
    });

  } catch (error) {
    console.error('Error fetching all system statuses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system statuses' },
      { status: 500 }
    );
  }
}
