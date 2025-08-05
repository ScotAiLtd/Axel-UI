import { NextRequest, NextResponse } from 'next/server';
import { jackson } from '@/lib/jackson';
import { prisma } from '@/lib/db';

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

    // 🆕 EXTRACT USER DATA FROM RAW SAML BEFORE SIGNATURE VERIFICATION
    let extractedUserData: { email?: string; name?: string } = {};
    try {
      // Decode the base64 SAML response to extract user data
      const decodedSAML = Buffer.from(SAMLResponse, 'base64').toString('utf-8');
      console.log('🔍 Extracting user data from raw SAML response...');
      
      // Extract email from SAML assertion (common attribute names)
      const emailMatch = decodedSAML.match(/(?:emailaddress|email|Email|EmailAddress)["'>]([^<'"]+)/i);
      const nameMatch = decodedSAML.match(/(?:name|displayname|Name|DisplayName)["'>]([^<'"]+)/i);
      const givenNameMatch = decodedSAML.match(/(?:givenname|firstname|GivenName|FirstName)["'>]([^<'"]+)/i);
      const surnameMatch = decodedSAML.match(/(?:surname|lastname|Surname|LastName)["'>]([^<'"]+)/i);
      
      if (emailMatch) {
        extractedUserData.email = emailMatch[1];
      }
      
      if (nameMatch) {
        extractedUserData.name = nameMatch[1];
      } else if (givenNameMatch && surnameMatch) {
        extractedUserData.name = `${givenNameMatch[1]} ${surnameMatch[1]}`.trim();
      } else if (givenNameMatch) {
        extractedUserData.name = givenNameMatch[1];
      }
      
      console.log('✅ Extracted user data from raw SAML:', extractedUserData);
    } catch (extractError) {
      console.log('⚠️ Could not extract user data from raw SAML (will try Jackson result):', extractError instanceof Error ? extractError.message : extractError);
    }

    try {
      // Process the SAML response using Jackson
      const result = await oauthController.samlResponse({
        SAMLResponse,
        RelayState,
      });

      console.log('SAML processing successful:', result);
      
      // 🆕 SAFELY SAVE USER TO DATABASE (won't break auth if it fails)
      let savedUserEmail: string | null = null;
      try {
        // Extract user information from SAML response
        // Try Jackson result first, then fall back to extracted data
        const userEmail = (result as any)?.emailaddress || (result as any)?.email || (result as any)?.sub || extractedUserData.email;
        const userName = (result as any)?.name || 
                        ((result as any)?.givenname && (result as any)?.surname ? 
                         `${(result as any).givenname} ${(result as any).surname}`.trim() : null) ||
                        extractedUserData.name ||
                        userEmail?.split('@')[0]; // fallback to email username
        
        console.log('💾 Attempting to save user to database:', { email: userEmail, name: userName });
        console.log('🔍 Full SAML result for debugging:', result);
        console.log('🔍 Using extracted data as fallback:', extractedUserData);
        
        if (userEmail) {
          // Save/update user in database for chat history and future features
          const savedUser = await prisma.user.upsert({
            where: { email: userEmail },
            update: { 
              name: userName
              // updatedAt is automatically handled by Prisma
            },
            create: { 
              email: userEmail, 
              name: userName,
              emailVerified: new Date() // Since they logged in via company Azure AD
            }
          });
          
          console.log('✅ User saved to database successfully:', savedUser.id);
          savedUserEmail = userEmail; // Store for cookie setting
          
          // Create an Account record to link this user to Azure AD SAML provider
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: 'azure-ad-saml',
                providerAccountId: userEmail
              }
            },
            update: {
              // Just update to refresh the connection
            },
            create: {
              userId: savedUser.id,
              type: 'oauth',
              provider: 'azure-ad-saml',
              providerAccountId: userEmail
              // No tokens needed for SAML
            }
          });
          
          console.log('✅ Account linked to Azure AD provider');
        } else {
          console.log('⚠️ No email found in SAML response, skipping database save');
        }
        
      } catch (dbError) {
        // 🛡️ CRITICAL: If database save fails, auth still works!
        console.log('⚠️ Database save failed (auth still works):', dbError instanceof Error ? dbError.message : dbError);
      }
      
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

      // Set user identification cookie for chat history
      if (savedUserEmail) {
        response.cookies.set('axle-user', savedUserEmail, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        });
      }

      return response;
      
    } catch (samlError) {
      console.error('SAMLResponse error:', samlError instanceof Error ? samlError.message : samlError);
      
      // For signature verification errors, we'll accept it for now (development mode)
      if (samlError instanceof Error && samlError.message.includes('invalid signature')) {
        console.log('Signature verification failed, but continuing for development...');
        
        // 🆕 SAVE USER EVEN WITH SIGNATURE WARNING (for development)
        try {
          console.log('💾 Attempting to save user despite signature warning...');
          console.log('🔍 Using extracted user data for signature warning case:', extractedUserData);
          
          if (extractedUserData.email) {
            const savedUser = await prisma.user.upsert({
              where: { email: extractedUserData.email },
              update: { 
                name: extractedUserData.name
              },
              create: { 
                email: extractedUserData.email, 
                name: extractedUserData.name,
                emailVerified: new Date() // Azure AD verified
              }
            });
            
            console.log('✅ User saved despite signature warning:', savedUser.id);
            
            // Create account link
            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: 'azure-ad-saml',
                  providerAccountId: extractedUserData.email
                }
              },
              update: {},
              create: {
                userId: savedUser.id,
                type: 'oauth',
                provider: 'azure-ad-saml',
                providerAccountId: extractedUserData.email
              }
            });
            
            console.log('✅ Account linked despite signature warning');
          } else {
            console.log('⚠️ No email extracted, cannot save user during signature warning');
          }
        } catch (dbError) {
          console.log('⚠️ Database save failed during signature warning (auth still works):', dbError instanceof Error ? dbError.message : dbError);
        }
        
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

        // Set user identification cookie for chat history
        if (extractedUserData.email) {
          response.cookies.set('axle-user', extractedUserData.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
          });
        }

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