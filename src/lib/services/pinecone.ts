/**
 * Pinecone Service
 * Handles vector search operations for document retrieval
 */

import { Pinecone } from '@pinecone-database/pinecone';
import env from '@/config/env';
import { DocumentSource } from '@/types/chat';

export class PineconeService {
  private pinecone: Pinecone;
  private indexName: string;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    this.indexName = env.PINECONE_INDEX;
  }

  /**
   * Generate embeddings for a given text using OpenAI
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-3-small', // Cost-effective embedding model
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding for search query');
    }
  }

  /**
   * Search for similar documents in Pinecone
   */
  async searchSimilarDocuments(
    query: string, 
    namespace: string = env.PINECONE_NAMESPACE,
    topK: number = 5
  ): Promise<DocumentSource[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // Get Pinecone index
      const index = this.pinecone.index(this.indexName);

      // Perform similarity search
      const searchResponse = await index.namespace(namespace).query({
        vector: queryEmbedding,
        topK,
        includeValues: false,
        includeMetadata: true,
      });

      // Transform results to DocumentSource format
      const sources: DocumentSource[] = searchResponse.matches?.map((match) => ({
        content: (match.metadata?.text as string) || '',
        metadata: match.metadata || {},
        score: match.score || 0,
      })) || [];

      return sources.filter(source => source.content && source.content.trim().length > 0);
    } catch (error) {
      console.error('Error searching documents in Pinecone:', error);
      throw new Error('Failed to search for relevant documents');
    }
  }

  /**
   * Health check for Pinecone connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const index = this.pinecone.index(this.indexName);
      await index.describeIndexStats();
      return true;
    } catch (error) {
      console.error('Pinecone health check failed:', error);
      return false;
    }
  }
} 