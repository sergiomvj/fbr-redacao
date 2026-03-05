from core.database import get_supabase_service_auth
from core.exceptions import DatabaseOperationError, ResourceNotFoundError
from domain.agents.schemas import AgentResponse
from domain.agents.collector import NewsScraper
import logging
from typing import List, Dict, Any
import uuid
import json

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

    async def run_collector(self, agent_id: uuid.UUID, region_id: uuid.UUID, query_override: str = None) -> List[Dict[str, Any]]:
        """
        Executes the collection process for a specific agent and region.
        """
        try:
            # 1. Get region details for search keywords
            region_resp = self.supabase.table("regions").select("name, search_keywords").eq("id", str(region_id)).single().execute()
            region = region_resp.data
            if not region:
                raise ResourceNotFoundError(detail="Região não encontrada")

            search_query = query_override or region.get("search_keywords") or region.get("name")
            
            # 2. Search for news
            scraper = NewsScraper()
            news_items = scraper.search_news(search_query, limit=10)
            
            created_articles = []
            
            # 3. Process each item (check if already exists)
            for item in news_items:
                # Check for duplicate URL
                existing = self.supabase.table("articles").select("id").eq("slug", item["link"]).execute()
                if existing.data:
                    continue
                
                # 4. Extract full content
                full_content = scraper.extract_full_content(item["link"])
                if not full_content:
                    continue
                
                # 5. Save to articles table with 'collecting' status
                # Note: We use the link as a temporary slug/id for uniqueness check
                article_data = {
                    "title": full_content["title"] or item["title"],
                    "body": full_content["text"],
                    "slug": item["link"], # This might need a proper slug generator later
                    "region_id": str(region_id),
                    "agent_id": str(agent_id),
                    "status": "collecting",
                    "category": "noticias",
                    "impact_section": full_content.get("summary", ""),
                    "tags": region.get("name").split() if region.get("name") else []
                }
                
                resp = self.supabase.table("articles").insert(article_data).execute()
                if resp.data:
                    created_articles.append(resp.data[0])
            
            return created_articles
            
        except Exception as e:
            logger.error(f"Error running collector for engine: {str(e)}")
            raise DatabaseOperationError(detail=f"Erro na execução do coletor: {str(e)}")
