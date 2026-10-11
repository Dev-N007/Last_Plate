import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.models import FoodListing, Claim, User

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    db.query(Claim).delete()
    db.query(FoodListing).delete()
    db.query(User).delete()
    db.commit()

    now = datetime.now(timezone.utc)
    # Create test listing
    listing = FoodListing(
        id="test-list-1",
        provider_id="prov-1",
        provider_name="Test Bakery",
        name="Fresh Bread Loaves",
        category="Bakery & Bread",
        description="Daily surplus bread",
        total_quantity=10,
        quantity_unit="portions",
        available_portions=10,
        preparation_time=now - timedelta(hours=2),
        pickup_deadline=now + timedelta(hours=4),
        pickup_location="Main Street 10",
        dietary_tags='["Vegetarian"]',
        declared_allergens='["Gluten"]',
        storage_information="Room temperature",
        image_url="https://example.com/bread.jpg",
        status="available",
        created_at=now,
        updated_at=now
    )
    db.add(listing)
    db.commit()
    db.close()
    yield

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_listings():
    response = client.get("/api/listings")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Fresh Bread Loaves"
    assert data[0]["available_portions"] == 10

def test_claim_portions_success():
    payload = {
        "recipient_id": "rec-1",
        "recipient_name": "Student Hostel",
        "portions_claimed": 4
    }
    response = client.post("/api/listings/test-list-1/claims", json=payload)
    assert response.status_code == 201
    claim = response.json()
    assert claim["portions_claimed"] == 4
    assert claim["status"] == "reserved"
    assert claim["claim_reference"].startswith("LP-")

    # Verify inventory decremented
    listing_res = client.get("/api/listings/test-list-1")
    assert listing_res.json()["available_portions"] == 6

def test_claim_portions_overclaim_rejected():
    payload = {
        "recipient_id": "rec-1",
        "recipient_name": "Student Hostel",
        "portions_claimed": 15  # Only 10 available!
    }
    response = client.post("/api/listings/test-list-1/claims", json=payload)
    assert response.status_code == 400
    assert "remain available" in response.json()["detail"]

def test_cancel_claim_restores_inventory():
    # 1. Claim 4
    claim_res = client.post("/api/listings/test-list-1/claims", json={
        "recipient_id": "rec-1",
        "portions_claimed": 4
    })
    claim_id = claim_res.json()["id"]

    # 2. Cancel claim
    cancel_res = client.patch(f"/api/claims/{claim_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"

    # 3. Check inventory restored to 10
    listing_res = client.get("/api/listings/test-list-1")
    assert listing_res.json()["available_portions"] == 10

def test_confirm_pickup_updates_impact():
    # 1. Claim 5
    claim_res = client.post("/api/listings/test-list-1/claims", json={
        "recipient_id": "rec-1",
        "portions_claimed": 5
    })
    claim_id = claim_res.json()["id"]

    # Before confirmation, collected impact is 0
    impact_before = client.get("/api/impact/summary").json()
    assert impact_before["total_portions_collected"] == 0

    # 2. Confirm pickup
    confirm_res = client.post(f"/api/claims/{claim_id}/confirm-pickup")
    assert confirm_res.status_code == 200
    assert confirm_res.json()["status"] == "confirmed"

    # After confirmation, collected impact increases to 5 portions
    impact_after = client.get("/api/impact/summary").json()
    assert impact_after["total_portions_collected"] == 5
    assert impact_after["estimated_kg_redistributed"] == 5 * 0.45

def test_ai_matching_endpoint():
    response = client.post("/api/ai/match", json={
        "max_matches": 3
    })
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert "agent_reasoning" in data
    assert "limitations_and_safety_notes" in data
