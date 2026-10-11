from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import FoodListing, User
from app.schemas.schemas import MatchingSuggestion

# Sample recipient profiles for matching (when looking up recipients or coordinators)
DEMO_RECIPIENT_PROFILES = [
    {
        "id": "rec-1",
        "name": "Hostel 4 Food Committee",
        "role": "recipient",
        "organization": "Campus Student Union",
        "dietary_needs": ["Vegetarian"],
        "allergens_to_avoid": ["Peanuts", "Shellfish"],
        "typical_portions": 15,
        "max_distance_km": 3.0,
        "pickup_ready": True
    },
    {
        "id": "rec-2",
        "name": "Saanjh Community Kitchen",
        "role": "recipient",
        "organization": "Saanjh Welfare NGO",
        "dietary_needs": ["Vegetarian", "Vegan", "Halal"],
        "allergens_to_avoid": [],
        "typical_portions": 20,
        "max_distance_km": 5.0,
        "pickup_ready": True
    },
    {
        "id": "rec-3",
        "name": "Anand Ashram Shelter",
        "role": "recipient",
        "organization": "Anand Foundation",
        "dietary_needs": [],
        "allergens_to_avoid": ["Dairy"],
        "typical_portions": 10,
        "max_distance_km": 4.0,
        "pickup_ready": True
    },
    {
        "id": "rec-4",
        "name": "Night Study Group Co-op",
        "role": "recipient",
        "organization": "Engineering College Hostel",
        "dietary_needs": ["Vegetarian"],
        "allergens_to_avoid": [],
        "typical_portions": 8,
        "max_distance_km": 2.0,
        "pickup_ready": True
    }
]

def calculate_urgency(pickup_deadline: datetime) -> tuple[str, int]:
    now = datetime.now(timezone.utc)
    if pickup_deadline.tzinfo is None:
        deadline_utc = pickup_deadline.replace(tzinfo=timezone.utc)
    else:
        deadline_utc = pickup_deadline

    delta = deadline_utc - now
    total_minutes = int(delta.total_seconds() / 60)

    if total_minutes <= 0:
        return "expired", 0
    elif total_minutes <= 120:  # <= 2 hours
        return "critical", total_minutes
    elif total_minutes <= 360:  # <= 6 hours
        return "urgent", total_minutes
    else:
        return "normal", total_minutes

