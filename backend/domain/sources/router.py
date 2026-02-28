from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_sources():
    """Returns a list of all active sources."""
    return []
