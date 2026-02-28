from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage
import operator

class EditorState(TypedDict):
    article_id: str
    content: str
    decision: Literal["approved", "needs_revision", "rejected"]
    revised_content: str
    messages: Annotated[list[BaseMessage], operator.add]

async def receive_article(state: EditorState):
    return {"content": "Loading text from DB"}

async def analyze_quality(state: EditorState):
    # Uses regional_editor system prompt to grade the draft
    # Mock decision as 'needs_revision' based on AI rules
    return {"decision": "needs_revision", "revised_content": state["content"] + "\n\n(Revisado por AI)"}

def route_decision(state: EditorState) -> Literal["correct_and_publish", "log_rejection", "log_corrections"]:
    if state["decision"] == "approved":
        return "log_corrections" # Publishes as-is
    elif state["decision"] == "rejected":
        return "log_rejection"
    return "correct_and_publish"

async def correct_and_publish(state: EditorState):
    # Modifies existing article payload with revised_content
    return {}

async def log_rejection(state: EditorState):
    # Alerts human operators the AI trashed a draft
    return {}

async def log_corrections(state: EditorState):
    # Commits to 'articles_versions' optionally
    return {}

def build_regional_editor_graph() -> StateGraph:
    workflow = StateGraph(EditorState)
    
    workflow.add_node("receive_article", receive_article)
    workflow.add_node("analyze_quality", analyze_quality)
    workflow.add_node("correct_and_publish", correct_and_publish)
    workflow.add_node("log_rejection", log_rejection)
    workflow.add_node("log_corrections", log_corrections)
    
    workflow.add_edge(START, "receive_article")
    workflow.add_edge("receive_article", "analyze_quality")
    workflow.add_conditional_edges("analyze_quality", route_decision)
    
    workflow.add_edge("correct_and_publish", "log_corrections")
    
    workflow.add_edge("log_corrections", END)
    workflow.add_edge("log_rejection", END)
    
    return workflow.compile()
