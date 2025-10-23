/**
 * Dashboard Metrics API Route
 * Returns real metrics data for the dashboard
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
 * GET /api/dashboard/metrics
 * Get dashboard metrics (admin only)
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

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get managers count (ScotAIManagers group)
    const managersCount = await prisma.user.count({
      where: {
        azureAdGroup: 'ScotAIManagers'
      }
    });

    // Get users count (ScotAIUsers group)
    const usersCount = await prisma.user.count({
      where: {
        azureAdGroup: 'ScotAIUsers'
      }
    });

    // Get total chat messages count from AdminChatHistory (persistent admin copy)
    // This ensures the count doesn't decrease when users delete their chat history
    const totalChatMessages = await prisma.adminChatHistory.count();

    // Get unique users who have sent chat messages (active users from AdminChatHistory)
    // This ensures consistent counting even after users delete their chat history
    const activeChatUsers = await prisma.user.count({
      where: {
        adminChatHistory: {
          some: {}
        }
      }
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        managersCount,
        usersCount,
        totalChatMessages,
        activeChatUsers
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
} 