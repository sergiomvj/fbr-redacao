from workers.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="workers.moderation.run_moderator_graph")
def run_moderator_graph(ugc_payload: dict):
    """
    Evaluates new User-Generated Content for offensive content, relevance, etc.
    """
    logger.info(f"Moderator graph started for submission: {ugc_payload.get('id')}")
    
    # LangGraph logic placeholder
    
    logger.info("Moderator graph completed.")
    return {"status": "success", "module": "moderator"}
