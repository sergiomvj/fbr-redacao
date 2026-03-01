from fastapi import APIRouter, Depends, Request, BackgroundTasks, HTTPException
from core.security import verify_n8n_webhook, verify_openclaw_webhook
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# --- N8N Webhooks ---

@router.post("/n8n/cycle-completed", dependencies=[Depends(verify_n8n_webhook)])
async def n8n_cycle_completed_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Recebe notificação do n8n de que um ciclo periódico de notícias foi concluído.
    Útil para acionar a WebSocket de Dashboard e avisar a Redação sobre novos dados gerais.
    """
    try:
        payload = await request.json()
        logger.info(f"N8N Cycle webhook recebido: {payload}")
        
        # TODO: Implementar lógica de broadcats via WebSocket
        
        return {"status": "success", "message": "Cycle completion acknowledged"}
    except Exception as e:
        logger.error(f"Erro processando n8n webhook: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")

# --- OpenClaw Webhooks ---

@router.post("/openclaw/article-produced", dependencies=[Depends(verify_openclaw_webhook)])
async def openclaw_article_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Recebe o veredito final (texto + imagens + tags) gerado pelo OpenClaw Agent (ex: Regional Editor).
    É aqui que o FastAPI vai inserir/atualizar a linha no Supabase e acionar o Push.
    """
    try:
        payload = await request.json()
        logger.info(f"OpenClaw Produção recebida: {payload.get('title', 'Sem Título')}")
        
        # TODO: Validação Pydantic do formato do artigo
        # TODO: Salvar via supabase_admin no BD
        # TODO: Emitir websocket update para a tela "Mural Produção"
        
        return {"status": "success", "message": "Article ingested locally"}
    except Exception as e:
        logger.error(f"Erro processando OpenClaw webhook: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")

# --- FBR-Click Webhooks ---

@router.post("/fbr-click/interaction")
async def fbr_click_interaction_webhook(request: Request):
    """
    Recebe inputs vindos do chat do Microsoft Teams/Slack dos coordenadores.
    (Ex: Operador clicou no botão verde 'Aprovar UGC' postado no chat).
    """
    try:
        payload = await request.json()
        logger.info(f"FBR-Click interação recebida: {payload}")
        
        # TODO: Validar request nativa do serviço integrador de chat
        # TODO: Modificar status no BD via Supabase
        
        return {"status": "success", "message": "Interaction processed"}
    except Exception as e:
        logger.error(f"Erro processando FBR-Click webhook: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
