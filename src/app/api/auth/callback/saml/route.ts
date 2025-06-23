import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('SAML callback received:', { code, state });

    if (!code) {
      throw new Error('No authorization code received');
    }

    // For now, just redirect to chat page
    // In a full implementation, you'd exchange the code for tokens and create a session
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/chat?code=${code}&state=${state}`);
    
  } catch (error) {
    console.error('SAML callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=SAMLCallbackError`);
  }
} 