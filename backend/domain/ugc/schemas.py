from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from enum import Enum

class UGCType(str, Enum):
    video = 'video'
    audio = 'audio'
    text = 'text'

class UGCStatus(str, Enum):
    pending = 'pending'
    approved = 'approved'
    rejected = 'rejected'

class UGCSubmissionBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: UGCType
    storage_path: str
    file_size_bytes: int
    mime_type: str
    duration_seconds: Optional[int] = None

class UGCSubmissionCreate(UGCSubmissionBase):
    region_id: Optional[UUID] = None

class UGCSubmissionUpdate(BaseModel):
    status: Optional[UGCStatus] = None
    moderation_score: Optional[float] = None
    moderation_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    credit_amount: Optional[float] = None
    article_id: Optional[UUID] = None

class UGCSubmission(UGCSubmissionBase):
    id: UUID
    user_id: UUID
    region_id: Optional[UUID] = None
    status: UGCStatus
    moderator_agent_id: Optional[UUID] = None
    moderation_score: Optional[float] = None
    moderation_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    credit_amount: Optional[float] = None
    article_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UGCModerationQueueItem(UGCSubmission):
    # Added fields for display in the queue
    author_name: str
    location_name: Optional[str] = None
    time_ago: str
    tags: List[str] = []
