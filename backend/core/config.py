from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "1FBR-Redacao"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Supabase Setup
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # Network
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Internal Security
    INTERNAL_API_KEY: str | None = None
    
    # Session key for Next.js interop verification parity
    SESSION_SECRET: str
    
    # Data Layer
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Openclaw Configs
    OPENCLAW_GATEWAY_URL: str | None = None
    OPENCLAW_API_KEY: str | None = None
    OPENCLAW_WEBHOOK_KEY: str | None = None
    
    # N8N Configs
    N8N_WEBHOOK_URL: str | None = None
    N8N_API_KEY: str | None = None
    N8N_WEBHOOK_KEY: str | None = None
    
    # FBR Click Configs
    FBR_CLICK_WEBHOOK_URL: str | None = None
    FBR_CLICK_BOT_TOKEN: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_ignore_empty=True, 
        extra="ignore"
    )

settings = Settings()
