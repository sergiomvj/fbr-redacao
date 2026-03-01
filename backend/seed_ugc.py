import os
from supabase import create_client
from dotenv import load_dotenv
from uuid import uuid4
import random

load_dotenv()

# Setup Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not supabase_url or not supabase_key:
    print("Missing Supabase credentials in .env")
    exit(1)

supabase = create_client(supabase_url, supabase_key)

def seed_ugc():
    """Seeds User Generated Content queue with mock data"""
    print("Seeding UGC Queue...")

    # Fetch users to associate with submissions
    users_response = supabase.table("users").select("id").limit(3).execute()
    users = users_response.data
    
    if not users:
        print("No users found to author UGC. Please seed users first.")
        return

    # Fetch regions to associate with submissions
    regions_response = supabase.table("regions").select("id").limit(2).execute()
    regions = regions_response.data
    
    # Pre-canned mock submissions
    mock_submissions = [
        {
            "id": str(uuid4()),
            "user_id": users[0]["id"],
            "region_id": regions[0]["id"] if regions else None,
            "type": "video",
            "title": "Chuva forte na I-4 causando engarrafamento",
            "description": "Mandei este vídeo gravado agora às 14h mostrando o engavetamento causado pelas chuvas cruzando a Internacional Drive.",
            "storage_path": "/ugc/mock_video.mp4",
            "file_size_bytes": 1024 * 1024 * 15,
            "mime_type": "video/mp4",
            "duration_seconds": 45,
            "status": "pending",
            "moderation_score": 0.88,
            "credit_amount": 5.0
        },
        {
            "id": str(uuid4()),
            "user_id": users[1 % len(users)]["id"],
            "region_id": regions[1 % len(regions)]["id"] if regions else None,
            "type": "video",
            "title": "Festival de comida brasileira em Wynwood",
            "description": "Fotos do evento de ontem à noite que reuniu vários food trucks locais.",
            "storage_path": "/ugc/mock_image.jpg",
            "file_size_bytes": 1024 * 1024 * 2,
            "mime_type": "image/jpeg",
            "status": "pending",
            "moderation_score": 0.95,
            "credit_amount": 10.0
        },
        {
            "id": str(uuid4()),
            "user_id": users[2 % len(users)]["id"],
            "region_id": regions[0]["id"] if regions else None,
            "type": "text",
            "title": "Acidente leve na rota 21",
            "description": "Apenas um relato em texto sobre lentidão.",
            "storage_path": "/ugc/mock_text.txt",
            "file_size_bytes": 1024,
            "mime_type": "text/plain",
            "status": "pending",
            "moderation_score": 0.45,
            "credit_amount": 0.0
        }
    ]

    for submission in mock_submissions:
        try:
            supabase.table("ugc_submissions").upsert(submission).execute()
            print(f"Upserted UGC: {submission['title']}")
        except Exception as e:
            print(f"Error upserting UGC: {e}")

if __name__ == "__main__":
    seed_ugc()
