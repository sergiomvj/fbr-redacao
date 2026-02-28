from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_metrics():
    """Returns platform metrics."""
    return []
