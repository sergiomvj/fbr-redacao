from fastapi import Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.exceptions import AuthenticationFailedError
import uuid

# Define the expected Auth Header scheme (though Iron Session Proxy handles the real JWT)
# The Next.js API route proxy will unpack the cookie and inject this header:
# X-User-Id: <uuid>
security = HTTPBearer(auto_error=False)

async def get_current_user_id(request: Request) -> uuid.UUID:
    """
    Extracts the user ID from the X-User-Id header injected by the Next.js frontend proxy.
    This guarantees that the user has already been authenticated via Iron-Session + Supabase
    on the server-side before the request reaches FastAPI.
    """
    user_id_str = request.headers.get("X-User-Id")
    
    if not user_id_str:
        raise AuthenticationFailedError(detail="Missing X-User-Id header. Access must be routed through the authorized frontend proxy.")
        
    try:
        user_id = uuid.UUID(user_id_str)
        return user_id
    except ValueError:
        raise AuthenticationFailedError(detail="Invalid X-User-Id format.")

# --- FBR Architecture Webhook Validators ---
# As rotas de webhook serão chamadas por serviços externos (como o n8n e o OpenClaw)
# e não passam pelo proxy do Next.js. Elas validam tokens da .env.

from core.config import settings
from fastapi import Header

async def verify_n8n_webhook(x_n8n_webhook_key: str = Header(..., alias="X-N8N-Webhook-Key")):
    """
    Validates requests coming from the central FBR n8n orchestrator.
    """
    expected_key = settings.N8N_WEBHOOK_KEY
    if not expected_key or x_n8n_webhook_key != expected_key:
        raise AuthenticationFailedError(detail="Invalid or missing n8n webhook key.")

async def verify_openclaw_webhook(x_openclaw_webhook_key: str = Header(..., alias="X-OpenClaw-Webhook-Key")):
    """
    Validates requests coming from OpenClaw instances.
    """
    expected_key = settings.OPENCLAW_WEBHOOK_KEY
    if not expected_key or x_openclaw_webhook_key != expected_key:
        raise AuthenticationFailedError(detail="Invalid or missing OpenClaw webhook key.")
