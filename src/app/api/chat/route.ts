/**
 * Chat API Route
 * Next.js 15 App Router API endpoint for handling chat requests
 * Implements RAG (Retrieval Augmented Generation) using Pinecone + OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat';
import { ChatRequest, ChatResponse, ApiErrorResponse } from '@/types/chat';
import { validateEnv } from '@/config/env';

// Initialize chat service
let chatService: ChatService;

/**
 * Initialize services with environment validation
 */
function initializeServices() {
  if (!chatService) {
    try {
      validateEnv();
      chatService = new ChatService();
    } catch (error) {
      console.error('Failed to initialize chat services:', error);
      throw error;
    }
  }
  return chatService;
}

/**
 * POST /api/chat
 * Handle chat message requests
 */
export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | ApiErrorResponse>> {
  try {
    // Initialize services with environment validation
    const service = initializeServices();
    
    // Parse and validate request body
    const body: ChatRequest = await request.json();
    
    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Message is required and must be a non-empty string',
          code: 'INVALID_INPUT' 
        },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedMessage = body.message.trim();
    
    if (sanitizedMessage.length > 4000) {
      return NextResponse.json(
        { 
          error: 'Message is too long. Maximum length is 4000 characters.',
          code: 'MESSAGE_TOO_LONG' 
        },
        { status: 400 }
      );
    }

    // Process the message using RAG
    const { response, sources } = await service.processMessage(
      sanitizedMessage,
      body.namespace
    );

    // Return successful response
    return NextResponse.json({
      message: response,
      sources: sources.length > 0 ? sources : undefined,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Handle missing environment variables
      if (error.message.includes('Missing required environment variables')) {
        return NextResponse.json(
          { 
            error: 'Service configuration error. Please check environment variables.',
            code: 'CONFIG_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 503 }
        );
      }
      
      // Check for API-specific errors
      if (error.message.includes('OpenAI API error')) {
        return NextResponse.json(
          { 
            error: 'AI service temporarily unavailable. Please try again.',
            code: 'AI_SERVICE_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 503 }
        );
      }
      
      if (error.message.includes('Pinecone API error')) {
        return NextResponse.json(
          { 
            error: 'Document search service temporarily unavailable. Please try again.',
            code: 'SEARCH_SERVICE_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 503 }
        );
      }
      
      if (error.message.includes('Failed to generate embedding')) {
        return NextResponse.json(
          { 
            error: 'Unable to process your question. Please try rephrasing.',
            code: 'PROCESSING_ERROR'
          },
          { status: 422 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  try {
    const service = initializeServices();
    const health = await service.healthCheck();
    
    return NextResponse.json({
      status: 'healthy',
      services: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

/**
 * OPTIONS /api/chat
 * Handle CORS preflight requests
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 