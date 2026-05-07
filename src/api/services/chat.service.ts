import { api } from '../client';
import { buildQuery } from '../utils';
import type { Booking, Message, PaginatedResponse } from '../types';

export interface ConversationSummary {
  bookingId: string;
  bookingRef?: string;
  booking: Partial<Booking> | null;
  lastMessage: Message;
  unreadCount: number;
}

type InboxRow = {
  booking?: (Partial<Booking> & { _id?: string }) | null;
  bookingRef?: string;
  lastMessage: Message;
  unreadCount: number;
};

function bookingIdFromRow(row: InboxRow): string {
  const b = row.booking as { _id?: string } | null | undefined;
  if (b?._id) return String(b._id);
  const lm = row.lastMessage;
  const bid = lm.bookingId;
  if (typeof bid === 'string') return bid;
  return String(bid);
}

export const chatService = {
  getInbox: async (): Promise<ConversationSummary[]> => {
    const raw = await api.get<InboxRow[]>('/chat/my');
    const rows = Array.isArray(raw) ? raw : [];
    return rows.map((row) => ({
      bookingId: bookingIdFromRow(row),
      bookingRef: row.bookingRef,
      booking: row.booking ?? null,
      lastMessage: row.lastMessage,
      unreadCount: row.unreadCount ?? 0,
    }));
  },

  getMessages: (bookingId: string, params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Message>>(
      `/chat/${bookingId}/messages${buildQuery(params as Record<string, unknown>)}`,
    ),

  sendMessage: (bookingId: string, content: string, imageUrl?: string) =>
    api.post<Message>(`/chat/${bookingId}/messages`, { content, imageUrl }),
};
