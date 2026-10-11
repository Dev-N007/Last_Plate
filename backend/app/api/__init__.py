from fastapi import APIRouter
from app.api.listings import router as listings_router
from app.api.claims import router as claims_router
from app.api.impact import router as impact_router
from app.api.coordinator import router as coordinator_router
from app.api.ai import router as ai_router
from app.api.health import router as health_router

api_router = APIRouter(prefix="/api")
api_router.include_router(health_router)
api_router.include_router(listings_router)
api_router.include_router(claims_router)
api_router.include_router(impact_router)
api_router.include_router(coordinator_router)
api_router.include_router(ai_router)

__all__ = ["api_router"]
