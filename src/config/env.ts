/**
 * Environment Configuration
 * Centralized environment variable configuration
 */

export const env = {
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
  PINECONE_INDEX: process.env.PINECONE_INDEX || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  PINECONE_NAMESPACE: process.env.PINECONE_NAMESPACE || 'cma6krcyl000zkarj4pb59tcm',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
};

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