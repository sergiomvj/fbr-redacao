from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage
import operator

# State definition
class CollectorState(TypedDict):
    source_url: str
    raw_content: str
    filtered_pautas: List[dict]
    final_headlines: List[dict]
    messages: Annotated[list[BaseMessage], operator.add]

# Node: fetch_sources
async def fetch_sources(state: CollectorState):
    # Logic to scrape or read RSS feeds
    return {"raw_content": f"Scraped data from {state['source_url']}"}

# Node: filter_relevance
async def filter_relevance(state: CollectorState):
    # LLM logic to filter out noise
    return {"filtered_pautas": [{"title": "Example", "score": 8}]}

# Node: deduplicate
async def deduplicate(state: CollectorState):
    # Search vector DB or simply text match to avoid repeating articles
    return {"filtered_pautas": state["filtered_pautas"]}

# Node: score_priority
async def score_priority(state: CollectorState):
    # LLM sorts and assigns priority
    return {"final_headlines": state["filtered_pautas"]}

# Node: enqueue_articles
async def enqueue_articles(state: CollectorState):
    # Save to articles table with status 'pending'
    return {"messages": []}

def build_collector_graph() -> StateGraph:
    workflow = StateGraph(CollectorState)
    
    workflow.add_node("fetch_sources", fetch_sources)
    workflow.add_node("filter_relevance", filter_relevance)
    workflow.add_node("deduplicate", deduplicate)
    workflow.add_node("score_priority", score_priority)
    workflow.add_node("enqueue_articles", enqueue_articles)
    
    workflow.add_edge(START, "fetch_sources")
    workflow.add_edge("fetch_sources", "filter_relevance")
    workflow.add_edge("filter_relevance", "deduplicate")
    workflow.add_edge("deduplicate", "score_priority")
    workflow.add_edge("score_priority", "enqueue_articles")
    workflow.add_edge("enqueue_articles", END)
    
    return workflow.compile()
