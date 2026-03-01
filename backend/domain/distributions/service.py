from core.database import supabase_admin
import logging

logger = logging.getLogger(__name__)


async def list_distributions(article_id: str | None = None) -> list[dict]:
    """Lista canais de distribuição, opcionalmente filtrado por artigo."""
    try:
        query = supabase_admin.table("distributions").select("*")
        if article_id:
            query = query.eq("article_id", article_id)
        result = query.order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        logger.error(f"Erro ao listar canais de distribuição: {e}")
        return []


async def get_distribution_summary() -> dict:
    """Retorna um resumo dos canais ativos agrupados por tipo."""
    try:
        result = supabase_admin.table("distributions").select(
            "channel, is_active"
        ).eq("is_active", True).execute()
        data = result.data or []
        summary: dict[str, int] = {}
        for row in data:
            ch = row.get("channel", "unknown")
            summary[ch] = summary.get(ch, 0) + 1
        return summary
    except Exception as e:
        logger.error(f"Erro ao buscar resumo de canais: {e}")
        return {}
