from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field

class UserResponse(BaseModel):
    id: str
    name: str
    role: str
    organization: Optional[str] = None
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FoodListingBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., description="e.g. Bakery & Bread, Prepared Meals, Produce & Fruits, Dairy & Deli, Packaged Goods")
    description: str = Field(..., min_length=5)
    total_quantity: int = Field(..., gt=0)
    quantity_unit: str = Field(default="portions")
    available_portions: int = Field(..., ge=0)
    preparation_time: datetime
    pickup_deadline: datetime
    pickup_location: str = Field(..., min_length=3)
    dietary_tags: List[str] = Field(default_factory=list)
    declared_allergens: List[str] = Field(default_factory=list)
    storage_information: str = Field(default="Refrigerated")
    image_url: str = Field(default="")
    provider_name: str = Field(default="Community Kitchen")

class FoodListingCreate(FoodListingBase):
    provider_id: Optional[str] = None

class FoodListingUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    total_quantity: Optional[int] = None
    quantity_unit: Optional[str] = None
    available_portions: Optional[int] = None
    pickup_deadline: Optional[datetime] = None
    pickup_location: Optional[str] = None
    dietary_tags: Optional[List[str]] = None
    declared_allergens: Optional[List[str]] = None
    storage_information: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class FoodListingResponse(BaseModel):
    id: str
    provider_id: str
    provider_name: str
    name: str
    category: str
    description: str
    total_quantity: int
    quantity_unit: str
    available_portions: int
    preparation_time: datetime
    pickup_deadline: datetime
    pickup_location: str
    dietary_tags: List[str]
    declared_allergens: List[str]
    storage_information: str
    image_url: str
    status: str
    created_at: datetime
    updated_at: datetime
    urgency_level: Optional[str] = "normal"  # "critical", "urgent", "normal", "expired"
    minutes_remaining: Optional[int] = 0

    class Config:
        from_attributes = True

class ClaimCreate(BaseModel):
    recipient_id: str = Field(..., description="Recipient user ID")
    recipient_name: Optional[str] = "Demo Recipient"
    portions_claimed: int = Field(..., gt=0)
    pickup_notes: Optional[str] = None

class ClaimResponse(BaseModel):
    id: str
    listing_id: str
    recipient_id: str
    recipient_name: str
    portions_claimed: int
    status: str
    claim_reference: str
    pickup_notes: Optional[str] = None
    claimed_at: datetime
    pickup_confirmed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    listing_name: Optional[str] = None
    listing_category: Optional[str] = None
    pickup_location: Optional[str] = None
    pickup_deadline: Optional[datetime] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ImpactSummary(BaseModel):
    total_portions_listed: int
    total_portions_claimed: int
    total_portions_collected: int
    estimated_kg_redistributed: float
    kg_per_portion_factor: float
    successful_pickup_rate_pct: float
    total_active_listings: int
    total_completed_pickups: int
    total_active_partners: int
    active_rescue_organizations: int
    co2_avoided_kg_estimate: float  # Estimated at 2.5 kg CO2e per kg food saved (FAO standard benchmark)

class ImpactTimeseriesPoint(BaseModel):
    date: str
    portions_collected: int
    kg_rescued: float
    rescues_count: int

class ImpactCategoryPoint(BaseModel):
    category: str
    portions: int
    percentage: float

class MatchingSuggestion(BaseModel):
    listing_id: str
    listing_name: str
    provider_name: str
    recipient_id: str
    recipient_name: str
    recipient_org: Optional[str] = None
    available_portions: int
    portions_requested: int
    score: float
    urgency_level: str
    reason: str
    evidence: dict[str, Any]
    missing_info: Optional[str] = None
    suggested_action: str
    allergen_safety_status: str  # "verified_safe", "no_declared_allergens", "contains_allergen_rejected"

class AIRecommendationRequest(BaseModel):
    listing_id: Optional[str] = None
    recipient_id: Optional[str] = None
    dietary_filter: Optional[str] = None
    max_matches: int = 5

class AIRecommendationResponse(BaseModel):
    ai_status: str  # "strands_agent_active", "offline_fallback"
    model_provider: str
    agent_reasoning: str
    recommendations: List[MatchingSuggestion]
    timestamp: datetime
    limitations_and_safety_notes: str

class AIStatusResponse(BaseModel):
    available: bool
    provider: str
    model: str
    strands_version: Optional[str] = None
    message: str
