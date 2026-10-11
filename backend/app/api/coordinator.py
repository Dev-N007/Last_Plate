from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import FoodListing, Claim
from app.schemas.schemas import FoodListingResponse, ClaimResponse
from app.api.listings import to_listing_response
from app.api.claims import build_claim_response

router = APIRouter(prefix="/coordinator", tags=["Coordinator"])

@router.get("/urgent-listings", response_model=List[FoodListingResponse])
def get_urgent_listings(
    max_hours: int = Query(6, description="Listings expiring within max_hours"),
    db: Session = Depends(get_db)
):
    """
    Returns active food listings with imminent deadlines (< max_hours) sorted by urgency.
    """
    now = datetime.now(timezone.utc)
    listings = db.query(FoodListing).filter(
        FoodListing.status == "available",
        FoodListing.available_portions > 0,
        FoodListing.pickup_deadline > now
    ).all()

    urgent_list: List[FoodListingResponse] = []
    for item in listings:
        resp = to_listing_response(item, db)
        if resp.urgency_level in ["critical", "urgent"]:
            urgent_list.append(resp)

    urgent_list.sort(key=lambda x: x.minutes_remaining)
    return urgent_list

@router.get("/overview")
def get_coordinator_overview(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Consolidated operational dashboard metrics for coordinators.
    """
    now = datetime.now(timezone.utc)
    active_listings = db.query(FoodListing).filter(
        FoodListing.status == "available",
        FoodListing.available_portions > 0,
        FoodListing.pickup_deadline > now
    ).count()

    urgent_count = 0
    all_active = db.query(FoodListing).filter(
        FoodListing.status == "available",
        FoodListing.available_portions > 0
    ).all()
    for item in all_active:
        resp = to_listing_response(item, db)
        if resp.urgency_level in ["critical", "urgent"]:
            urgent_count += 1

    pending_claims_count = db.query(Claim).filter(Claim.status == "reserved").count()
    completed_rescues_count = db.query(Claim).filter(Claim.status == "confirmed").count()
    expired_listings_count = db.query(FoodListing).filter(FoodListing.status == "expired").count()

    # Total portions awaiting pickup
    pending_claims = db.query(Claim).filter(Claim.status == "reserved").all()
    portions_awaiting = sum(c.portions_claimed for c in pending_claims)

    return {
        "active_listings_count": active_listings,
        "urgent_listings_count": urgent_count,
        "pending_claims_count": pending_claims_count,
        "completed_rescues_count": completed_rescues_count,
        "expired_listings_count": expired_listings_count,
        "portions_awaiting_pickup": portions_awaiting,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
