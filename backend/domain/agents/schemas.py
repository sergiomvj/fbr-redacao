from pydantic import BaseModel, ConfigDict
import uuid
from typing import Optional, Dict, Any
from datetime import datetime

class AgentBase(BaseModel):
    name: str
    role: str # enum: collector, journalist, art, regional_editor, chief_editor, moderator
    status: str # enum: online, offline, error, paused
    llm: str # enum: local, claude, gpt4o
    region: Optional[str] = None

class AgentResponse(AgentBase):
    id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
