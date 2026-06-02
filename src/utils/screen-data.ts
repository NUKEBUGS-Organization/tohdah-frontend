import type { PaginatedResponse } from '../api/types';

export function resolveUserId(
  user: { id?: string; _id?: string; userId?: string } | null | undefined,
): string {
  return user?.id ?? user?._id ?? user?.userId ?? '';
}

export function emptyPaginated<T>(limit = 20): PaginatedResponse<T> {
  return { data: [], total: 0, page: 1, limit };
}

export const FRIENDLY_LOAD_ERROR =
  'Unable to load data right now. Please refresh.';
