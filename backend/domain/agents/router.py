from fastapi import APIRouter, Depends
from typing import List
from domain.agents.schemas import AgentResponse
from domain.agents.service import AgentService

router = APIRouter()
agent_service = AgentService()

@router.get("/", response_model=List[AgentResponse])
async def list_agents():
    """Returns a list of all active AI agents from database."""
    return await agent_service.list_agents()
