import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Logout requested');
  
  // Create response that redirects to home page
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear the authentication cookie
  response.cookies.set('axle-auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/'
  });

  // Clear the user identification cookie
  response.cookies.set('axle-user', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/'
  });

  console.log('Auth cookie cleared, redirecting to home');
  return response;
}

export async function POST(request: NextRequest) {
  // Handle POST requests the same way
  return GET(request);
} 