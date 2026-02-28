from pydantic import BaseModel, ConfigDict
import uuid
from typing import Optional
from datetime import datetime

class SourceBase(BaseModel):
    name: str
    url: Optional[str] = None
    frequency_minutes: int = 15
    type: str # enum: feed, scraper, api, etc

class SourceCreate(SourceBase):
    pass
    
class SourceResponse(SourceBase):
    id: uuid.UUID
    is_active: bool
    last_fetched_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
