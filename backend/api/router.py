from fastapi import APIRouter
from domain.auth.router import router as auth_router
from domain.regions.router import router as regions_router
from domain.agents.router import router as agents_router
from domain.sources.router import router as sources_router
from domain.articles.router import router as articles_router
from domain.ugc.router import router as ugc_router
from domain.metrics.router import router as metrics_router
from domain.webhooks.router import router as webhooks_router
from domain.distributions.router import router as distributions_router

api_router = APIRouter()

# Domain routers
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(regions_router, prefix="/regions", tags=["regions"])
api_router.include_router(agents_router, prefix="/agents", tags=["agents"])
api_router.include_router(sources_router, prefix="/sources", tags=["sources"])
api_router.include_router(articles_router, prefix="/articles", tags=["articles"])
api_router.include_router(ugc_router, prefix="/ugc", tags=["ugc"])
api_router.include_router(metrics_router, prefix="/metrics", tags=["metrics"])
api_router.include_router(distributions_router, prefix="/distributions", tags=["distributions"])

# Webhooks da FBR Architecture (Não necessitam do X-User-Id do frontend proxy)
api_router.include_router(webhooks_router, prefix="/webhooks", tags=["webhooks"])

