from fastapi import Request
from pydantic import BaseModel, ConfigDict
import uuid

class UserProfile(BaseModel):
    user_id: uuid.UUID
    email: str
    role: str
    plan: str
    region_id: uuid.UUID | None
    
    model_config = ConfigDict(from_attributes=True)
