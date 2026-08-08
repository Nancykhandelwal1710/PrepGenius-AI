from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ats import router as ats_router
from app.api.resume import router as resume_router
from app.api.health import router as health_router
from app.api.interview import router as interview_router
from app.api.evaluation import router as evaluation_router
from app.api.tailor import router as tailor_router
from app.api.optimize import router as optimize_router

app = FastAPI(title="PrepGeniusAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ats_router)
app.include_router(resume_router)
app.include_router(health_router)
app.include_router(interview_router)
app.include_router(evaluation_router)
app.include_router(tailor_router)
app.include_router(optimize_router)

@app.get("/")
def home():
    return {
        "status": "running",
        "message": "PrepGeniusAI Backend is Ready 🚀"
    }
