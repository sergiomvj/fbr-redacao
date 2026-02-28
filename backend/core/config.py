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
    
    # AI Configs
    LOCAL_LLM_URL: str | None = None
    LOCAL_LLM_MODEL: str | None = None
    OPENAI_API_KEY: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_ignore_empty=True, 
        extra="ignore"
    )

settings = Settings()
