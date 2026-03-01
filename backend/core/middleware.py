from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from core.exceptions import BaseAppException
import time
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

# --- Rate Limiting (in-memory, por IP) ---
# Para produção multi-worker, substituir por Redis counter.
_rate_counters: dict[str, list[float]] = defaultdict(list)

RATE_LIMIT_SENSITIVE = 30   # req por janela
RATE_WINDOW_SECONDS = 60    # janela de 1 minuto

SENSITIVE_PREFIXES = (
    "/api/v1/auth/",
    "/api/v1/ugc/",
    "/api/v1/distributions/",
)


def _is_rate_limited(ip: str, path: str) -> bool:
    """Aplica rate limit apenas em prefixos sensíveis."""
    if not any(path.startswith(p) for p in SENSITIVE_PREFIXES):
        return False

    now = time.time()
    window_start = now - RATE_WINDOW_SECONDS
    hits = _rate_counters[ip]

    # Limpar hits antigos
    _rate_counters[ip] = [t for t in hits if t > window_start]
    _rate_counters[ip].append(now)

    return len(_rate_counters[ip]) > RATE_LIMIT_SENSITIVE


class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()

        # Rate limiting
        client_ip = request.client.host if request.client else "unknown"
        if _is_rate_limited(client_ip, request.url.path):
            logger.warning(f"Rate limit excedido: {client_ip} → {request.url.path}")
            return JSONResponse(
                status_code=429,
                content={"detail": "Muitas requisições. Tente novamente em instantes."},
                headers={"Retry-After": str(RATE_WINDOW_SECONDS)},
            )

        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            response.headers["X-Process-Time"] = f"{process_time:.4f}"
            return response

        except BaseAppException as e:
            logger.warning(f"Application Error [{request.url.path}]: {e.detail}")
            return JSONResponse(
                status_code=e.status_code,
                content={"detail": e.detail},
            )
        except Exception as e:
            # Erros fatais não revelam stack trace ao cliente (regra de segurança)
            logger.error(f"Unhandled Exception [{request.url.path}]: {str(e)}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Erro interno. Contate o suporte FBR."},
            )
