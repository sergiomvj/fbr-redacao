from core.config import settings
import httpx
import logging

logger = logging.getLogger(__name__)

async def send_whatsapp_alert(phone: str, message: str):
    """
    Sends WhatsApp message via Meta Cloud API.
    """
    if not settings.WHATSAPP_TOKEN:
        logger.warning("WhatsApp Token not set.")
        return None
        
    url = f"https://graph.facebook.com/v19.0/PHONE_NUMBER_ID/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": message}
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers, timeout=10.0)
        return response.json()
