import {
  bookingPartyId,
  filterTravelerBookings,
  paginateBookings,
} from '../booking-utils';
import { api, ApiRequestError } from '../client';
import { buildQuery } from '../utils';
import type { Booking, PaginatedResponse } from '../types';

export const bookingsService = {
  match: (data: { requestId: string; tripId: string; offeredFee: number }) =>
    api.post<Booking>('/bookings/match', data),

  getMy: async (params?: {
    status?: string;
    role?: 'traveler' | 'requester';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Booking>> => {
    const raw = await api.get<PaginatedResponse<Booking> | Booking[]>(
      `/bookings/my${buildQuery(params as Record<string, unknown>)}`,
    );
    if (raw == null) {
      throw new ApiRequestError(
        401,
        'Could not load bookings. Sign in again or refresh the page.',
        'Unauthorized',
      );
    }
    if (Array.isArray(raw)) {
      const limit = Math.max(1, params?.limit ?? 10);
      const page = Math.max(1, params?.page ?? 1);
      const start = (page - 1) * limit;
      const slice = raw.slice(start, start + limit);
      return { data: slice, total: raw.length, page, limit };
    }
    return {
      data: raw.data ?? [],
      total: raw.total ?? 0,
      page: raw.page ?? 1,
      limit: raw.limit ?? params?.limit ?? 10,
    };
  },

  /**
   * All bookings where the user is the traveler. Uses role=traveler when possible,
   * then client-side party-id match; falls back to unfiltered /bookings/my if needed.
   */
  getMyForTraveler: async (
    travelerUserId: string,
    params?: { limit?: number },
  ): Promise<PaginatedResponse<Booking>> => {
    const limit = Math.max(1, params?.limit ?? 50);

    const byRole = await bookingsService.getMy({ role: 'traveler', limit: 100 });
    let rows = filterTravelerBookings(byRole.data, travelerUserId);

    if (rows.length === 0 && byRole.total === 0) {
      const all = await bookingsService.getMy({ limit: 100 });
      rows = filterTravelerBookings(all.data, travelerUserId);
    }

    return paginateBookings(rows, limit);
  },

  getMyForRequester: async (
    requesterUserId: string,
    params?: { limit?: number },
  ): Promise<PaginatedResponse<Booking>> => {
    const limit = Math.max(1, params?.limit ?? 50);

    const byRole = await bookingsService.getMy({ role: 'requester', limit: 100 });
    let rows = byRole.data.filter(
      (b) => bookingPartyId(b.requesterId) === requesterUserId,
    );

    if (rows.length === 0 && byRole.total === 0) {
      const all = await bookingsService.getMy({ limit: 100 });
      rows = all.data.filter(
        (b) => bookingPartyId(b.requesterId) === requesterUserId,
      );
    }

    return paginateBookings(rows, limit);
  },

  getById: async (id: string): Promise<Booking> => {
    const booking = await api.get<Booking>(`/bookings/${id}`);
    if (!booking) {
      throw new ApiRequestError(404, 'Booking not found', 'Not Found');
    }
    return booking;
  },

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
