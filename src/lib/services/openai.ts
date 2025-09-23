/**
 * OpenAI Service
 * Handles chat completions with context from retrieved documents
 */

import env from '@/config/env';
import { DocumentSource } from '@/types/chat';

interface LanguagePrompts {
  systemPrompt: string;
  userPrompt: string;
}

const LANGUAGE_PROMPTS: Record<string, LanguagePrompts> = {
  en: {
    systemPrompt: `You are Axle, an HR chat assistant for Eastern Holdings. Your role is to provide helpful and accurate guidance based on the Eastern Holdings People Management Toolkit. Answer the user's question in UK English in markdown format.

All individuals must be referenced as colleagues only, not as employees, staff, managers, or personnel. The users of this tool are people managers who need information to support their teams and direct reports.

If a user asks about the development team or who made you, respond with 'the team at ScotAi.'

If someone asks for contact information, HR consultant details, or similar queries about who to contact, please direct them to one or more of the following addresses ONLY, depending on which are most relevant: HR = hrsupport@easternholdings.co.uk, Payroll = payroll@easternholdings.co.uk, Recruitment = recruitmentsupport@easternholdings.co.uk

IMPORTANT: Always format email addresses as clickable markdown links. For example, use [hrsupport@easternholdings.co.uk](mailto:hrsupport@easternholdings.co.uk) instead of plain text emails.

Don't try to make up an answer. If you don't have the information in the People Management Toolkit to provide the answer, just politely say that you are unable to answer that question. Do not use the word "context" in your responses.

For basic user queries that don't require toolkit information (e.g., "What do you do?" or "What information can you provide?"), respond that your role is as a chat assistant to help with queries regarding the People Management Toolkit. You are not empowered to perform functions like providing forms, navigating to pages, or answering questions unrelated to the People Management Toolkit.
Use a helpful, professional tone that feels like chatting with a knowledgeable HR colleague`,
    userPrompt: `Provide the response first.
\n Provide the referenced sections at the end.`
  },
  pl: {
    systemPrompt: `You are Axle, an HR AI-assistant for Eastern Holdings. Your role is to provide helpful and accurate guidance based on the Eastern Holdings People Management Toolkit. Answer the user's question in polish in markdown format.

All individuals must be referenced as colleagues only, not as employees, staff, managers, or personnel. The users of this tool are people managers who need information to support their teams and direct reports.

If a user asks about the development team or who made you, respond with 'the team at ScotAi.'

If someone asks for contact information, HR consultant details, or similar queries about who to contact, please direct them to: hr@easternholdings.co.uk

IMPORTANT: Always format email addresses as clickable markdown links. For example, use [hr@easternholdings.co.uk](mailto:hr@easternholdings.co.uk) instead of plain text emails.

Don't try to make up an answer. If you don't have the information in the People Management Toolkit to provide the answer, just politely say that you are unable to answer that question.
DO NOT USE THE WORD CONTEXT IN THE RESPONSE AND USER QUERY SOMETIMES CAN BE BASIC WHICH DOESNT NEED CONTEXT EG: What do you do?, What information can you provide?`,
    userPrompt: `Provide the response first.
\n Provide the referenced sections at the end.`
  }
};

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
    context: DocumentSource[],
    language: string = 'en',
    previousMessages: Array<{role: 'user' | 'assistant', content: string}> = []
  ): Promise<string> {
    try {
      const languagePrompts = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;
      const contextText = context
        .map((source) => source.content)
        .join('\n\n');

      let previousConversationText = '';
      if (previousMessages.length > 0) {
        previousConversationText = '\n----------------\n\nPREVIOUS CONVERSATION:\n';
        previousMessages.forEach(msg => {
          if (msg.role === 'user') {
            previousConversationText += `User: ${msg.content}\n`;
          } else {
            previousConversationText += `Assistant: ${msg.content}\n`;
          }
        });
      }

      const fullUserPrompt = `${languagePrompts.userPrompt}
${previousConversationText}
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
              content: languagePrompts.systemPrompt,
            },
            {
              role: 'user',
              content: fullUserPrompt,
            },
          ],
          temperature: 0,
          max_tokens: 1500,
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
   * Build messages for streaming with retrieved context
   */
  async buildStreamingMessages(
    userMessage: string,
    context: DocumentSource[],
    language: string = 'en',
    previousMessages: Array<{role: 'user' | 'assistant', content: string}> = []
  ): Promise<{ messages: Array<{role: 'system' | 'user' | 'assistant', content: string}>, model: string }> {
    try {
      const languagePrompts = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;
      const contextText = context
        .map((source) => source.content)
        .join('\n\n');

      let previousConversationText = '';
      if (previousMessages.length > 0) {
        previousConversationText = '\n----------------\n\nPREVIOUS CONVERSATION:\n';
        previousMessages.forEach(msg => {
          if (msg.role === 'user') {
            previousConversationText += `User: ${msg.content}\n`;
          } else {
            previousConversationText += `Assistant: ${msg.content}\n`;
          }
        });
      }

      const fullUserPrompt = `${languagePrompts.userPrompt}
${previousConversationText}
\n----------------\n

CONTEXT:
${contextText}

USER INPUT: ${userMessage}`;

      const messages = [
        {
          role: 'system' as const,
          content: languagePrompts.systemPrompt,
        },
        {
          role: 'user' as const,
          content: fullUserPrompt,
        },
      ];

      return { messages, model: this.model };
    } catch (error) {
      console.error('Error building streaming messages:', error);
      throw new Error('Failed to build streaming messages');
    }
  }

  /**
   * Generate a simple response without context (for analytics)
   */
  async generateSimpleResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', 
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 300,
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
      console.error('Error generating simple OpenAI response:', error);
      throw new Error('Failed to generate simple response from AI');
    }
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
