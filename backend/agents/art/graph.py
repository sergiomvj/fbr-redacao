from typing import TypedDict, Annotated, List, Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage
import operator

class ArtState(TypedDict):
    article_id: str
    content: str
    search_keywords: List[str]
    found_urls: List[str]
    selected_image: str
    generation_prompt: str
    messages: Annotated[list[BaseMessage], operator.add]

async def receive_article(state: ArtState):
    return {"content": "Extracting keywords..."}

async def search_stock_images(state: ArtState):
    # LLM extracts ideal search queries then queries APIs (Unsplash/Pexels)
    # Mocking as found
    return {"found_urls": ["https://images.unsplash.com/1234"]}

def has_images(state: ArtState) -> Literal["select_best", "generate_image"]:
    if len(state["found_urls"]) > 0:
        return "select_best"
    return "generate_image"

async def select_best(state: ArtState):
    # Filter aspect ratio / pick the most relevant
    return {"selected_image": state["found_urls"][0]}

async def generate_image(state: ArtState):
    # Fallback to local Stable Diffusion
    return {"selected_image": "local:///generated.jpg"}

async def create_thumbnail(state: ArtState):
    # Resize, compress, text overlay operations via Pillow
    return {"selected_image": state["selected_image"]}

async def attach_to_article(state: ArtState):
    # DB update
    return {}

def build_art_graph() -> StateGraph:
    workflow = StateGraph(ArtState)
    
    workflow.add_node("receive_article", receive_article)
    workflow.add_node("search_stock_images", search_stock_images)
    workflow.add_node("select_best", select_best)
    workflow.add_node("generate_image", generate_image)
    workflow.add_node("create_thumbnail", create_thumbnail)
    workflow.add_node("attach_to_article", attach_to_article)
    
    workflow.add_edge(START, "receive_article")
    workflow.add_edge("receive_article", "search_stock_images")
    
    workflow.add_conditional_edges("search_stock_images", has_images)
    
    workflow.add_edge("select_best", "create_thumbnail")
    workflow.add_edge("generate_image", "create_thumbnail")
    
    workflow.add_edge("create_thumbnail", "attach_to_article")
    workflow.add_edge("attach_to_article", END)
    
    return workflow.compile()
