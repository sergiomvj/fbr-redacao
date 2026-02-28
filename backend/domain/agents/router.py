from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_agents():
    """Returns a list of all active AI agents."""
    return []
