import httpx
from core.config import settings

async def search_unsplash_images(query: str, per_page: int = 5) -> list:
    """
    Finds stock images from Unsplash matching the LLM generated keywords.
    """
    if not settings.UNSPLASH_ACCESS_KEY:
        return []
        
    url = f"https://api.unsplash.com/search/photos?query={query}&per_page={per_page}"
    headers = {"Authorization": f"Client-ID {settings.UNSPLASH_ACCESS_KEY}"}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
