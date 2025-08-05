/**
 * User Profile API Route
 * Returns current user's profile information including role
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
 * GET /api/user/profile
 * Get current user's profile information
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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 