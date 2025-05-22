/**
 * Message interface for chat messages
 */
export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
