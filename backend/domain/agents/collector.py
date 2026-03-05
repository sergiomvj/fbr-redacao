from pygooglenews import GoogleNews
from newspaper import Article
import logging
from typing import List, Dict, Optional
import feedparser
import httpx

logger = logging.getLogger(__name__)

class NewsScraper:
    def __init__(self, lang: str = 'pt', country: str = 'BR'):
        self.gn = GoogleNews(lang=lang, country=country)

    def search_news(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Search for news using Google News RSS.
        Returns a list of dicts with title, link, and published date.
        """
        try:
            search = self.gn.search(query)
            entries = search.get('entries', [])[:limit]
            
            results = []
            for entry in entries:
                results.append({
                    "title": entry.title,
                    "link": entry.link,
                    "published": entry.published
                })
            return results
        except Exception as e:
            logger.error(f"Error searching news for query '{query}': {e}")
            return []

    def extract_full_content(self, url: str) -> Optional[Dict]:
        """
        Extract full article content using newspaper3k.
        Handles Google News redirects if necessary.
        """
        try:
            target_url = url
            # Handle Google News redirects for better extraction
            if "news.google.com" in url:
                try:
                    with httpx.Client(follow_redirects=True, timeout=10.0) as client:
                        response = client.get(url)
                        target_url = str(response.url)
                except Exception as redirect_err:
                    logger.warning(f"Failed to resolve Google News redirect for {url}: {redirect_err}")

            article = Article(target_url)
            article.download()
            article.parse()
            
            return {
                "title": article.title,
                "text": article.text,
                "authors": article.authors,
                "top_image": article.top_image,
                "publish_date": article.publish_date,
                "summary": article.summary if hasattr(article, 'summary') else "",
                "final_url": target_url
            }
        except Exception as e:
            logger.error(f"Error extracting content from URL '{url}': {e}")
            return None

    def get_top_news_by_location(self, location: str, limit: int = 5) -> List[Dict]:
        """
        Get top news for a specific location (e.g., 'Orlando', 'Miami').
        """
        query = f"news in {location}"
        return self.search_news(query, limit=limit)
