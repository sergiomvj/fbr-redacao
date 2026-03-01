from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # CORS: restritivo em produção — configurar ALLOWED_ORIGINS no .env
    allowed_origins = settings.ALLOWED_ORIGINS if settings.ALLOWED_ORIGINS else ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-User-Id"],
    )
    
    # Custom error handling and timing middleware
    from core.middleware import ExceptionMiddleware
    app.add_middleware(ExceptionMiddleware)

    @app.get("/health")
    async def health_check():
        return {"status": "ok", "environment": settings.ENVIRONMENT}
        
    # Routers inclusion
    from api.router import api_router
    from ws.router import router as ws_router
    app.include_router(api_router, prefix=settings.API_V1_STR)
    app.include_router(ws_router, tags=["websockets"])
    
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host=settings.HOST, 
        port=settings.PORT, 
        reload=settings.ENVIRONMENT == "development"
    )
