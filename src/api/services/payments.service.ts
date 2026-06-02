import { api } from '../client';

import type { Booking } from '../types';

export const paymentsService = {
  createIntent: (bookingId: string) =>
    api.post<{ clientSecret: string; paymentIntentId: string }>(
      `/payments/intent/${bookingId}`,
    ),

  /** Sync booking to paid after Stripe.js confirms (webhook fallback). */
  confirmPayment: (paymentIntentId: string) =>
    api.post<Booking>('/payments/confirm', { paymentIntentId }),
};
