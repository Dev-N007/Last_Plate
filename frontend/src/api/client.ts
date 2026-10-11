import {
  FoodListing,
  Claim,
  ImpactSummary,
  ImpactTimeseriesPoint,
  ImpactCategoryPoint,
  AIRecommendationResponse,
  AIStatusResponse,
  CoordinatorOverview
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Listings
  getListings: (params?: { q?: string; category?: string; dietary?: string; status?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.dietary) query.append('dietary', params.dietary);
    if (params?.status) query.append('status', params.status);
    if (params?.sort) query.append('sort', params.sort);
    return request<FoodListing[]>(`/listings?${query.toString()}`);
  },

  getListing: (id: string) => request<FoodListing>(`/listings/${id}`),

  createListing: (data: Partial<FoodListing>) =>
    request<FoodListing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateListing: (id: string, data: Partial<FoodListing>) =>
    request<FoodListing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  // Claims
  claimPortions: (listingId: string, data: { recipient_id: string; recipient_name?: string; portions_claimed: number; pickup_notes?: string }) =>
    request<Claim>(`/listings/${listingId}/claims`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getClaims: (recipientId?: string, statusFilter?: string) => {
    const query = new URLSearchParams();
    if (recipientId) query.append('recipient_id', recipientId);
    if (statusFilter) query.append('status_filter', statusFilter);
    return request<Claim[]>(`/claims?${query.toString()}`);
  },

  cancelClaim: (claimId: string) =>
    request<Claim>(`/claims/${claimId}/cancel`, {
      method: 'PATCH'
    }),

  confirmPickup: (claimId: string) =>
    request<Claim>(`/claims/${claimId}/confirm-pickup`, {
      method: 'POST'
    }),

  // Impact
  getImpactSummary: () => request<ImpactSummary>('/impact/summary'),
  getImpactTimeseries: () => request<ImpactTimeseriesPoint[]>('/impact/timeseries'),
  getImpactCategories: () => request<ImpactCategoryPoint[]>('/impact/categories'),

  // Coordinator
  getUrgentListings: (maxHours = 6) => request<FoodListing[]>(`/coordinator/urgent-listings?max_hours=${maxHours}`),
  getCoordinatorOverview: () => request<CoordinatorOverview>('/coordinator/overview'),

  // AI & Strands
  getAIMatches: (data: { listing_id?: string; recipient_id?: string; dietary_filter?: string; max_matches?: number }) =>
    request<AIRecommendationResponse>('/ai/match', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getAIStatus: () => request<AIStatusResponse>('/ai/status'),

  // Demo reset
  resetDemoData: () =>
    request<{ status: string; message: string }>('/demo/reset', {
      method: 'POST'
    })
};
