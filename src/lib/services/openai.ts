/**
 * OpenAI Service
 * Handles chat completions with context from retrieved documents
 */

import env from '@/config/env';
import { DocumentSource } from '@/types/chat';

export class OpenAIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = env.OPENAI_API_KEY;
    this.model = env.OPENAI_MODEL;
  }

  /**
   * Generate a chat response using retrieved context
   */
  async generateResponse(
    userMessage: string,
    context: DocumentSource[]
  ): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const generatedResponse = data.choices?.[0]?.message?.content;

      if (!generatedResponse) {
        throw new Error('No response generated from OpenAI');
      }

      return generatedResponse.trim();
    } catch (error) {
      console.error('Error generating OpenAI response:', error);
      throw new Error('Failed to generate response from AI');
    }
  }

  /**
   * Build system prompt with context from retrieved documents
   */
  private buildSystemPrompt(context: DocumentSource[]): string {
    const contextText = context
      .map((source, index) => `[${index + 1}] ${source.content}`)
      .join('\n\n');

    return `You are Axle, a knowledgeable AI assistant for the People Management Toolkit. You help with HR policies, employee management, and related topics.

Use the following context to answer the user's question accurately and helpfully:

CONTEXT:
${contextText}

INSTRUCTIONS:
- Answer based primarily on the provided context
- If the context doesn't contain sufficient information, acknowledge this and provide general guidance
- Be professional, clear, and concise
- If referencing specific information from the context, be confident in your response
- For HR-related topics, emphasize compliance and best practices
- Keep responses focused and actionable
- If the user asks a question that is not related to the context, politely decline to answer and dont give any generic response if it is not related to the context.

Remember: You are an expert assistant designed to help with people management and HR topics.`;
  }

  /**
   * Health check for OpenAI API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('OpenAI health check failed:', error);
      return false;
    }
  }
} 