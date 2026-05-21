import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

# Import schema and workflows
from schemas import ClientApplicationPayload, HiroPlatformState
from agents_workflow import hiro_state_machine

app = FastAPI(
    title="Hiro Career Intelligence Platform API",
    description="Enterprise-grade multi-agent resume matching and optimization engine.",
    version="1.0.0"
)

# Enforce secure CORS policy boundaries for enterprise interfaces
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to trusted domains in formal production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=200)
@app.get("/healthz", status_code=200)
async def health_check():
    """Liveness probe for Cloud Run scheduling and service routing checks."""
    return {"status": "healthy", "service": "hiro-orchestrator"}

@app.post("/api/v1/optimize")
async def optimize_resume(payload: ClientApplicationPayload):
    """
    Ingests raw candidate resumes and target job profiles, orchestrating them
    through the compiling LangGraph nodes using dynamic Vertex context caches.
    """
    try:
        # Construct transactional graph state starting parameters
        initial_state: HiroPlatformState = {
            "resume_snapshot": payload.raw_text_resume,
            "job_profile": payload.raw_job_description,
            "config": {
                "temperature": 0.2,
                "strict_ats": payload.preferences.strict_ats_matching,
                "target_role": payload.preferences.target_role,
                "target_location": payload.preferences.target_location
            },
            "extracted_target_keywords": [],
            "detected_gaps": [],
            "initial_ats_score": 0.0,
            "semantic_analysis": None,
            "current_optimized_resume": "",
            "reflection_critique": "",
            "total_tokens_consumed": 0,
            "execution_logs": [],

            "raw_job_description": payload.raw_job_description,
            "raw_resume": payload.raw_text_resume,
            "user_metadata": {
                "target_role": payload.preferences.target_role,
                "target_location": payload.preferences.target_location,
                "strict_ats_matching": payload.preferences.strict_ats_matching
            },
            "dense_sparse_rag_payload": {},
            "current_resume_draft": payload.raw_text_resume,
            "resume_changelog": [],
            "reflection_report": None,
            "iteration_count": 0,
            "max_iterations": 3,
            "agent_execution_logs": []
        }

        # InvokeCompiledGraph State Machine
        final_state = hiro_state_machine.invoke(initial_state)

        # Structure out standard transactional enterprise outputs
        return {
            "success": True,
            "optimized_resume": final_state.get("current_resume_draft"),
            "system_metrics": {
                "final_ats_score": final_state.get("semantic_analysis").ats_score if final_state.get("semantic_analysis") else 0.0,
                "total_iteration_loops": final_state.get("iteration_count", 0),
                "aggregated_token_count": final_state.get("total_tokens_consumed", 0)
            },
            "analytics": final_state.get("semantic_analysis"),
            "compliance": final_state.get("reflection_report"),
            "audit_trail": [
                {
                    "agent_id": log.agent_id,
                    "thought": log.thought,
                    "action": log.action,
                    "observation": log.observation,
                    "reflection": log.reflection,
                    "timestamp": log.timestamp
                }
                for log in final_state.get("agent_execution_logs", [])
            ]
        }

    except ValidationError as val_err:
        raise HTTPException(status_code=400, detail=f"Data Schema Validation Failed: {val_err.errors()}")
    except Exception as err:
        # Fallback tracking for production log collectors (OpenTelemetry)
        print(f"[CRITICAL ERR] Pipeline processing crash: {err}")
        raise HTTPException(status_code=500, detail=f"Internal Orchestration Engine Fault: {str(err)}")

if __name__ == "__main__":
    import uvicorn
    # Execute developer system debugging server instance
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
