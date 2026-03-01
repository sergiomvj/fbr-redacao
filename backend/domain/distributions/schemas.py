from pydantic import BaseModel
from typing import Optional
from enum import Enum
import uuid


class DistributionChannel(str, Enum):
    WEBSITE = "website"
    APP = "app"
    NEWSLETTER = "newsletter"
    SOCIAL = "social"
    API = "api"


class DistributionBase(BaseModel):
    channel: DistributionChannel
    region_id: Optional[uuid.UUID] = None
    is_active: bool = True


class DistributionCreate(DistributionBase):
    pass


class DistributionResponse(DistributionBase):
    id: uuid.UUID
    article_id: uuid.UUID

    class Config:
        from_attributes = True
