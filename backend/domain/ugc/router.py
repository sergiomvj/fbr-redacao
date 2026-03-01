from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from core.security import get_current_user_id
from core.config import settings
from core.exceptions import UploadRejectedError, QuotaExceededError
from .schemas import UGCModerationQueueItem
from .service import UGCService
import uuid

router = APIRouter()

# Tipos MIME aceitos para UGC (vídeo e imagem apenas)
ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/webp",
    "video/mp4", "video/webm",
}


@router.get("/queue", response_model=List[UGCModerationQueueItem])
async def list_ugc_queue(
    current_user: uuid.UUID = Depends(get_current_user_id),
) -> List[UGCModerationQueueItem]:
    """Retorna fila de conteúdo UGC pendente de moderação."""
    return await UGCService.get_moderation_queue()


@router.post("/submit")
async def submit_ugc(
    file: UploadFile = File(...),
    current_user: uuid.UUID = Depends(get_current_user_id),
) -> dict:
    """
    Recebe envio de UGC pelo repórter cidadão.
    Valida tipo MIME e tamanho antes de aceitar.
    """
    # 14.3 — Validação de tipo MIME
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise UploadRejectedError(
            detail=f"Tipo '{file.content_type}' não é permitido. Use: {', '.join(sorted(ALLOWED_MIME_TYPES))}"
        )

    # 14.3 — Validação de tamanho (lê até o limite + 1 byte)
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    contents = await file.read(max_bytes + 1)

    if len(contents) > max_bytes:
        raise UploadRejectedError(
            detail=f"Arquivo excede o limite de {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Rewind para o storage (Supabase Storage) processar depois
    await file.seek(0)

    # TODO: armazenar no Supabase Storage via service_role
    return {
        "status": "received",
        "filename": file.filename,
        "size_bytes": len(contents),
        "content_type": file.content_type,
    }
