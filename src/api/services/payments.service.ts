import { api } from '../client';

export const paymentsService = {
  createIntent: (bookingId: string) =>
    api.post<{ clientSecret: string; paymentIntentId: string }>(
      `/payments/intent/${bookingId}`,
    ),
};
