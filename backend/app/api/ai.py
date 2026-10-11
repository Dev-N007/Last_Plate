from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.schemas import (
    AIRecommendationRequest,
    AIRecommendationResponse,
    AIStatusResponse
)
from app.agents.distributor import run_ai_distribution_planner, get_ai_status

router = APIRouter(prefix="/ai", tags=["AI & Strands Agent"])

@router.post("/match", response_model=AIRecommendationResponse)
def get_ai_matches(
    payload: AIRecommendationRequest,
    db: Session = Depends(get_db)
):
    """
    AI-assisted distribution planner powered by AWS Strands Agents SDK.
    Grounds recommendations in strict deterministic checks (allergens, portion needs, deadlines).
    """
    return run_ai_distribution_planner(
        db=db,
        listing_id=payload.listing_id,
        recipient_id=payload.recipient_id,
        dietary_filter=payload.dietary_filter,
        max_matches=payload.max_matches
    )

@router.get("/status", response_model=AIStatusResponse)
def check_ai_status():
    """
    Returns Strands Agents SDK integration status and configured model provider.
    """
    return get_ai_status()
