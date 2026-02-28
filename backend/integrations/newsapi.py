import httpx
from core.config import settings

async def fetch_news_via_gnews(query: str, max_results: int = 10) -> list:
    """
    Fetches news headlines dynamically from GNews API for Collector matching.
    """
    if not settings.NEWSAPI_KEY:
        return []

    url = f"https://gnews.io/api/v4/search?q={query}&lang=pt&max={max_results}&apikey={settings.NEWSAPI_KEY}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        data = response.json()
        return data.get("articles", [])
