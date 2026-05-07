import { api } from '../client';
import { buildQuery } from '../utils';
import type { Notification, PaginatedResponse } from '../types';

export const notificationsService = {
  getAll: (params?: {
    isRead?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<
      PaginatedResponse<Notification> & { unreadCount: number }
    >(`/notifications${buildQuery(params as Record<string, unknown>)}`),

  markRead: (id: string) =>
    api.patch<Notification>(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch<{ message: string; updated: number }>(
      '/notifications/read-all',
    ),

  delete: (id: string) =>
    api.delete<{ message: string }>(`/notifications/${id}`),
};
