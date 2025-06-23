import { NextRequest, NextResponse } from 'next/server';
import { jackson } from '@/lib/jackson';

export async function GET(request: NextRequest) {
  try {
    console.log('=== SAML Debug Info ===');
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set');
    
    const { oauthController, connectionAPIController } = await jackson();
    console.log('Jackson initialized successfully');
    
    // Test metadata fetching
    const tenantId = '7001f45d-eb22-4507-836a-8f0a934324bf';
    const metadataUrl = `https://login.microsoftonline.com/${tenantId}/FederationMetadata/2007-06/FederationMetadata.xml`;
    
    try {
      const response = await fetch(metadataUrl);
      console.log('Metadata fetch status:', response.status);
      if (response.ok) {
        const metadata = await response.text();
        console.log('Metadata length:', metadata.length);
        console.log('Metadata preview:', metadata.substring(0, 200) + '...');
      }
    } catch (metadataError) {
      console.error('Metadata fetch error:', metadataError);
    }
    
    // Try to list existing connections
    try {
      const connections = await connectionAPIController.getConnections({
        tenant: 'axle-hr-portal',
        product: 'axle-app',
      });
      console.log('Existing connections:', connections?.length || 0);
    } catch (connectionsError) {
      console.log('No existing connections found');
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Check server logs for debug info',
      env: {
        nextauth_url: process.env.NEXTAUTH_URL,
        nextauth_secret_set: !!process.env.NEXTAUTH_SECRET,
      }
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 