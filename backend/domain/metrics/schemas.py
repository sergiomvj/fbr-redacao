from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from enum import Enum

class AlertType(str, Enum):
    agent_offline = 'agent_offline'
    high_rejection_rate = 'high_rejection_rate'
    ugc_queue_overflow = 'ugc_queue_overflow'
    llm_fallback = 'llm_fallback'

class AlertStatus(str, Enum):
    open = 'open'
    acknowledged = 'acknowledged'
    resolved = 'resolved'

class AlertBase(BaseModel):
    type: AlertType
    status: AlertStatus
    agent_id: Optional[UUID] = None
    region_id: Optional[UUID] = None
    message: str
    metadata: Optional[Dict[str, Any]] = None

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: UUID
    acknowledged_by: Optional[UUID] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class AlertDisplay(Alert):
    agent_name: Optional[str] = None
    region_name: Optional[str] = None
    time_ago: str
