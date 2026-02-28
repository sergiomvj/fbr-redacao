from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from core.exceptions import BaseAppException
import time
import logging

logger = logging.getLogger(__name__)

class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        try:
            response = await call_next(request)
            
            # Record Processing Time
            process_time = time.time() - start_time
            response.headers["X-Process-Time"] = f"{process_time:.4f}"
            return response
            
        except BaseAppException as e:
            logger.warning(f"Application Error: {e.detail}")
            return JSONResponse(
                status_code=e.status_code,
                content={"detail": e.detail}
            )
        except Exception as e:
            # Fatal uncaught errors get hidden from the client per security specs
            logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error"}
            )
