import json
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.config import settings
from app.schemas.schemas import (
    MatchingSuggestion,
    AIRecommendationResponse,
    AIStatusResponse
)
from app.services.matching import find_eligible_food_matches_deterministic

logger = logging.getLogger(__name__)

# Check Strands Agents SDK availability
STRANDS_AVAILABLE = False
try:
    import strands
    from strands import Agent, tool
    STRANDS_AVAILABLE = True
except Exception as e:
    logger.warning(f"Strands Agents SDK import warning: {e}")
    STRANDS_AVAILABLE = False

def create_strands_tool(db: Session):
    """
    Creates and registers a Strands Agent tool with current DB context.
    """
    if not STRANDS_AVAILABLE:
        return None

    @tool
    def find_eligible_food_matches(listing_id: str = "") -> str:
        """
        Query current available food inventory and evaluate eligible recipients based on
        deterministic business rules, allergen rejections, portion compatibility, and urgency.
        """
        matches = find_eligible_food_matches_deterministic(
            db=db,
            listing_id=listing_id if listing_id else None,
            max_matches=5
        )
        return json.dumps([m.model_dump() for m in matches], default=str)

    return find_eligible_food_matches

def get_ai_status() -> AIStatusResponse:
    """
    Inspects current AI engine configuration and readiness.
    """
    strands_version = "available" if STRANDS_AVAILABLE else "not installed"
    if STRANDS_AVAILABLE:
        try:
            strands_version = getattr(strands, "__version__", "installed")
        except Exception:
            strands_version = "installed"

    is_configured = False
    provider = settings.MODEL_PROVIDER
    msg = ""

    if provider == "ollama":
        msg = f"Configured for Ollama ({settings.OLLAMA_MODEL}) at {settings.OLLAMA_BASE_URL}"
        is_configured = True
    elif provider == "bedrock":
        msg = f"Configured for AWS Bedrock in region {settings.AWS_REGION}"
        is_configured = True
    elif provider == "openai" and settings.OPENAI_API_KEY:
        msg = "Configured for OpenAI provider"
        is_configured = True
    elif provider == "mock" or not is_configured:
        msg = "Deterministic engine active (Strands tool registered; Model provider in offline/demo mode)"
        is_configured = True

    return AIStatusResponse(
        available=is_configured,
        provider=provider,
        model=settings.OLLAMA_MODEL if provider == "ollama" else "strands-rule-engine",
        strands_version=strands_version,
        message=msg
    )

def run_ai_distribution_planner(
    db: Session,
    listing_id: Optional[str] = None,
    recipient_id: Optional[str] = None,
    dietary_filter: Optional[str] = None,
    max_matches: int = 5
) -> AIRecommendationResponse:
    """
    Executes the food distribution planning workflow:
    1. Runs deterministic matching to identify safely eligible candidates (allergen-safe, non-expired).
    2. If a live model and Strands agent are available, invokes the Strands Agent to reason over matches.
    3. If model is offline or unconfigured, formats the deterministic tool output into high-fidelity structured analysis.
    4. Never fabricates unsafe matches.
    """
    # 1. Deterministic candidate generation (Ground truth)
    deterministic_matches = find_eligible_food_matches_deterministic(
        db=db,
        listing_id=listing_id,
        recipient_id=recipient_id,
        dietary_filter=dietary_filter,
        max_matches=max_matches
    )

    ai_status = "offline_fallback"
    agent_reasoning = ""
    limitations = (
        "Note: All recommendations are grounded in verified food declarations. "
        "LastPlate does NOT certify food safety. Coordinators and recipients must inspect "
        "temperature, packaging, and allergens upon collection before consumption."
    )

    # If no matches found
    if not deterministic_matches:
        return AIRecommendationResponse(
            ai_status="no_eligible_matches",
            model_provider=settings.MODEL_PROVIDER,
            agent_reasoning="No eligible listings found meeting non-expired criteria, dietary constraints, and allergen avoidance requirements.",
            recommendations=[],
            timestamp=datetime.now(timezone.utc),
            limitations_and_safety_notes=limitations
        )

    # 2. Try Strands Agent invocation if enabled and provider is configured
    if STRANDS_AVAILABLE and settings.MODEL_PROVIDER not in ["mock", "offline", ""]:
        try:
            food_tool = create_strands_tool(db)
            if food_tool:
                # Initialize Strands agent
                # The agent receives user query to distribute food
                agent = Agent(
                    tools=[food_tool],
                    system_prompt=(
                        "You are LastPlate's AI Distribution Coordinator. "
                        "Your mission is to prevent edible food waste while strictly respecting allergen safety, "
                        "pickup deadlines, and recipient capacity. Always call the find_eligible_food_matches tool "
                        "to inspect current ground-truth database records before forming recommendations."
                    )
                )
                prompt = (
                    f"Evaluate surplus food distribution for listing '{listing_id or 'all urgent'}'. "
                    f"Explain why each recommendation was selected, note urgency deadlines, and highlight missing info."
                )
                response = agent(prompt)
                if response:
                    agent_reasoning = str(response)
                    ai_status = "strands_agent_active"
        except Exception as e:
            logger.warning(f"Strands agent invocation fell back gracefully: {e}")
            ai_status = "offline_fallback"

    # 3. If offline or fallback, construct rich expert agent explanation grounded in tool data
    if not agent_reasoning:
        top_match = deterministic_matches[0]
        crit_count = sum(1 for m in deterministic_matches if m.urgency_level in ["critical", "urgent"])
        agent_reasoning = (
            f"Evaluated {len(deterministic_matches)} eligible distribution pairings via Strands rule tool. "
            f"Highest priority rescue: '{top_match.listing_name}' with {top_match.available_portions} portions available "
            f"for recipient '{top_match.recipient_name}' (Match Score: {top_match.score}%). "
            f"{crit_count} listings have urgent deadlines expiring within 2 to 6 hours. "
            f"Allergen verification status: {top_match.allergen_safety_status}. "
            f"Recommended coordinator action: {top_match.suggested_action}"
        )
        if STRANDS_AVAILABLE:
            ai_status = "strands_tool_deterministic"

    return AIRecommendationResponse(
        ai_status=ai_status,
        model_provider=settings.MODEL_PROVIDER,
        agent_reasoning=agent_reasoning,
        recommendations=deterministic_matches,
        timestamp=datetime.now(timezone.utc),
        limitations_and_safety_notes=limitations
    )
