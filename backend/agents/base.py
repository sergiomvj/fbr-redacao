from langchain_core.language_models.chat_models import BaseChatModel
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class BaseAgent:
    """
    Abstract Base Class for all LangGraph agents.
    Provides common formatting and execution logic shared across different roles.
    """
    def __init__(self, llm: BaseChatModel, agent_id: str):
        self.llm = llm
        self.agent_id = agent_id
        
    async def log_step(self, step_name: str, payload: Dict[str, Any]):
        """
        Record internal graph steps. In reality, this will emit to DB
        or WebSocket streams so that standard dashboards can read it.
        """
        logger.info(f"[Agent {self.agent_id}] Step '{step_name}' executed. Data: {payload}")
        
    # Standard format handlers will be placed here
    # Expected structured output mapping algorithms
