from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional, List
from datetime import datetime
import uuid

class ArticleStatus(str, Enum):
    collecting = 'collecting'
    writing = 'writing'
    art_review = 'art_review'
    regional_review = 'regional_review'
    published = 'published'
    returned = 'returned'
    off_air = 'off_air'
    deleted = 'deleted'

class ArticleBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    slug: str
    body: str
    impact_section: Optional[str] = None
    category: str
    tags: List[str] = []
    status: ArticleStatus
    views_count: int = 0
    shares_count: int = 0
    read_time_seconds: int = 0

class ArticleResponse(ArticleBase):
    id: uuid.UUID
    region_id: uuid.UUID
    agent_id: Optional[uuid.UUID] = None
    source_id: Optional[uuid.UUID] = None
    ugc_submission_id: Optional[uuid.UUID] = None
    operator_id: Optional[uuid.UUID] = None
    operator_action: Optional[str] = None
    operator_notes: Optional[str] = None
    published_at: Optional[datetime] = None
    off_air_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
