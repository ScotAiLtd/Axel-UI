/**
 * Simple Dashboard Stats API Route
 * Returns total user and session counts
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
 * GET /api/dashboard/stats
 * Get activity stats for specific time period (admin only)
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

    // Find user and check if admin
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    // Get time period from query params (default to 1w)
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1w';

    if (!['24h', '1w', '1m'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Use 24h, 1w, or 1m' },
        { status: 400 }
      );
    }

    // Calculate time range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        break;
      case '1w':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        break;
      case '1m':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    }

    // Get users who have sent messages in the time period using AdminChatHistory (persistent admin copy)
    const totalUsers = await prisma.user.count({
      where: {
        adminChatHistory: {
          some: {
            createdAt: {
              gte: startDate,
              lte: now
            }
          }
        }
      }
    });

    // Get total messages in the time period using AdminChatHistory (persistent admin copy)
    const totalMessages = await prisma.adminChatHistory.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: now
        }
      }
    });

    // Calculate total sessions (messages / 2)
    const totalSessions = Math.floor(totalMessages / 2);

    return NextResponse.json({ 
      success: true,
      period,
      stats: {
        totalUsers,
        totalSessions,
        totalMessages
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
