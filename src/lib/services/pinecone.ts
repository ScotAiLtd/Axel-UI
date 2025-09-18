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

  /**
   * Clean OCR text using pattern-based rules (no manual word corrections)
   */
  private cleanOCRText(text: string): string {
    if (!text || text.trim().length === 0) return text;

    return text
      // Fix concatenated words: "documentManagement" → "document Management"
      .replace(/([a-z])([A-Z])/g, '$1 $2')

      // Fix spaced punctuation: "word ." → "word."
      .replace(/\s+([.!?,:;])/g, '$1')

      // Fix broken words: "s ystem" → "system", "emp loyment" → "employment"
      .replace(/\b([a-z])\s+([a-z]{1,3})\b/g, '$1$2')

      // Fix broken short words: "i s" → "is", "a nd" → "and"
      .replace(/\b([a-z])\s+([a-z]{1,2})\b/g, '$1$2')

      // Remove excessive special characters (keep basic punctuation)
      .replace(/[^\w\s.,!?&()-]/g, ' ')

      // Fix multiple spaces
      .replace(/\s+/g, ' ')

      // Fix spacing around common punctuation
      .replace(/\s*&\s*/g, ' & ')
      .replace(/\s*-\s*/g, ' - ')

      // Remove standalone single characters that are likely OCR noise
      .replace(/\b[a-zA-Z]\b(?!\s[a-zA-Z]\b)/g, '')

      // Clean up any remaining multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Check if a text chunk has acceptable quality for embedding
   */
  private isValidChunk(text: string): boolean {
    if (!text || text.trim().length < 10) return false;

    const words = text.trim().split(/\s+/);
    const totalWords = words.length;

    if (totalWords < 3) return false;

    // Count words that look like OCR garbage (very short or contain numbers/special chars)
    const garbageWords = words.filter(word => {
      return word.length === 1 ||
             /^\d+$/.test(word) ||
             /[^\w\s]/.test(word) ||
             word.length > 20; // Extremely long words are likely OCR errors
    }).length;

    // Calculate garbage ratio
    const garbageRatio = garbageWords / totalWords;

    // Reject chunks with too much garbage
    return garbageRatio < 0.4;
  }

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
    topK: number = 20
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

      // Use similarity search with scores for better filtering
      const results = await (vectorStore as any).similaritySearchWithScore(query, topK);
      console.log(`✅ Pinecone search completed. Found ${results.length} matches`);
      console.log('Raw results:', results);

      // Transform results to DocumentSource format with actual scores and OCR cleanup
      const sources: DocumentSource[] = results
        .filter(([doc, score]: [any, number]) => {
          const rawContent = doc.content || doc.metadata?.content || '';
          const hasContent = rawContent && rawContent.trim().length > 20;
          const goodScore = score >= 0.7; // Adjust this threshold based on testing
          const validChunk = this.isValidChunk(rawContent);

          return hasContent && goodScore && validChunk;
        })
        .map(([result, score]: [any, number], index: number) => {
          const rawContent = result.content || result.metadata?.content || '';

          // Apply OCR cleanup
          const cleanedContent = this.cleanOCRText(rawContent);

          console.log(`📊 Result ${index + 1}: Score ${score.toFixed(3)}`);
          console.log(`   Raw Preview: ${rawContent.substring(0, 100)}${rawContent.length > 100 ? '...' : ''}`);
          console.log(`   Clean Preview: ${cleanedContent.substring(0, 100)}${cleanedContent.length > 100 ? '...' : ''}`);
          console.log(`   Metadata:`, result.metadata);

          return {
            content: cleanedContent,
            metadata: result.metadata || {},
            score: score,
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
            const content = result.content || result.metadata?.content || '';
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
