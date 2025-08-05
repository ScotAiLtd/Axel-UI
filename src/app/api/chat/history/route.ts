/**
 * Chat History API Route
 * Handles loading, saving, and deleting chat messages for authenticated users
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
 * GET /api/chat/history
 * Load chat history for current user
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

    // Get chat messages for this user
    const chatMessages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' }
    });

    // Convert to the format expected by the frontend
    const messages = chatMessages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Error loading chat history:', error);
    return NextResponse.json(
      { error: 'Failed to load chat history' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/history
 * Save a new chat message
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

    const body = await request.json();
    const { content, role } = body;

    if (!content || !role || !['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid message data' },
        { status: 400 }
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

    // Save the chat message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        content,
        role,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      messageId: chatMessage.id 
    });

  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json(
      { error: 'Failed to save chat message' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chat/history
 * Delete all chat history for current user
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

    // Delete all chat messages for this user
    const deletedCount = await prisma.chatMessage.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: deletedCount.count 
    });

  } catch (error) {
    console.error('Error deleting chat history:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat history' },
      { status: 500 }
    );
  }
} 