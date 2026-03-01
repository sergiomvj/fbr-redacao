import uuid
from typing import List, Dict, Any
from core.database import get_supabase_service_auth
from core.exceptions import ResourceNotFoundError

class ArticleService:
    def __init__(self):
        self.supabase = get_supabase_service_auth()

    def list_production_articles(self, user_id: uuid.UUID) -> Dict[str, List[Dict[str, Any]]]:
        """
        Fetches articles in production statuses and groups them for the Kanban board.
        In a real scenario, this should filter by user's authorized regions.
        """
        # Exclude published, off_air, and deleted statuses
        production_statuses = ['collecting', 'writing', 'art_review', 'regional_review', 'returned']
        
        # We query the DB using the service role
        response = self.supabase.table('articles') \
            .select('*') \
            .in_('status', production_statuses) \
            .execute()
        
        articles = response.data
        
        # Group by status to match the frontend MOCK_DATA structure
        # 'classifying' is the collector lane ('collecting' and 'returned')
        # 'writing' is the journalist lane 
        # 'art' is the art_review lane
        # 'review' is the regional_review lane
        grouped = {
            "classifying": [a for a in articles if a['status'] in ['collecting', 'returned']],
            "writing": [a for a in articles if a['status'] == 'writing'],
            "art": [a for a in articles if a['status'] == 'art_review'],
            "review": [a for a in articles if a['status'] == 'regional_review']
        }
        
        return grouped

    def list_published_articles(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        """
        Fetches published articles and left joins metrics for the Publicados Kanban board.
        In a real scenario, this should filter by user's authorized regions.
        """
        response = self.supabase.table('articles') \
            .select('*, regions(name), metrics(views)') \
            .in_('status', ['published', 'off_air']) \
            .order('updated_at', desc=True) \
            .execute()
        
        articles = []
        for row in response.data:
            views = 0
            if row.get('metrics'):
                 views = sum(m.get('views', 0) for m in row['metrics'])
                 
            articles.append({
                "id": row['id'],
                "title": row.get('title') or "Título Indisponível",
                "date": row.get('updated_at', row.get('created_at')),
                "region": row.get('regions', {}).get('name') if row.get('regions') else "Nacional (US)",
                "views": views,
                "status": "live" if row['status'] == 'published' else "archived",
                "url": f"https://facebrasil.com/noticia/{row['id']}"
            })
            
        return articles
