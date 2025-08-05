/**
 * User Growth API Route
 * Returns real user growth data grouped by month
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
 * GET /api/dashboard/user-growth
 * Get user growth data by month (admin only)
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

    // Get user count grouped by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Get user growth data using raw SQL for better control
    const growthData = await prisma.$queryRaw`
      WITH months AS (
        SELECT 
          generate_series(
            date_trunc('month', NOW() - interval '5 months'),
            date_trunc('month', NOW()),
            interval '1 month'
          ) AS month
      ),
      user_counts AS (
        SELECT 
          date_trunc('month', u."createdAt") AS month,
          COUNT(*)::int AS new_users
        FROM "User" u
        WHERE u."createdAt" >= date_trunc('month', NOW() - interval '5 months')
        GROUP BY date_trunc('month', u."createdAt")
      ),
      cumulative_counts AS (
        SELECT 
          m.month,
          COALESCE(uc.new_users, 0) AS new_users,
          (
            SELECT COUNT(*)::int 
            FROM "User" u2 
            WHERE u2."createdAt" <= m.month + interval '1 month' - interval '1 day'
          ) AS total_users
        FROM months m
        LEFT JOIN user_counts uc ON m.month = uc.month
        ORDER BY m.month
      )
      SELECT 
        TO_CHAR(month, 'Mon') AS month_name,
        total_users,
        CASE 
          WHEN LAG(total_users) OVER (ORDER BY month) IS NULL THEN 0
          ELSE ROUND(
            ((total_users - LAG(total_users) OVER (ORDER BY month))::DECIMAL / 
             NULLIF(LAG(total_users) OVER (ORDER BY month), 0)) * 100, 1
          )
        END AS growth_percentage
      FROM cumulative_counts
      ORDER BY month
    ` as Array<{
      month_name: string;
      total_users: number;
      growth_percentage: number;
    }>;

    // Format the response
    const formattedGrowthData = growthData.map((item) => ({
      month: item.month_name,
      users: item.total_users,
      growth: item.growth_percentage
    }));

    return NextResponse.json({ 
      success: true,
      growthData: formattedGrowthData 
    });

  } catch (error) {
    console.error('Error fetching user growth data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user growth data' },
      { status: 500 }
    );
  }
} 