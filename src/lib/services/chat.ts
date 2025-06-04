/**
 * Chat Service
 * Main service that orchestrates RAG (Retrieval Augmented Generation)
 * Combines Pinecone vector search with OpenAI response generation
 */

import { OpenAIService } from './openai';
import { PineconeService } from './pinecone';
import { DocumentSource } from '@/types/chat';
import env from '@/config/env';

export class ChatService {
  private openaiService: OpenAIService;
  private pineconeService: PineconeService;

  constructor() {
    this.openaiService = new OpenAIService();
    this.pineconeService = new PineconeService();
  }

  /**
   * Process a chat message with RAG
   */
  async processMessage(
    message: string,
    namespace?: string
  ): Promise<{ response: string; sources: DocumentSource[] }> {
    try {
      // Search for relevant documents
      const sources = await this.pineconeService.searchSimilarDocuments(
        message,
        namespace || env.PINECONE_NAMESPACE
      );

      // Generate response using OpenAI with context
      const response = await this.openaiService.generateResponse(message, sources);

      return { response, sources };
    } catch (error) {
      console.error('Error processing chat message:', error);
      throw error;
    }
  }

  /**
   * Health check for all services
   */
  async healthCheck(): Promise<{ openai: boolean; pinecone: boolean }> {
    const [openaiHealth, pineconeHealth] = await Promise.allSettled([
      this.openaiService.healthCheck(),
      this.pineconeService.healthCheck(),
    ]);

    return {
      openai: openaiHealth.status === 'fulfilled' ? openaiHealth.value : false,
      pinecone: pineconeHealth.status === 'fulfilled' ? pineconeHealth.value : false,
    };
  }
} 