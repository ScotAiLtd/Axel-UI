/**
 * Changelog API Route
 * Handles CRUD operations for changelog entries
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
 * GET /api/changelog
 * Get all visible changelog entries
 */
export async function GET(request: NextRequest) {
  try {
    const changelog = await prisma.changelog.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      changelog
    });

  } catch (error) {
    console.error('Error fetching changelog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch changelog' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/changelog
 * Create a new changelog entry (admin only)
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
    const { title, description, version } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const changelogEntry = await prisma.changelog.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        version: version?.trim() || null,
        isVisible: true
      }
    });

    return NextResponse.json({
      success: true,
      changelog: changelogEntry
    });

  } catch (error) {
    console.error('Error creating changelog:', error);
    return NextResponse.json(
      { error: 'Failed to create changelog entry' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/changelog
 * Update a changelog entry (admin only)
 */
export async function PATCH(request: NextRequest) {
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
    const { id, title, description, version, isVisible } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Changelog ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (version !== undefined) updateData.version = version?.trim() || null;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    const updatedChangelog = await prisma.changelog.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      changelog: updatedChangelog
    });

  } catch (error) {
    console.error('Error updating changelog:', error);
    return NextResponse.json(
      { error: 'Failed to update changelog entry' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/changelog
 * Delete a changelog entry (admin only)
 */
export async function DELETE(request: NextRequest) {
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

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Changelog ID is required' },
        { status: 400 }
      );
    }

    await prisma.changelog.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Changelog entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting changelog:', error);
    return NextResponse.json(
      { error: 'Failed to delete changelog entry' },
      { status: 500 }
    );
  }
}
