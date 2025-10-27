/**
 * Environment Configuration
 * Centralized environment variable configuration
 */

export const env = {
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
  PINECONE_INDEX: process.env.PINECONE_INDEX || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  PINECONE_NAMESPACE: process.env.PINECONE_NAMESPACE || 'axel-1',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
};

/**
 * Get Pinecone namespace based on Azure AD Group
 * @param azureAdGroup - The Azure AD group from user record ('ScotAIManagers' | 'ScotAIUsers' | null)
 * @returns The appropriate Pinecone namespace
 *
 * Logic:
 * - ScotAIUsers → 'axel-1'
 * - ScotAIManagers → 'axel-2'
 * - null (no group) → 'axel-2' (default)
 */
export function getPineconeNamespace(azureAdGroup: string | null | undefined): string {
  if (azureAdGroup === 'ScotAIUsers') {
    return 'axel-1';
  }
  // ScotAIManagers or null/undefined → use axel-2
  return 'axel-2';
}

/**
 * Validate required environment variables at runtime
 */
export function validateEnv() {
  const required = ['PINECONE_API_KEY', 'PINECONE_INDEX', 'OPENAI_API_KEY'] as const;
  const missing = required.filter(key => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export default env; 