import { api } from '../client';
import type { User } from '../types';

export interface UserStats {
  completedDeliveries?: number;
  supportDeliveries?: number;
  tripsPosted?: number;
  requestsPosted?: number;
  [key: string]: unknown;
}

export interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  travelPreferences?: string[];
  profilePhoto?: string;
  accountType?: 'traveler' | 'requester' | 'both';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ReportData {
  targetUserId: string;
  reason: 'spam' | 'fraud' | 'harassment' | 'fake_profile' | 'other';
  description?: string;
}

export const usersService = {
  getProfile: (userId: string) =>
    api.get<User & Record<string, unknown>>(`/users/${userId}/profile`),

  getStats: (userId: string) => api.get<UserStats>(`/users/${userId}/stats`),

  updateProfile: (data: UpdateProfileData) =>
    api.patch<User>('/users/profile', data),

  changePassword: (data: ChangePasswordData) =>
    api.patch<{ message: string }>('/users/change-password', data),

  getBlocked: () => api.get<User[]>('/users/blocked'),

  block: (userId: string) =>
    api.post<{ message: string }>(`/users/block/${userId}`),

  unblock: (userId: string) =>
    api.delete<{ message: string }>(`/users/block/${userId}`),

  report: (data: ReportData) =>
    api.post<{ message: string }>('/users/report', data),

  registerFcmToken: (token: string) =>
    api.post<{ message: string }>('/users/fcm-token', { token }),

  removeFcmToken: (token: string) =>
    api.delete<{ message: string }>('/users/fcm-token', { token }),

  getActiveSessions: () =>
    api.get<{ activeSessions: number }>('/users/sessions'),

  revokeAllSessions: () =>
    api.delete<{ message: string }>('/users/sessions'),
};
