from fastapi import APIRouter, Depends
from typing import List
from domain.distributions.service import list_distributions, get_distribution_summary
from core.security import get_current_user_id
import uuid

router = APIRouter()


@router.get("/")
async def list_channels(
    article_id: str | None = None,
    _: uuid.UUID = Depends(get_current_user_id),
) -> List[dict]:
    """Lista todos os canais de distribuição. Filtra por artigo se article_id for passado."""
    return await list_distributions(article_id)


@router.get("/summary")
async def channels_summary(
    _: uuid.UUID = Depends(get_current_user_id),
) -> dict:
    """Retorna contagem de artigos distribuídos por canal."""
    return await get_distribution_summary()
