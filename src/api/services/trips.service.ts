import { api } from '../client';
import { buildQuery } from '../utils';
import type { PaginatedResponse, Trip } from '../types';

export interface CreateTripData {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  luggageSpace: 'small' | 'medium' | 'large';
  acceptedCategories?: string[];
  deliveryPreferences?: string;
  pricingType: 'fixed' | 'negotiable';
  pricePerKg?: number;
  notes?: string;
  openToCommunitySupport?: boolean;
  willingToAssistElderly?: boolean;
  acceptReducedFee?: boolean;
  acceptVolunteer?: boolean;
}

export interface BrowseTripsParams {
  origin?: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  luggageSpace?: 'small' | 'medium' | 'large';
  category?: string;
  maxPrice?: number;
  socialImpact?: boolean;
  page?: number;
  limit?: number;
}

function asPaginatedTrips(
  list: Trip[],
  page: number,
  limit: number,
): PaginatedResponse<Trip> {
  const total = list.length;
  const start = (Math.max(1, page) - 1) * limit;
  return {
    data: list.slice(start, start + limit),
    total,
    page: Math.max(1, page),
    limit,
  };
}

export const tripsService = {
  create: (data: CreateTripData) => api.post<Trip>('/trips', data),

  /**
   * Backend returns a plain array (no server pagination). Client slices when page/limit passed.
   */
  getMy: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Trip>> => {
    const qs = buildQuery(
      params?.status ? { status: params.status } : undefined,
    );
    const raw = await api.get<Trip[]>(`/trips/my${qs}`);
    const list = Array.isArray(raw) ? raw : [];
    const page = params?.page ?? 1;
    const limit = Math.max(1, params?.limit ?? 10);
    return asPaginatedTrips(list, page, limit);
  },

  browse: (params?: BrowseTripsParams) =>
    api.get<PaginatedResponse<Trip>>(`/trips/browse${buildQuery(params as Record<string, unknown>)}`),

  getById: (id: string) => api.get<Trip>(`/trips/${id}`),

  update: (id: string, data: Partial<CreateTripData>) =>
    api.patch<Trip>(`/trips/${id}`, data),

  cancel: (id: string) => api.delete<{ message: string }>(`/trips/${id}`),
};
