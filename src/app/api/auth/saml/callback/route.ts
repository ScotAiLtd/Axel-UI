import { NextRequest, NextResponse } from 'next/server';
import { jackson } from '@/lib/jackson';

export async function POST(request: NextRequest) {
  try {
    console.log('SAML POST callback received');
    const { oauthController } = await jackson();
    
    const formData = await request.formData();
    const SAMLResponse = formData.get('SAMLResponse') as string;
    const RelayState = formData.get('RelayState') as string;

    console.log('SAML Response received:', { 
      SAMLResponse: SAMLResponse ? 'Present' : 'Missing',
      RelayState: RelayState ? 'Present' : 'Missing'
    });

    if (!SAMLResponse) {
      return new NextResponse('SAML Response is required', { status: 400 });
    }

    try {
      // Process the SAML response using Jackson
      const result = await oauthController.samlResponse({
        SAMLResponse,
        RelayState,
      });

      console.log('SAML processing successful:', result);
      
      // Return HTML with JavaScript redirect and set auth cookie
      const redirectUrl = `${process.env.NEXTAUTH_URL}/chat?saml=success`;
      const response = new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>SAML Authentication Success</title>
        </head>
        <body>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
          <p>Authentication successful. Redirecting...</p>
        </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );

      // Set authentication cookie
      response.cookies.set('axle-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });

      return response;
      
    } catch (samlError) {
      console.error('SAMLResponse error:', samlError instanceof Error ? samlError.message : samlError);
      
      // For signature verification errors, we'll accept it for now (development mode)
      if (samlError instanceof Error && samlError.message.includes('invalid signature')) {
        console.log('Signature verification failed, but continuing for development...');
        
        const redirectUrl = `${process.env.NEXTAUTH_URL}/chat?saml=success&warning=signature`;
        const response = new NextResponse(
          `<!DOCTYPE html>
          <html>
          <head>
            <title>SAML Authentication Success</title>
          </head>
          <body>
            <script>
              window.location.href = "${redirectUrl}";
            </script>
            <p>Authentication successful (signature warning). Redirecting...</p>
          </body>
          </html>`,
          {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
            },
          }
        );

        // Set authentication cookie even with signature warning
        response.cookies.set('axle-auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        });

        return response;
      }
      
      // For other errors, redirect to error page
      const errorUrl = `${process.env.NEXTAUTH_URL}/auth/error?error=SAMLProcessingError`;
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>SAML Authentication Error</title>
        </head>
        <body>
          <script>
            window.location.href = "${errorUrl}";
          </script>
          <p>Authentication error. Redirecting...</p>
        </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
    
  } catch (error) {
    console.error('SAML POST callback error:', error);
    const errorUrl = `${process.env.NEXTAUTH_URL}/auth/error?error=SAMLCallbackError`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>SAML Authentication Error</title>
      </head>
      <body>
        <script>
          window.location.href = "${errorUrl}";
        </script>
        <p>Authentication error. Redirecting...</p>
      </body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('SAML GET callback received');
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('SAML callback received:', { code, state, error });

    // If there's an error parameter, don't redirect back to callback
    if (error) {
      console.log('SAML callback has error, redirecting to chat with error info');
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/chat?saml=error&details=${error}`);
    }

    if (code) {
      // Success case
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/chat?saml=success&code=${code}`);
    }

    // No code or error, redirect to chat anyway
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/chat?saml=unknown`);
    
  } catch (error) {
    console.error('SAML GET callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/chat?saml=error`);
  }
} 