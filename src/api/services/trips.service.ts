import { api, ApiRequestError } from '../client';
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
   * GET /trips/my accepts only `status` (active | completed | cancelled).
   * Backend returns a plain Trip[] or paginated { data, total, page, limit }.
   * `page` / `limit` are applied client-side only — never sent as query params.
   */
  getMy: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Trip>> => {
    const q: Record<string, unknown> = {};
    if (params?.status) q.status = params.status;
    const path = `/trips/my${buildQuery(q)}`;
    if (import.meta.env.DEV) {
      console.debug('[tripsService.getMy]', path);
    }
    const raw = await api.get<Trip[] | PaginatedResponse<Trip>>(path);
    const page = params?.page ?? 1;
    const limit = Math.max(1, params?.limit ?? 10);

    if (raw == null) {
      throw new ApiRequestError(
        401,
        'Could not load trips. Sign in again or refresh the page.',
        'Unauthorized',
      );
    }

    if (!Array.isArray(raw) && Array.isArray(raw.data)) {
      const total = raw.total ?? raw.data.length;
      const start = (Math.max(1, page) - 1) * limit;
      return {
        data: raw.data.slice(start, start + limit),
        total,
        page: Math.max(1, page),
        limit,
      };
    }

    const list = Array.isArray(raw) ? raw : [];
    return asPaginatedTrips(list, page, limit);
  },

  browse: (params?: BrowseTripsParams) =>
    api.get<PaginatedResponse<Trip>>(`/trips/browse${buildQuery(params as Record<string, unknown>)}`),

  getById: (id: string) => api.get<Trip>(`/trips/${id}`),

  update: (id: string, data: Partial<CreateTripData>) =>
    api.patch<Trip>(`/trips/${id}`, data),

  cancel: (id: string) => api.delete<{ message: string }>(`/trips/${id}`),
};
