from fastapi import APIRouter, Depends
from typing import List
from core.security import get_current_user_id
from .schemas import AlertDisplay
from .service import AlertService

router = APIRouter()

@router.get("/alerts", response_model=List[AlertDisplay])
async def list_active_alerts(current_user: str = Depends(get_current_user_id)):
    """Returns active system alerts for the dashboard."""
    return await AlertService.get_active_alerts()
