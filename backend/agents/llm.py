from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from core.config import settings
import logging

logger = logging.getLogger(__name__)

# Map types to local model strings depending on deployment
LOCAL_MODEL_MAP = {
    "collector": "llama-3-8b-instruct",
    "journalist": "llama-3-70b-instruct",
    "art": "stable-diffusion-xl",
    "editor": "llama-3-70b-instruct",
    "chief": "llama-3-70b-instruct",
    "moderator": "llama-3-8b-instruct",
}

async def is_local_llm_available() -> bool:
    """Checks if the local LLM server is responding."""
    if not settings.LOCAL_LLM_URL:
        return False
    # TODO: Make a health check HTTP call to settings.LOCAL_LLM_URL
    return False

async def log_fallback_event(task_type: str, provider: str):
    logger.warning(f"Fallback to {provider} triggered for task: {task_type}")
    
async def get_llm(task_type: str) -> BaseChatModel:
    """
    Factory method to retrieve the correct LLM instance for a specific graph.
    Prefers local, then Claude, then OpenAI.
    """
    if await is_local_llm_available():
        # TODO: return ChatOllama or similar based on Local Stack details
        logger.info(f"Using local LLM {LOCAL_MODEL_MAP.get(task_type)} for {task_type}")
        pass
        
    # Check if Claude is available via API key
    if settings.ANTHROPIC_API_KEY:
        await log_fallback_event(task_type, provider="claude")
        return ChatAnthropic(
            model="claude-3-5-sonnet-20240620", 
            api_key=settings.ANTHROPIC_API_KEY,
            temperature=0.7
        )
        
    # Check if OpenAI is available as a last resort
    if settings.OPENAI_API_KEY:
        await log_fallback_event(task_type, provider="openai")
        return ChatOpenAI(
            model="gpt-4o", 
            api_key=settings.OPENAI_API_KEY,
            temperature=0.7
        )
        
    logger.critical("No LLMs available for Graph instantiation.")
    raise Exception("Nenhum provedor de LLM configurado localmente ou na nuvem.")
