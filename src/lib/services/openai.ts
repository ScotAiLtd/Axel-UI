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
      const contextText = context
        .map((source) => source.content)
        .join('\n\n');
      
      const userPrompt = `Provide the response first.
If there is any conflict or ambiguity in the provided information, include a section titled "Clarification Recommended" after the response.
\n Provide a list of the conflicting or unspecified items or details from my request.
\n Provide the references at the end, section number, page number, and image or figure number (if any) from the pdf separately in points, not the URL, with a subheading of 'References.' after the actual response,

\n----------------\n

CONTEXT:
${contextText}

USER INPUT: ${userMessage}`;
      
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
              content: userPrompt,
            },
          ],
          temperature: 0,
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

    return `Use the following pieces of context (or previous conversation if needed) to answer the user's question in English in markdown format. 
Do not reply with 'I'm developed by the OpenAI Team.' 
If a user asks about the development team, respond with 'engineers at ScotAI.' 
Don't try to make up an answer. If you don't know the answer, just say that you don't know. 
Don't answer if the question is out of context`;
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