from fastapi import APIRouter
from typing import List
from domain.regions.schemas import RegionTree, RegionResponse
from domain.regions.service import get_all_regions, get_region_tree

router = APIRouter()

@router.get("/", response_model=List[RegionResponse])
async def list_regions():
    """Returns a flat list of all active regions available in the platform."""
    return await get_all_regions()

@router.get("/tree", response_model=List[RegionTree])
async def get_regions_hierarchy():
    """Returns active regions structured hierarchically (parents and children)."""
    return await get_region_tree()
