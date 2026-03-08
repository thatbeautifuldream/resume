/**
 * Simple Chat Storage with Dexie.js
 *
 * One persistent chat session with clean IndexedDB storage.
 * Messages are stored individually for easy inspection in DevTools.
 */

import Dexie, { Table } from 'dexie';
import type { ExtendedUIMessage } from '@/types/chat';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string; // Plain text extracted from parts
  parts: ExtendedUIMessage["parts"];
  sequenceNumber: number;
  createdAt: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Database Definition
// ============================================================================

class ChatDatabase extends Dexie {
  messages!: Table<ChatMessage, string>;

  constructor() {
    super('resume-chat-storage');

    this.version(4).stores({
      messages: 'id, sequenceNumber, createdAt, role'
    });
  }
}

// Create database instance
const db = new ChatDatabase();

// Delete legacy databases on initialization
if (typeof window !== 'undefined') {
  (async () => {
    try {
      await Dexie.delete('chat-storage'); // V1
    } catch (error) {
      // Ignore if doesn't exist
    }
  })();
}

// Persistent chat ID
const CHAT_ID = 'persistent-chat';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract plain text content from message parts for search
 */
function extractTextContent(parts: ExtendedUIMessage["parts"] | undefined): string {
  if (!parts || !Array.isArray(parts)) return '';

  return parts
    .filter(
      (part): part is ExtendedUIMessage["parts"][number] & { type: "text"; text: string } =>
        part.type === "text" && typeof part.text === "string",
    )
    .map((part) => part.text)
    .join(' ')
    .trim();
}

// ============================================================================
// Message Operations
// ============================================================================

/**
 * Save messages to IndexedDB
 */
export async function saveMessages(messages: ExtendedUIMessage[]): Promise<void> {
  try {
    const now = Date.now();

    const messagesData: ChatMessage[] = messages.map((message, i) => ({
      id: message.id,
      role: message.role,
      content: extractTextContent(message.parts),
      parts: message.parts || [],
      sequenceNumber: i,
      createdAt: message.createdAt || now,
      metadata:
        message.metadata && typeof message.metadata === "object"
          ? (message.metadata as Record<string, unknown>)
          : undefined,
    }));

    // Clear existing messages and save new ones
    await db.transaction('rw', db.messages, async () => {
      await db.messages.clear();
      await db.messages.bulkAdd(messagesData);
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Storage] Failed to save messages:', error);
    }
    // Fallback to localStorage
    try {
      localStorage.setItem(CHAT_ID, JSON.stringify({
        messages,
        updatedAt: Date.now()
      }));
    } catch (lsError) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Storage] LocalStorage fallback also failed:', lsError);
      }
    }
  }
}

/**
 * Load messages from IndexedDB
 */
export async function loadMessages(): Promise<ExtendedUIMessage[]> {
  try {
    const messages = await db.messages
      .orderBy('sequenceNumber')
      .toArray();

    // Convert stored format back to message format
    return messages.map((msg): ExtendedUIMessage => ({
      id: msg.id,
      role: msg.role,
      parts: msg.parts,
      createdAt: msg.createdAt,
      metadata: msg.metadata,
    }));
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Storage] Failed to load messages:', error);
    }
    // Fallback to localStorage
    try {
      const data = localStorage.getItem(CHAT_ID);
      if (data) {
        const parsed = JSON.parse(data) as { messages?: ExtendedUIMessage[] };
        return parsed.messages || [];
      }
    } catch (lsError) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Storage] LocalStorage fallback also failed:', lsError);
      }
    }
    return [];
  }
}

/**
 * Clear all messages (start fresh)
 */
export async function clearMessages(): Promise<void> {
  try {
    await db.messages.clear();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Storage] Failed to clear messages:', error);
    }
    localStorage.removeItem(CHAT_ID);
  }
}

// Export database instance for advanced usage
export { db };
