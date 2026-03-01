from core.database import get_supabase_service_auth
from datetime import datetime, timezone
import math

class AlertService:
    @staticmethod
    async def get_active_alerts() -> list[dict]:
        supabase = get_supabase_service_auth()
        
        # Fetch open and acknowledged alerts
        response = supabase.table("alerts").select(
            "*, agents(name), regions(name)"
        ).in_("status", ["open", "acknowledged"]).order("created_at", desc=True).execute()
        
        items = []
        for row in response.data:
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

            agent_name = row.get("agents", {}).get("name") if row.get("agents") else None
            region_name = row.get("regions", {}).get("name") if row.get("regions") else None

            item = {
                **row,
                "agent_name": agent_name,
                "region_name": region_name,
                "time_ago": time_ago,
            }
            items.append(item)
            
        return items
