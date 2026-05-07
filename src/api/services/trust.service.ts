import { api } from '../client';
import type { TrustScore } from '../types';

export interface Badge {
  badge: string;
  earned: boolean;
}

export const trustService = {
  getMyScore: () => api.get<TrustScore>('/trust/me'),

  getUserScore: (userId: string) =>
    api.get<TrustScore>(`/trust/user/${userId}`),

  getBadges: (userId: string) =>
    api.get<Badge[]>(`/trust/badges/${userId}`),

  verify: (field: 'email' | 'phone' | 'id' | 'selfie') =>
    api.patch<TrustScore>('/trust/verify', { field }),
};
