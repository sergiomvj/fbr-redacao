from pydantic import BaseModel, ConfigDict
import uuid
from typing import Optional, Dict, Any
from datetime import datetime

class AgentBase(BaseModel):
    name: str
    role: str # enum: collector, journalist, url_extractor, etc
    model: str
    temperature: float = 0.7

class AgentResponse(AgentBase):
    id: uuid.UUID
    is_active: bool
    system_prompt: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
