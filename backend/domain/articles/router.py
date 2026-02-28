from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_articles():
    """Returns a list of articles under production/published."""
    return []
