/**
 * Embedded Text API Route
 * Next.js 15 App Router API endpoint for viewing embedded text in Pinecone namespace
 */

import { NextRequest, NextResponse } from 'next/server';
import { PineconeService } from '@/lib/services/pinecone';
import { DocumentSource } from '@/types/chat';
import { validateEnv } from '@/config/env';
import env from '@/config/env';

// Initialize Pinecone service
let pineconeService: PineconeService;

/**
 * Initialize services with environment validation
 */
function initializeServices() {
  if (!pineconeService) {
    try {
      validateEnv();
      pineconeService = new PineconeService();
    } catch (error) {
      console.error('Failed to initialize Pinecone service:', error);
      throw error;
    }
  }
  return pineconeService;
}

/**
 * GET /api/embedded-text
 * Fetch all embedded text from the specified namespace
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Initialize services
    const service = initializeServices();
    
    // Get namespace from query params, default to env namespace
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get('namespace') || env.PINECONE_NAMESPACE;
    
    console.log(`🚀 Fetching embedded text from namespace: ${namespace}`);
    
    // Fetch all embedded text from the namespace
    const embeddedDocuments = await service.getAllEmbeddedText(namespace);
    
    // Prepare response data with additional statistics
    const responseData = {
      namespace,
      totalDocuments: embeddedDocuments.length,
      documents: embeddedDocuments.map((doc, index) => ({
        id: index + 1,
        content: doc.content,
        contentLength: doc.content.length,
        metadata: doc.metadata,
        score: doc.score,
        preview: doc.content.substring(0, 150) + (doc.content.length > 150 ? '...' : ''),
      })),
      statistics: {
        averageContentLength: embeddedDocuments.length > 0 
          ? Math.round(embeddedDocuments.reduce((sum, doc) => sum + doc.content.length, 0) / embeddedDocuments.length)
          : 0,
        totalCharacters: embeddedDocuments.reduce((sum, doc) => sum + doc.content.length, 0),
        documentsWithMetadata: embeddedDocuments.filter(doc => doc.metadata && Object.keys(doc.metadata).length > 0).length,
      },
      timestamp: new Date().toISOString(),
    };
    
    console.log(`✅ Successfully retrieved ${embeddedDocuments.length} documents from namespace: ${namespace}`);
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('❌ Embedded text API error:', error);
    
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
      
      // Handle Pinecone-specific errors
      if (error.message.includes('Failed to fetch embedded text')) {
        return NextResponse.json(
          { 
            error: 'Unable to fetch embedded text from namespace. Please try again.',
            code: 'PINECONE_ERROR',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 503 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while fetching embedded text.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/embedded-text
 * Handle CORS preflight requests
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 