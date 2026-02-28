from typing import TypedDict, Annotated, List, Literal
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import BaseMessage
import operator

class ChiefState(TypedDict):
    articles_payload: list[dict]
    problem_found: bool
    problem_classification: str
    severity: Literal["low", "high", "none"]
    messages: Annotated[list[BaseMessage], operator.add]

async def monitor_published(state: ChiefState):
    # LLM scans for redundancy, bias, or saturation
    return {"problem_found": False}

def has_problems(state: ChiefState) -> Literal["classify_problem", "end"]:
    if state.get("problem_found"):
        return "classify_problem"
    return "end"

async def classify_problem(state: ChiefState):
    # Determine the severity level of the editorial problem
    return {"severity": "low", "problem_classification": "Bias detected"}

def route_severity(state: ChiefState) -> Literal["flag_for_human", "act_automatically"]:
    if state["severity"] == "high":
        return "act_automatically"
    return "flag_for_human"

async def flag_for_human(state: ChiefState):
    # Insert record into 'alerts' table
    return {}

async def act_automatically(state: ChiefState):
    # E.g. un-publish offending articles pending review
    return {}

def build_chief_editor_graph() -> StateGraph:
    workflow = StateGraph(ChiefState)
    
    workflow.add_node("monitor_published", monitor_published)
    workflow.add_node("classify_problem", classify_problem)
    workflow.add_node("flag_for_human", flag_for_human)
    workflow.add_node("act_automatically", act_automatically)
    
    workflow.add_edge(START, "monitor_published")
    workflow.add_conditional_edges("monitor_published", has_problems, {
        "classify_problem": "classify_problem",
        "end": END
    })
    
    workflow.add_edge("classify_problem", route_severity)
    workflow.add_conditional_edges("classify_problem", route_severity)
    
    workflow.add_edge("flag_for_human", END)
    workflow.add_edge("act_automatically", END)
    
    return workflow.compile()
