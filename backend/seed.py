import json
import uuid
from datetime import datetime, timezone, timedelta
from app.database import engine, SessionLocal, Base, init_db
from app.models.models import User, FoodListing, Claim

def utc_now():
    return datetime.now(timezone.utc)

def seed_database():
    print("Initializing database tables...")
    init_db()
    db = SessionLocal()

    try:
        # Clear existing data for fresh seed
        db.query(Claim).delete()
        db.query(FoodListing).delete()
        db.query(User).delete()
        db.commit()

        print("Seeding users...")
        now = utc_now()

        users = [
            User(
                id="usr-provider-1",
                name="Campus Central Canteen",
                role="provider",
                organization="Delhi Tech University Canteen",
                contact_email="canteen@dtu.ac.in",
                phone="+91 98765 43210",
                created_at=now - timedelta(days=20)
            ),
            User(
                id="usr-provider-2",
                name="Golden Crust Artisan Bakery",
                role="provider",
                organization="Golden Crust Bakeries Ltd",
                contact_email="orders@goldencrust.com",
                phone="+91 98111 22334",
                created_at=now - timedelta(days=15)
            ),
            User(
                id="usr-provider-3",
                name="FreshMart Green Grocers",
                role="provider",
                organization="FreshMart Organics",
                contact_email="care@freshmart.org",
                phone="+91 98222 33445",
                created_at=now - timedelta(days=10)
            ),
            User(
                id="usr-provider-4",
                name="Urban Roast Cafe & Deli",
                role="provider",
                organization="Urban Roast Co.",
                contact_email="manager@urbanroast.in",
                phone="+91 98333 44556",
                created_at=now - timedelta(days=8)
            ),
            User(
                id="usr-recipient-1",
                name="Hostel 4 Food Committee",
                role="recipient",
                organization="Campus Student Union",
                contact_email="hostel4@dtu.ac.in",
                phone="+91 98444 55667",
                created_at=now - timedelta(days=14)
            ),
            User(
                id="usr-recipient-2",
                name="Saanjh Community Kitchen",
                role="recipient",
                organization="Saanjh Welfare NGO",
                contact_email="kitchen@saanjh.ngo",
                phone="+91 98555 66778",
                created_at=now - timedelta(days=12)
            ),
            User(
                id="usr-recipient-3",
                name="Anand Ashram Shelter",
                role="recipient",
                organization="Anand Foundation",
                contact_email="seva@anandashram.org",
                phone="+91 98666 77889",
                created_at=now - timedelta(days=10)
            ),
            User(
                id="usr-coord-1",
                name="Regional Dispatch Coordinator",
                role="coordinator",
                organization="Central Food Rescue Network",
                contact_email="coordinator@lastplate.org",
                phone="+91 98777 88990",
                created_at=now - timedelta(days=30)
            )
        ]
        db.add_all(users)
        db.commit()

        print("Seeding food listings...")
        listings = [
            FoodListing(
                id="list-1",
                provider_id="usr-provider-1",
                provider_name="Campus Central Canteen",
                name="Vegetable Rice Bowls (Khichdi & Subzi)",
                category="Prepared Meals",
                description="Freshly prepared warm vegetable rice bowls with steamed lentils and mixed vegetables. Cooked today at 11:30 AM in clean commercial kitchen. Packed in food-grade eco containers.",
                total_quantity=18,
                quantity_unit="portions",
                available_portions=18,
                preparation_time=now - timedelta(hours=3),
                pickup_deadline=now + timedelta(hours=2, minutes=30),  # Urgent (< 3h)
                pickup_location="Campus Canteen Counter 2, Tech Block Gate 1",
                dietary_tags=json.dumps(["Vegetarian", "Halal"]),
                declared_allergens=json.dumps(["Dairy"]),
                storage_information="Heated warmer, ready for immediate pickup",
                image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
                status="available",
                created_at=now - timedelta(hours=2),
                updated_at=now - timedelta(hours=2)
            ),
            FoodListing(
                id="list-2",
                provider_id="usr-provider-2",
                provider_name="Golden Crust Artisan Bakery",
                name="Assorted Sourdough & Country Loaves",
                category="Bakery & Bread",
                description="Artisan wood-fired sourdough, whole wheat batards, and herb focaccia loaves baked early this morning. Unsliced, crisp crust, high quality.",
                total_quantity=24,
                quantity_unit="portions",
                available_portions=18,
                preparation_time=now - timedelta(hours=6),
                pickup_deadline=now + timedelta(hours=4),  # Urgent (< 4h)
                pickup_location="Golden Crust Bakery, 14 Market Lane, North Campus",
                dietary_tags=json.dumps(["Vegetarian", "Vegan"]),
                declared_allergens=json.dumps(["Gluten"]),
                storage_information="Room temperature dry bakery bags",
                image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                status="available",
                created_at=now - timedelta(hours=5),
                updated_at=now - timedelta(hours=3)
            ),
            FoodListing(
                id="list-3",
                provider_id="usr-provider-3",
                provider_name="FreshMart Green Grocers",
                name="Seasonal Fruit Boxes (Apples, Oranges & Bananas)",
                category="Produce & Fruits",
                description="Crates of fresh ripe fruits including Washington apples, sweet kinnow oranges, and bananas. Perfect for nutritious snacking or meal prep.",
                total_quantity=12,
                quantity_unit="boxes",
                available_portions=12,
                preparation_time=now - timedelta(hours=4),
                pickup_deadline=now + timedelta(hours=7),
                pickup_location="FreshMart Store Loading Dock B, Ring Road",
                dietary_tags=json.dumps(["Vegan", "Gluten-Free"]),
                declared_allergens=json.dumps(["None Declared"]),
                storage_information="Ambient shaded crates",
                image_url="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
                status="available",
                created_at=now - timedelta(hours=4),
                updated_at=now - timedelta(hours=4)
            ),
            FoodListing(
                id="list-4",
                provider_id="usr-provider-3",
                provider_name="FreshMart Green Grocers",
                name="Farm Fresh Vegetable Bundles",
                category="Produce & Fruits",
                description="Assorted local spinach, cauliflower, carrots, and sweet potatoes. Freshly harvested, clean, edible surplus ready for community cooking.",
                total_quantity=15,
                quantity_unit="packs",
                available_portions=15,
                preparation_time=now - timedelta(hours=5),
                pickup_deadline=now + timedelta(hours=10),
                pickup_location="FreshMart Store Counter 1, Ring Road",
                dietary_tags=json.dumps(["Vegan", "Gluten-Free"]),
                declared_allergens=json.dumps(["None Declared"]),
                storage_information="Cool room crates",
                image_url="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
                status="available",
                created_at=now - timedelta(hours=5),
                updated_at=now - timedelta(hours=5)
            ),
            FoodListing(
                id="list-5",
                provider_id="usr-provider-4",
                provider_name="Urban Roast Cafe & Deli",
                name="Packaged Deli Sandwiches & Wraps",
                category="Packaged Goods",
                description="Gourmet grilled vegetable paneer ciabattas and Mexican bean wraps individually packed in clear tamper-evident packaging.",
                total_quantity=10,
                quantity_unit="portions",
                available_portions=6,
                preparation_time=now - timedelta(hours=4),
                pickup_deadline=now + timedelta(hours=1, minutes=45),  # Critical (< 2h)
                pickup_location="Urban Roast Cafe, Ground Floor Student Centre",
                dietary_tags=json.dumps(["Vegetarian"]),
                declared_allergens=json.dumps(["Gluten", "Dairy"]),
                storage_information="Refrigerated display at 4°C",
                image_url="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
                status="available",
                created_at=now - timedelta(hours=3),
                updated_at=now - timedelta(hours=1)
            ),
            FoodListing(
                id="list-6",
                provider_id="usr-provider-2",
                provider_name="Golden Crust Artisan Bakery",
                name="Unsold Morning Pastries & Croissants",
                category="Bakery & Bread",
                description="Butter croissants, cinnamon swirls, and chocolate danishes baked fresh this morning. Sealed in bakery pastry trays.",
                total_quantity=16,
                quantity_unit="portions",
                available_portions=0,  # All claimed!
                preparation_time=now - timedelta(hours=8),
                pickup_deadline=now + timedelta(hours=3),
                pickup_location="Golden Crust Bakery, 14 Market Lane",
                dietary_tags=json.dumps(["Vegetarian"]),
                declared_allergens=json.dumps(["Gluten", "Dairy", "Eggs"]),
                storage_information="Ambient bakery counter box",
                image_url="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
                status="collected",
                created_at=now - timedelta(hours=7),
                updated_at=now - timedelta(hours=1)
            ),
            FoodListing(
                id="list-7",
                provider_id="usr-provider-1",
                provider_name="Campus Central Canteen",
                name="Yesterday's Dal Makhani & Roti Sets",
                category="Prepared Meals",
                description="North Indian slow-simmered black lentils and whole wheat rotis from yesterday's dinner service.",
                total_quantity=12,
                quantity_unit="portions",
                available_portions=0,
                preparation_time=now - timedelta(hours=28),
                pickup_deadline=now - timedelta(hours=4),  # EXPIRED
                pickup_location="Canteen Rear Dispatch",
                dietary_tags=json.dumps(["Vegetarian"]),
                declared_allergens=json.dumps(["Dairy"]),
                storage_information="Refrigerated",
                image_url="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
                status="expired",
                created_at=now - timedelta(hours=26),
                updated_at=now - timedelta(hours=4)
            )
        ]
        db.add_all(listings)
        db.commit()

        print("Seeding demo claims...")
        claims = [
            # 1. Confirmed collected claim for list-6 (Unsold Pastries)
            Claim(
                id="clm-1",
                listing_id="list-6",
                recipient_id="usr-recipient-1",
                recipient_name="Hostel 4 Food Committee",
                portions_claimed=16,
                status="confirmed",
                claim_reference="LP-312-BAKE",
                pickup_notes="Collected by Hostel Food Team Representative. Distributed at study hall.",
                claimed_at=now - timedelta(hours=4),
                pickup_confirmed_at=now - timedelta(hours=1)
            ),
            # 2. Confirmed collected claim for past bread rescue
            Claim(
                id="clm-2",
                listing_id="list-2",
                recipient_id="usr-recipient-2",
                recipient_name="Saanjh Community Kitchen",
                portions_claimed=6,
                status="confirmed",
                claim_reference="LP-814-BRED",
                pickup_notes="Received by community kitchen volunteer for evening soup kitchen.",
                claimed_at=now - timedelta(hours=3),
                pickup_confirmed_at=now - timedelta(minutes=45)
            ),
            # 3. Active reserved claim for list-5 (Sandwiches)
            Claim(
                id="clm-3",
                listing_id="list-5",
                recipient_id="usr-recipient-3",
                recipient_name="Anand Ashram Shelter",
                portions_claimed=4,
                status="reserved",
                claim_reference="LP-529-SAND",
                pickup_notes="Representative arriving in auto at 3:15 PM.",
                claimed_at=now - timedelta(minutes=30),
                pickup_confirmed_at=None
            ),
            # 4. Cancelled claim demo
            Claim(
                id="clm-4",
                listing_id="list-1",
                recipient_id="usr-recipient-1",
                recipient_name="Hostel 4 Food Committee",
                portions_claimed=2,
                status="cancelled",
                claim_reference="LP-109-CNCL",
                pickup_notes="Cancelled due to duplicate schedule.",
                claimed_at=now - timedelta(hours=1, minutes=30),
                cancelled_at=now - timedelta(minutes=50)
            )
        ]
        db.add_all(claims)
        db.commit()

        print("Database successfully seeded with realistic sample data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
