from core.database import get_supabase_service_auth
from .schemas import UGCModerationQueueItem
from datetime import datetime, timezone
import math

class UGCService:
    @staticmethod
    async def get_moderation_queue() -> list[dict]:
        """Fetch pending UGC submissions formatted for the frontend queue."""
        
        # Use service role to bypass RLS for administrative backend views
        supabase = get_supabase_service_auth()
        response = supabase.table("ugc_submissions").select(
            "*, users(full_name), regions(name)"
        ).eq("status", "pending").order("created_at", desc=True).execute()
        
        items = []
        for row in response.data:
            # Calculate time ago
            created_at = datetime.fromisoformat(row["created_at"].replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            delta = now - created_at
            
            if delta.days > 0:
                time_ago = f"Há {delta.days} dias"
            elif delta.seconds >= 3600:
                hours = math.floor(delta.seconds / 3600)
                time_ago = f"Há {hours}h"
            else:
                minutes = math.floor(delta.seconds / 60)
                time_ago = f"Há {minutes} min"

            author_name = row.get("users", {}).get("full_name", "Desconhecido") if row.get("users") else "Desconhecido"
            location_name = row.get("regions", {}).get("name", "Sem Localização") if row.get("regions") else "Sem Localização"

            # Transform raw row into ModerationQueueItem dict
            item = {
                **row,
                "author_name": author_name,
                "location_name": location_name,
                "time_ago": time_ago,
                "tags": [row.get("type", "").upper()], # Simplified tags for now
            }
            items.append(item)
            
        return items