def find_eligible_food_matches_deterministic(
    db: Session,
    listing_id: Optional[str] = None,
    recipient_id: Optional[str] = None,
    dietary_filter: Optional[str] = None,
    max_matches: int = 5
) -> List[MatchingSuggestion]:
    """
    Deterministic rule-based matching:
    1. Only non-expired, available listings with portions > 0.
    2. Strict allergen rejection: If recipient avoids an allergen present in declared_allergens, REJECT match.
    3. Dietary compatibility: If recipient requires specific diet, check listing tags.
    4. Urgency weight: closer to deadline increases rescue priority.
    """
    now = datetime.now(timezone.utc)
    query = db.query(FoodListing).filter(
        FoodListing.status == "available",
        FoodListing.available_portions > 0,
        FoodListing.pickup_deadline > now
    )

    if listing_id:
        query = query.filter(FoodListing.id == listing_id)

    listings = query.all()
    if not listings:
        return []

    # Recipient candidates
    recipients = DEMO_RECIPIENT_PROFILES
    if recipient_id:
        recipients = [r for r in DEMO_RECIPIENT_PROFILES if r["id"] == recipient_id]
        if not recipients:
            # If not in demo list, find from DB
            db_user = db.query(User).filter(User.id == recipient_id).first()
            if db_user:
                recipients = [{
                    "id": db_user.id,
                    "name": db_user.name,
                    "role": db_user.role,
                    "organization": db_user.organization or "Community Recipient",
                    "dietary_needs": [],
                    "allergens_to_avoid": [],
                    "typical_portions": 10,
                    "max_distance_km": 5.0,
                    "pickup_ready": True
                }]

    suggestions: List[MatchingSuggestion] = []

    for listing in listings:
        urgency_level, minutes_remaining = calculate_urgency(listing.pickup_deadline)
        if urgency_level == "expired":
            continue

        food_dietary = set(listing.parsed_dietary_tags)
        food_allergens = set(listing.parsed_declared_allergens)

        for recipient in recipients:
            # Check dietary filter if specified in request
            if dietary_filter and dietary_filter not in food_dietary:
                continue

            # Check recipient dietary requirements
            dietary_needs = set(recipient.get("dietary_needs", []))
            if dietary_needs and not (dietary_needs.intersection(food_dietary)):
                # If recipient is vegetarian, vegetarian or vegan must be present
                if "Vegetarian" in dietary_needs and ("Vegetarian" not in food_dietary and "Vegan" not in food_dietary):
                    continue

            # CRITICAL SAFETY CHECK: Strict allergen rejection
            allergens_to_avoid = set(recipient.get("allergens_to_avoid", []))
            allergen_conflict = allergens_to_avoid.intersection(food_allergens)
            if allergen_conflict:
                # Match REJECTED on allergen grounds
                continue

            # Calculate match score
            score = 50.0  # Base score

            # Urgency score bonus (closer deadline = higher urgency)
            if urgency_level == "critical":
                score += 35.0
            elif urgency_level == "urgent":
                score += 20.0
            else:
                score += 10.0

            # Portion matching score
            typical_portions = recipient.get("typical_portions", 10)
            portion_ratio = min(listing.available_portions, typical_portions) / max(listing.available_portions, typical_portions)
            score += portion_ratio * 15.0

            score = min(round(score, 1), 99.0)

            # Safety status
            if not food_allergens or "None Declared" in food_allergens:
                allergen_status = "no_declared_allergens"
            else:
                allergen_status = "verified_safe"

            # Formulate clear rationale
            hours_rem = round(minutes_remaining / 60, 1)
            reason = (
                f"{listing.name} ({listing.available_portions} portions) matches {recipient['name']}'s "
                f"capacity for ~{typical_portions} portions. Deadline is in {hours_rem}h ({urgency_level} priority). "
                f"Dietary compatibility verified ({', '.join(food_dietary) if food_dietary else 'Standard'})."
            )

            suggested_action = (
                f"Notify {recipient['name']} ({recipient['organization']}) to claim "
                f"{min(listing.available_portions, typical_portions)} portions before {listing.pickup_deadline.strftime('%H:%M')}."
            )

            missing_info = None
            if not listing.storage_information:
                missing_info = "Storage temperature guidance not specified."
            elif not listing.parsed_declared_allergens:
                missing_info = "Provider has not explicitly confirmed allergen cross-contact declarations."

            suggestion = MatchingSuggestion(
                listing_id=listing.id,
                listing_name=listing.name,
                provider_name=listing.provider_name,
                recipient_id=recipient["id"],
                recipient_name=recipient["name"],
                recipient_org=recipient.get("organization"),
                available_portions=listing.available_portions,
                portions_requested=min(listing.available_portions, typical_portions),
                score=score,
                urgency_level=urgency_level,
                reason=reason,
                evidence={
                    "minutes_remaining": minutes_remaining,
                    "hours_remaining": hours_rem,
                    "available_portions": listing.available_portions,
                    "dietary_match": list(food_dietary),
                    "declared_allergens": list(food_allergens),
                    "allergens_checked": list(allergens_to_avoid),
                    "urgency_level": urgency_level
                },
                missing_info=missing_info,
                suggested_action=suggested_action,
                allergen_safety_status=allergen_status
            )
            suggestions.append(suggestion)

    # Sort by score descending
    suggestions.sort(key=lambda x: x.score, reverse=True)
    return suggestions[:max_matches]
