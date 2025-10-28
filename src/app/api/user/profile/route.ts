import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function getCurrentUser(request: NextRequest): string | null {
  const authCookie = request.cookies.get('axle-auth');
  const userCookie = request.cookies.get('axle-user');

  if (!authCookie || authCookie.value !== 'authenticated' || !userCookie) {
    return null;
  }

  return userCookie.value;
}

export async function GET(request: NextRequest) {
  try {
    const userEmail = getCurrentUser(request);

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
        role: user.role,
        azureAdGroup: user.azureAdGroup
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

export async function PATCH(request: NextRequest) {
  try {
    const userEmail = getCurrentUser(request);

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { azureAdGroup } = body;

    if (!azureAdGroup) {
      return NextResponse.json(
        { error: 'azureAdGroup is required' },
        { status: 400 }
      );
    }

    if (azureAdGroup !== 'ScotAIManagers' && azureAdGroup !== 'ScotAIUsers') {
      return NextResponse.json(
        { error: 'Invalid azureAdGroup value' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { azureAdGroup },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        azureAdGroup: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 