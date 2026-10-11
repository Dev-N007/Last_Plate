import json
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)  # "provider", "recipient", "coordinator"
    organization = Column(String(150), nullable=True)
    contact_email = Column(String(120), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now)

class FoodListing(Base):
    __tablename__ = "food_listings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    provider_id = Column(String(36), nullable=False)
    provider_name = Column(String(120), nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(80), nullable=False)  # Bakery & Bread, Prepared Meals, Produce & Fruits, Dairy & Deli, Packaged Goods
    description = Column(Text, nullable=False)
    total_quantity = Column(Integer, nullable=False, default=1)
    quantity_unit = Column(String(30), nullable=False, default="portions")  # portions, boxes, kg, meals
    available_portions = Column(Integer, nullable=False, default=0)
    preparation_time = Column(DateTime, nullable=False)
    pickup_deadline = Column(DateTime, nullable=False)
    pickup_location = Column(String(255), nullable=False)
    dietary_tags = Column(Text, nullable=False, default="[]")  # JSON array string
    declared_allergens = Column(Text, nullable=False, default="[]")  # JSON array string
    storage_information = Column(String(120), nullable=False, default="Refrigerated")
    image_url = Column(String(500), nullable=False)
    status = Column(String(30), nullable=False, default="available")  # available, reserved, collected, expired
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    @property
    def parsed_dietary_tags(self) -> list[str]:
        try:
            return json.loads(self.dietary_tags or "[]")
        except Exception:
            return []

    @property
    def parsed_declared_allergens(self) -> list[str]:
        try:
            return json.loads(self.declared_allergens or "[]")
        except Exception:
            return []

class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    listing_id = Column(String(36), ForeignKey("food_listings.id"), nullable=False)
    recipient_id = Column(String(36), nullable=False)
    recipient_name = Column(String(120), nullable=False)
    portions_claimed = Column(Integer, nullable=False, default=1)
    status = Column(String(30), nullable=False, default="reserved")  # reserved, confirmed, cancelled, expired
    claim_reference = Column(String(50), nullable=False, unique=True)
    pickup_notes = Column(Text, nullable=True)
    claimed_at = Column(DateTime, default=utc_now)
    pickup_confirmed_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    listing_id = Column(String(36), ForeignKey("food_listings.id"), nullable=False)
    recipient_id = Column(String(36), nullable=False)
    score = Column(Float, nullable=False, default=0.0)
    reason = Column(Text, nullable=False)
    suggested_action = Column(String(200), nullable=False)
    evidence = Column(Text, nullable=False, default="{}")  # JSON string
    missing_info = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
