from core.config import settings
import logging

logger = logging.getLogger(__name__)

async def create_checkout_session(user_id: str, plan_id: str):
    """
    Create a Stripe Checkout session.
    """
    if not settings.STRIPE_SECRET_KEY:
        logger.warning("Stripe Secret Key not set.")
        return None
        
    logger.info(f"Creating checkout session for user: {user_id}, plan: {plan_id}")
    # Stripe library initialization here
    return {"url": "https://checkout.stripe.com/pay/cs_test_mock123"}
