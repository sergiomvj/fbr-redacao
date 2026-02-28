import redis.asyncio as aioredis
from typing import AsyncGenerator
from supabase import create_client, Client
from core.config import settings

# --- Redis Configuration ---
class RedisClient:
    def __init__(self):
        self.pool = aioredis.ConnectionPool.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            max_connections=10
        )

    async def get_connection(self) -> AsyncGenerator[aioredis.Redis, None]:
        client = aioredis.Redis(connection_pool=self.pool)
        try:
            yield client
        finally:
            await client.aclose()
            
redis_manager = RedisClient()

async def get_redis_client() -> AsyncGenerator[aioredis.Redis, None]:
    async for client in redis_manager.get_connection():
        yield client


# --- Supabase Configuration ---
# Creates an elevated service_role client for backend operations
# Warning: Bypasses RLS. Do not expose this client directly via public APIs.
# Always inject the user_id and execute specific targeted queries
def get_supabase_service_auth() -> Client:
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )
