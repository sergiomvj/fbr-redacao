import os
from celery import Celery

# Setup the Celery application
# Uses the REDIS URL defined in the project configuration

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "redacao_workers",
    broker=redis_url,
    backend=redis_url,
    include=[
        "workers.collector_worker",
        "workers.journalist_worker",
        "workers.art_worker",
        "workers.editor_worker",
        "workers.distribution_worker",
        "workers.moderation_worker",
    ]
)

# Optional configurations
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Sao_Paulo",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600, # 1 hr max per task
)
