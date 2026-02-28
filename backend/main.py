from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Set all CORS enabled origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # In production, this needs to be restricted to frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Custom error handling and timing middleware
    from core.middleware import ExceptionMiddleware
    app.add_middleware(ExceptionMiddleware)

    @app.get("/health")
    async def health_check():
        return {"status": "ok", "environment": settings.ENVIRONMENT}
        
    # Routers inclusion
    from api.router import api_router
    from websockets.router import router as ws_router
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
