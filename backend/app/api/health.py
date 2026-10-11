from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db

router = APIRouter(tags=["Health & Utilities"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "kg_per_portion": settings.KG_PER_PORTION,
        "model_provider": settings.MODEL_PROVIDER
    }

@router.post("/demo/reset")
def reset_demo_data(db: Session = Depends(get_db)):
    """
    Resets the database and reseeds predictable sample data for demo presentations.
    """
    from seed import seed_database
    seed_database()
    return {
        "status": "success",
        "message": "Demo sample data has been reset to predictable initial state."
    }
