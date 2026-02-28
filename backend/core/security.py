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
