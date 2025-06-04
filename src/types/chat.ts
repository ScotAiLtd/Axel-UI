/**
 * Message interface for chat messages
 */
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

/**
 * Chat API Request interface
 */
export interface ChatRequest {
  message: string;
  namespace?: string;
}

/**
 * Chat API Response interface
 */
export interface ChatResponse {
  message: string;
  sources?: DocumentSource[];
  error?: string;
}

/**
 * Document source interface for citations
 */
export interface DocumentSource {
  content: string;
  metadata?: Record<string, any>;
  score?: number;
}

/**
 * API Error Response interface
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: string;
}
