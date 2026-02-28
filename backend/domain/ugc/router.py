from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_ugc():
    """Returns user-generated content from readers."""
    return []
