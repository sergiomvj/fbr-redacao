from core.database import get_supabase_service_auth
from core.exceptions import DatabaseOperationError
from domain.agents.schemas import AgentResponse
import logging
from typing import List
import uuid

logger = logging.getLogger(__name__)

class AgentService:
    def __init__(self):
        self.supabase = get_supabase_service_auth()

    async def list_agents(self) -> List[AgentResponse]:
        """Fetch all active agents from database."""
        try:
            response = self.supabase.table("agents") \
                .select("*, regions(name)") \
                .is_("deleted_at", "null") \
                .order("created_at") \
                .execute()
            
            agents = []
            for item in response.data:
                # Add region name if available
                region_name = item.get("regions", {}).get("name") if item.get("regions") else None
                
                agents.append(AgentResponse(
                    id=item["id"],
                    name=item["name"],
                    role=item["type"],
                    status=item["status"],
                    llm=item["llm_provider"],
                    region=region_name,
                    created_at=item["created_at"]
                ))
            return agents
        except Exception as e:
            logger.error(f"Error fetching agents: {str(e)}")
            raise DatabaseOperationError(detail="Erro ao carregar lista de agentes")
