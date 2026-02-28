from typing import TypedDict, Annotated, Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage
import operator

class ModeratorState(TypedDict):
    ugc_id: str
    content_text: str
    score_relevance: float
    rejection_reason: str
    messages: Annotated[list[BaseMessage], operator.add]

async def receive_ugc(state: ModeratorState):
    # Loads UGC content from DB
    return {"content_text": "Sample text from user"}

async def analyze_content(state: ModeratorState):
    # Moderation LLM evaluates rules 
    return {"score_relevance": 0.9} # Mock score

def route_decision(state: ModeratorState) -> Literal["approve_and_credit", "reject_with_reason"]:
    if state["score_relevance"] >= 0.8:
        return "approve_and_credit"
    return "reject_with_reason"

async def approve_and_credit(state: ModeratorState):
    # Mark UGC as approved, add credits to wallet
    return {}

async def reject_with_reason(state: ModeratorState):
    # Mark as rejected, store reason
    return {"rejection_reason": "Failed automated quality checks."}

def build_moderator_graph() -> StateGraph:
    workflow = StateGraph(ModeratorState)
    
    workflow.add_node("receive_ugc", receive_ugc)
    workflow.add_node("analyze_content", analyze_content)
    workflow.add_node("approve_and_credit", approve_and_credit)
    workflow.add_node("reject_with_reason", reject_with_reason)
    
    workflow.add_edge(START, "receive_ugc")
    workflow.add_edge("receive_ugc", "analyze_content")
    
    workflow.add_conditional_edges("analyze_content", route_decision)
    
    workflow.add_edge("approve_and_credit", END)
    workflow.add_edge("reject_with_reason", END)
    
    return workflow.compile()
