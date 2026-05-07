import { api } from '../client';
import { buildQuery } from '../utils';
import type { Booking, PaginatedResponse } from '../types';

export const bookingsService = {
  match: (data: { requestId: string; tripId: string; offeredFee: number }) =>
    api.post<Booking>('/bookings/match', data),

  getMy: (params?: {
    status?: string;
    role?: 'traveler' | 'requester';
    page?: number;
    limit?: number;
  }) =>
    api.get<PaginatedResponse<Booking>>(
      `/bookings/my${buildQuery(params as Record<string, unknown>)}`,
    ),

  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  accept: (id: string) => api.post<Booking>(`/bookings/${id}/accept`),

  counter: (id: string, counterFee: number) =>
    api.post<Booking>(`/bookings/${id}/counter`, { counterFee }),

  decline: (id: string) =>
    api.post<{ message: string }>(`/bookings/${id}/decline`),

  acceptCounter: (id: string) =>
    api.post<Booking>(`/bookings/${id}/accept-counter`),

  /** @deprecated Returns 410 — use `paymentsService.createIntent` + Stripe.js instead. */
  pay: (id: string, paymentMethodId: string) =>
    api.post<{ booking: Booking; message: string }>(`/bookings/${id}/pay`, {
      paymentMethodId,
    }),

  markInTransit: (id: string) =>
    api.post<Booking>(`/bookings/${id}/in-transit`),

  submitPod: (
    id: string,
    data: { podPhotoUrl: string; podConfirmationCode: string },
  ) => api.post<Booking>(`/bookings/${id}/proof-of-delivery`, data),

  complete: (id: string) => api.post<Booking>(`/bookings/${id}/complete`),

  dispute: (id: string, reason: string) =>
    api.post<Booking>(`/bookings/${id}/dispute`, { reason }),

  cancel: (id: string, reason?: string) =>
    api.post<{ message: string }>(`/bookings/${id}/cancel`, { reason }),
};
