import { NextRequest, NextResponse } from 'next/server';
import { jackson } from '@/lib/jackson';

export async function GET(request: NextRequest) {
  try {
    const { oauthController, connectionAPIController } = await jackson();
    
    // First, check if SAML connection exists, if not create it
    const tenant = 'axle-hr-portal';
    const product = 'axle-app';
    
    console.log('Checking for existing SAML connection...');
    
    let connectionExists = false;
    try {
      // Check if connection exists
      const connections = await connectionAPIController.getConnections({
        tenant,
        product,
      });
      console.log('Existing connections:', connections);
      connectionExists = connections && connections.length > 0;
    } catch (error) {
      console.log('No existing connection found, will create new one');
      connectionExists = false;
    }

    if (!connectionExists) {
      console.log('Creating new SAML connection...');
      try {
        const metadata = await getSAMLMetadata();
        console.log('Metadata fetched successfully, length:', metadata.length);
        
        const connection = await connectionAPIController.createSAMLConnection({
          tenant,
          product,
          rawMetadata: metadata,
          redirectUrl: [`https://localhost:3339/api/auth/saml/callback`],
          defaultRedirectUrl: `${process.env.NEXTAUTH_URL}/chat`,
        });
        console.log('SAML connection created successfully:', connection);
      } catch (createError) {
        console.error('Error creating SAML connection:', createError);
        return new NextResponse(`Failed to create SAML connection: ${createError instanceof Error ? createError.message : 'Unknown error'}`, { status: 500 });
      }
    }

    console.log('Generating SAML authorization URL...');
    // Generate SAML AuthnRequest URL
    const { redirect_url } = await oauthController.authorize({
      tenant,
      product,
      state: 'saml-auth-state',
      redirect_uri: `https://localhost:3339/api/auth/saml/callback`,
      response_type: 'code',
    } as any);

    if (!redirect_url) {
      throw new Error('Failed to generate SAML redirect URL');
    }

    console.log('SAML redirect URL generated:', redirect_url);
    return NextResponse.redirect(redirect_url);
    
  } catch (error) {
    console.error('SAML login error:', error);
    return new NextResponse(`SAML login failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}

// Helper function to get SAML metadata from Microsoft
async function getSAMLMetadata(): Promise<string> {
  try {
    console.log('Fetching Microsoft SAML metadata...');
    // Fetch the actual Microsoft SAML metadata for Ken's tenant
    const tenantId = '7001f45d-eb22-4507-836a-8f0a934324bf';
    const metadataUrl = `https://login.microsoftonline.com/${tenantId}/FederationMetadata/2007-06/FederationMetadata.xml`;
    
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch SAML metadata: ${response.statusText}`);
    }
    
    const metadata = await response.text();
    console.log('Successfully fetched metadata from Microsoft');
    return metadata;
  } catch (error) {
    console.error('Error fetching SAML metadata from Microsoft, using fallback:', error);
    
    // Fallback to a basic metadata structure with the correct tenant ID
    return `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" 
                  entityID="https://sts.windows.net/7001f45d-eb22-4507-836a-8f0a934324bf/">
  <IDPSSODescriptor WantAuthnRequestsSigned="false" 
                    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                         Location="https://login.microsoftonline.com/7001f45d-eb22-4507-836a-8f0a934324bf/saml2"/>
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
                         Location="https://login.microsoftonline.com/7001f45d-eb22-4507-836a-8f0a934324bf/saml2"/>
  </IDPSSODescriptor>
</EntityDescriptor>`;
  }
} 
//main
