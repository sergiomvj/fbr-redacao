import os
from supabase import create_client
from dotenv import load_dotenv
from uuid import uuid4

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("Missing Supabase credentials in .env")
    exit(1)

supabase = create_client(supabase_url, supabase_key)

def seed_alerts():
    print("Seeding Alerts Queue...")

    agents_response = supabase.table("agents").select("id").limit(2).execute()
    agents = agents_response.data
    
    regions_response = supabase.table("regions").select("id").limit(1).execute()
    regions = regions_response.data

    mock_alerts = [
        {
            "id": str(uuid4()),
            "type": "llm_fallback",
            "status": "open",
            "agent_id": agents[0]["id"] if agents else None,
            "region_id": regions[0]["id"] if regions else None,
            "message": "O billing da OpenAI ultrapassou $50.00 diários. Módulo Journalist pausado preventivamente. Verifique o uso imediato."
        },
        {
            "id": str(uuid4()),
            "type": "high_rejection_rate",
            "status": "acknowledged",
            "agent_id": agents[1 % len(agents)]["id"] if agents else None,
            "region_id": regions[0]["id"] if regions else None,
            "message": 'A matéria "Crise no Governo" gerada na fila apresentou viés político não alinhado às diretrizes editoriais do Facebrasil.'
        },
        {
            "id": str(uuid4()),
            "type": "ugc_queue_overflow",
            "status": "open",
            "agent_id": None,
            "region_id": regions[0]["id"] if regions else None,
            "message": "Mais de 5.000 usuários simultâneos no portal principal agora devido à matéria sobre neve na Flórida."
        }
    ]

    for alert in mock_alerts:
        try:
            supabase.table("alerts").upsert(alert).execute()
            print(f"Upserted Alert: {alert['type']}")
        except Exception as e:
            print(f"Error upserting Alert: {e}")

if __name__ == "__main__":
    seed_alerts()
