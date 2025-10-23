/**
 * AI Topics Analytics API Route
 * Analyzes last week's chat messages to identify most discussed topics
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OpenAIService } from '@/lib/services/openai';

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
 * GET /api/dashboard/analytics/topics?userGroup=ScotAIManagers
 * Get the latest saved analytics from database for specific group
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

    // Get userGroup from query params
    const { searchParams } = new URL(request.url);
    const userGroup = searchParams.get('userGroup') || 'ScotAIManagers'; // Default to Managers

    // Validate userGroup
    if (userGroup !== 'ScotAIManagers' && userGroup !== 'ScotAIUsers') {
      return NextResponse.json(
        { error: 'Invalid userGroup. Must be ScotAIManagers or ScotAIUsers' },
        { status: 400 }
      );
    }

    // Get the latest analytics for this specific group
    const latestAnalytics = await prisma.topicsAnalytics.findFirst({
      where: {
        userGroup: userGroup
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!latestAnalytics) {
      return NextResponse.json({
        success: true,
        analytics: null
      });
    }

    return NextResponse.json({
      success: true,
      analytics: {
        id: latestAnalytics.id,
        analysis: latestAnalytics.analysis,
        messageCount: latestAnalytics.messageCount,
        dateRange: {
          from: latestAnalytics.dateRangeFrom.toISOString(),
          to: latestAnalytics.dateRangeTo.toISOString()
        },
        generatedBy: latestAnalytics.generatedBy,
        userGroup: latestAnalytics.userGroup,
        createdAt: latestAnalytics.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dashboard/analytics/topics
 * Generate AI analysis of most discussed topics from last week and save to DB
 * Body: { userGroup: "ScotAIManagers" | "ScotAIUsers" }
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

    // Get userGroup from request body
    const body = await request.json();
    const userGroup = body.userGroup || 'ScotAIManagers'; // Default to Managers

    // Validate userGroup
    if (userGroup !== 'ScotAIManagers' && userGroup !== 'ScotAIUsers') {
      return NextResponse.json(
        { error: 'Invalid userGroup. Must be ScotAIManagers or ScotAIUsers' },
        { status: 400 }
      );
    }

    // Get last 7 days of user messages from AdminChatHistory
    // FILTERED by user's azureAdGroup
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const userMessages = await prisma.adminChatHistory.findMany({
      where: {
        role: 'user', // Only analyze user questions, not AI responses
        createdAt: {
          gte: lastWeek
        },
        user: {
          azureAdGroup: userGroup // Filter by ScotAIManagers or ScotAIUsers
        }
      },
      select: {
        content: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to prevent huge API costs
    });

    if (userMessages.length === 0) {
      const groupName = userGroup === 'ScotAIManagers' ? 'Managers' : 'Users';
      return NextResponse.json({
        success: true,
        analysis: `No ${groupName} messages found in the last week to analyze.`,
        messageCount: 0,
        userGroup: userGroup
      });
    }

    // Prepare messages for AI analysis
    const messagesContent = userMessages.map(msg => msg.content).join('\n---\n');

    // Initialize OpenAI service
    const openaiService = new OpenAIService();

    // Create AI prompt for topic analysis
    const groupName = userGroup === 'ScotAIManagers' ? 'Managers' : 'Users';
    const prompt = `Analyze the following user questions from ${groupName} in the last week and identify the 3-4 most common topics/themes.

User Questions from ${groupName}:
${messagesContent}

Please provide a brief 3-4 line summary mentioning:
1. The most frequently asked topics
2. Common patterns in user questions
3. Any notable trends you observe

Keep it concise and professional for an admin dashboard.`;

    // Get AI analysis using existing OpenAI service
    const analysis = await openaiService.generateSimpleResponse(prompt);

    // Save the analysis to database
    const now = new Date();
    const savedAnalytics = await prisma.topicsAnalytics.create({
      data: {
        analysis: analysis,
        messageCount: userMessages.length,
        dateRangeFrom: lastWeek,
        dateRangeTo: now,
        generatedBy: userEmail,
        userGroup: userGroup
      }
    });

    return NextResponse.json({
      success: true,
      analytics: {
        id: savedAnalytics.id,
        analysis: savedAnalytics.analysis,
        messageCount: savedAnalytics.messageCount,
        dateRange: {
          from: savedAnalytics.dateRangeFrom.toISOString(),
          to: savedAnalytics.dateRangeTo.toISOString()
        },
        generatedBy: savedAnalytics.generatedBy,
        userGroup: savedAnalytics.userGroup,
        createdAt: savedAnalytics.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating topics analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate topics analysis' },
      { status: 500 }
    );
  }
}