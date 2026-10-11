import json
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import FoodListing, generate_uuid, utc_now
from app.schemas.schemas import (
    FoodListingCreate,
    FoodListingUpdate,
    FoodListingResponse
)
from app.services.matching import calculate_urgency

router = APIRouter(prefix="/listings", tags=["Listings"])

def auto_update_expired(listing: FoodListing, db: Session):
    now = datetime.now(timezone.utc)
    deadline_utc = listing.pickup_deadline if listing.pickup_deadline.tzinfo else listing.pickup_deadline.replace(tzinfo=timezone.utc)
    if deadline_utc < now and listing.status == "available":
        listing.status = "expired"
        db.commit()

def to_listing_response(listing: FoodListing, db: Session) -> FoodListingResponse:
    auto_update_expired(listing, db)
    urgency_level, minutes_remaining = calculate_urgency(listing.pickup_deadline)
    if listing.status == "expired":
        urgency_level = "expired"
        minutes_remaining = 0

    return FoodListingResponse(
        id=listing.id,
        provider_id=listing.provider_id,
        provider_name=listing.provider_name,
        name=listing.name,
        category=listing.category,
        description=listing.description,
        total_quantity=listing.total_quantity,
        quantity_unit=listing.quantity_unit,
        available_portions=listing.available_portions,
        preparation_time=listing.preparation_time,
        pickup_deadline=listing.pickup_deadline,
        pickup_location=listing.pickup_location,
        dietary_tags=listing.parsed_dietary_tags,
        declared_allergens=listing.parsed_declared_allergens,
        storage_information=listing.storage_information,
        image_url=listing.image_url,
        status=listing.status,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
        urgency_level=urgency_level,
        minutes_remaining=minutes_remaining
    )

@router.get("", response_model=List[FoodListingResponse])
def get_listings(
    q: Optional[str] = Query(None, description="Search keyword in name or description"),
    category: Optional[str] = Query(None, description="Category filter"),
    dietary: Optional[str] = Query(None, description="Dietary filter"),
    status: Optional[str] = Query("available", description="Status filter: 'available', 'all', 'expired', 'collected'"),
    sort: Optional[str] = Query("urgency", description="Sort by 'urgency', 'newest', 'portions'"),
    db: Session = Depends(get_db)
):
    query = db.query(FoodListing)

    if status and status != "all":
        query = query.filter(FoodListing.status == status)

    if category and category.lower() != "all":
        query = query.filter(FoodListing.category == category)

    all_listings = query.all()
    results: List[FoodListingResponse] = []

    for item in all_listings:
        # Check text search
        if q:
            term = q.lower()
            if (term not in item.name.lower() and
                term not in item.description.lower() and
                term not in item.provider_name.lower() and
                term not in item.pickup_location.lower()):
                continue

        # Check dietary tag
        if dietary and dietary.lower() != "all":
            if dietary not in item.parsed_dietary_tags:
                continue

        results.append(to_listing_response(item, db))

    # Apply sorting
    if sort == "urgency":
        # Sort by minutes remaining ascending (shortest deadline first), but expired listings at end
        results.sort(key=lambda x: (x.status == "expired", x.minutes_remaining if x.minutes_remaining > 0 else 999999))
    elif sort == "newest":
        results.sort(key=lambda x: x.created_at, reverse=True)
    elif sort == "portions":
        results.sort(key=lambda x: x.available_portions, reverse=True)

    return results

@router.get("/{listing_id}", response_model=FoodListingResponse)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return to_listing_response(listing, db)

@router.post("", response_model=FoodListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(payload: FoodListingCreate, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    deadline_utc = payload.pickup_deadline if payload.pickup_deadline.tzinfo else payload.pickup_deadline.replace(tzinfo=timezone.utc)

    if deadline_utc <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup deadline must be in the future."
        )

    if payload.available_portions <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Available portions must be greater than zero."
        )

    # Fallback image if empty
    image_url = payload.image_url.strip()
    if not image_url:
        image_url = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"

    new_listing = FoodListing(
        id=generate_uuid(),
        provider_id=payload.provider_id or generate_uuid(),
        provider_name=payload.provider_name,
        name=payload.name,
        category=payload.category,
        description=payload.description,
        total_quantity=payload.total_quantity,
        quantity_unit=payload.quantity_unit,
        available_portions=payload.available_portions,
        preparation_time=payload.preparation_time,
        pickup_deadline=payload.pickup_deadline,
        pickup_location=payload.pickup_location,
        dietary_tags=json.dumps(payload.dietary_tags),
        declared_allergens=json.dumps(payload.declared_allergens),
        storage_information=payload.storage_information,
        image_url=image_url,
        status="available",
        created_at=utc_now(),
        updated_at=utc_now()
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return to_listing_response(new_listing, db)

@router.patch("/{listing_id}", response_model=FoodListingResponse)
def update_listing(listing_id: str, payload: FoodListingUpdate, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "dietary_tags" in update_data and update_data["dietary_tags"] is not None:
        listing.dietary_tags = json.dumps(update_data.pop("dietary_tags"))
    if "declared_allergens" in update_data and update_data["declared_allergens"] is not None:
        listing.declared_allergens = json.dumps(update_data.pop("declared_allergens"))

    for key, value in update_data.items():
        setattr(listing, key, value)

    listing.updated_at = utc_now()
    db.commit()
    db.refresh(listing)

    return to_listing_response(listing, db)
