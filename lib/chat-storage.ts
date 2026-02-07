/**
 * Simple Chat Storage with Dexie.js
 *
 * One persistent chat session with clean IndexedDB storage.
 * Messages are stored individually for easy inspection in DevTools.
 */

import Dexie, { Table } from 'dexie';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string; // Plain text extracted from parts
  parts: Array<{
    type: string;
    text?: string;
    reasoning?: string;
    state?: string;
    [key: string]: any;
  }>;
  sequenceNumber: number;
  createdAt: number;
  metadata?: Record<string, any>;
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
function extractTextContent(parts: Array<any>): string {
  if (!parts || !Array.isArray(parts)) return '';

  return parts
    .filter(part => part.type === 'text' && part.text)
    .map(part => part.text)
    .join(' ')
    .trim();
}

// ============================================================================
// Message Operations
// ============================================================================

/**
 * Save messages to IndexedDB
 */
export async function saveMessages(messages: any[]): Promise<void> {
  try {
    const now = Date.now();

    const messagesData: ChatMessage[] = messages.map((message, i) => ({
      id: message.id,
      role: message.role,
      content: extractTextContent(message.parts),
      parts: message.parts || [],
      sequenceNumber: i,
      createdAt: message.createdAt || now,
      metadata: message.metadata,
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
export async function loadMessages(): Promise<any[]> {
  try {
    const messages = await db.messages
      .orderBy('sequenceNumber')
      .toArray();

    // Convert stored format back to message format
    return messages.map((msg) => ({
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
        const parsed = JSON.parse(data);
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
