from workers.celery_app import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="workers.journalist.run_journalist_graph")
def run_journalist_graph(headline_payload: dict):
    """
    Executes the AI linear graph for journalism text generation.
    """
    logger.info(f"Started Journalist Graph for headline: {headline_payload.get('title')}")
    
    # LangGraph logic placeholder
    
    logger.info("Journalist Graph completed.")
    return {"status": "success", "module": "journalist"}
