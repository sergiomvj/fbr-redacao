from fastapi import APIRouter, Depends
from typing import List
from core.security import get_current_user_id
from .schemas import UGCModerationQueueItem
from .service import UGCService

router = APIRouter()

@router.get("/queue", response_model=List[UGCModerationQueueItem])
async def list_ugc_queue(current_user: str = Depends(get_current_user_id)):
    """Returns pending user-generated content for moderation."""
    return await UGCService.get_moderation_queue()
