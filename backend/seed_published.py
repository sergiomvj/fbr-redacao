import os
from supabase import create_client
from dotenv import load_dotenv
from uuid import uuid4
import datetime

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("Missing Supabase credentials in .env")
    exit(1)

supabase = create_client(supabase_url, supabase_key)

def seed_published_articles():
    print("Seeding Published Articles and Metrics...")

    regions_response = supabase.table("regions").select("id").limit(1).execute()
    regions = regions_response.data
    region_id = regions[0]["id"] if regions else None

    # Ensure a main editor exists (to satisfy published_by requirement)
    users_response = supabase.table("users").select("id").limit(1).execute()
    users = users_response.data
    if not users:
        print("No users found to set as publisher. Exiting.")
        return
    publisher_id = users[0]["id"]
    
    mock_articles = [
        {
            "id": str(uuid4()),
            "title": "Comunidade brasileira se reúne para festival de outono em Nova York",
            "slug": "comunidade-festival-outono-ny",
            "body": "A comunidade brasileira marcou presença em massa...",
            "category": "Cultura",
            "status": "published",
            "region_id": region_id,
            "operator_id": publisher_id,
            "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "Novas regras de imigração: O que muda para estudantes internacionais",
            "slug": "novas-regras-imigracao-estudantes",
            "body": "O departamento de imigração anunciou novas diretrizes...",
            "category": "Política",
            "status": "published",
            "region_id": region_id,
            "operator_id": publisher_id,
            "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2)).isoformat()
        },
        {
            "id": str(uuid4()),
            "title": "Destaques do esporte: Torneio de Jiu-Jitsu atrai centenas em Miami",
            "slug": "destaques-esporte-torneio-jiu-jitsu-miami",
            "body": "O final de semana foi marcado por muita emoção...",
            "category": "Esportes",
            "status": "off_air",
            "region_id": region_id,
            "operator_id": publisher_id,
            "published_at": (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5)).isoformat()
        }
    ]

    for article in mock_articles:
        try:
            supabase.table("articles").upsert(article).execute()
            print(f"Upserted Published Article: {article['title']}")
            
            # Seed metric based on title
            views_mock = 1200 if "outono" in article['title'] else (5800 if "imigração" in article['title'] else 890)
            metric = {
                 "id": str(uuid4()),
                 "article_id": article["id"],
                 "channel": "web",
                 "date": datetime.date.today().isoformat(),
                 "views": views_mock,
                 "unique_views": int(views_mock * 0.8),
                 "shares": int(views_mock * 0.1)
            }
            try:
                 supabase.table("metrics").upsert(metric).execute()
                 print(f"  - Appended {views_mock} web views.")
            except Exception as me:
                 print(f"  - Error upserting metric: {me}")
            
        except Exception as e:
            print(f"Error upserting Article: {e}")

if __name__ == "__main__":
    seed_published_articles()
