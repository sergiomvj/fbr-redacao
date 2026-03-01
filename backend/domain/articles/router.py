from fastapi import APIRouter, Depends
import uuid
from core.security import get_current_user_id
from domain.articles.service import ArticleService

router = APIRouter()
article_service = ArticleService()

@router.get("/production")
def list_production_articles(user_id: uuid.UUID = Depends(get_current_user_id)):
    """Returns a grouped list of articles currently in the production pipeline."""
    return article_service.list_production_articles(user_id)

@router.get("/published")
def list_published_articles(user_id: uuid.UUID = Depends(get_current_user_id)):
    """Returns a list of published articles with their metrics."""
    return article_service.list_published_articles(user_id)
