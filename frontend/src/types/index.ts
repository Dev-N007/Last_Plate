export type UserRole = 'provider' | 'recipient' | 'coordinator';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  organization?: string;
  contact_email?: string;
  phone?: string;
  created_at: string;
}

export type ListingStatus = 'available' | 'reserved' | 'collected' | 'expired';
export type UrgencyLevel = 'critical' | 'urgent' | 'normal' | 'expired';

export interface FoodListing {
  id: string;
  provider_id: string;
  provider_name: string;
  name: string;
  category: string;
  description: string;
  total_quantity: number;
  quantity_unit: string;
  available_portions: number;
  preparation_time: string;
  pickup_deadline: string;
  pickup_location: string;
  dietary_tags: string[];
  declared_allergens: string[];
  storage_information: string;
  image_url: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  urgency_level: UrgencyLevel;
  minutes_remaining: number;
}

export type ClaimStatus = 'reserved' | 'confirmed' | 'cancelled' | 'expired';

export interface Claim {
  id: string;
  listing_id: string;
  recipient_id: string;
  recipient_name: string;
  portions_claimed: number;
  status: ClaimStatus;
  claim_reference: string;
  pickup_notes?: string;
  claimed_at: string;
  pickup_confirmed_at?: string;
  cancelled_at?: string;
  listing_name?: string;
  listing_category?: string;
  pickup_location?: string;
  pickup_deadline?: string;
  image_url?: string;
}

export interface ImpactSummary {
  total_portions_listed: number;
  total_portions_claimed: number;
  total_portions_collected: number;
  estimated_kg_redistributed: number;
  kg_per_portion_factor: number;
  successful_pickup_rate_pct: number;
  total_active_listings: number;
  total_completed_pickups: number;
  total_active_partners: number;
  active_rescue_organizations: number;
  co2_avoided_kg_estimate: number;
}

export interface ImpactTimeseriesPoint {
  date: string;
  portions_collected: number;
  kg_rescued: number;
  rescues_count: number;
}

export interface ImpactCategoryPoint {
  category: string;
  portions: number;
  percentage: number;
}

export interface MatchingSuggestion {
  listing_id: string;
  listing_name: string;
  provider_name: string;
  recipient_id: string;
  recipient_name: string;
  recipient_org?: string;
  available_portions: number;
  portions_requested: number;
  score: number;
  urgency_level: UrgencyLevel;
  reason: string;
  evidence: {
    minutes_remaining?: number;
    hours_remaining?: number;
    available_portions?: number;
    dietary_match?: string[];
    declared_allergens?: string[];
    allergens_checked?: string[];
    urgency_level?: string;
    [key: string]: any;
  };
  missing_info?: string;
  suggested_action: string;
  allergen_safety_status: 'verified_safe' | 'no_declared_allergens' | 'contains_allergen_rejected';
}

export interface AIRecommendationResponse {
  ai_status: string;
  model_provider: string;
  agent_reasoning: string;
  recommendations: MatchingSuggestion[];
  timestamp: string;
  limitations_and_safety_notes: string;
}

export interface AIStatusResponse {
  available: boolean;
  provider: string;
  model: string;
  strands_version?: string;
  message: string;
}

export interface CoordinatorOverview {
  active_listings_count: number;
  urgent_listings_count: number;
  pending_claims_count: number;
  completed_rescues_count: number;
  expired_listings_count: number;
  portions_awaiting_pickup: number;
  timestamp: string;
}
