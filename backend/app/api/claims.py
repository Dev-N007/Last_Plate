import random
import string
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import FoodListing, Claim, generate_uuid, utc_now
from app.schemas.schemas import ClaimCreate, ClaimResponse
from app.services.aws_ledger import aws_ledger

router = APIRouter(prefix="", tags=["Claims"])

def generate_claim_reference() -> str:
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    num = random.randint(100, 999)
    return f"LP-{num}-{code}"

def build_claim_response(claim: Claim, listing: Optional[FoodListing]) -> ClaimResponse:
    return ClaimResponse(
        id=claim.id,
        listing_id=claim.listing_id,
        recipient_id=claim.recipient_id,
        recipient_name=claim.recipient_name,
        portions_claimed=claim.portions_claimed,
        status=claim.status,
        claim_reference=claim.claim_reference,
        pickup_notes=claim.pickup_notes,
        claimed_at=claim.claimed_at,
        pickup_confirmed_at=claim.pickup_confirmed_at,
        cancelled_at=claim.cancelled_at,
        listing_name=listing.name if listing else "Surplus Food",
        listing_category=listing.category if listing else "General",
        pickup_location=listing.pickup_location if listing else "Pickup Point",
        pickup_deadline=listing.pickup_deadline if listing else None,
        image_url=listing.image_url if listing else ""
    )

@router.post("/listings/{listing_id}/claims", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def claim_portions(
    listing_id: str,
    payload: ClaimCreate,
    db: Session = Depends(get_db)
):
    # Enforce atomic transaction
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).with_for_update().first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food listing not found")

    # Expiration check
    now = datetime.now(timezone.utc)
    deadline_utc = listing.pickup_deadline if listing.pickup_deadline.tzinfo else listing.pickup_deadline.replace(tzinfo=timezone.utc)
    if deadline_utc <= now:
        listing.status = "expired"
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This listing has expired and cannot be claimed.")

    if listing.status not in ["available", "reserved"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Listing is {listing.status} and cannot be claimed.")

    if payload.portions_claimed <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portions claimed must be at least 1.")

    if payload.portions_claimed > listing.available_portions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested {payload.portions_claimed} portions, but only {listing.available_portions} portions remain available."
        )

    # Decrement available portions atomically
    listing.available_portions -= payload.portions_claimed
    if listing.available_portions == 0:
        listing.status = "reserved"

    listing.updated_at = utc_now()

    claim = Claim(
        id=generate_uuid(),
        listing_id=listing.id,
        recipient_id=payload.recipient_id,
        recipient_name=payload.recipient_name or "Demo Recipient",
        portions_claimed=payload.portions_claimed,
        status="reserved",
        claim_reference=generate_claim_reference(),
        pickup_notes=payload.pickup_notes or f"Show claim reference at {listing.pickup_location}",
        claimed_at=utc_now()
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)
    db.refresh(listing)

    return build_claim_response(claim, listing)

@router.get("/claims", response_model=List[ClaimResponse])
def get_claims(
    recipient_id: Optional[str] = Query(None, description="Filter claims by recipient ID"),
    status_filter: Optional[str] = Query(None, description="Filter by status (reserved, confirmed, cancelled)"),
    db: Session = Depends(get_db)
):
    query = db.query(Claim)
    if recipient_id:
        query = query.filter(Claim.recipient_id == recipient_id)
    if status_filter:
        query = query.filter(Claim.status == status_filter)

    claims = query.order_by(Claim.claimed_at.desc()).all()
    results: List[ClaimResponse] = []

    for c in claims:
        listing = db.query(FoodListing).filter(FoodListing.id == c.listing_id).first()
        results.append(build_claim_response(c, listing))

    return results

@router.patch("/claims/{claim_id}/cancel", response_model=ClaimResponse)
def cancel_claim(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).with_for_update().first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    if claim.status != "reserved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel a claim with status '{claim.status}'. Only reserved claims can be cancelled."
        )

    listing = db.query(FoodListing).filter(FoodListing.id == claim.listing_id).with_for_update().first()
    if listing:
        # Release inventory back to listing
        listing.available_portions += claim.portions_claimed
        now = datetime.now(timezone.utc)
        deadline_utc = listing.pickup_deadline if listing.pickup_deadline.tzinfo else listing.pickup_deadline.replace(tzinfo=timezone.utc)
        if deadline_utc > now and listing.status == "reserved":
            listing.status = "available"
        listing.updated_at = utc_now()

    claim.status = "cancelled"
    claim.cancelled_at = utc_now()
    db.commit()
    db.refresh(claim)

    return build_claim_response(claim, listing)

@router.post("/claims/{claim_id}/confirm-pickup", response_model=ClaimResponse)
def confirm_pickup(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).with_for_update().first()
    if not claim:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Claim not found")

    if claim.status == "confirmed":
        listing = db.query(FoodListing).filter(FoodListing.id == claim.listing_id).first()
        return build_claim_response(claim, listing)

    if claim.status != "reserved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot confirm pickup for claim with status '{claim.status}'."
        )

    claim.status = "confirmed"
    claim.pickup_confirmed_at = utc_now()

    listing = db.query(FoodListing).filter(FoodListing.id == claim.listing_id).with_for_update().first()
    if listing and listing.available_portions == 0:
        # Check if all other claims are confirmed
        unconfirmed = db.query(Claim).filter(
            Claim.listing_id == listing.id,
            Claim.status == "reserved"
        ).count()
        if unconfirmed == 0:
            listing.status = "collected"
            listing.updated_at = utc_now()

    db.commit()
    db.refresh(claim)

    # Record verified audit receipt via AWS Open Source SDK (boto3)
    try:
        aws_ledger.record_handover_receipt(
            claim_id=claim.id,
            listing_name=listing.name if listing else "Surplus Food",
            provider_name=listing.provider_name if listing else "Provider",
            recipient_name=claim.recipient_name,
            portions=claim.portions_claimed,
            co2_saved_kg=round(claim.portions_claimed * 0.45 * 2.5, 2),
            reference_code=claim.claim_reference
        )
    except Exception as e:
        pass

    return build_claim_response(claim, listing)
