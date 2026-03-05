from fastapi import APIRouter, Depends
from typing import List
from domain.agents.schemas import AgentResponse, AgentRunRequest
from domain.agents.service import AgentService

router = APIRouter()
agent_service = AgentService()

@router.get("/", response_model=List[AgentResponse])
async def list_agents():
    """Returns a list of all active AI agents from database."""
    return await agent_service.list_agents()

@router.post("/run-collector")
async def run_collector(request: AgentRunRequest):
    """Triggers the collector agent to search and extract news."""
    return await agent_service.run_collector(
        agent_id=request.agent_id,
        region_id=request.region_id,
        query_override=request.query_override
    )
