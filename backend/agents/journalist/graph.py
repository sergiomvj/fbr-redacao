from typing import TypedDict, Annotated, List, Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage
import operator

class JournalistState(TypedDict):
    article_id: str
    headline: str
    context: str
    draft: str
    validation_errors: List[str]
    messages: Annotated[list[BaseMessage], operator.add]

async def receive_headline(state: JournalistState):
    return {"headline": state["headline"]}

async def research_context(state: JournalistState):
    # RAG or external search (e.g., NewsAPI / Google Search)
    return {"context": "Retrieved context for the headline"}

async def translate_culturalize(state: JournalistState):
    # LLM applies localization rules for target immigrant audience
    return {"context": state["context"] + " (Localized)"}

async def write_article(state: JournalistState):
    # Main LLM generation step using the Journalist prompt
    return {"draft": "This is the generated markdown draft."}

async def validate_structure(state: JournalistState):
    # Basic deterministic checks (e.g. check for 'O que isso muda pra você' section)
    errors = []
    if "O que isso muda" not in state["draft"]:
        errors.append("Missing mandatory impact section.")
    return {"validation_errors": errors}

def should_retry(state: JournalistState) -> Literal["write_article", "send_to_art"]:
    # Retry text generation if structural checks fail
    if len(state["validation_errors"]) > 0:
        return "write_article"
    return "send_to_art"

async def send_to_art(state: JournalistState):
    # Update article status to 'ready_for_art' or queue Celery task
    return {}

def build_journalist_graph() -> StateGraph:
    workflow = StateGraph(JournalistState)
    
    workflow.add_node("receive_headline", receive_headline)
    workflow.add_node("research_context", research_context)
    workflow.add_node("translate_culturalize", translate_culturalize)
    workflow.add_node("write_article", write_article)
    workflow.add_node("validate_structure", validate_structure)
    workflow.add_node("send_to_art", send_to_art)
    
    workflow.add_edge(START, "receive_headline")
    workflow.add_edge("receive_headline", "research_context")
    workflow.add_edge("research_context", "translate_culturalize")
    workflow.add_edge("translate_culturalize", "write_article")
    workflow.add_edge("write_article", "validate_structure")
    
    # Conditional edge for retry logic
    workflow.add_conditional_edges(
        "validate_structure",
        should_retry
    )
    workflow.add_edge("send_to_art", END)
    
    return workflow.compile()
