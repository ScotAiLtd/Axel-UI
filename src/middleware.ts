import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`🚀 MIDDLEWARE IS RUNNING! Path: ${pathname}`)

  // Allow access to the main route (login page)
  if (pathname === '/') {
    console.log('✅ Allowing access to main route /')
    return NextResponse.next()
  }
  if(pathname === '/chat') {

  }

  // Allow access to authentication API routes
  if (pathname.startsWith('/api/auth/')) {
    console.log('✅ Allowing access to auth API route')
    return NextResponse.next()
  }

  // Allow access to Next.js internals and static files
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/logo.') ||
      pathname.startsWith('/favicon.') ||
      pathname.startsWith('/public/') ||
      pathname === '/favicon.ico' || 
      pathname === '/sitemap.xml' ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.ico')) {
    console.log('✅ Allowing access to static files')
    return NextResponse.next()
  }

  // Check for authentication - look for our custom auth cookie
  const authCookie = request.cookies.get('axle-auth')
  console.log('🔍 Auth cookie check:', authCookie ? `Found: ${authCookie.value}` : 'Not found')

  // If no auth cookie or cookie value is not 'authenticated', redirect to login
  if (!authCookie || authCookie.value !== 'authenticated') {
    console.log(`🚫 ACCESS DENIED to ${pathname} - redirecting to login`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow access if authenticated
  console.log(`✅ ACCESS GRANTED to ${pathname} - user authenticated`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/chat',
    '/dashboard',
    '/api/:path*',
    '/((?!api/auth|_next|favicon.ico|Ask_Axle_256x256.png).*)'
  ]
} 
//export1
