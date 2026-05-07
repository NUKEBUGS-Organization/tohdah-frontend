import { api } from '../client';
import { buildQuery } from '../utils';
import type { DeliveryRequest, PaginatedResponse } from '../types';

export interface CreateRequestData {
  type: 'standard' | 'support';
  itemName: string;
  itemDescription: string;
  itemCategory: string;
  itemSize: 'small' | 'medium' | 'large';
  estimatedValue?: number;
  origin: string;
  destination: string;
  deliveryDeadline: string;
  budget?: number;
  currency?: string;
  paymentType?: 'full' | 'reduced' | 'sponsored' | 'volunteer';
  beneficiaryName?: string;
  beneficiaryType?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  supportingNotes?: string;
}

export interface BrowseRequestsParams {
  origin?: string;
  destination?: string;
  type?: 'standard' | 'support';
  supportOnly?: boolean;
  itemCategory?: string;
  itemSize?: 'small' | 'medium' | 'large';
  urgencyLevel?: string;
  minBudget?: number;
  maxBudget?: number;
  deadlineBefore?: string;
  page?: number;
  limit?: number;
}

function asPaginatedRequests(
  list: DeliveryRequest[],
  page: number,
  limit: number,
): PaginatedResponse<DeliveryRequest> {
  const total = list.length;
  const start = (Math.max(1, page) - 1) * limit;
  return {
    data: list.slice(start, start + limit),
    total,
    page: Math.max(1, page),
    limit,
  };
}

export const requestsService = {
  create: (data: CreateRequestData) =>
    api.post<DeliveryRequest>('/requests', data),

  getMy: async (params?: {
    status?: string;
    type?: 'standard' | 'support';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<DeliveryRequest>> => {
    const q: Record<string, unknown> = {};
    if (params?.status) q.status = params.status;
    if (params?.type) q.type = params.type;
    const raw = await api.get<DeliveryRequest[]>(
      `/requests/my${buildQuery(q)}`,
    );
    const list = Array.isArray(raw) ? raw : [];
    const page = params?.page ?? 1;
    const limit = Math.max(1, params?.limit ?? 10);
    return asPaginatedRequests(list, page, limit);
  },

  browse: (params?: BrowseRequestsParams) =>
    api.get<PaginatedResponse<DeliveryRequest>>(
      `/requests/browse${buildQuery(params as Record<string, unknown>)}`,
    ),

  getById: (id: string) => api.get<DeliveryRequest>(`/requests/${id}`),

  update: (id: string, data: Partial<CreateRequestData>) =>
    api.patch<DeliveryRequest>(`/requests/${id}`, data),

  cancel: (id: string) =>
    api.delete<{ message: string }>(`/requests/${id}`),
};
