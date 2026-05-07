import { api } from '../client';
import { buildQuery } from '../utils';
import type { PaginatedResponse, Review } from '../types';

export interface CreateReviewData {
  bookingId: string;
  revieweeId: string;
  overallRating: number;
  categoryRatings?: {
    communication?: number;
    reliability?: number;
    itemCare?: number;
    punctuality?: number;
  };
  comment?: string;
}

export const reviewsService = {
  create: (data: CreateReviewData) => api.post<Review>('/reviews', data),

  getForUser: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get<
      PaginatedResponse<Review> & { averageRating: number }
    >(`/reviews/user/${userId}${buildQuery(params as Record<string, unknown>)}`),

  getForBooking: (bookingId: string) =>
    api.get<Review[]>(`/reviews/booking/${bookingId}`),

  getMy: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Review>>(
      `/reviews/my${buildQuery(params as Record<string, unknown>)}`,
    ),
};
