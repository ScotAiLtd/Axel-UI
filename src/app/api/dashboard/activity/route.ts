/**
 * Simple Chat Activity API Route
 * Returns chat activity data for different time periods
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
 * Generate time series data for a given period
 */
async function generateActivityData(period: string) {
  const now = new Date();
  let startDate: Date;
  let intervals: { label: string; start: Date; end: Date }[] = [];

  switch (period) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
      // Create 24 hour intervals
      for (let i = 23; i >= 0; i--) {
        const intervalStart = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
        const intervalEnd = new Date(now.getTime() - i * 60 * 60 * 1000);
        intervals.push({
          label: intervalStart.getHours().toString().padStart(2, '0') + ':00',
          start: intervalStart,
          end: intervalEnd
        });
      }
      break;

    case '1w':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      // Create 7 day intervals
      for (let i = 6; i >= 0; i--) {
        const intervalStart = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
        const intervalEnd = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        intervalStart.setHours(0, 0, 0, 0);
        intervalEnd.setHours(23, 59, 59, 999);
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        intervals.push({
          label: dayNames[intervalStart.getDay()],
          start: intervalStart,
          end: intervalEnd
        });
      }
      break;

    case '1m':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      // Create 30 day intervals (grouped by week for readability)
      for (let i = 3; i >= 0; i--) {
        const intervalStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const intervalEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        intervalStart.setHours(0, 0, 0, 0);
        intervalEnd.setHours(23, 59, 59, 999);
        
        intervals.push({
          label: `Week ${4 - i}`,
          start: intervalStart,
          end: intervalEnd
        });
      }
      break;

    default:
      throw new Error('Invalid period');
  }

  // Get data for each interval
  const activityData = await Promise.all(
    intervals.map(async (interval) => {
      // Get unique active users for this interval
      const activeUsers = await prisma.user.count({
        where: {
          chatMessages: {
            some: {
              createdAt: {
                gte: interval.start,
                lte: interval.end
              }
            }
          }
        }
      });

      // Get total messages for this interval
      const totalMessages = await prisma.chatMessage.count({
        where: {
          createdAt: {
            gte: interval.start,
            lte: interval.end
          }
        }
      });

      // Calculate chat sessions (total messages / 2)
      const chatSessions = Math.floor(totalMessages / 2);

      return {
        period: interval.label,
        users: activeUsers,
        sessions: chatSessions,
        messages: totalMessages
      };
    })
  );

  return activityData;
}

/**
 * GET /api/dashboard/activity
 * Get chat activity data for specified time period (admin only)
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

    const activityData = await generateActivityData(period);

    return NextResponse.json({ 
      success: true,
      period,
      data: activityData
    });

  } catch (error) {
    console.error('Error fetching activity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}
