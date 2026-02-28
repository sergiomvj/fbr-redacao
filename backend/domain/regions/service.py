from core.database import get_supabase_service_auth
from core.exceptions import DatabaseOperationError
from domain.regions.schemas import RegionTree, RegionResponse
import logging
from typing import List
import uuid

logger = logging.getLogger(__name__)

async def get_all_regions() -> List[RegionResponse]:
    """Fetch all active regions linearly from database"""
    client = get_supabase_service_auth()
    try:
        response = client.table("regions").select("*").eq("is_active", True).is_("deleted_at", "null").order("name").execute()
        return [RegionResponse(**region) for region in response.data]
    except Exception as e:
        logger.error(f"Error fetching regions: {str(e)}")
        raise DatabaseOperationError(detail="Erro ao carregar lista de regiões")

async def get_region_tree() -> List[RegionTree]:
    """Fetch all active regions and construct hierarchical tree."""
    regions_linear = await get_all_regions()
    
    # Map regions to tree nodes dict via ID
    nodes = {region.id: RegionTree(**region.model_dump(), children=[]) for region in regions_linear}
    
    tree = []
    
    # Assemble hierarchy
    for region_id, node in nodes.items():
        if node.parent_id and node.parent_id in nodes:
            nodes[node.parent_id].children.append(node)
        else:
            # Root node
            tree.append(node)
            
    return tree
