import httpx
from core.config import settings

async def search_pexels_videos(query: str, per_page: int = 5) -> list:
    """
    Finds stock videos from Pexels matching the LLM generated keywords.
    """
    if not settings.PEXELS_API_KEY:
        return []

    url = f"https://api.pexels.com/videos/search?query={query}&per_page={per_page}"
    headers = {"Authorization": settings.PEXELS_API_KEY}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        return data.get("videos", [])
