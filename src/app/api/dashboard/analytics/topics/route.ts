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
 * GET /api/dashboard/analytics/topics
 * Get the latest saved analytics from database
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

    // Get the latest analytics from database
    const latestAnalytics = await prisma.topicsAnalytics.findFirst({
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

    // Get last 7 days of user messages from AdminChatHistory
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const userMessages = await prisma.adminChatHistory.findMany({
      where: {
        role: 'user', // Only analyze user questions, not AI responses
        createdAt: {
          gte: lastWeek
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
      return NextResponse.json({
        success: true,
        analysis: 'No user messages found in the last week to analyze.',
        messageCount: 0
      });
    }

    // Prepare messages for AI analysis
    const messagesContent = userMessages.map(msg => msg.content).join('\n---\n');

    // Initialize OpenAI service
    const openaiService = new OpenAIService();

    // Create AI prompt for topic analysis
    const prompt = `Analyze the following user questions from the last week and identify the 3-4 most common topics/themes. 

User Questions:
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
        generatedBy: userEmail
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