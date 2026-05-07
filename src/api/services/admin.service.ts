import { api } from '../client';
import { buildQuery } from '../utils';
import type {
  User,
  Trip,
  DeliveryRequest,
  Booking,
  PaginatedResponse,
} from '../types';
import type { UserStats } from './users.service';

export interface PlatformStats {
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    travelers: number;
    requesters: number;
    verified: number;
  };
  trips: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  requests: {
    total: number;
    pending: number;
    standard: number;
    support: number;
    completed: number;
  };
  bookings: {
    total: number;
    active: number;
    completed: number;
    disputed: number;
    cancelled: number;
  };
  revenue: {
    totalCommission: number;
    thisMonth: number;
    thisWeek: number;
  };
  impact: {
    supportRequestsTotal: number;
    supportRequestsFulfilled: number;
    volunteerDeliveries: number;
    elderlyAssisted: number;
    communityChampions: number;
  };
}

export interface ImpactReport {
  overview: {
    supportRequestsTotal: number;
    supportRequestsFulfilled: number;
    volunteerDeliveries: number;
    elderlyAssisted: number;
    communityChampions: number;
  };
  byType: { type: string; count: number; fulfilled: number }[];
  byPaymentType: { paymentType: string; count: number }[];
  topTravelers: {
    travelerId: string;
    fullName: string;
    profilePhoto: string | null;
    supportDeliveries: number;
  }[];
}

/** Row from `GET /admin/users` (subset of User + list fields). */
export interface AdminListedUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  accountType: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  rating: number;
  reviewCount: number;
  accountStatus: string;
  createdAt?: string;
}

/** Backend returns `{ user, stats, recentActivity }` — not a flat `User` merge. */
export interface AdminUserDetailResponse {
  user: User & Record<string, unknown>;
  stats: UserStats;
  recentActivity: {
    bookings: { id: string; status: string; createdAt?: string }[];
    trips: { id: string; status: string; createdAt?: string }[];
    requests: { id: string; status: string; createdAt?: string }[];
  };
}

export interface ResolveDisputeData {
  resolution: 'refund_requester' | 'release_traveler' | 'partial_refund' | 'no_action';
  refundAmount?: number;
  notes: string;
}

export interface AdminReferralRow {
  id: string;
  fullName: string;
  email: string;
  loyaltyPoints?: number;
  createdAt?: string;
  referredBy: { fullName?: string; email?: string } | string | null;
}

export const adminService = {
  getStats: () => api.get<PlatformStats>('/admin/stats'),

  getUsers: (params?: {
    search?: string;
    role?: string;
    accountType?: string;
    status?: string;
    isVerified?: boolean;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<AdminListedUser>>(`/admin/users${buildQuery(params as Record<string, unknown>)}`),

  getUserDetail: (userId: string) =>
    api.get<AdminUserDetailResponse>(`/admin/users/${userId}`),

  suspendUser: (userId: string, reason: string) =>
    api.patch<{ message: string; userId: string }>(`/admin/users/${userId}/suspend`, { reason }),

  banUser: (userId: string, reason: string) =>
    api.patch<{ message: string; userId: string }>(`/admin/users/${userId}/ban`, { reason }),

  reinstateUser: (userId: string) =>
    api.patch<{ message: string; userId: string }>(`/admin/users/${userId}/reinstate`),

  updateUserRole: (userId: string, role: 'user' | 'admin') =>
    api.patch<{ message: string; userId: string; role: string }>(`/admin/users/${userId}/role`, { role }),

  getTrips: (params?: {
    status?: string;
    origin?: string;
    destination?: string;
    dateFrom?: string;
    dateTo?: string;
    travelerId?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<PaginatedResponse<Trip>>(`/admin/trips${buildQuery(params as Record<string, unknown>)}`),

  getRequests: (params?: {
    status?: string;
    type?: string;
    urgencyLevel?: string;
    origin?: string;
    destination?: string;
    requesterId?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<PaginatedResponse<DeliveryRequest>>(
      `/admin/requests${buildQuery(params as Record<string, unknown>)}`,
    ),

  getBookings: (params?: {
    status?: string;
    travelerId?: string;
    requesterId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<PaginatedResponse<Booking>>(`/admin/bookings${buildQuery(params as Record<string, unknown>)}`),

  getDisputes: (params?: { dateFrom?: string; dateTo?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Booking>>(`/admin/disputes${buildQuery(params as Record<string, unknown>)}`),

  resolveDispute: (bookingId: string, data: ResolveDisputeData) =>
    api.post<{ message: string; booking: Booking }>(`/admin/disputes/${bookingId}/resolve`, data),

  getSupportRequests: (params?: {
    adminApprovalStatus?: string;
    urgencyLevel?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get<PaginatedResponse<DeliveryRequest>>(
      `/admin/support-requests${buildQuery(params as Record<string, unknown>)}`,
    ),

  approveSupport: (requestId: string, notes?: string) =>
    api.post<{ message: string; request: DeliveryRequest }>(
      `/admin/support-requests/${requestId}/approve`,
      { notes },
    ),

  rejectSupport: (requestId: string, notes: string) =>
    api.post<{ message: string; request: DeliveryRequest }>(
      `/admin/support-requests/${requestId}/reject`,
      { notes },
    ),

  getImpact: (params?: { dateFrom?: string; dateTo?: string }) =>
    api.get<ImpactReport>(`/admin/impact${buildQuery(params as Record<string, unknown>)}`),

  getReferrals: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<AdminReferralRow>>(`/admin/referrals${buildQuery(params as Record<string, unknown>)}`),

  getLoyalty: () =>
    api.get<{
      tiers: { tier: string; count: number }[];
      topUsers: { fullName: string; email: string; points: number }[];
    }>('/admin/loyalty'),
};
