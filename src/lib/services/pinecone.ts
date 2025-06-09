/**
 * Pinecone Service
 * Handles vector search operations for document retrieval
 * Using exact same approach as working application
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import env from '@/config/env';
import { DocumentSource } from '@/types/chat';

export class PineconeService {
  private pinecone: Pinecone;
  private indexName: string;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    this.indexName = env.PINECONE_INDEX;
    // Use exact same embeddings as working application
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
    });
  }

  /**
   * Search for similar documents in Pinecone - exact same method as working application
   */
  async searchSimilarDocuments(
    query: string, 
    namespace: string = env.PINECONE_NAMESPACE,
    topK: number = 6
  ): Promise<DocumentSource[]> {
    try {
      console.log(`🔍 Pinecone Search Query: "${query}"`);
      console.log(`📂 Namespace: ${namespace}`);
      console.log(`🔢 Top K: ${topK}`);

      // Use exact same pattern as working application
      const pineconeIndex = this.pinecone.index(this.indexName);

      const vectorStore = await PineconeStore.fromExistingIndex(this.embeddings, {
        pineconeIndex,
        namespace: namespace,
      });

      // This is the exact same call as in the working application
      const results = await (vectorStore as any).similaritySearch(query, topK);
      console.log(`✅ Pinecone search completed. Found ${results.length} matches`);
      console.log('Raw results:', results);

      // Transform results to DocumentSource format
      const sources: DocumentSource[] = results.map((result: any, index: number) => {
        const content = result.pageContent || result.metadata?.pageContent || '';
        
        console.log(`📊 Result ${index + 1}: Content found`);
        console.log(`   Content Preview: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);
        console.log(`   Metadata:`, result.metadata);
        
        return {
          content,
          metadata: result.metadata || {},
          score: 0.8, // Default score since similaritySearch doesn't return scores
        };
      });

      const filteredSources = sources.filter(source => source.content && source.content.trim().length > 0);
      
      console.log(`🎯 Final results: ${filteredSources.length} relevant documents`);

      return filteredSources;
    } catch (error) {
      console.error('❌ Error searching documents in Pinecone:', error);
      throw new Error('Failed to search for relevant documents');
    }
  }

  /**
   * Get all embedded text from a specific namespace
   */
  async getAllEmbeddedText(namespace: string = env.PINECONE_NAMESPACE): Promise<DocumentSource[]> {
    try {
      console.log(`📚 Fetching all embedded text from namespace: ${namespace}`);
      
      const pineconeIndex = this.pinecone.index(this.indexName);
      
      // First, get index stats to understand the namespace
      const stats = await pineconeIndex.describeIndexStats();
      console.log(`📊 Index stats for namespace "${namespace}":`, stats.namespaces?.[namespace]);
      
      const vectorStore = await PineconeStore.fromExistingIndex(this.embeddings, {
        pineconeIndex,
        namespace: namespace,
      });
      
      // Use multiple broad searches to get documents
      const commonQueries = [
        "document", "text", "content", "information", "data", "policy", "procedure", "form"
      ];
      
      const allDocuments = new Map<string, DocumentSource>();
      
      for (let i = 0; i < Math.min(4, commonQueries.length); i++) {
        try {
          const queryResults = await (vectorStore as any).similaritySearch(commonQueries[i], 200);
          
          queryResults.forEach((result: any, idx: number) => {
            const content = result.pageContent || result.metadata?.pageContent || '';
            const docId = `${result.metadata?.id || `${namespace}-${i}-${idx}`}`;
            
            if (content && content.trim().length > 0 && !allDocuments.has(docId)) {
              allDocuments.set(docId, {
                content,
                metadata: {
                  ...result.metadata,
                  id: docId,
                },
                score: 0.5,
              });
            }
          });
          
          console.log(`🔍 Query "${commonQueries[i]}" returned ${queryResults.length} matches. Total unique: ${allDocuments.size}`);
        } catch (queryError) {
          console.warn(`⚠️ Query for "${commonQueries[i]}" failed:`, queryError);
        }
      }

      const documents = Array.from(allDocuments.values());
      
      console.log(`✅ Retrieved ${documents.length} unique embedded documents from namespace`);
      
      return documents;
    } catch (error) {
      console.error('❌ Error fetching embedded text from Pinecone:', error);
      throw new Error('Failed to fetch embedded text from namespace');
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