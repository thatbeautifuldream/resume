import type { UIMessage } from '@ai-sdk/react';

/**
 * Extended UIMessage type with createdAt timestamp
 * for WhatsApp-style message timestamps
 */
export interface ExtendedUIMessage extends UIMessage {
  createdAt?: number;
}

/**
 * Type for chat items that can be either a message or date separator
 */
export type ChatItem =
  | { type: "message"; data: ExtendedUIMessage; originalIndex: number }
  | { type: "date-separator"; date: string; timestamp: number };
