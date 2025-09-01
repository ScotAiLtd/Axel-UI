/**
 * Top Users API Route
 * Returns the top 5 most frequent chat users based on message count
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
 * GET /api/dashboard/top-users
 * Get top 5 most frequent chat users (admin only)
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

    // Get users with their chat message counts using AdminChatHistory (persistent admin copy)
    // We count total messages and will divide by 2 for chat sessions
    const topUsersData = await prisma.$queryRaw`
      SELECT 
        u.email,
        COUNT(ach.id)::int as "messageCount"
      FROM "User" u
      INNER JOIN "AdminChatHistory" ach ON u.id = ach."userId"
      GROUP BY u.id, u.email
      ORDER BY COUNT(ach.id) DESC
      LIMIT 5
    ` as Array<{email: string; messageCount: number}>;

    // Format the response - messageCount represents total messages (user + AI)
    // We keep the raw count for accurate sorting but display will show sessions
    const formattedUsers = topUsersData.map((user, index) => ({
      rank: index + 1,
      email: user.email,
      messageCount: user.messageCount, // Keep raw count for sorting
      chatSessions: Math.floor(user.messageCount / 2) // Calculate chat sessions
    }));

    return NextResponse.json({ 
      success: true,
      topUsers: formattedUsers 
    });

  } catch (error) {
    console.error('Error fetching top users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top users' },
      { status: 500 }
    );
  }
} 