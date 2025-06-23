import jackson, { 
  type IOAuthController, 
  type IConnectionAPIController,
  type JacksonOption 
} from '@boxyhq/saml-jackson';

const jacksonOptions: JacksonOption = {
  externalUrl: process.env.NEXTAUTH_URL || 'https://localhost:3339',
  samlAudience: 'axle-hr-portal',
  samlPath: '/api/auth/saml/callback',
  db: {
    engine: 'mem' as const, // Use memory for now, can be changed to sql/mongo later
  },
  clientSecretVerifier: process.env.NEXTAUTH_SECRET || 'secret-key',
};

let jacksonInstance: {
  oauthController: IOAuthController;
  connectionAPIController: IConnectionAPIController;
} | null = null;

export const getJackson = async () => {
  if (!jacksonInstance) {
    jacksonInstance = await jackson(jacksonOptions);
  }
  return jacksonInstance;
};

export { getJackson as jackson }; 