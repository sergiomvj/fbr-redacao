from pydantic import BaseModel, ConfigDict
import uuid
from typing import Optional, List
from datetime import datetime

class RegionBase(BaseModel):
    name: str
    slug: str
    country_code: Optional[str] = None
    timezone: Optional[str] = None
    type: str

class RegionResponse(RegionBase):
    id: uuid.UUID
    parent_id: Optional[uuid.UUID] = None
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
    
class RegionTree(RegionResponse):
    children: List['RegionTree'] = []
    
    model_config = ConfigDict(from_attributes=True)
